import { EntityCustomer } from '@/services/customers/entities/customer/EntityCustomer';
import { EntityOrder } from '@/services/orders/entities/order/EntityOrder';
import { NextResponse } from 'next/server';

export async function GET(): Promise<Response> {
  const customerEntity = new EntityCustomer();
  const sampleCustomerModel = await customerEntity.genSampleOne();
  if (sampleCustomerModel == null) {
    return NextResponse.json([]);
  }

  const orderEntity = new EntityOrder();
  const orderModels = await orderEntity.genMany({
    customer_id: sampleCustomerModel._id,
  });
  return NextResponse.json(orderModels);
}
