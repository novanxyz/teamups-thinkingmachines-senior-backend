import { AnyBulkWriteOperation, ObjectId } from 'mongodb';
import { EntityCustomer } from '../customers/entities/customer/EntityCustomer';
import { EntityOrder } from '../orders/entities/order/EntityOrder';
import { IEntityOrder } from '../orders/entities/order/IEntityOrder';
import {
  EOrderCategory,
  IOrderItem,
} from '../orders/entities/order/IOrderItem';

const CONFIG = {
  minNumOrdersPerCustomer: 30,
  maxNumOrdersPerCustomers: 150,
  minNumItemsPerOrder: 1,
  maxNumItemsPerOrder: 10,
  orderWindowLookbackNumDays: 30,
  minItemPriceUSD: 0.5,
  maxItemPriceUSD: 100,
};

export abstract class BaseOrderSeedDataService {
  public async genDeleteSeedOrders(): Promise<void> {
    const orderEntity = new EntityOrder();
    await orderEntity.genDeleteAllEntities();
  }

  public async genCreateSeedOrders(): Promise<IEntityOrder[]> {
    // set up creation payloads
    const customerEntity = new EntityCustomer();
    const customers = await customerEntity.genMany();

    const orderModelPayloads: IEntityOrder[] = customers
      .map((customer) => {
        const numOrdersToCreate =
          Math.floor(
            Math.random() *
              (CONFIG.maxNumOrdersPerCustomers -
                CONFIG.minNumOrdersPerCustomer +
                1)
          ) + CONFIG.minNumOrdersPerCustomer;

        return Array.from({
          length: numOrdersToCreate,
        }).map(() => this.getConstructOrderModel(customer._id));
      })
      .flat();

    // perform bulk writes
    const orderEntity = new EntityOrder();
    const bulkWriteOperations: AnyBulkWriteOperation<IEntityOrder>[] =
      orderModelPayloads.map((modelPayload) => ({
        insertOne: {
          document: modelPayload,
        },
      }));
    const bulkOpResult = await orderEntity.genBulkWrite(bulkWriteOperations);
    if (!bulkOpResult.isOk()) {
      throw new Error(
        `Failed to create orders: ${bulkOpResult.getWriteErrors().join(', ')}`
      );
    }

    // return newly-created entities
    return await orderEntity.genMany();
  }

  private getConstructOrderModel(customerId: ObjectId): IEntityOrder {
    const numItemsInOrder =
      Math.floor(
        Math.random() *
          (CONFIG.maxNumItemsPerOrder - CONFIG.minNumItemsPerOrder + 1)
      ) + CONFIG.minNumItemsPerOrder;

    return {
      _id: new ObjectId(),
      customer_id: customerId,
      date: this.getConstructDateForOrder(),
      items: Array.from({ length: numItemsInOrder }).map(() =>
        this.getConstructOrderItemModel()
      ),
    };
  }

  private getConstructDateForOrder(): IEntityOrder['date'] {
    const now = new Date();
    const yearNow = now.getFullYear();
    const monthNow = now.getMonth();
    const dateNow = now.getDate();

    const daysToSubtractForLookback = Math.floor(
      Math.random() * (CONFIG.orderWindowLookbackNumDays + 1)
    );
    const dateWithLookbackSubtracted = new Date(
      yearNow,
      monthNow,
      dateNow - daysToSubtractForLookback
    );

    return {
      year: dateWithLookbackSubtracted.getFullYear(),
      month: dateWithLookbackSubtracted.getMonth(),
      date: dateWithLookbackSubtracted.getDate(),
    };
  }

  private getConstructOrderItemModel(): IOrderItem {
    const priceUSD =
      Math.random() * (CONFIG.maxItemPriceUSD - CONFIG.minItemPriceUSD + 1) +
      CONFIG.minItemPriceUSD;

    return {
      _id: new ObjectId(),
      price_usd: priceUSD,
      category: this.getRandomItemCategory(),
    };
  }

  private getRandomItemCategory(): EOrderCategory {
    const categories = Object.values<EOrderCategory>(EOrderCategory);
    return categories[Math.floor(Math.random() * categories.length)];
  }
}
