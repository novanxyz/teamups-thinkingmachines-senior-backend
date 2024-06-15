export interface IOrderLoyaltyPointsSummary {
  order_id: string;
  // ids of promotions that this order qualifies for
  eligible_promotion_ids: string[];
  // id of the single best promotion that was applied to the order, if any
  effective_promotion_id: string | null;
  // total points earned for the order, should be >= 0
  points_earned: number;
}
