import { IOrderItem } from '../../../orders/entities/order/IOrderItem';

export type TPromotionConfig =
  | IPromotionConfigMinQuantity
  | IPromotionConfigMinTotalPrice
  | IPromotionConfigItemCategory
  | IPromotionConfigDayOfPurchase;

interface IPromotionConfigMinQuantity {
  type: 'order_min_quantity';
  min_order_item_quantity: number;
}

interface IPromotionConfigMinTotalPrice {
  type: 'order_min_total_price';
  min_order_total_price_usd: number;
}

interface IPromotionConfigItemCategory {
  type: 'item_category';
  item_category: IOrderItem['category'];
}

interface IPromotionConfigDayOfPurchase {
  type: 'order_day_of_purchase';
  day: number; // sun: 0, mon: 1, tue: 2, ...sat: 6
}
