export default function handler(req, res) {
  const { text } = req.query;
  if (!text) return res.status(400).json({status: false, error: 'Missing text parameter'});

  res.json({
    status: true,
    query: text,
    qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`
  });
}
