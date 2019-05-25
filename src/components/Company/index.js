import React, { PureComponent, Fragment } from 'react';
import request from '@/utils/request';
import CompanyModal from '@/components/Modal/Company';
import { Select, Spin, Icon, Empty } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class CompanySelect extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchCompany = debounce(this.fetchCompany, 1000);
  }

  state = {
    data: [],
    initialValue: '',
    companyModal: false,
    fetching: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(this);
    if (nextProps.initialValue !== prevState.initialValue) {
      return {
        initialValue: nextProps.initialValue,
      };
    }
    return null;
  }

  componentDidMount() {
    this.fetchCompany();
  }

  fetchCompany = async value => {
    if (!value && this.lastFetchId !== 0) return;
    const { keyType } = this.props;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    const response = await request('/MDM/TI_Z006/TI_Z00602', {
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
    console.log('被调用了');
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

  changeCompany = select => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(select);
      this.handleModalVisible(false);
    }
  };

  handleModalVisible = flag => {
    this.setState({ companyModal: !!flag });
  };

  render() {
    const { fetching, data, companyModal, initialValue } = this.state;
    const companyParentMethods = {
      handleSubmit: this.changeCompany,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <Select
          showSearch
          value={initialValue}
          defaultValue={initialValue}
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
          onSearch={this.fetchCompany}
          onChange={this.handleChange}
          style={{ width: '100%' }}
        >
          {data.map(option => (
            <Option key={option.Code} value={option.Code}>
              {option.Name}
            </Option>
          ))}
        </Select>
        <CompanyModal {...companyParentMethods} modalVisible={companyModal} />
      </Fragment>
    );
  }
}

export default CompanySelect;
