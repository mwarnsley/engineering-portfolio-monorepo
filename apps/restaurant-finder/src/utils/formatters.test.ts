import {
  formatAddressPreview,
  formatCategoryLabel,
  formatCuisineList,
  formatHoursPreview,
  formatLocationLine,
  formatPhoneNumber,
  formatPriceRange,
  getWebsiteLabel,
  normalizeWebsiteUrl,
} from './formatters';
import { restaurantFixture } from '../test/fixtures/restaurants';

describe('formatters', () => {
  it('joins cuisine names', () => {
    expect(formatCuisineList(['American', 'Diner'])).toBe('American • Diner');
  });

  it('returns a fallback for missing cuisines', () => {
    expect(formatCuisineList([])).toBe('Cuisine information unavailable');
  });

  it('returns the given price range', () => {
    expect(formatPriceRange('$$')).toBe('$$');
  });

  it('returns a fallback when price is missing', () => {
    expect(formatPriceRange('')).toBe('Price unknown');
  });

  it('returns the phone number when present', () => {
    expect(formatPhoneNumber('(212) 228-2333')).toBe('(212) 228-2333');
  });

  it('returns a fallback when the phone is missing', () => {
    expect(formatPhoneNumber('')).toBe('Phone number unavailable');
  });

  it('builds a location line from address fields', () => {
    expect(formatLocationLine(restaurantFixture)).toBe('New York, NY, 10012');
  });

  it('truncates long address previews', () => {
    expect(
      formatAddressPreview(
        '123 Long Restaurant Avenue, Suite 500, Indianapolis, Indiana 46204, United States'
      )
    ).toMatch(/\.\.\.$/);
  });

  it('returns a compact hours preview', () => {
    expect(formatHoursPreview('Monday-Friday 7am-9pm; Saturday-Sunday 8am-10pm')).toBe(
      'Monday-Friday 7am-9pm'
    );
  });

  it('formats API category labels into title case', () => {
    expect(formatCategoryLabel('coffee_shop')).toBe('Coffee Shop');
  });

  it('normalizes website urls that do not include a protocol', () => {
    expect(normalizeWebsiteUrl('example.com')).toBe('https://example.com/');
  });

  it('returns an empty string for invalid website values', () => {
    expect(normalizeWebsiteUrl('not-a-valid-url')).toBe('');
  });

  it('builds a clean website label from a valid url', () => {
    expect(getWebsiteLabel('https://www.example.com/path')).toBe('example.com');
  });
});

it.each([
  ['', 'Address not available'],
  ['12 Main Street', '12 Main Street'],
])('formats address %j', (input, expected) => expect(formatAddressPreview(input)).toBe(expected));

it.each([
  ['', 'Hours not provided'],
  ['  Daily   9am-5pm  ', 'Daily 9am-5pm'],
  ['   ', ''],
  ['; Sunday closed', '; Sunday closed'],
  ['A'.repeat(60), `${'A'.repeat(53)}...`],
])('formats hours %j', (input, expected) => expect(formatHoursPreview(input)).toBe(expected));

it('preserves international phone numbers', () =>
  expect(formatPhoneNumber('+44 20 1234 5678')).toBe('+44 20 1234 5678'));
it('falls back for empty categories', () => expect(formatCategoryLabel('')).toBe('Restaurant'));
it('falls back for an invalid website label', () =>
  expect(getWebsiteLabel('not-a-url')).toBe('No website listed'));
it.each(['', 'https://', 'http://[invalid', 'http://localhost'])(
  'rejects unusable website %j',
  (url) => expect(normalizeWebsiteUrl(url)).toBe('')
);
it('preserves explicit HTTP websites', () =>
  expect(normalizeWebsiteUrl('  http://example.com/menu  ')).toBe('http://example.com/menu'));
it('omits missing locality segments', () =>
  expect(
    formatLocationLine({
      ...restaurantFixture,
      address: { ...restaurantFixture.address, state: '', postalCode: '' },
    })
  ).toBe('New York'));
