import { SeedDataService } from '@/services/seed-data/SeedDataService';
import { NextResponse } from 'next/server';

export interface ISeedOpResult {
  ack: 0 | 1;
}

const DEFAULT_SEED_OP_RESULT: ISeedOpResult = { ack: 1 };

export async function POST(): Promise<Response> {
  const seedDataService = new SeedDataService();
  await seedDataService.genCreateSeedData();
  return NextResponse.json(DEFAULT_SEED_OP_RESULT, { status: 201 });
}

export async function DELETE(): Promise<Response> {
  const seedDataService = new SeedDataService();
  await seedDataService.genDeleteSeedData();
  return NextResponse.json(DEFAULT_SEED_OP_RESULT, { status: 200 });
}
