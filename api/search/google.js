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
    const url = `https://duckgo.com/html/?q=${encodeURIComponent(query)}&rpl=1`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const html = await r.text();

    // Parse matokeo kutoka HTML
    const results = [];
    const regex = /<a class="result__a" href="([^"]+)"[^>]*>(.*?)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>(.*?)<\/a>/g;
    let match;

    while ((match = regex.exec(html))!== null && results.length < 5) {
      results.push({
        title: match[2].replace(/<[^>]+>/g, '').trim(),
        link: match[1],
        snippet: match[3].replace(/<[^>]+>/g, '').trim()
      });
    }

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
