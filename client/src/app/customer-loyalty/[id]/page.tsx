import CustomerDetailsPageServerWithSuspense from '@/webpages/customer-details-page/CustomerDetailsPageServer';

interface IPageProps {
  params: {
    id: string;
  };
  searchParams: {
    index?: string;
  };
}

export default function Page(props: IPageProps) {
  const { params, searchParams } = props;

  const customerId = params.id;
  const avatarIndex =
    searchParams.index == null ? undefined : parseInt(searchParams.index);

  return (
    <CustomerDetailsPageServerWithSuspense
      customerId={customerId}
      avatarIndex={avatarIndex}
    />
  );
}
