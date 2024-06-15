import { ObjectId } from 'mongodb';
import { TPromotionConfig } from './IPromotionConfig';

export interface IEntityPromotion {
  _id: ObjectId;
  name: string;
  config: TPromotionConfig;
  points_multiplier: number;
}
