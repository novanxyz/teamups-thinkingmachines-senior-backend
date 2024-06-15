import { IHealthCheckSummary } from '@/services/infra/IHealthCheckSummary';
import { ILoyaltyTierSummary } from '@/services/loyalty/types/ILoyaltyTierSummary';
import { ILoyaltyTierThreshold } from '@/services/loyalty/types/ILoyaltyTierThreshold';
import { IOrderLoyaltyPointsSummary } from '@/services/loyalty/types/IOrderLoyaltyPointsSummary';
import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { IEntityOrder } from '@/services/orders/entities/order/IEntityOrder';
import { EOrderCategory } from '@/services/orders/entities/order/IOrderItem';
import { IEntityPromotion } from '@/services/promotions/entities/promotion/IEntityPromotion';
import * as _ from 'lodash';
import {
  HEALTH_CHECK_URL,
  LOYALTY_TIER_URL,
  REWARDS_POINTS_URL,
} from '../shared/utils/env-variables';

type TValidationHandler = (responseData: unknown) => TValidationResult;
type TValidationResult = [boolean, string[]];

const TEST_ORDERS: TWithStringIds<IEntityOrder>[] = [
  {
    _id: '6616c9c557f6aca48492946e',
    customer_id: '6616c9c557f6aca484929462',
    date: {
      year: 2024,
      month: 3, // april
      date: 9,
    },
    items: [
      {
        _id: '6616c9c557f6aca48492946f',
        price_usd: 100,
        category: EOrderCategory.MEAL,
      },
    ],
  },
];

const BRONZE_TIER: ILoyaltyTierThreshold = {
  tier: 'bronze',
  min_points_required: 50,
};

const SILVER_TIER: ILoyaltyTierThreshold = {
  tier: 'silver',
  min_points_required: 100,
};

const GOLD_TIER: ILoyaltyTierThreshold = {
  tier: 'gold',
  min_points_required: 150,
};

export const LOYALTY_TIER_THRESHOLDS: ILoyaltyTierThreshold[] = [
  BRONZE_TIER,
  SILVER_TIER,
  GOLD_TIER,
];

const MIN_ORDER_TOTAL_PROMOTION: TWithStringIds<IEntityPromotion> = {
  _id: '6616c9c557f6aca48492946b',
  name: 'Min Order Total Promotion',
  config: {
    type: 'order_min_total_price',
    min_order_total_price_usd: 101,
  },
  points_multiplier: 1.5,
};

const DAY_OF_WEEK_PROMOTION: TWithStringIds<IEntityPromotion> = {
  _id: '6616c9c557f6aca48492946d',
  name: 'Order Day of Purchase Promotion',
  config: {
    type: 'order_day_of_purchase',
    day: 2,
  },
  points_multiplier: 1.1,
};

const TEST_PROMOTIONS: TWithStringIds<IEntityPromotion>[] = [
  MIN_ORDER_TOTAL_PROMOTION,
  DAY_OF_WEEK_PROMOTION,
];

export interface ITestCaseConfig {
  name: string;
  description: string;
  requestUrl: string;
  requestBody: unknown | null;
  validateResponse: TValidationHandler;
}

export const TEST_CASES: ITestCaseConfig[] = [
  {
    name: 'Health check',
    description: 'Verify base health-check connection is established',
    requestUrl: HEALTH_CHECK_URL,
    requestBody: null,
    validateResponse: (responseData: unknown) => {
      if (responseData == null) {
        return [false, ['Response data is null']];
      }

      if (typeof responseData !== 'object') {
        return [false, ['Response data is not an object']];
      }

      const expectedHealthSummary: IHealthCheckSummary = {
        message: 'pong',
      };
      const hasValidHealthSummaryResponse = _.isEqual(
        responseData,
        expectedHealthSummary
      );

      if (!hasValidHealthSummaryResponse) {
        return [
          false,
          [
            `
              Response data does not contain expected summary.
              Expected: ${JSON.stringify(expectedHealthSummary)}
              Received: ${JSON.stringify(responseData)}
            `,
          ],
        ];
      }

      return [true, []];
    },
  },
  {
    name: 'Loyalty tier: Test 1',
    description: 'Test loyalty-tier endpoint',
    requestUrl: LOYALTY_TIER_URL,
    requestBody: {
      orders: TEST_ORDERS,
      promotions: TEST_PROMOTIONS,
      thresholds: LOYALTY_TIER_THRESHOLDS,
    },
    validateResponse: (responseData: unknown) => {
      if (responseData == null || typeof responseData !== 'object') {
        return [false, ['Response data is not an object. Expected object']];
      }

      const expectedLoyaltyTierSummaryResponse: ILoyaltyTierSummary = {
        tier: 'silver',
        num_points_to_next_tier: 40,
      };
      const hasValidTierSummary = _.isEqual(
        responseData,
        expectedLoyaltyTierSummaryResponse
      );

      if (!hasValidTierSummary) {
        return [
          false,
          [
            `
              Response data does not contain expected summary.
              Expected: ${JSON.stringify(expectedLoyaltyTierSummaryResponse)}
              Received: ${JSON.stringify(responseData)}
            `,
          ],
        ];
      }

      return [true, []];
    },
  },
  {
    name: 'Rewards points: Test 1',
    description: 'Test rewards-points endpoint',
    requestUrl: REWARDS_POINTS_URL,
    requestBody: {
      orders: TEST_ORDERS,
      promotions: TEST_PROMOTIONS,
    },
    validateResponse: (responseData: unknown) => {
      if (responseData == null) {
        return [false, ['Response data is null']];
      }

      if (typeof responseData !== 'object') {
        return [false, ['Response data is not an object']];
      }

      if (
        !('total_points' in responseData) ||
        !('order_summaries' in responseData)
      ) {
        return [
          false,
          [
            'Response data does not contain expected "total_points" and "order_summaries" fields',
          ],
        ];
      }

      if (responseData.total_points !== 110) {
        return [
          false,
          [
            `Expected "total_points" value of 110 for ((100 USD)*(1.1 day-of-week-promo multiplier)), received: ${responseData.total_points}`,
          ],
        ];
      }

      const expectedPointsSummaries: IOrderLoyaltyPointsSummary[] = [
        {
          order_id: TEST_ORDERS[0]._id,
          eligible_promotion_ids: [DAY_OF_WEEK_PROMOTION._id],
          effective_promotion_id: DAY_OF_WEEK_PROMOTION._id,
          points_earned: 110,
        },
      ];
      const hasValidPointsPerOrder = _.isEqual(
        responseData.order_summaries,
        expectedPointsSummaries
      );

      if (!hasValidPointsPerOrder) {
        return [
          false,
          [
            `
              Response "order_summaries" is inaccurate or out of sequence with input orders.
              Expected: ${JSON.stringify(expectedPointsSummaries)}
              Received: ${JSON.stringify(responseData.order_summaries)}
            `,
          ],
        ];
      }

      return [true, []];
    },
  },
];
