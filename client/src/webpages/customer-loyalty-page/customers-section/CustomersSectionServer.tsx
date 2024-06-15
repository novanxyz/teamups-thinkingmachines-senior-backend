import { EntityCustomer } from '@/services/customers/entities/customer/EntityCustomer';
import PageHeaderClient from '@/webpages/shared/components/page-header/PageHeaderClient';
import { Skeleton } from 'antd';
import { Suspense } from 'react';
import CustomersSectionClient from './CustomersSectionClient';
import styles from './CustomersSectionServer.module.css';

async function CustomersSectionServer() {
  const customersEntity = new EntityCustomer();
  const customerModels = await customersEntity.genMany();
  const customersClientModels = customerModels.map((customer) =>
    customersEntity.getAsClientEntity(customer)
  );

  return (
    <>
      <PageHeaderClient hasDivider title='Customers' />
      <CustomersSectionClient customers={customersClientModels} />
    </>
  );
}

export default async function CustomersSectionServerWithSuspense() {
  return (
    <section className={styles['root-container']}>
      <Suspense fallback={<Skeleton loading active />}>
        <CustomersSectionServer />
      </Suspense>
    </section>
  );
}
