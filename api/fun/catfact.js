export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const r = await fetch('https://catfact.ninja/fact');
    const data = await r.json();

    res.json({
      status: true,
      fact: data.fact,
      length: data.length,
      author: "@nexus - Nexus AI"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch cat fact",
      author: "@nexus - Nexus AI"
    });
  }
}
