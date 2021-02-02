import React from 'react';
import { Table } from '@ss/mtd-react';
import './index.less';

const dataSource = [];
for (let i = 0; i < 5; i++) {
  dataSource.push({
    key: i,
    name: `Jhon Black ${i}`,
    age: 26,
    address: '恒电大厦B座2层',
    email: 'John@meituan.com',
  });
}

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: dataSource,
    };
  }

  // <Table rowKey="key" data={data} bordered="cell">
  //         {column &&
  //           column.map((item, index) => {
  //             const { key, name } = item;
  //             return <Table.Column dataKey={key}>{name}</Table.Column>;
  //           })}
  //       </Table>
  render() {
    const { data } = this.state;
    return (
      <div className="template">
        @data(`${data}`) @include(../template/table.html)
        <div>这是另外一个子节点</div>
      </div>
    );
  }
}

export default Template;
