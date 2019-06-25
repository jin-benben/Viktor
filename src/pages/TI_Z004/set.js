import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  List,
  Card,
  Button,
  Tabs,
  Tree,
  message,
  Table,
  Form,
  Input,
  Select,
  Checkbox,
} from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import styles from './style.less';
import { flagType, roleType } from '@/utils/publicData';
import { getName } from '@/utils/utils';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const { Option } = Select;
const FormItem = Form.Item;

@connect(({ staffs, loading, global }) => ({
  staffs,
  global,
  loading: loading.effects['staffs/getController'],
  setLoading: loading.effects['staffs/setLoading'],
}))
@Form.create()
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
    selectedRowKeys: [], // 选中的销售员
    Targetline: '', // 当前选中主管
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'staffs/getController',
      payload: {
        Content: {
          ShowAll: 'Y',
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
    const { Targetline } = this.state;
    this.getSalerHangele(Targetline, checkedKeys);
  };

  changeStatus = (record, index, value) => {
    const {
      staffs: { OSLP },
      dispatch,
    } = this.props;
    // eslint-disable-next-line no-param-reassign
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
    const { Targetline, selectedRowKeys, checkedKeys } = this.state;
    const {
      dispatch,
      staffs: { OSLP },
    } = this.props;
    const EmployeeList = selectedRowKeys.map(item => {
      const thisLine = OSLP.find(line => line.Code === item);
      return {
        EmployeeCode: thisLine.Code,
        Flag: thisLine.Flag,
      };
    });
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

  rowSelection = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { SearchText, ShowAll, Type } = fieldsValue;
      dispatch({
        type: 'staffs/getController',
        payload: {
          Content: {
            SearchText,
            Type,
            ShowAll: ShowAll ? 'Y' : 'N',
          },
        },
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col>
            <FormItem key="SearchText">
              {getFieldDecorator('SearchText')(<Input placeholder="请输入关键字" />)}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <FormItem key="Type">
              {getFieldDecorator('Type')(
                <Select placeholder="请选择类型">
                  <Option value="S">销售</Option>
                  <Option value="P">采购</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem key="ShowAll">
              {getFieldDecorator('ShowAll', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>全部</Checkbox>)}
            </FormItem>
          </Col>
          <Col>
            <span className="submitButtons">
              <Button size="small" type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      staffs: { controllerList, setLoading, treeData, OSLP },
    } = this.props;
    const { Targetline, expandedKeys, checkedKeys, selectedRowKeys } = this.state;
    return (
      <Card bordered={false} style={{ paddingTop: 30 }}>
        <Row>
          <div className="tableListForm">{this.renderSimpleForm()}</div>
        </Row>
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
                  {`${item.SlpName}(${getName(roleType, item.U_Type)})`}
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
