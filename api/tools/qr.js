export default async function handler(req, res) {
  const { text, size = "500x500" } = req.query;

  if (!text) {
    return res.status(400).json({
      status: false,
      error: "Missing text parameter",
      usage: "/api/qr?text=hello"
    });
  }

  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(text)}`;
    
    const r = await fetch(qrUrl);
    
    if (!r.ok) {
      return res.status(r.status).json({
        status: false,
        error: "QR API error"
      });
    }

    const buffer = await r.arrayBuffer();
    
    // Weka header za image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("X-Author", "@nexus - Nexus AI");
    
    // Rudisha image moja kwa moja
    return res.send(Buffer.from(buffer));

  } catch (e) {
    return res.status(500).json({
      status: false,
      error: "Server error",
      message: e.message
    });
  }
}
