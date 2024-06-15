import { EMongoCollectionName } from '@/services/mongo/EMongoCollectionName';
import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { BaseEntity } from '../../../mongo/entities/base/BaseEntity';
import { IEntityPromotion } from './IEntityPromotion';

export class EntityPromotion extends BaseEntity<IEntityPromotion> {
  public getCollectionName(): EMongoCollectionName {
    return EMongoCollectionName.PROMOTIONS;
  }

  public getAsClientEntity(
    entity: IEntityPromotion
  ): TWithStringIds<IEntityPromotion> {
    return {
      ...entity,
      _id: entity._id.toString(),
    };
  }
}
