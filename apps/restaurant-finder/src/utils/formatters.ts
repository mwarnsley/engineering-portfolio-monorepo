import { RestaurantSummary } from '../types/restaurant';

export const formatCuisineList = (cuisines: string[]) => {
  if (!cuisines.length) {
    return 'Cuisine information unavailable';
  }

  return cuisines.join(' • ');
};

export const formatPriceRange = (priceRange: string) => {
  return priceRange || 'Price unknown';
};

export const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    return 'Phone number unavailable';
  }

  const digits = phoneNumber.replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phoneNumber;
};

export const formatLocationLine = (restaurant: RestaurantSummary) => {
  return [restaurant.address.city, restaurant.address.state, restaurant.address.postalCode]
    .filter(Boolean)
    .join(', ');
};

export const formatAddressPreview = (address: string) => {
  if (!address) {
    return 'Address not available';
  }

  return address.length > 72 ? `${address.slice(0, 69).trimEnd()}...` : address;
};

export const formatHoursPreview = (hours: string) => {
  if (!hours) {
    return 'Hours not provided';
  }

  const normalizedHours = hours.replace(/\s+/g, ' ').trim();
  const firstSegment = normalizedHours.split(/[;|]/)[0]?.trim();

  if (firstSegment && firstSegment !== normalizedHours) {
    return firstSegment;
  }

  if (normalizedHours.length <= 56) {
    return normalizedHours;
  }

  if (firstSegment && firstSegment.length <= 56) {
    return firstSegment;
  }

  return `${normalizedHours.slice(0, 53).trimEnd()}...`;
};

export const formatCategoryLabel = (value: string) => {
  if (!value) {
    return 'Restaurant';
  }

  return value
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
};

export const normalizeWebsiteUrl = (url: string) => {
  if (!url) {
    return '';
  }

  const trimmedUrl = url.trim();
  const candidate = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`;

  try {
    const parsedUrl = new URL(candidate);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }

    if (!parsedUrl.hostname.includes('.')) {
      return '';
    }

    return parsedUrl.toString();
  } catch {
    return '';
  }
};

export const getWebsiteLabel = (url: string) => {
  const normalizedUrl = normalizeWebsiteUrl(url);

  if (!normalizedUrl) {
    return 'No website listed';
  }

  return new URL(normalizedUrl).hostname.replace(/^www\./, '');
};
