'use client';

import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { IEntityPromotion } from '@/services/promotions/entities/promotion/IEntityPromotion';
import { List } from 'antd';

interface IPromotionsSectionClientProps {
  promotions: TWithStringIds<IEntityPromotion>[];
}

export default function PromotionsSectionClient(
  props: IPromotionsSectionClientProps
) {
  const { promotions } = props;

  return (
    <div>
      <List<TWithStringIds<IEntityPromotion>>
        size='small'
        dataSource={promotions}
        renderItem={(promotion) => (
          <List.Item key={promotion._id}>
            <List.Item.Meta
              title={promotion.name}
              description={
                <PromotionConfigDetailsClient promotion={promotion} />
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

interface IPromotionConfigDetailsClientProps {
  promotion: TWithStringIds<IEntityPromotion>;
}

function PromotionConfigDetailsClient(
  props: IPromotionConfigDetailsClientProps
) {
  const { promotion } = props;
  const type = promotion.config.type;
  const valueForType = getLabelForConfigVal(promotion.config);

  return (
    <div>
      <p>Type: {type}</p>
      <p>Promo criteria: {valueForType}</p>
      <p>Points multiplier: {promotion.points_multiplier}</p>
    </div>
  );
}

const getLabelForConfigVal = (config: IEntityPromotion['config']): string => {
  switch (config.type) {
    case 'order_min_quantity':
      return [config.min_order_item_quantity, 'items'].join(' ');
    case 'order_min_total_price':
      return ['$', config.min_order_total_price_usd].join('');
    case 'order_day_of_purchase':
      return getDayLabelForDayValue(config.day);
    case 'item_category':
      return config.item_category;
  }
};

const getDayLabelForDayValue = (dayValue: number): string => {
  switch (dayValue) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      throw new Error(`Invalid day value: ${dayValue}`);
  }
};
