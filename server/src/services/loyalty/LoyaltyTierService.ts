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
    let idx = 0
    let loyaltyTier : TLoyaltyTier = 'none'

    let num_points_to_next_tier : number | null =  this.thresholds[idx].min_points_required ; 

    while ( this.thresholds[idx] && point >= this.thresholds[idx].min_points_required ){
      loyaltyTier = this.thresholds[idx].tier;
      idx++
    }
    num_points_to_next_tier =  loyaltyTier == 'gold' ? null : this.thresholds[idx].min_points_required - point
    return { tier: loyaltyTier, num_points_to_next_tier: num_points_to_next_tier} 
  }

  private getPromotionsForOrder(order: IEntityOrder ): IOrderPromotion[] {
    
    let order_date = new Date(order.date.year,order.date.month,order.date.date)
    let total_price = order.items.reduce((sum, i) => sum + i.price_usd, 0);
    let points = 0

    let eligible_promotions : IOrderPromotion[] = []

    let qty_promo = this.promotions.find( p => p.config.type == 'order_min_quantity' && p.config.min_order_item_quantity <= order.items.length )
    let total_promo = this.promotions.find( p => p.config.type == 'order_min_total_price' && p.config.min_order_total_price_usd <= total_price )   
    let day_promo = this.promotions.find( p => p.config.type == 'order_day_of_purchase' && p.config.day == order_date.getDay() )   

    if (qty_promo){
      let point = Math.round(total_price * qty_promo.points_multiplier * 100)/100
      points += point 
      eligible_promotions.push({ order: order ,promotion: qty_promo, points_earned: point })
    }

    if (total_promo){
      let  point = Math.round(total_price * total_promo.points_multiplier*100)/100
      points +=  point
      eligible_promotions.push({ order: order  ,promotion: total_promo, points_earned: point })
      
    }
    if (day_promo){
      let point = Math.round(total_price * day_promo.points_multiplier*100)/100
      points +=  point
      eligible_promotions.push({ order: order  , promotion: day_promo, points_earned: point })
    }

    for (var item of  order.items){
      let item_promo = this.promotions.find( p => p.config.type == 'item_category' && p.config.item_category == item.category ) 
      if (item_promo ){
        let point = Math.round(item.price_usd * item_promo.points_multiplier*100)/100
        points += point
        eligible_promotions.push({ order: order, promotion: item_promo, points_earned: point })
        }
    }
    
    return eligible_promotions
  }

  public getLoyaltyTier(orders: IEntityOrder[]): ILoyaltyTierSummary {        
    
    let order_promotions = orders.map(o => this.getPromotionsForOrder(o) );
    let point =  order_promotions.reduce((prev,cur)=> prev + cur.reduce((p,c)=>p+c.points_earned,0) ,0);
    let loyalty_repsone = this.getLoyaltyTierforPoint(point)
    return loyalty_repsone;
  }

  public getRewardsPoints(orders: IEntityOrder[]): ILoyaltyRewardsPointsSummary {
    
    let total_points = 0;
    let order_summaries =[]
    for (var order of orders ){
      let order_promotions = this.getPromotionsForOrder(order);
      if ( order_promotions.length ) {
        let max_promo = order_promotions.reduce((prev,cur) => cur.points_earned > prev.points_earned ? cur: prev ,order_promotions[0])
        let order_total_points = order_promotions.reduce((sum,cur) => sum+cur.points_earned,0)
        let order_summary : IOrderLoyaltyPointsSummary = {
          order_id: order._id.toString(),
          eligible_promotion_ids: order_promotions.map(op=> op.promotion._id.toString()),
          effective_promotion_id: max_promo.promotion._id.toString(),
          points_earned: order_total_points
        }
        order_summaries.push(order_summary);
        total_points +=order_total_points;
      }
    }

    let response : ILoyaltyRewardsPointsSummary = {
      total_points: total_points,
      order_summaries: order_summaries
    }
    return response  ;
  }

}