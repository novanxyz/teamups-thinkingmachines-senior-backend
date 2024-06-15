export type TLoyaltyTier = 'none' | 'bronze' | 'silver' | 'gold';

export interface ILoyaltyTierSummary {
  tier: TLoyaltyTier;
  num_points_to_next_tier: number | null;
}
