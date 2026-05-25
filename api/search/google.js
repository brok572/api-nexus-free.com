export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = req.query.q || req.query.text;
  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Add?q=search_term to URL",
      example: "/api/search/google?q=Tanzania",
      author: "@nexus - Nexus API"
    });
  }

  try {
    const r = await fetch(`https://r.jina.ai/http://duckgo.com/?q=${encodeURIComponent(query)}&format=json`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    
    const data = await r.json();

    const results = (data.results || []).slice(0, 5).map(item => ({
      title: item.title,
      link: item.url,
      snippet: item.description
    }));

    res.json({
      status: true,
      query: query,
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
