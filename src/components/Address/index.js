/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
import React, { PureComponent } from 'react';

import { Cascader } from 'antd';
import CityList from '../../../public/js/cities';
import AreaList from '../../../public/js/areas';
import ProvinceList from '../../../public/js/provinces';

const getCity = code => {
  // 获取城市
  // eslint-disable-next-line array-callback-return
  const children = CityList.filter(city => {
    if (city.provinceCode === code) {
      city.isLeaf = false;
      return city;
    }
  });
  return children;
};

const getArea = code => {
  // 获取地区
  // eslint-disable-next-line array-callback-return
  const children = AreaList.filter(area => {
    if (area.cityCode === code) {
      return area;
    }
  });
  return children;
};

const getIndex = (code, arr) => {
  return arr.findIndex(item => {
    return item.code === code;
  });
};

class AddressCascader extends PureComponent {
  state = {
    value: [],
    options: ProvinceList.map(province => {
      province.isLeaf = false;
      return province;
    }),
  };

  static getDerivedStateFromProps(nextProps, preState) {
    if (!preState.value.length && nextProps.initialValue && nextProps.initialValue[0]) {
      const { options } = preState;
      const provinceIndex = getIndex(nextProps.initialValue[0], ProvinceList);
      options[provinceIndex].children = getCity(nextProps.initialValue[0]);
      const cityIndex = getIndex(nextProps.initialValue[1], getCity(nextProps.initialValue[0]));
      options[provinceIndex].children[cityIndex].children = getArea(nextProps.initialValue[1]);

      return {
        value: nextProps.initialValue,
        options: [...options],
      };
    }
    return null;
  }

  loadData = selectedOptions => {
    const target = selectedOptions[selectedOptions.length - 1];
    const { options } = this.state;

    if (selectedOptions.length === 1) {
      const provinceIndex = getIndex(target.code, ProvinceList);
      options[provinceIndex].children = getCity(target.code);
    }
    if (selectedOptions.length === 2) {
      const provinceIndex = getIndex(target.provinceCode, ProvinceList);
      const cityIndex = getIndex(target.code, getCity(target.provinceCode));
      options[provinceIndex].children[cityIndex].children = getArea(target.code);
    }
    this.setState({ options: [...options] });
  };

  handleChange = (value, selectedOptions) => {
    const [province, city, area] = selectedOptions;
    this.setState({ value: [...value] });
    let address;
    if (selectedOptions.length === 3) {
      address = {
        ProvinceID: province.code,
        Province: province.name,
        CityID: city.code,
        City: city.name,
        AreaID: area.code,
        Area: area.name,
      };
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(address);
    }
  };

  render() {
    const { value, options } = this.state;

    return (
      <Cascader
        style={{ width: '100%' }}
        fieldNames={{ label: 'name', value: 'code', children: 'children' }}
        value={value}
        loadData={this.loadData}
        changeOnSelect
        onChange={this.handleChange}
        options={options}
        placeholder="请选择地址"
      />
    );
  }
}

export default AddressCascader;
