import { Skeleton } from 'antd';
import { Suspense } from 'react';
import CustomerLoyaltyPageClient from './CustomerLoyaltyPageClient';
import OrdersSectionServerWithSuspense from './customers-section/CustomersSectionServer';
import PromotionsSectionServerWithSuspense from './promotions-section/PromotionsSectionServer';

async function CustomerLoyaltyPageServer() {
  return (
    <CustomerLoyaltyPageClient>
      <OrdersSectionServerWithSuspense />
      <PromotionsSectionServerWithSuspense />
    </CustomerLoyaltyPageClient>
  );
}

export default function CustomerLoyaltyPageServerWithSuspense() {
  return (
    <Suspense fallback={<Skeleton loading active />}>
      <CustomerLoyaltyPageServer />
    </Suspense>
  );
}
