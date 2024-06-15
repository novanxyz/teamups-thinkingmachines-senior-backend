import { TLoyaltyTier } from './ILoyaltyTierSummary';

export interface ILoyaltyTierThreshold {
  tier: TLoyaltyTier;
  min_points_required: number;
}
