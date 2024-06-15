import { IOrderLoyaltyPointsSummary } from './IOrderLoyaltyPointsSummary';

export interface ILoyaltyRewardsPointsSummary {
  total_points: number;
  order_summaries: IOrderLoyaltyPointsSummary[];
}
