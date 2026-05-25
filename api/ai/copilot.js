export default async function handler(req, res) {
  const { text } = req.query;
  if (!text) return res.status(400).json({status: false, error: 'Missing text parameter'});

  try {
    const r = await fetch(`https://api.nexray.eu.cc/ai/copilot?text=${encodeURIComponent(text)}`);
    const data = await r.json();
    res.json({status: true, result: data.result || data, query: text});
  } catch (e) {
    res.status(500).json({status: false, error: e.message});
  }
}
