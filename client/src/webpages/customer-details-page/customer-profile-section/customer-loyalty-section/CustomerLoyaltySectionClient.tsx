'use client';

import { ILoyaltyRewardsPointsSummary } from '@/services/loyalty/types/ILoyaltyRewardsPointsSummary';
import {
  ILoyaltyTierSummary,
  TLoyaltyTier,
} from '@/services/loyalty/types/ILoyaltyTierSummary';
import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { IEntityOrder } from '@/services/orders/entities/order/IEntityOrder';
import { IEntityPromotion } from '@/services/promotions/entities/promotion/IEntityPromotion';
import useFetchData from '@/webpages/shared/hooks/useFetchData';
import {
  LOYALTY_TIER_URL,
  REWARDS_POINTS_URL,
} from '@/webpages/shared/utils/env-variables';
import { LOYALTY_TIER_THRESHOLDS } from '@/webpages/test-cases-page/test-cases-constants';
import { SendOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Empty,
  Statistic,
} from 'antd';
import styles from './CustomerLoyaltySectionClient.module.css';

interface ICustomerLoyaltySectionClientProps {
  orders: TWithStringIds<IEntityOrder>[];
  promotions: TWithStringIds<IEntityPromotion>[];
}

export default function CustomerLoyaltySectionClient(
  props: ICustomerLoyaltySectionClientProps
) {
  const { orders, promotions } = props;

  const [loyaltyTierData, fetchLoyaltyTierData] =
    useFetchData<ILoyaltyTierSummary>(LOYALTY_TIER_URL, {
      shouldAutoInitRequest: false,
      httpMethod: 'POST',
      requestBody: JSON.stringify({
        orders,
        promotions,
        thresholds: LOYALTY_TIER_THRESHOLDS,
      }),
    });
  const [numRewardsPointsData, fetchRewardsPointsData] =
    useFetchData<ILoyaltyRewardsPointsSummary>(REWARDS_POINTS_URL, {
      shouldAutoInitRequest: false,
      httpMethod: 'POST',
      requestBody: JSON.stringify({
        orders,
        promotions,
      }),
    });

  const items: DescriptionsProps['items'] = [
    {
      key: 'status',
      label: (
        <LoyaltyProgramTableHeader
          label='Loyalty tier'
          requestUrl={LOYALTY_TIER_URL}
          isLoading={loyaltyTierData.isLoading}
          onClickRequest={fetchLoyaltyTierData}
        />
      ),
      children: (
        <div>
          <LoyaltyTierClient loyaltyTier={loyaltyTierData.data?.tier} />
        </div>
      ),
    },
    {
      key: 'points',
      label: (
        <LoyaltyProgramTableHeader
          label='Rewards points'
          requestUrl={REWARDS_POINTS_URL}
          isLoading={numRewardsPointsData.isLoading}
          onClickRequest={fetchRewardsPointsData}
        />
      ),
      children: (
        <div>
          <RewardsPointsClient
            numPoints={numRewardsPointsData.data?.total_points}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles['root-container']}>
      <Descriptions bordered layout='vertical' items={items} />
    </div>
  );
}

interface ILoyaltyTierClientProps {
  loyaltyTier?: TLoyaltyTier;
}

function LoyaltyTierClient(props: ILoyaltyTierClientProps) {
  const { loyaltyTier } = props;

  if (loyaltyTier == null) {
    return <Empty />;
  }

  return <p>{loyaltyTier}</p>;
}

interface IRewardsPointsClientProps {
  numPoints?: number;
}

function RewardsPointsClient(props: IRewardsPointsClientProps) {
  const { numPoints } = props;

  if (numPoints == null) {
    return <Empty />;
  }

  return <Statistic value={numPoints} />;
}

interface ILoyaltyProgramTableHeaderProps {
  label: string;
  requestUrl: string;
  isLoading: boolean;
  onClickRequest: () => void;
}

function LoyaltyProgramTableHeader(props: ILoyaltyProgramTableHeaderProps) {
  const { label, requestUrl, onClickRequest, isLoading } = props;

  return (
    <div className={styles['loyalty-header-container']}>
      <div className={styles['loyalty-header-title']}>
        <p>{label}</p>
        <p className={styles['url-text']}>(URL: {requestUrl})</p>
      </div>
      <div>
        <Button
          type='primary'
          loading={isLoading}
          icon={<SendOutlined />}
          onClick={onClickRequest}
        />
      </div>
    </div>
  );
}
