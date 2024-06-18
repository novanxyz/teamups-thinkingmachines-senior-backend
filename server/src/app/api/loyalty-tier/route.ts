import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

import { ILoyaltyTierSummary } from '@/services/loyalty/types/ILoyaltyTierSummary';


export const slug = 'loyalty-tier'


import { IHealthCheckSummary } from '@/services/infra/IHealthCheckSummary';
import { LoyaltyTierService } from '../../../services/loyalty/LoyaltyTierService';
import { ILoyaltyTierRequest } from '../ILoyaltyTierRequest';

export async function GET(): Promise<Response> {
  return NextResponse.json({"message": slug });
}

export async function POST(req: NextRequest, res: NextApiResponse<ILoyaltyTierSummary>): Promise<NextResponse<ILoyaltyTierSummary|IHealthCheckSummary>> {
 
  try {
    let request : ILoyaltyTierRequest = await req.json();

    const loyaltyService = new LoyaltyTierService(request.promotions, request.thresholds);
    let response = await loyaltyService.getLoyaltyTier(request.orders)
    
    return NextResponse.json(response);
  }catch(error){
    return NextResponse.json({message :error} as IHealthCheckSummary,{status:500})
  }

}