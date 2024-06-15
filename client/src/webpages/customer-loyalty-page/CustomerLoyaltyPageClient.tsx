'use client';

import { PropsWithChildren } from 'react';
import styles from './CustomerLoyaltyPageClient.module.css';

interface ICustomerLoyaltyPageClientProps extends PropsWithChildren {}

export default function CustomerLoyaltyPageClient(
  props: ICustomerLoyaltyPageClientProps
) {
  const { children } = props;
  return <main className={styles['root-container']}>{children}</main>;
}
