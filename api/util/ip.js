export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const data = await r.json();

    res.json({
      status: true,
      ip: data.ip,
      author: "@nexus - Nexus API"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to get IP",
      author: "@nexus - Nexus API"
    });
  }
}
