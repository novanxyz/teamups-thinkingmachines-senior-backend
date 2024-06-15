'use client';

import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { IEntityOrder } from '@/services/orders/entities/order/IEntityOrder';
import { IOrderItem } from '@/services/orders/entities/order/IOrderItem';
import { List } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

const TABLE_COLUMNS: ColumnsType<TWithStringIds<IEntityOrder>> = [
  {
    title: 'Order ID',
    dataIndex: '_id',
    key: '_id',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) =>
      getDateToDashString(a.date).localeCompare(getDateToDashString(b.date)),
    render: (_, record) => {
      return getDateToDashString(record.date);
    },
  },
  {
    title: 'Total items',
    dataIndex: 'items',
    key: 'total_items',
    render: (_, record) => {
      return record.items.length;
    },
  },
  {
    title: 'Item details',
    dataIndex: 'items',
    key: 'item_details',
    render: (_, record) => {
      return (
        <List<TWithStringIds<IOrderItem>>
          size='small'
          dataSource={record.items}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={`${index + 1}. ${item._id}`}
                description={
                  <div>
                    <div>Category: {item.category}</div>
                    <div>Price: ${item.price_usd.toFixed(2)}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      );
    },
  },
];

interface IPromotionsSectionClientProps {
  orders: TWithStringIds<IEntityOrder>[];
}

export default function OrdersSectionClient(
  props: IPromotionsSectionClientProps
) {
  const { orders } = props;

  return (
    <div>
      <Table
        bordered
        columns={TABLE_COLUMNS}
        dataSource={orders.map((order) => ({ ...order, key: order._id }))}
      />
    </div>
  );
}

const getDateToDashString = (date: IEntityOrder['date']): string => {
  return `${date.year}-${date.month + 1}-${date.date}`;
};
