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
    const r = await fetch(`https://r.jina.ai/http://duckgo.com/?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const text = await r.text();

    // Chomoa matokeo kutoka markdown
    const results = [];
    const regex = /\d+\.\s+\[\[([^\]]+)\]\(([^)]+)\)[^\n]*\n([^\n]+)/g;
    let match;

    while ((match = regex.exec(text))!== null && results.length < 5) {
      results.push({
        title: match[1].trim(),
        link: match[2].trim(),
        snippet: match[3].trim()
      });
    }

    // Fallback kama regex haipati kitu
    if (results.length === 0) {
      const fallback = /\d+\.\s+\[(.*?)\]\((.*?)\)\n(.*?)(?=\n\d+\.|\n*$)/gs;
      while ((match = fallback.exec(text))!== null && results.length < 5) {
        results.push({
          title: match[1].replace(/\[.*?\]\(.*?\)/g, '').trim(),
          link: match[2].trim(),
          snippet: match[3].trim()
        });
      }
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
