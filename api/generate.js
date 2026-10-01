// Vercel serverless function: writes the program blueprint and coach notes with Claude.
// Deploy this folder as a Vercel project and set ANTHROPIC_API_KEY in
// Project Settings -> Environment Variables. Nothing else to configure.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (process.env.ACCESS_CODE && req.headers["x-access-code"] !== process.env.ACCESS_CODE) {
    return res.status(401).json({ error: "invalid access code" });
  }
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.length > 20000) {
    return res.status(400).json({ error: "missing or oversized prompt" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
  }
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: "upstream: " + t.slice(0, 300) });
    }
    const data = await r.json();
    const html = (data.content || []).map((b) => b.text || "").join("");
    return res.status(200).json({ html });
  } catch (e) {
    return res.status(500).json({ error: String(e).slice(0, 300) });
  }
}
