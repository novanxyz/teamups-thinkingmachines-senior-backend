import { AnyBulkWriteOperation, ObjectId } from 'mongodb';
import { EOrderCategory } from '../orders/entities/order/IOrderItem';
import { EntityPromotion } from '../promotions/entities/promotion/EntityPromotion';
import { IEntityPromotion } from '../promotions/entities/promotion/IEntityPromotion';

const BASE_PROMOTIONS: Pick<
  IEntityPromotion,
  'name' | 'config' | 'points_multiplier'
>[] = [
  {
    name: 'Min Order Item Quantity Promotion',
    config: {
      type: 'order_min_quantity',
      min_order_item_quantity: 4,
    },
    points_multiplier: 1.25,
  },
  {
    name: 'Min Order Total Promotion',
    config: {
      type: 'order_min_total_price',
      min_order_total_price_usd: 60,
    },
    points_multiplier: 1.5,
  },
  {
    name: 'Item Category Promotion',
    config: {
      type: 'item_category',
      item_category: EOrderCategory.DRINK,
    },
    points_multiplier: 1.1,
  },
  {
    name: 'Order Day of Purchase Promotion',
    config: {
      type: 'order_day_of_purchase',
      day: 0,
    },
    points_multiplier: 1.1,
  },
];

export abstract class BasePromotionSeedDataService {
  public async genDeleteSeedPromotions(): Promise<void> {
    const promotionEntity = new EntityPromotion();
    await promotionEntity.genDeleteAllEntities();
  }

  public async genCreateSeedPromotions(): Promise<IEntityPromotion[]> {
    // perform bulk writes
    const promotionEntity = new EntityPromotion();
    const bulkWriteOperations: AnyBulkWriteOperation<IEntityPromotion>[] =
      BASE_PROMOTIONS.map((modelPayload) => ({
        insertOne: {
          document: {
            ...modelPayload,
            _id: new ObjectId(),
          },
        },
      }));
    const bulkOpResult =
      await promotionEntity.genBulkWrite(bulkWriteOperations);
    if (!bulkOpResult.isOk()) {
      throw new Error(
        `Failed to create customers: ${bulkOpResult.getWriteErrors().join(', ')}`
      );
    }

    // return newly-created entities
    return await promotionEntity.genMany();
  }
}
