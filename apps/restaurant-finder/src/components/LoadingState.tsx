import { Card, CardBody, Skeleton } from '@heroui/react';

export const LoadingState = () => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="border border-slate-200 bg-white" data-testid="loading-card">
          <CardBody className="gap-4 p-5">
            <Skeleton className="h-8 rounded-xl" />
            <Skeleton className="h-5 rounded-xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-10 rounded-xl" />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
