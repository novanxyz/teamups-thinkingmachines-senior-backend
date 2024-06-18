import { IEntityOrder } from "@/services/orders/entities/order/IEntityOrder";
import { IEntityPromotion } from "@/services/promotions/entities/promotion/IEntityPromotion";


export interface IOrderPromotion {
    order: IEntityOrder
    promotion: IEntityPromotion
    points_earned: number
}