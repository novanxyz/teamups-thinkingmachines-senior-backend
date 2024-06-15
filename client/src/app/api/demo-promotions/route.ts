import { EntityPromotion } from '@/services/promotions/entities/promotion/EntityPromotion';
import { NextResponse } from 'next/server';

export async function GET(): Promise<Response> {
  const promoEntity = new EntityPromotion();
  const promoModels = await promoEntity.genMany();
  return NextResponse.json(promoModels);
}
