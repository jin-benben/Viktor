import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, List, Card, Button, Tabs, Tree, message, Table } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import styles from './style.less';
import { flagType, roleType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
@connect(({ staffs, loading, global }) => ({
  staffs,
  global,
  loading: loading.effects['staffs/getController'],
  setLoading: loading.effects['staffs/setLoading'],
}))
class DataAuthority extends Component {
  columns = [
    {
      title: '销售员',
      dataIndex: 'SlpName',
    },
    {
      title: '类型',
      dataIndex: 'U_Type',
      render: text => <span>{getName(roleType, text)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'Flag',
      render: text => <span>{getName(flagType, text)}</span>,
    },
    {
      title: '操作',
      dataIndex: 'Do',
      render: (text, record, index) => (
        <Fragment>
          <Button onClick={() => this.changeStatus(record, index, '0')} size="small" type="primary">
            恢复
          </Button>
          <Button
            style={{ marginRight: 8, marginLeft: 8 }}
            onClick={() => this.changeStatus(record, index, '1')}
            size="small"
            type="primary"
          >
            额外排除
          </Button>
          <Button onClick={() => this.changeStatus(record, index, '2')} size="small" type="primary">
            额外添加
          </Button>
        </Fragment>
      ),
    },
  ];

  state = {
    checkedKeys: [],
    expandedKeys: [],
    selectedRows: [],
    selectedRowKeys: [], // 选中的销售员
    Targetline: '', // 当前选中主管
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/getController',
      payload: {
        Content: {
          SearchText: '',
        },
      },
    });
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.Name} key={item.Code}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.Name} key={item.Code} />;
    });

  // 点击树形节点时
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };

  // 树形check时
  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  changeStatus = (record, index, value) => {
    const {
      staffs: { OSLP },
      dispatch,
    } = this.props;
    record.Flag = value;
    OSLP[index] = record;
    dispatch({
      type: 'staffs/save',
      payload: {
        OSLP,
      },
    });
  };

  // 主管修改时
  changeController = Targetline => {
    const { dispatch } = this.props;
    this.setState({ Targetline });
    dispatch({
      type: 'staffs/getDepartment',
      payload: {
        Content: {
          Code: Targetline,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          const { DepartmentList } = response.Content;
          this.setState({
            checkedKeys: DepartmentList,
            expandedKeys: DepartmentList,
          });
          this.getSalerHangele(Targetline, DepartmentList);
        }
      },
    });
  };

  // 获取销售员
  getSalerHangele = (Code, DepartmentList) => {
    const {
      dispatch,
      staffs: { OSLP },
    } = this.props;
    dispatch({
      type: 'staffs/getSaler',
      payload: {
        Content: {
          DepartmentList,
          Code,
        },
      },
      callback: response => {
        if (response && response.Status === 200) {
          const selectedRowKeys = [];
          const newOslp = OSLP.map(item => {
            const thisLine = response.Content.TI_Z00411ResponseItem.find(
              line => line.EmployeeCode === item.Code
            );
            if (thisLine) {
              selectedRowKeys.push(item.Code);
              return {
                ...item,
                Flag: thisLine.Flag,
              };
            }
            return {
              ...item,
              Flag: '0',
            };
          });
          this.setState({
            selectedRowKeys,
          });
          dispatch({
            type: 'staffs/save',
            payload: {
              OSLP: [...newOslp],
            },
          });
        }
      },
    });
  };

  setDataFun = () => {
    const { Targetline, selectedRows, checkedKeys } = this.state;
    const { dispatch } = this.props;
    const EmployeeList = selectedRows.map(item => ({
      EmployeeCode: item.Code,
      Flag: item.Flag,
    }));
    if (Targetline) {
      dispatch({
        type: 'staffs/setLoading',
        payload: {
          Content: {
            Code: Targetline,
            DepartmentList: checkedKeys,
            EmployeeList,
          },
        },
        callback: response => {
          if (response && response.Status === 200) {
            message.success('保存成功');
            this.changeController(Targetline);
          }
        },
      });
    }
  };

  rowSelection = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  render() {
    const {
      staffs: { controllerList, setLoading, treeData, OSLP },
    } = this.props;
    const { Targetline, expandedKeys, checkedKeys, selectedRowKeys } = this.state;
    return (
      <Card bordered={false} style={{ paddingTop: 30 }}>
        <Row type="flex" justify="space-between">
          <Col span={5}>
            <List
              header={<h3>主管列表</h3>}
              bordered
              dataSource={controllerList}
              renderItem={item => (
                <List.Item
                  className={`${styles.item} ${Targetline === item.Code ? styles.active : ''}`}
                  onClick={() => this.changeController(item.Code)}
                >
                  {`${item.SlpName}(${item.type === 'P' ? '采购' : '销售'})`}
                </List.Item>
              )}
            />
          </Col>
          <Col span={15}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="部门" key="1">
                {treeData.length ? (
                  <Tree
                    onExpand={this.onExpand}
                    className="trees"
                    checkable
                    expandedKeys={expandedKeys}
                    autoExpandParent
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    selectedKeys={checkedKeys}
                  >
                    {this.renderTreeNodes(treeData)}
                  </Tree>
                ) : null}
              </TabPane>
              <TabPane tab="销售员" key="2">
                <Table
                  dataSource={OSLP}
                  bordered
                  pagination={false}
                  rowKey="Code"
                  rowSelection={{
                    onChange: this.rowSelection,
                    selectedRowKeys,
                  }}
                  columns={this.columns}
                />
              </TabPane>
            </Tabs>
            ,
          </Col>
        </Row>
        <FooterToolbar>
          <Button loading={setLoading} type="primary" onClick={this.setDataFun}>
            保存
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default DataAuthority;
