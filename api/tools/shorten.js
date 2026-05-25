let urlDatabase = {};

export default async function handler(req, res) {
  const { text, s } = req.query;

  // Mode 1: Kama kuna s=abc123 → fanya redirect
  if (s) {
    const originalUrl = urlDatabase[s];
    if (!originalUrl) {
      return res.status(404).send('Link not found. Imeexpire au haipo.');
    }
    return res.redirect(301, originalUrl);
  }

  // Mode 2: Kama kuna text=... → tengeneza short link
  if (text) {
    const code = Math.random().toString(36).substring(2, 8);
    urlDatabase[code] = text;

    return res.json({
      status: true,
      original: text,
      short: `https://api-nexus-free-com.onrender.com/api/tools/shorten?s=${code}`,
      author: "@nexus - Nexus AI"
    });
  }

  // Kama hakuna chochote
  return res.json({ status: false, short: "Use?text=url au?s=code", author: "@nexus - Nexus AI" });
}
