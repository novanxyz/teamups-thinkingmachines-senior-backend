

import { ILoyaltyTierThreshold } from '@/services/loyalty/types/ILoyaltyTierThreshold';
import { IEntityOrder } from '@/services/orders/entities/order/IEntityOrder';
import { IEntityPromotion } from '@/services/promotions/entities/promotion/IEntityPromotion';

export interface ILoyaltyTierRequest  {
    orders: IEntityOrder[];
    promotions: IEntityPromotion[];
    thresholds: ILoyaltyTierThreshold[];
}
