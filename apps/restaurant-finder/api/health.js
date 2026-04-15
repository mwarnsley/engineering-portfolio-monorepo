import { handleHealthRequest } from '../lib/geoapifyApi.js';

export default async function handler(req, res) {
  return handleHealthRequest(req, res);
}
