import React, { PureComponent, Fragment } from 'react';
import request from '@/utils/request';
import SupplierModal from '@/components/Modal/Supplier';
import { Select, Spin, Icon, Empty } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class SupplierSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchSupplier = debounce(this.fetchSupplier, 1000);
  }

  state = {
    data: [],
    value: { key: '', label: '' },
    companyModal: false,
    fetching: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialValue !== prevState.initialValue) {
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
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  changeSupplier = select => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(select);
      this.setState({
        value: {
          label: select.Name,
          key: select.Code,
        },
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
