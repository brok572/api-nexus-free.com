export default async function handler(req, res) {
  const { text } = req.query; // badilisha 'url' kuwa 'text'
  
  if (!text) {
    return res.json({ status: false, short: "Missing text", author: "@nexus - Nexus AI" });
  }

  try {
    const r = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`);
    const shortUrl = await r.text();
    
    res.json({
      status: true,
      original: text,
      short: shortUrl,
      author: "@nexus - Nexus AI"
    });
  } catch (err) {
    res.json({ status: false, short: "Error", author: "@nexus - Nexus AI" });
  }
}
