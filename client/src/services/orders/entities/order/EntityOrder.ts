import { EMongoCollectionName } from '@/services/mongo/EMongoCollectionName';
import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { BaseEntity } from '../../../mongo/entities/base/BaseEntity';
import { IEntityOrder } from './IEntityOrder';

export class EntityOrder extends BaseEntity<IEntityOrder> {
  public getCollectionName(): EMongoCollectionName {
    return EMongoCollectionName.ORDERS;
  }

  public getAsClientEntity(entity: IEntityOrder): TWithStringIds<IEntityOrder> {
    return {
      ...entity,
      _id: entity._id.toString(),
      customer_id: entity.customer_id.toString(),
      items: entity.items.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    };
  }
}
