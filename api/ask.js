// Vercel serverless function - api/ask.js
export default async function handler(req, res) {
  // ⚠️ BELANGRIJK: Vervang "*" door je echte GitHub Pages URL na deploy
  // Voorbeeld: "https://emielvanbree.github.io"
  const ALLOWED_ORIGIN = "*"; 
  
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }
  
  // Get messages from request
  const { messages } = req.body || {};
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array" });
  }
  
  // Get API key from environment
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });
  }
  
  try {
    // Call OpenAI API
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 200,
        temperature: 1.0
      })
    });
    
    if (!openaiResp.ok) {
      const errorText = await openaiResp.text();
      console.error("OpenAI error:", errorText);
      return res.status(500).json({ error: `OpenAI error: ${errorText}` });
    }
    
    const data = await openaiResp.json();
    
    // Extract text from response
    const text = data.choices?.[0]?.message?.content || "No response from Dick";
    
    return res.status(200).json({ text });
    
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.message });
  }
}
