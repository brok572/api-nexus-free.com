// Simple in-memory storage. Itarudi empty kila Render inareload
let urlDatabase = {};

export default async function handler(req, res) {
  const { text } = req.query;

  if (!text) {
    return res.json({ status: false, short: "Missing text", author: "@nexus - Nexus AI" });
  }

  try {
    // Generate short code 6 characters
    const code = Math.random().toString(36).substring(2, 8);

    // Save to memory
    urlDatabase[code] = text;

    res.json({
      status: true,
      original: text,
      short: `https://api-nexus-free-com.onrender.com/s/${code}`,
      author: "@nexus - Nexus AI"
    });
  } catch (err) {
    res.json({ status: false, short: "Error", author: "@nexus - Nexus AI" });
  }
}

// Fanya database ipatikane kwa file nyingine
export { urlDatabase };
