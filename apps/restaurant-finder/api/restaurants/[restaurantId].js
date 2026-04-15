import { handleRestaurantDetailsRequest } from '../../lib/geoapifyApi.js';

export default async function handler(req, res) {
  return handleRestaurantDetailsRequest(req, res);
}
