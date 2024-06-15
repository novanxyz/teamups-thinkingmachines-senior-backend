import { Skeleton } from 'antd';
import { Suspense } from 'react';
import CustomerLoyaltyPageClient from './CustomerDetailsPageClient';
import CustomerProfileSectionServerWithSuspense from './customer-profile-section/CustomerProfileSectionServer';
import OrdersSectionServerWithSuspense from './orders-section/OrdersSectionServer';

interface ICustomerDetailsPageServerProps {
  customerId: string;
  avatarIndex?: number;
}

async function CustomerDetailsPageServer(
  props: ICustomerDetailsPageServerProps
) {
  const { customerId, avatarIndex } = props;

  return (
    <CustomerLoyaltyPageClient>
      <CustomerProfileSectionServerWithSuspense
        customerId={customerId}
        avatarIndex={avatarIndex}
      />
      <OrdersSectionServerWithSuspense customerId={customerId} />
    </CustomerLoyaltyPageClient>
  );
}

export default function CustomerDetailsPageServerWithSuspense(
  props: ICustomerDetailsPageServerProps
) {
  return (
    <Suspense fallback={<Skeleton loading active />}>
      <CustomerDetailsPageServer {...props} />
    </Suspense>
  );
}
