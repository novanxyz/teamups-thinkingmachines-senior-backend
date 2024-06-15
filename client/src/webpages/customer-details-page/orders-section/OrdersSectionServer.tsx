import { EntityOrder } from '@/services/orders/entities/order/EntityOrder';
import PageHeaderClient from '@/webpages/shared/components/page-header/PageHeaderClient';
import { Skeleton } from 'antd';
import { ObjectId } from 'mongodb';
import { Suspense } from 'react';
import OrdersSectionClient from './OrdersSectionClient';
import styles from './OrdersSectionServer.module.css';

interface IOrdersSectionServerProps {
  customerId: string;
}

async function OrdersSectionServer(props: IOrdersSectionServerProps) {
  const orderEntity = new EntityOrder();
  const ordersForCustomerModels = await orderEntity.genMany({
    customer_id: new ObjectId(props.customerId),
  });
  const ordersForCustomerClientModels = ordersForCustomerModels.map((order) =>
    orderEntity.getAsClientEntity(order)
  );

  return (
    <>
      <PageHeaderClient hasDivider title='Customer orders' />
      <OrdersSectionClient orders={ordersForCustomerClientModels} />
    </>
  );
}

export default async function OrdersSectionServerWithSuspense(
  props: IOrdersSectionServerProps
) {
  return (
    <section className={styles['root-container']}>
      <Suspense fallback={<Skeleton loading active />}>
        <OrdersSectionServer {...props} />
      </Suspense>
    </section>
  );
}
