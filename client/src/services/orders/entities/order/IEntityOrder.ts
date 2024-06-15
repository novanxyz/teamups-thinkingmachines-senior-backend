import { ObjectId } from 'mongodb';
import { IOrderItem } from './IOrderItem';

export interface IEntityOrder {
  _id: ObjectId;
  customer_id: ObjectId;
  date: {
    year: number; // e.g. 2024
    month: number; // range from 0-11
    date: number; // range from 1-31
  };
  items: IOrderItem[];
}
