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
    const dadosIniciais = req.body ?? {};

    const prompt = `
Crie uma persona de marketing com base nos dados abaixo e retorne SOMENTE JSON válido:

{
  "nome": "",
  "idade": 0,
  "genero": "",
  "ocupacao": "",
  "segmento": "",
  "cidade": "",
  "objetivos": [],
  "desafios": [],
  "motivadores": [],
  "canais": [],
  "tom": "",
  "mensagemPrincipal": "",
  "resumo": ""
}

DADOS:
${JSON.stringify(dadosIniciais, null, 2)}
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
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
      jsonOut = match ? JSON.parse(match[0]) : {};
    }

    return res.status(200).json(jsonOut);
  } catch (err) {
    console.error("Erro generate-persona:", err);
    return res.status(500).json({ error: "Falha ao gerar persona" });
  }
}
