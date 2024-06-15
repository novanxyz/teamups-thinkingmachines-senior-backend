import { EntityCustomer } from '@/services/customers/entities/customer/EntityCustomer';
import { EntityOrder } from '@/services/orders/entities/order/EntityOrder';
import { EntityPromotion } from '@/services/promotions/entities/promotion/EntityPromotion';
import PageHeaderClient from '@/webpages/shared/components/page-header/PageHeaderClient';
import { Skeleton } from 'antd';
import { ObjectId } from 'mongodb';
import { Suspense } from 'react';
import CustomerProfileSectionClient from './CustomerProfileSectionClient';
import styles from './CustomerProfileSectionServer.module.css';
import CustomerLoyaltySectionClient from './customer-loyalty-section/CustomerLoyaltySectionClient';

interface ICustomerProfileSectionServerProps {
  customerId: string;
  avatarIndex?: number;
}

async function CustomerProfileSectionServer(
  props: ICustomerProfileSectionServerProps
) {
  const { customerId, avatarIndex } = props;

  const customersEntity = new EntityCustomer();
  const customerModel = await customersEntity.genOne({
    _id: new ObjectId(customerId),
  });
  if (customerModel == null) {
    throw new Error('Customer not found');
  }

  const orderEntity = new EntityOrder();
  const promoEntity = new EntityPromotion();
  const [orderModels, promoModels] = await Promise.all([
    orderEntity.genMany({ customer_id: customerModel._id }),
    promoEntity.genMany(),
  ]);

  const customerClientModel = customersEntity.getAsClientEntity(customerModel);
  const orderClientModels = orderModels.map((order) =>
    orderEntity.getAsClientEntity(order)
  );
  const promoClientModels = promoModels.map((promo) =>
    promoEntity.getAsClientEntity(promo)
  );

  return (
    <div className={styles['root-container']}>
      <div className={styles['profile-container']}>
        <PageHeaderClient hasDivider title='Customer profile' />
        <CustomerProfileSectionClient
          customer={customerClientModel}
          avatarIndex={avatarIndex}
        />
      </div>
      <div>
        <PageHeaderClient hasDivider title='Loyalty program' />
        <CustomerLoyaltySectionClient
          orders={orderClientModels}
          promotions={promoClientModels}
        />
      </div>
    </div>
  );
}

export default async function CustomerProfileSectionServerWithSuspense(
  props: ICustomerProfileSectionServerProps
) {
  return (
    <section className={styles['root-container']}>
      <Suspense fallback={<Skeleton loading active />}>
        <CustomerProfileSectionServer {...props} />
      </Suspense>
    </section>
  );
}
