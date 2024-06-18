import { NextRequest, NextResponse } from 'next/server';

import { IHealthCheckSummary } from '@/services/infra/IHealthCheckSummary';
import { ILoyaltyRewardsPointsSummary } from '@/services/loyalty/types/ILoyaltyRewardsPointsSummary';
import { NextApiResponse } from 'next';

import { LoyaltyTierService } from '../../../services/loyalty/LoyaltyTierService';
import { ILoyaltyTierRequest } from '../ILoyaltyTierRequest';

export const slug = 'rewards-points'

export async function POST(req: NextRequest, res:NextApiResponse<ILoyaltyRewardsPointsSummary>): Promise<NextResponse<ILoyaltyRewardsPointsSummary|IHealthCheckSummary>> {
  let request: ILoyaltyTierRequest = await req.json()
  
  try {
    const loyaltyService = new LoyaltyTierService(request.promotions, []);
    let rewardspoints = loyaltyService.getRewardsPoints(request.orders)
    return NextResponse.json(rewardspoints);
  
  }catch(error){
    return NextResponse.json({message :error} as IHealthCheckSummary,{status:500})
  }

}