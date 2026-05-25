export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({
      status: false,
      error: "Missing text parameter",
      usage: "/api/fun/meme?text=When code works first try"
    });
  }

  try {
    // Meme API ya bure kutoka memegen.link
    const memeUrl = `https://api.memegen.link/images/custom/-/${encodeURIComponent(text)}.png?background=black&text_color=white`;

    const r = await fetch(memeUrl);
    
    if (!r.ok) {
      return res.status(500).json({ status: false, error: "Meme API error" });
    }

    const buffer = await r.arrayBuffer();
    
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("X-Author", "@nexus - Nexus AI");
    
    return res.send(Buffer.from(buffer));

  } catch (e) {
    return res.status(500).json({
      status: false,
      error: "Server error",
      message: e.message
    });
  }
}
