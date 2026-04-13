import React from 'react';
import { render } from '@testing-library/react';
import { AppProviders } from '../../components/providers';

export function renderWithProviders(ui) {
  return render(<AppProviders>{ui}</AppProviders>);
}
