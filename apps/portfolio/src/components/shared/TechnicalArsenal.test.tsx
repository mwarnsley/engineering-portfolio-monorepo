import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen, within } from '@/test';
import { coreStack } from '@/data';
import { TechnicalArsenal } from './TechnicalArsenal';

const getCards = () =>
  within(screen.getByRole('region', { name: 'Core Stack & Systems' })).getAllByRole('listitem');

describe('TechnicalArsenal', () => {
  it('should render one card per capability', () => {
    renderWithProviders(<TechnicalArsenal />);
    expect(getCards()).toHaveLength(coreStack.length);
  });

  it.each(coreStack.map((capability) => [capability.name, capability.category]))(
    'should label %s with its %s category badge',
    (name, category) => {
      renderWithProviders(<TechnicalArsenal />);
      const card = screen.getByRole('heading', { name, level: 3 }).closest('li')!;
      expect(within(card).getByText(category)).toBeInTheDocument();
    }
  );

  it('should not render decorative icon glyphs inside capability cards', () => {
    renderWithProviders(<TechnicalArsenal />);
    expect(getCards().some((card) => card.querySelector('svg'))).toBe(false);
  });
});
