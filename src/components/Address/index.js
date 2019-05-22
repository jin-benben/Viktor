import React, { PureComponent } from 'react';
import { Cascader } from 'antd';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            children: [
              {
                value: '莫干山',
                label: '莫干山',
              },
            ],
          },
        ],
      },
    ],
  },
];

class AddressCascader extends PureComponent {
  handleChange = (value, selectedOptions) => {
    const [province, city, area, street] = selectedOptions;
    let address;
    if (selectedOptions.length === 4) {
      address = {
        ProvinceID: province.value,
        Province: province.label,
        CityID: city.value,
        City: city.label,
        AreaID: area.value,
        Area: area.label,
        StreetID: street.value,
        Street: street.label,
      };
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(address);
    }
  };

  render() {
    const { initialValue, style } = this.props;
    console.log(initialValue);
    return (
      <Cascader
        style={style}
        defaultValue={initialValue}
        changeOnSelect
        expandTrigger="hover"
        onChange={this.handleChange}
        options={options}
        placeholder="请选择地址"
      />
    );
  }
}

export default AddressCascader;
