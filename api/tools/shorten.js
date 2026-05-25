export default async function handler(req, res) {
  const { url } = req.query;
  
  const r = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
  const shortUrl = await r.text();
  
  res.json({
    status: true,
    original: url,
    short: shortUrl,
    author: "@nexus - Nexus AI"
  });
}
