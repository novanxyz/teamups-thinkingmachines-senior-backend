'use client';

import { IEntityCustomer } from '@/services/customers/entities/customer/IEntityCustomer';
import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { Avatar } from 'antd';
import styles from './CustomerProfileSectionClient.module.css';

interface ICustomerProfileSectionClientProps {
  customer: TWithStringIds<IEntityCustomer>;
  avatarIndex?: number;
}

export default function CustomerProfileSectionClient(
  props: ICustomerProfileSectionClientProps
) {
  const { customer, avatarIndex } = props;

  return (
    <div className={styles['root-container']}>
      <div>
        <Avatar
          size='large'
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${avatarIndex}`}
        />
      </div>
      <div>
        <h2>{customer._id}</h2>
      </div>
    </div>
  );
}
