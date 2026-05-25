export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const r = await fetch('https://timeapi.io/api/Time/current/ip');
    const data = await r.json();

    res.json({
      status: true,
      timezone: data.timeZone,
      datetime: data.dateTime,
      date: data.date,
      time: data.time,
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
