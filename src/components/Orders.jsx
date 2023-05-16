import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';


 function Orders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios('https://northwind.vercel.app/api/orders')
      .then(res => {
        setData(res.data);
        setLoading(false)
      })
      .catch(error => {
        alert('Error fetching orders:', error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `${formattedDate}`;
  };

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      filters: [
        { text: 'ALFKI', value: 'ALFKI' },
        { text: 'ANATR', value: 'ANATR' },
      ],
      onFilter: (value, record) => record.customerId === value,
    },
    {
      title: 'Freight',
      dataIndex: 'freight',
      key: 'freight',
      sorter: (a, b) => a.freight - b.freight,
    },
    {
      title: 'City',
      dataIndex: 'shipAddress',
      key: 'shipAddress',
      render: shipAddress => (shipAddress?.city),
    },
    {
      title: 'Country',
      dataIndex: 'shipAddress',
      key: 'shipAddress',
      render: shipAddress => (shipAddress?.country),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      render: (text) => formatDate(text),
    },
    {
      title: 'Required Date',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
      render: (text, record) => {
        const requiredDate = new Date(text);
        const shippedDate = new Date(record.shippedDate);
        const isDelayed = requiredDate < shippedDate;
        const style = !isDelayed ? {} : {background: 'red'};
        return <span style={style}>{formatDate(text)}</span>;
      }
    },
    {
      title: 'Shipped Date',
      dataIndex: 'shippedDate',
      key: 'shippedDate',
      render: (text, record) => (
        <span>
          {formatDate(text)}
        </span>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={loading}
    />
  );
};

export default Orders;
