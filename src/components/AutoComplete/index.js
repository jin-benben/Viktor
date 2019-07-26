import React,{Component} from 'react'
import { Icon, Button, Input, AutoComplete } from 'antd';
import debounce from 'lodash/debounce';
import request from '@/utils/request';

const { Option } = AutoComplete;


function renderOption(item) {
  return (
    <Option key={item.Code} item={item} title={item.ProductName}>
      {`${item.ProductName}`}
    </Option>
  );
}

class OrderAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = debounce(this.handleSearch, 1000);
    this.state = {
      dataSource: [
        {
          SupplierName:"测试数据",
          Code:'1',
          InquiryPrice:"66",
          Currency:"USA"
        }
      ],
    };
  }


  onSelect=(value,option)=> {
    const {item}=option.props
    const {parentSelect}=this.props
    if(parentSelect) parentSelect(item)
  }
  


  handleSearch = async SearchText => {
    const {onChage}=this.props
    console.log(onChage)
    if(onChage) onChage(SearchText)
    const response = await request('/MDM/TI_Z009/TI_Z00902', {
      method: 'POST',
      data: {
        Content: {
          SearchText,
          SearchKey: 'Name',
        },
        page: 1,
        rows: 30,
        sidx: 'Code',
        sord: 'Desc',
      },
    });
    if (response && response.Status === 200) {
      if (response.Content) {
        const { rows } = response.Content;
        this.setState({
          dataSource: [...rows],
        });
      } else {
        this.setState({
          dataSource: [],
        });
      }
    }
  }


  render() {
    const { dataSource } = this.state;
    const {defaultValue}=this.props
    return (
      <AutoComplete
        className="global-search"
        size="large"
        defaultValue={defaultValue}
        style={{ width: '100%' }}
        dataSource={dataSource.map(renderOption)}
        onSelect={this.onSelect}
        onSearch={this.handleSearch}
        optionLabelProp="text"
      >
        <Input />
      </AutoComplete>
    );
  }
}

export default OrderAutoComplete