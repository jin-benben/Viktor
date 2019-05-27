/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
import React, { PureComponent } from 'react';
import ProvinceList from '@/assets/js/provinces';
import CityList from '@/assets/js/cities';
import AreaList from '@/assets/js/areas';
import StreetList from '@/assets/js/streets';
import { Cascader } from 'antd';

class AddressCascader extends PureComponent {
  state = {
    value: [],
    provinceIndex: 0, // 当前省份下标
    cityIndex: 0, // 当前城市
    areaIndex: 0, // 当前区下标
    options: ProvinceList.map(province => {
      province.isLeaf = false;
      return province;
    }),
  };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.initialValue && nextProps.initialValue[0]) {
      return {
        value: nextProps.initialValue,
      };
    }
    return null;
  }

  getIndex = (code, arr) => {
    return arr.findIndex(item => {
      return item.code === code;
    });
  };

  loadData = selectedOptions => {
    const target = selectedOptions[selectedOptions.length - 1];
    const { options } = this.state;
    let { provinceIndex, cityIndex, areaIndex } = this.state;

    if (selectedOptions.length === 1) {
      provinceIndex = this.getIndex(target.code, ProvinceList);
      options[provinceIndex].children = this.getCity(target.code);
    }
    if (selectedOptions.length === 2) {
      cityIndex = this.getIndex(target.code, this.getCity(target.provinceCode));
      options[provinceIndex].children[cityIndex].children = this.getArea(target.code);
    }

    if (selectedOptions.length === 3) {
      areaIndex = this.getIndex(target.code, this.getArea(target.cityCode));
      options[provinceIndex].children[cityIndex].children[areaIndex].children = this.getStreet(
        target.code
      );
    }

    console.log(options);

    this.setState({ options: [...options], provinceIndex, cityIndex, areaIndex });
  };

  getCity = code => {
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

  getArea = code => {
    // 获取地区

    // eslint-disable-next-line array-callback-return
    const children = AreaList.filter(area => {
      if (area.cityCode === code) {
        area.isLeaf = false;
        return area;
      }
    });
    return children;
  };

  getStreet = code => {
    // 街道

    // eslint-disable-next-line array-callback-return
    const children = StreetList.filter(street => {
      if (street.areaCode === code) {
        return street;
      }
    });
    return children;
  };

  handleChange = (value, selectedOptions) => {
    const [province, city, area, street] = selectedOptions;

    this.setState({ value: [...value] });
    let address;
    if (selectedOptions.length === 4) {
      address = {
        ProvinceID: province.code,
        Province: province.name,
        CityID: city.code,
        City: city.name,
        AreaID: area.code,
        Area: area.name,
        StreetID: street.code,
        Street: street.name,
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
