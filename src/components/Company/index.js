import React, { PureComponent, Fragment } from 'react';
import { Select, Spin, Icon, Empty, Button } from 'antd';
import debounce from 'lodash/debounce';
import { connect } from 'dva';
import request from '@/utils/request';
import CompanyModal from '@/components/Modal/Company';
import styles from './style.less';

const { Option } = Select;

@connect(({ loading, global }) => ({
  global,
  loading: loading.models.global,
}))
class CompanySelect extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchCompany = debounce(this.fetchCompany, 1000);
  }

  state = {
    data: [],
    value: { key: '', label: '' },
    companyModal: false,
    fetching: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.data.length && prevState.data !== nextProps.global.CustomerList) {
      return {
        data: nextProps.global.CustomerList,
      };
    }
    if (nextProps.initialValue.key !== undefined && nextProps.initialValue !== prevState.value) {
      return {
        value: nextProps.initialValue,
      };
    }
    return null;
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
    this.setState({ fetching: false });
    if (!response || response.Status !== 200 || fetchId !== this.lastFetchId) {
      this.setState({ data: [], fetching: false });
      return;
    }

    this.setState({ data: response.Content ? response.Content.rows : [], fetching: false });
  };

  handleChange = value => {
    this.setState({
      fetching: false,
    });
    const { data } = this.state;
    const { onChange } = this.props;
    if (onChange) {
      const select = data.find(item => item.Code === value.key);
      onChange(select);
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
    const { fetching, data, companyModal, value } = this.state;
    const { keyType } = this.props;
    const companyParentMethods = {
      handleSubmit: this.changeCompany,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <Fragment>
        <div className={styles.company}>
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
          {value.key && keyType === 'Code' ? (
            <Button
              href={`/main/TI_Z006/detail?Code=${value.label}`}
              target="_blank"
              title="编辑客户"
              className={styles.edit}
              type="link"
              shape="circle"
              icon="edit"
            />
          ) : null}
        </div>
        <CompanyModal {...companyParentMethods} modalVisible={companyModal} />
      </Fragment>
    );
  }
}

export default CompanySelect;
