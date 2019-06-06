import React, { PureComponent, Fragment } from 'react';
import request from '@/utils/request';
import SupplierModal from '@/components/Modal/Supplier';
import { Select, Spin, Icon, Empty } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';

const { Option } = Select;

@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
class SupplierSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchSupplier = debounce(this.fetchSupplier, 1000);
  }

  state = {
    data: [],
    value: { key: '' },
    companyModal: false,
    fetching: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.data.length && prevState.data !== nextProps.global.SupplierList) {
      return {
        data: nextProps.global.SupplierList,
      };
    }
    if (nextProps.initialValue !== prevState.value) {
      return {
        value: nextProps.initialValue,
      };
    }
    return null;
  }

  fetchSupplier = async value => {
    if (!value) return;
    const { keyType } = this.props;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const response = await request('/MDM/TI_Z007/TI_Z00702', {
      method: 'POST',
      data: {
        Content: {
          SearchText: value,
          SearchKey: keyType,
        },
        page: 1,
        rows: 100,
        sidx: 'Code',
        sord: 'DESC',
      },
    });
    this.setState({ fetching: false });
    if (response.Status !== 200 || fetchId !== this.lastFetchId) {
      this.setState({ data: [], fetching: false });
      return;
    }
    this.setState({ data: response.Content ? response.Content.rows : [], fetching: false });
  };

  handleChange = value => {
    this.setState({
      fetching: false,
      value,
    });
    const { data } = this.state;
    const { onChange } = this.props;
    if (onChange) {
      const select = data.find(item => item.Code === value.key);
      onChange(select);
    }
  };

  changeSupplier = select => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(select);
      this.setState({
        value: select.Code,
      });
      this.handleModalVisible(false);
    }
  };

  handleModalVisible = flag => {
    this.setState({ companyModal: !!flag });
  };

  render() {
    const { fetching, data, companyModal, value } = this.state;
    const companyParentMethods = {
      handleSubmit: this.changeSupplier,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Select
          showSearch
          value={value}
          defaultValue={value}
          labelInValue
          suffixIcon={
            <Icon
              onClick={() => {
                this.handleModalVisible(true);
              }}
              type="ellipsis"
            />
          }
          placeholder="输入内容"
          notFoundContent={fetching ? <Spin size="small" /> : <Empty style={{ width: '100%' }} />}
          filterOption={false}
          onSearch={this.fetchSupplier}
          onChange={this.handleChange}
          style={{ width: '100%' }}
        >
          {data.map(option => (
            <Option key={option.Code} value={option.Code}>
              {option.Name}
            </Option>
          ))}
        </Select>
        <SupplierModal {...companyParentMethods} modalVisible={companyModal} />
      </Fragment>
    );
  }
}

export default SupplierSelect;
