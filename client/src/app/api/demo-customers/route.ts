import { EntityCustomer } from '@/services/customers/entities/customer/EntityCustomer';
import { NextResponse } from 'next/server';

export async function GET(): Promise<Response> {
  const customerEntity = new EntityCustomer();
  const customerModels = await customerEntity.genMany();
  return NextResponse.json(customerModels);
}
