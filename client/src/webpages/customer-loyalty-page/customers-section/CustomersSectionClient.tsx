'use client';

import { IEntityCustomer } from '@/services/customers/entities/customer/IEntityCustomer';
import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { Avatar, Button, List } from 'antd';

interface ICustomersSectionClientProps {
  customers: TWithStringIds<IEntityCustomer>[];
}

export default function CustomersSectionClient(
  props: ICustomersSectionClientProps
) {
  const { customers } = props;

  return (
    <div>
      <List<TWithStringIds<IEntityCustomer>>
        size='small'
        dataSource={customers}
        renderItem={(customer, index) => (
          <List.Item
            key={customer._id}
            actions={[
              <Button
                key='view_details'
                href={`/customer-loyalty/${customer._id}?index=${index}`}
              >
                View details
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={customer._id}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
