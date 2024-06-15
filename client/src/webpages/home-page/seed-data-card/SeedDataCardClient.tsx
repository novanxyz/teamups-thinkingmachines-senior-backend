'use client';

import { ISeedOpResult } from '@/app/api/seed/route';
import { useGetMutationRequestHandler } from '@/webpages/shared/hooks/useGetMutationHandler';
import { Card, notification } from 'antd';
import { useCallback, useState } from 'react';
import SeedDataCardButtonClient from './seed-data-card-button/SeedDataCardButtonClient';
import SeedDataCardDescription from './seed-data-card-description/SeedDataCardDescriptionClient';

const SEED_ENDPOINT_URL = '/api/seed';

interface ISeedDataCardClientProps {
  hasSeedData: boolean;
}

export default function SeedDataCardClient(props: ISeedDataCardClientProps) {
  const { hasSeedData: initialHasSeedData } = props;

  const [hasSeedData, setHasSeedData] = useState<boolean>(initialHasSeedData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seedPOSTHandler] = useGetMutationRequestHandler<null, ISeedOpResult>(
    SEED_ENDPOINT_URL,
    'POST',
    () => {
      setIsLoading(true);
    },
    () => {
      setIsLoading(false);
    }
  );
  const [seedDELETEHandler] = useGetMutationRequestHandler<null, ISeedOpResult>(
    SEED_ENDPOINT_URL,
    'DELETE',
    () => {
      setIsLoading(true);
    },
    () => {
      setIsLoading(false);
    }
  );
  const makePOSTRequest = useCallback(() => {
    seedPOSTHandler(
      null,
      () => {
        setHasSeedData(true);
        notification.success({
          message: 'Seed data created!',
          placement: 'bottomRight',
        });
      },
      (error) => {
        notification.error({ message: error, placement: 'bottomRight' });
      }
    );
  }, [seedPOSTHandler]);
  const makeDELETERequest = useCallback(() => {
    seedDELETEHandler(
      null,
      () => {
        setHasSeedData(false);
        notification.success({
          message: 'Seed data deleted!',
          placement: 'bottomRight',
        });
      },
      (error) => {
        notification.error({ message: error, placement: 'bottomRight' });
      }
    );
  }, [seedDELETEHandler]);

  return (
    <Card title={<h3>Teamups technical exercise</h3>} bordered={false}>
      <Card
        title='Data init'
        loading={isLoading}
        extra={
          <SeedDataCardButtonClient
            hasSeedData={hasSeedData}
            isLoading={isLoading}
            makeDELETERequest={makeDELETERequest}
            makePOSTRequest={makePOSTRequest}
          />
        }
      >
        <p>Initialize seed data for the exercise.</p>
        <SeedDataCardDescription hasSeedData={hasSeedData} />
      </Card>
    </Card>
  );
}
