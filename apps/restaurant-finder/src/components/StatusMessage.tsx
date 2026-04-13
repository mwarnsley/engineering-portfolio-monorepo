import { Alert } from '@heroui/react';

type StatusMessageProps = {
  title: string;
  description: string;
  tone: 'danger' | 'warning' | 'success';
};

export const StatusMessage = ({ title, description, tone }: StatusMessageProps) => {
  return (
    <Alert className="mb-6" color={tone} description={description} title={title} variant="flat" />
  );
};
