export default async function handler(req, res) {
  const { type = "any" } = req.query;

  try {
    const r = await fetch(`https://v2.jokeapi.dev/joke/${type}?safe-mode`);

    if (!r.ok) {
      return res.status(r.status).json({
        status: false,
        error: "Joke API error"
      });
    }

    const data = await r.json();

    return res.json({
      status: true,
      author: "@nexus - Nexus AI",
      result: data.type === "single"? data.joke : `${data.setup}\n${data.delivery}`,
      query: type,
      timestamp: new Date().toISOString()
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      error: "Server error",
      message: e.message
    });
  }
}
