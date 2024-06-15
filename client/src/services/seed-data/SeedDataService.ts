import { applyMixins } from '@/typescript/apply-mixins';
import { EntityCustomer } from '../customers/entities/customer/EntityCustomer';
import { BaseCustomerSeedDataService } from './BaseCustomerSeedDataService';
import { BaseOrderSeedDataService } from './BaseOrderSeedDataService';
import { BasePromotionSeedDataService } from './BasePromotionSeedDataService';

export class SeedDataService {
  public async genHasSeedData(): Promise<boolean> {
    const customerEntity = new EntityCustomer();
    const customerSample = await customerEntity.genSampleOne();
    return customerSample != null;
  }

  public async genCreateSeedData(): Promise<void> {
    await this.genCreateSeedCustomers();
    await Promise.all([
      this.genCreateSeedOrders(),
      this.genCreateSeedPromotions(),
    ]);
  }

  public async genDeleteSeedData(): Promise<void> {
    await Promise.all([
      this.genDeleteSeedCustomers(),
      this.genDeleteSeedOrders(),
      this.genDeleteSeedPromotions(),
    ]);
  }
}

export interface SeedDataService
  extends BaseCustomerSeedDataService,
    BaseOrderSeedDataService,
    BasePromotionSeedDataService {}

applyMixins(SeedDataService, [
  BaseCustomerSeedDataService,
  BaseOrderSeedDataService,
  BasePromotionSeedDataService,
]);
