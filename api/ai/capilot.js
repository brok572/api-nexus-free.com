export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      status: false,
      error: "Missing text parameter",
      message: "Unatakiwa kutuma parameter ya text",
      usage: {
        correct_url: "/api/ai/capilot?text=habari",
        example: "/api/ai/capilot?text=unanifanyaje"
      }
    });
  }

  try {
    const r = await fetch(`https://api.nexray.eu.cc/ai/copilot?text=${encodeURIComponent(text)}`);
    
    if (!r.ok) {
      return res.status(r.status).json({
        status: false,
        error: `API error: ${r.status}`,
        message: "Nexray API haikujibu vizuri. Jaribu tena."
      });
    }

    const data = await r.json();
    
    // Rudisha kwa format ya Nexus
    return res.json({
      status: true,
      author: "@nexus - Nexus AI",
      result: data.result || data,
      query: text,
      timestamp: new Date().toISOString(),
      response_time: r.headers.get('x-response-time') || "unknown"
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      error: "Server error",
      message: e.message
    });
  }
}
