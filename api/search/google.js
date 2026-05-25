export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Kubali q na text zote mbili
  const query = req.query.q || req.query.text;

  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Add?q=search_term or?text=search_term to URL",
      example: "/api/search/google?q=Tanzania",
      author: "@nexus - Nexus API"
    });
  }

  try {
    // Tumia endpoint nyingine ya ddg inayofanya kazi Render
    const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.duckgo.com/?q=${query}&format=json&nohtml=1`)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!r.ok) throw new Error('API request failed');

    const data = await r.json();

    const results = (data.RelatedTopics || [])
    .filter(t => t.Text && t.FirstURL)
    .slice(0, 5)
    .map(t => ({
        title: t.Text.split(' - ')[0],
        link: t.FirstURL,
        snippet: t.Text
      }));

    res.json({
      status: true,
      query: query,
      abstract: data.AbstractText || null,
      results: results,
      author: "@nexus - Nexus API"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Search failed",
      error: err.message,
      author: "@nexus - Nexus API"
    });
  }
}
