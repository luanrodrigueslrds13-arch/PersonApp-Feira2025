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
Você é uma IA especialista em marketing digital e criação de personas.
Responda SEMPRE em português do Brasil, de forma clara, prática e focada em pequenos negócios.

Com base na persona abaixo, crie de 5 a 8 sugestões de estratégias claras e práticas
de como essa persona pode ser usada no planejamento de marketing, incluindo:

- ideias de conteúdos (temas, formatos),
- canais de comunicação mais indicados,
- abordagem de linguagem (tom de voz),
- sugestões de campanhas ou ações,
- formas de relacionamento e fidelização.

Persona:
${JSON.stringify(persona, null, 2)}

Responda APENAS com JSON válido no formato:

{
  "estrategias": [
    "…",
    "…"
  ]
}

Não explique nada fora desse JSON. Não adicione texto fora do JSON.
    `.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "Você é uma IA especialista em marketing digital e criação de personas. " +
            "Responda SEMPRE em português do Brasil, de forma clara, prática e focada em pequenos negócios. " +
            "Gere apenas JSON válido no formato solicitado."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text = completion.choices[0]?.message?.content || "";

    if (!text) {
      throw new Error("Sem texto retornado pela IA");
    }

    let jsonOut;

    try {
      jsonOut = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      jsonOut = match ? JSON.parse(match[0]) : { estrategias: [] };
    }

    if (!jsonOut || !Array.isArray(jsonOut.estrategias)) {
      jsonOut = { estrategias: [] };
    }

    return res.status(200).json(jsonOut);
  } catch (err) {
    console.error("OpenAI error in estrategias-persona:", err);
    return res.status(500).json({ error: "Falha ao gerar estratégias" });
  }
}
