export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = req.query.q;
  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Add?q=search_term to URL",
      example: "/api/search/google?q=python tutorial",
      author: "@nexus - Nexus API"
    });
  }

  try {
    const r = await fetch(`https://api.duckgo.com/?q=${encodeURIComponent(query)}&format=json&nohtml=1&skip_disambig=1`);
    const data = await r.json();

    const results = data.RelatedTopics
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
