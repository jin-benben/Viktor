import React, { PureComponent } from 'react';
import EditableFormTable from '@/components/EditableFormTable';

// eslint-disable-next-line react/no-multi-comp
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i.toString(),
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }
    this.state = { data };
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: 100,
        editable: false,
      },
      {
        title: 'age',
        dataIndex: 'age',
        width: 100,
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',

        editable: true,
      },
    ];
  }

  rowChange = record => {
    const { data } = this.state;
    data.map(item => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
    // console.log(data)
    this.setState({ data }, () => {
      console.log(data);
    });
  };

  render() {
    const { data } = this.state;
    console.log(data);
    return <EditableFormTable rowChange={this.rowChange} columns={this.columns} data={data} />;
  }
}

export default Welcome;
