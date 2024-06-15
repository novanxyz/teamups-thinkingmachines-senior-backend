import { ObjectId } from 'mongodb';

export enum EOrderCategory {
  MEAL = 'meal',
  DRINK = 'drink',
  CANDY = 'candy',
  CONVENIENCE = 'convenience',
  OTHER = 'other',
}

export interface IOrderItem {
  _id: ObjectId;
  price_usd: number;
  category: EOrderCategory;
}
