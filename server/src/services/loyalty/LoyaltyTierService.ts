import { ILoyaltyRewardsPointsSummary } from '@/services/loyalty/types/ILoyaltyRewardsPointsSummary';
import { ILoyaltyTierSummary, TLoyaltyTier } from "@/services/loyalty/types/ILoyaltyTierSummary";
import { ILoyaltyTierThreshold } from "@/services/loyalty/types/ILoyaltyTierThreshold";
import { IOrderLoyaltyPointsSummary } from "@/services/loyalty/types/IOrderLoyaltyPointsSummary";
import { IEntityOrder } from "@/services/orders/entities/order/IEntityOrder";
import { IEntityPromotion } from "@/services/promotions/entities/promotion/IEntityPromotion";
import { IOrderPromotion } from './IOrderPromotion';

export class LoyaltyTierService {
  promotions : IEntityPromotion[];
  thresholds : ILoyaltyTierThreshold[];
  
  constructor(promotions: IEntityPromotion[], thresholds: ILoyaltyTierThreshold[]){
    this.promotions = promotions;
    this.thresholds = thresholds;
  }

  private getLoyaltyTierforPoint(point: number): ILoyaltyTierSummary {
    let idx = 0 ;
    let loyaltyTier : TLoyaltyTier = 'none' ;

    let numPointsToNextTier : number | null =  this.thresholds[idx].min_points_required ; 

    while ( this.thresholds[idx] && point >= this.thresholds[idx].min_points_required ){
      loyaltyTier = this.thresholds[idx].tier;
      idx++
    }
    numPointsToNextTier =  loyaltyTier == 'gold' ? null : this.thresholds[idx].min_points_required - point;
    return { tier: loyaltyTier, num_points_to_next_tier: numPointsToNextTier} as ILoyaltyTierSummary ;
  }

  private getPromotionsForOrder(order: IEntityOrder ): IOrderPromotion[] {
    
    const orderDate = new Date(order.date.year,order.date.month,order.date.date);
    const totalPrice = order.items.reduce((sum, i) => sum + i.price_usd, 0);


    let eligible_promotions : IOrderPromotion[] = []:


    for ( var promo in this.promotions ) {

      switch ( promo.config.type ) {
      'order_min_quantity' : {
        if ( promo.config.min_order_item_quantity >= order.items.length ) {
          const point = Math.round( totalPrice * qty_promo.points_multiplier * 100)/100 ;
          eligible_promotions.push({ order: order ,promotion: qty_promo, points_earned: point });
        }
      };
      'order_min_total_price' : {
        if ( promo.config.min_order_total_price_usd <= totalPrice ) {
          const  point = Math.round( total_price * total_promo.points_multiplier*100)/100 ;
          eligible_promotions.push({ order: order  ,promotion: total_promo, points_earned: point });
        }
      };
      'order_day_of_purchase' : {
        if ( promo.config.day == orderDate.getDay() ) {
          const point = Math.round( totalPrice * day_promo.points_multiplier*100)/100;
          eligible_promotions.push({ order: order  , promotion: day_promo, points_earned: point });
        }
      };
      'item_category' : {
        for ( var item of order.items ) {
          if ( promo.config.item_category == item.category ) {
            const point = Math.round(item.price_usd * item_promo.points_multiplier*100)/100 ;
            eligible_promotions.push({ order: order, promotion: item_promo, points_earned: point }) ;
          }
        }
      };
      }


    return eligible_promotions
  }

  public getLoyaltyTier(orders: IEntityOrder[]): ILoyaltyTierSummary {        
    
    const orderPromotions = orders.map(o => this.getPromotionsForOrder(o) );
    let points = 0;
    if ( orderPromotions.length ) {
      points =  orderPromotions.reduce((prev,cur)=> prev + cur.reduce((p,c)=>p+c.points_earned,0) ,0);
    } else {
      points = order.items.reduce((sum, i) => sum + i.price_usd, 0);
    }
   
    return this.getLoyaltyTierforPoint(points);
  }

  public getRewardsPoints(orders: IEntityOrder[]): ILoyaltyRewardsPointsSummary {
    
    let totalPoints = 0;
    let orderSummaries =[];
    for (var order of orders ){
      const orderPromotions = this.getPromotionsForOrder(order);
      if ( orderPromotions.length ) {
        const maxPromo = orderPromotions.reduce((prev,cur) => cur.points_earned > prev.points_earned ? cur: prev ,order_promotions[0]);
        const orderTotalPoints = orderPromotions.reduce((sum,cur) => sum+cur.points_earned,0);
        const orderSummary : IOrderLoyaltyPointsSummary = {
          order_id: order._id.toString(),
          eligible_promotion_ids: orderPromotions.map(op=> op.promotion._id.toString()),
          effective_promotion_id: maxPromo.promotion._id.toString(),
          points_earned: orderTotalPoints
        }
        orderSummaries.push(orderSummary);
        total_points += orderTotalPoints;
      }
    }

    return {
      total_points: totalPoints,
      order_summaries: orderSummaries
    } as ILoyaltyRewardsPointsSummary ;
  }

}