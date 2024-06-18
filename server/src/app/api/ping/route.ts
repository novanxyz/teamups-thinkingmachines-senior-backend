import { IHealthCheckSummary } from '@/services/infra/IHealthCheckSummary';
import { NextResponse } from 'next/server';

export const slug = 'pong'

export async function GET(): Promise<Response> {
  let response : IHealthCheckSummary = {message: slug } ;
  return NextResponse.json(response);
}
export async function POST(): Promise<Response> {
  return GET();
}
