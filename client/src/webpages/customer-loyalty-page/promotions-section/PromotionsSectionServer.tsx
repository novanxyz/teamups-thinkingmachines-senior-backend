import { EntityPromotion } from '@/services/promotions/entities/promotion/EntityPromotion';
import PageHeaderClient from '@/webpages/shared/components/page-header/PageHeaderClient';
import { Skeleton } from 'antd';
import { Suspense } from 'react';
import PromotionsSectionClient from './PromotionsSectionClient';
import styles from './PromotionsSectionServer.module.css';

async function PromotionsSectionServer() {
  const promotionEntity = new EntityPromotion();
  const promotionModels = await promotionEntity.genMany();
  const promotionsClientModels = promotionModels.map((promotion) =>
    promotionEntity.getAsClientEntity(promotion)
  );

  return (
    <>
      <PageHeaderClient hasDivider title='Promotions' />
      <PromotionsSectionClient promotions={promotionsClientModels} />
    </>
  );
}

export default async function PromotionsSectionServerWithSuspense() {
  return (
    <section className={styles['root-container']}>
      <Suspense fallback={<Skeleton loading active />}>
        <PromotionsSectionServer />
      </Suspense>
    </section>
  );
}
