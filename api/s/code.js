import { urlDatabase } from '../tools/shorten.js';

export default async function handler(req, res) {
  const { code } = req.query;

  const originalUrl = urlDatabase[code];

  if (!originalUrl) {
    return res.status(404).send('Link not found');
  }

  res.redirect(301, originalUrl);
}
