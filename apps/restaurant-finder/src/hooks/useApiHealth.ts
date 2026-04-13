import { useEffect, useState } from 'react';

import { getApiHealth } from '../services/restaurants';

export type ApiHealthState = {
  configured: boolean;
  reachable: boolean | null;
  host: string;
  message: string;
  code?: string | null;
  status: 'checking' | 'ready' | 'error';
};

const initialState: ApiHealthState = {
  configured: false,
  reachable: null,
  host: '',
  message: 'Checking API connection...',
  code: null,
  status: 'checking',
};

export const useApiHealth = () => {
  const [health, setHealth] = useState<ApiHealthState>(initialState);

  useEffect(() => {
    let isMounted = true;

    const loadHealth = async () => {
      try {
        const data = await getApiHealth();

        if (!isMounted) {
          return;
        }

        setHealth({
          ...data,
          status: data.reachable === false ? 'error' : 'ready',
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setHealth({
          configured: false,
          reachable: false,
          host: '',
          message: error instanceof Error ? error.message : 'API health check failed unexpectedly.',
          code: null,
          status: 'error',
        });
      }
    };

    void loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  return health;
};
