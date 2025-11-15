import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI not configured" });

  try {
    const client = new OpenAI({ apiKey });
    const persona = req.body ?? {};

    const prompt = `
Gere 6 a 8 estratégias práticas de marketing com base na persona abaixo.
Retorne SOMENTE JSON no formato:

{
  "estrategias": [
    "…",
    "…"
  ]
}

Persona:
${JSON.stringify(persona, null, 2)}
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        { role: "system", content: "Retorne somente JSON válido." },
        { role: "user", content: prompt }
      ]
    });

    const text = completion.choices[0]?.message?.content || "";
    let jsonOut;

    try {
      jsonOut = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      jsonOut = match ? JSON.parse(match[0]) : { estrategias: [] };
    }

    if (!Array.isArray(jsonOut.estrategias)) jsonOut = { estrategias: [] };

    return res.status(200).json(jsonOut);
  } catch (err) {
    console.error("Erro estrategias-persona:", err);
    return res.status(500).json({ error: "Falha ao gerar estratégias" });
  }
}