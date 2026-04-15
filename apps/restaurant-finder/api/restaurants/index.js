import { handleRestaurantSearchRequest } from '../../lib/geoapifyApi.js';

export default async function handler(req, res) {
  return handleRestaurantSearchRequest(req, res);
}
