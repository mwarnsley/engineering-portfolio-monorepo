import axios from 'axios';

const DEFAULT_PLACES_API_URL = 'https://api.geoapify.com/v2/places';
const DEFAULT_PLACE_DETAILS_API_URL = 'https://api.geoapify.com/v2/place-details';
const GEOCODING_API_URL = 'https://api.geoapify.com/v1/geocode/search';

const getConfig = () => ({
  geoapifyApiKey: process.env.GEOAPIFY_API_KEY,
  placesApiUrl: process.env.PLACES_API_URL || DEFAULT_PLACES_API_URL,
  placeDetailsApiUrl: process.env.PLACE_DETAILS_API_URL || DEFAULT_PLACE_DETAILS_API_URL,
});

const geoapifyClient = axios.create({
  timeout: 15000,
});

const normalizeWebsiteUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;

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

const toTitleCase = (value) =>
  value
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const inferCuisines = (properties) => {
  const rawCuisine = properties.datasource?.raw?.cuisine;

  if (typeof rawCuisine === 'string' && rawCuisine.trim()) {
    return rawCuisine
      .split(/[;,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const derived = (properties.categories || [])
    .filter((category) => category.startsWith('catering.'))
    .map((category) => category.replace(/^catering\./, ''))
    .filter((category) => !['restaurant', 'cafe', 'bar', 'fast_food', 'pub'].includes(category))
    .map(toTitleCase);

  return Array.from(new Set(derived)).slice(0, 4);
};

const inferHighlights = (properties) => {
  const highlights = [];
  const raw = properties.datasource?.raw || {};

  if (raw.takeaway === 'yes') {
    highlights.push('Takeout');
  }

  if (raw.delivery === 'yes') {
    highlights.push('Delivery');
  }

  if (raw.outdoor_seating === 'yes') {
    highlights.push('Outdoor seating');
  }

  if (raw.wheelchair === 'yes') {
    highlights.push('Wheelchair access');
  }

  if (properties.distance) {
    highlights.push(`${Math.round(properties.distance)} m away`);
  }

  return highlights;
};

const inferPriceRange = (properties) => {
  const rawPrice = properties.datasource?.raw?.price;

  if (typeof rawPrice === 'string' && rawPrice.trim()) {
    return rawPrice.trim();
  }

  const priceLevel = Number(properties.datasource?.raw?.price_level || 0);

  return priceLevel > 0 ? '$'.repeat(Math.min(priceLevel, 4)) : '';
};

const normalizeRestaurant = (feature) => {
  if (!feature) {
    return null;
  }

  const properties = feature.properties || {};
  const raw = properties.datasource?.raw || {};
  const longitude = properties.lon ?? feature.geometry?.coordinates?.[0] ?? null;
  const latitude = properties.lat ?? feature.geometry?.coordinates?.[1] ?? null;
  const formattedAddress =
    properties.formatted ||
    [properties.address_line1, properties.address_line2].filter(Boolean).join(', ');

  return {
    restaurantId:
      properties.place_id ||
      raw.place_id ||
      `${properties.name || 'restaurant'}-${latitude || 'lat'}-${longitude || 'lon'}`,
    restaurantName: properties.name || properties.address_line1 || 'Unnamed restaurant',
    restaurantPhone: raw.contact_phone || raw.phone || '',
    restaurantWebsite: normalizeWebsiteUrl(
      properties.website || raw.website || raw.contact_website || raw.contact_facebook || ''
    ),
    priceRange: inferPriceRange(properties),
    hours: properties.opening_hours || raw.opening_hours || '',
    cuisines: inferCuisines(properties),
    lastUpdated: '',
    highlights: inferHighlights(properties),
    geo: {
      lat: latitude,
      lon: longitude,
    },
    address: {
      formatted: formattedAddress,
      street: properties.address_line1 || '',
      city: properties.city || raw.addr_city || '',
      state: properties.state || raw.addr_state || '',
      postalCode: properties.postcode || raw.addr_postcode || '',
    },
    menus: [],
  };
};

const formatApiError = (error) => {
  if (error.code === 'ENOTFOUND') {
    return {
      message: 'Geoapify could not be reached. Check your network or API URL values.',
      code: error.code,
      details: null,
    };
  }

  return {
    message:
      error.response?.data?.message ||
      error.message ||
      'We could not load data from the Geoapify API.',
    code: error.code || null,
    details: error.response?.data ?? null,
  };
};

const geocodeLocation = async (text, geoapifyApiKey) => {
  const response = await geoapifyClient.get(GEOCODING_API_URL, {
    params: {
      text,
      limit: 1,
      format: 'json',
      apiKey: geoapifyApiKey,
    },
  });

  return response.data?.results?.[0] ?? null;
};

const searchRestaurantsByCoordinates = async ({
  latitude,
  longitude,
  limit,
  placesApiUrl,
  geoapifyApiKey,
}) => {
  const response = await geoapifyClient.get(placesApiUrl, {
    params: {
      categories: 'catering.restaurant,catering.cafe,catering.fast_food,catering.pub,catering.bar',
      conditions: 'named',
      filter: `circle:${longitude},${latitude},7000`,
      bias: `proximity:${longitude},${latitude}`,
      limit,
      apiKey: geoapifyApiKey,
    },
  });

  return Array.isArray(response.data?.features) ? response.data.features : [];
};

const sendApiError = (res, error, fallbackStatus = 500) => {
  const formattedError = formatApiError(error);

  return res.status(error.response?.status || fallbackStatus).json({
    message: formattedError.message,
    code: formattedError.code,
    details: formattedError.details,
  });
};

export const logMissingApiKeyWarning = () => {
  if (!process.env.GEOAPIFY_API_KEY) {
    console.warn('GEOAPIFY_API_KEY is missing. API requests will fail until the key is configured.');
  }
};

export const handleHealthRequest = async (req, res) => {
  const { geoapifyApiKey, placesApiUrl } = getConfig();
  const shouldProbe = req.query.probe === 'true';

  if (!geoapifyApiKey) {
    return res.status(500).json({
      configured: false,
      reachable: false,
      host: placesApiUrl,
      message: 'GEOAPIFY_API_KEY is missing from the environment.',
    });
  }

  if (!shouldProbe) {
    return res.json({
      configured: true,
      reachable: null,
      host: placesApiUrl,
      message: 'Geoapify credentials are configured.',
    });
  }

  try {
    await geoapifyClient.get(placesApiUrl, {
      params: {
        categories: 'catering.restaurant',
        filter: 'circle:-73.999819,40.727026,1000',
        limit: 1,
        apiKey: geoapifyApiKey,
      },
    });

    return res.json({
      configured: true,
      reachable: true,
      host: placesApiUrl,
      message: 'Geoapify Places API responded successfully.',
    });
  } catch (error) {
    const formattedError = formatApiError(error);

    return res.status(error.response?.status || 502).json({
      configured: true,
      reachable: false,
      host: placesApiUrl,
      message: formattedError.message,
      code: formattedError.code,
      details: formattedError.details,
    });
  }
};

export const handleRestaurantSearchRequest = async (req, res) => {
  const { geoapifyApiKey, placesApiUrl } = getConfig();
  const mode = req.query.mode === 'zip' ? 'zip' : req.query.mode === 'geo' ? 'geo' : 'city';
  const query = String(req.query.query || '').trim();
  const latitude = req.query.latitude ? Number(req.query.latitude) : null;
  const longitude = req.query.longitude ? Number(req.query.longitude) : null;
  const limit = Number(req.query.size || 18);

  if (!geoapifyApiKey) {
    return res.status(500).json({
      message: 'GEOAPIFY_API_KEY is missing from the environment.',
    });
  }

  if (mode === 'geo' && (!latitude || !longitude)) {
    return res.status(400).json({
      message: 'Latitude and longitude are required for location-based searches.',
    });
  }

  if (mode !== 'geo' && !query) {
    return res.status(400).json({
      message: 'A search query is required.',
    });
  }

  try {
    const coordinates =
      mode === 'geo'
        ? { latitude, longitude }
        : await geocodeLocation(query, geoapifyApiKey).then((result) =>
            result ? { latitude: result.lat, longitude: result.lon } : null
          );

    if (!coordinates?.latitude || !coordinates?.longitude) {
      return res.json({
        restaurants: [],
      });
    }

    const features = await searchRestaurantsByCoordinates({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      limit,
      placesApiUrl,
      geoapifyApiKey,
    });

    const restaurants = features.map(normalizeRestaurant).filter(Boolean);

    return res.json({
      restaurants,
    });
  } catch (error) {
    return sendApiError(res, error);
  }
};

export const handleRestaurantDetailsRequest = async (req, res) => {
  const { geoapifyApiKey, placeDetailsApiUrl } = getConfig();

  if (!geoapifyApiKey) {
    return res.status(500).json({
      message: 'GEOAPIFY_API_KEY is missing from the environment.',
    });
  }

  try {
    const response = await geoapifyClient.get(placeDetailsApiUrl, {
      params: {
        id: req.params.restaurantId,
        features: 'details',
        apiKey: geoapifyApiKey,
      },
    });

    const restaurant = normalizeRestaurant(response.data?.features?.[0]);

    return res.json({
      restaurant,
    });
  } catch (error) {
    return sendApiError(res, error);
  }
};
