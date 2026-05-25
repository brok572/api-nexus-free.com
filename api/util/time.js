export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Pata IP ya client kutoka headers za Render/Vercel
    const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
               req.headers['x-real-ip'] ||
               req.socket.remoteAddress;

    const r = await fetch(`https://timeapi.io/api/Time/current/ip?ipAddress=${ip}`);

    if (!r.ok) {
      throw new Error(`TimeAPI returned ${r.status}`);
    }

    const data = await r.json();

    res.json({
      status: true,
      timezone: data.timeZone,
      datetime: data.dateTime,
      date: data.date,
      time: data.time,
      ip: ip,
      author: "@nexus - Nexus API"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to get time",
      error: err.message,
      author: "@nexus - Nexus API"
    });
  }
}
