export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const r = await fetch('https://worldtimeapi.org/api/ip');
    const data = await r.json();

    res.json({
      status: true,
      timezone: data.timezone,
      datetime: data.datetime,
      day_of_week: data.day_of_week,
      author: "@nexus - Nexus API"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Failed to get time",
      author: "@nexus - Nexus API"
    });
  }
}
