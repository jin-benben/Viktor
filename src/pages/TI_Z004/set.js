import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, List, Card, Button, Tabs, Tree, Checkbox } from 'antd';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import styles from './style.less';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
@connect(({ staffs, loading, global }) => ({
  staffs,
  global,
  loading: loading.effects['staffs/getController'],
  setLoading: loading.effects['staffs/setLoading'],
}))
class DataAuthority extends Component {
  state = {
    checkedKeys: [],
    expandedKeys: [],
    salerList: [],
    EmployeeList: [], // 选中的销售员
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

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  salerChange = EmployeeList => {
    this.setState({
      EmployeeList,
    });
  };

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

  getSalerHangele = (Code, DepartmentList) => {
    const { dispatch } = this.props;
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
          this.setState({
            salerList: response.Content.TI_Z00411ResponseItem,
          });
        }
      },
    });
  };

  render() {
    const {
      staffs: { controllerList, setLoading, treeData },
    } = this.props;
    console.log(treeData);
    const { Targetline, expandedKeys, checkedKeys, salerList } = this.state;
    return (
      <Card bordered={false} style={{ paddingTop: 30 }}>
        <Row type="flex" justify="space-between">
          <Col span={6}>
            <List
              header={<h3>主管列表</h3>}
              bordered
              dataSource={controllerList}
              renderItem={item => (
                <List.Item
                  className={`${styles.item} ${Targetline === item.Code ? styles.active : ''}`}
                  onClick={() => this.changeController(item.Code)}
                >
                  {`${item.Name}(${item.type === 'P' ? '采购' : '销售'})`}
                </List.Item>
              )}
            />
          </Col>
          <Col span={12}>
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
                <Checkbox.Group style={{ width: '100%' }} onChange={this.salerChange}>
                  <Row>
                    {salerList.map(item => (
                      <Col span={4}>
                        <Checkbox value={item.EmployeeCode}>{item.EmployeeCode}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </TabPane>
            </Tabs>
            ,
          </Col>
        </Row>
        <FooterToolbar>
          <Button loading={setLoading} type="primary">
            保存
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default DataAuthority;
