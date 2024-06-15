import { EMongoCollectionName } from '@/services/mongo/EMongoCollectionName';
import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { BaseEntity } from '../../../mongo/entities/base/BaseEntity';
import { IEntityCustomer } from './IEntityCustomer';

export class EntityCustomer extends BaseEntity<IEntityCustomer> {
  public getCollectionName(): EMongoCollectionName {
    return EMongoCollectionName.CUSTOMERS;
  }

  public getAsClientEntity(
    entity: IEntityCustomer
  ): TWithStringIds<IEntityCustomer> {
    return {
      ...entity,
      _id: entity._id.toString(),
    };
  }
}
