import { AnyBulkWriteOperation, ObjectId } from 'mongodb';
import { EntityCustomer } from '../customers/entities/customer/EntityCustomer';
import { IEntityCustomer } from '../customers/entities/customer/IEntityCustomer';

const CONFIG = {
  minNumCustomers: 5,
  maxNumCustomers: 15,
};

export abstract class BaseCustomerSeedDataService {
  public async genDeleteSeedCustomers(): Promise<void> {
    const customerEntity = new EntityCustomer();
    await customerEntity.genDeleteAllEntities();
  }

  public async genCreateSeedCustomers(): Promise<IEntityCustomer[]> {
    // set up creation payloads
    const numCustomersToCreate =
      Math.floor(
        Math.random() * (CONFIG.maxNumCustomers - CONFIG.minNumCustomers + 1)
      ) + CONFIG.minNumCustomers;
    const modelPayloads = Array.from({ length: numCustomersToCreate }).map(() =>
      this.getConstructCustomerModel()
    );

    // perform bulk writes
    const customerEntity = new EntityCustomer();
    const bulkWriteOperations: AnyBulkWriteOperation<IEntityCustomer>[] =
      modelPayloads.map((modelPayload) => ({
        insertOne: {
          document: modelPayload,
        },
      }));
    const bulkOpResult = await customerEntity.genBulkWrite(bulkWriteOperations);
    if (!bulkOpResult.isOk()) {
      throw new Error(
        `Failed to create customers: ${bulkOpResult.getWriteErrors().join(', ')}`
      );
    }

    // return newly-created entities
    return await customerEntity.genMany();
  }

  private getConstructCustomerModel(): IEntityCustomer {
    return {
      _id: new ObjectId(),
    };
  }
}
