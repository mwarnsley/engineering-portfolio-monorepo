import { ReactNode } from 'react';
import { Card, CardBody } from '@heroui/react';

type EmptyStateProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export const EmptyState = ({ title, description, children }: EmptyStateProps) => {
  return (
    <Card className="border border-dashed border-slate-300 bg-[linear-gradient(180deg,#fbfdff,#f8fafc)] shadow-none">
      <CardBody className="items-center gap-3 px-6 py-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="max-w-xl text-sm text-slate-600">{description}</p>
        {children}
      </CardBody>
    </Card>
  );
};
