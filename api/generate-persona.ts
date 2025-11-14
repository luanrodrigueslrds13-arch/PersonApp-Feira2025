import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS básico
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "AI not configured",
      hint: "Defina OPENAI_API_KEY e redeploy"
    });
  }

  try {
    const client = new OpenAI({ apiKey });

    const {
      empresa = "",
      publico = "",
      objetivos = "",
      desafios = "",
      motivacoes = "",
      canais = "",
    } = (req.body ?? {});

    const prompt = `
Você é uma IA especialista em marketing digital e criação de personas.
Responda SEMPRE em português do Brasil, de forma clara, prática e focada em pequenos negócios.

Com base nas informações abaixo, crie de 3 a 5 personas diferentes, realistas e coerentes:

Empresa/Projeto: ${empresa || "-"}
Público-alvo: ${publico || "-"}
Objetivos do público: ${objetivos || "-"}
Desafios do público: ${desafios || "-"}
Motivações: ${motivacoes || "-"}
Canais de comunicação: ${canais || "-"}

Para cada persona:
- gere um nome brasileiro coerente (ex.: Carla, João, Francisco, Claudia, Maria),
- defina o campo "genero" com valor "masculino" ou "feminino",
- inclua "idade" com um texto curto (ex.: "25 anos"),
- escreva uma "descricao" natural e objetiva, sem exageros,
- liste "objetivos" em forma de lista (itens curtos, começando com verbo),
- liste "desafios" em forma de lista,
- liste "motivacoes" em forma de lista,
- liste "canais" em forma de lista (ex.: "WhatsApp", "Instagram", "YouTube"),
- crie uma frase de síntese em "frase" (uma frase que resuma a persona).

Responda APENAS com JSON válido no formato:

{
  "personas": [
    {
      "nome": "Carla",
      "genero": "feminino",
      "idade": "25 anos",
      "descricao": "…",
      "objetivos": ["…","…"],
      "desafios": ["…","…"],
      "motivacoes": ["…","…"],
      "canais": ["…","…"],
      "frase": "…"
    }
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

    let jsonOut: any;

    try {
      // Tentar parse direto
      jsonOut = JSON.parse(text);
    } catch {
      // Se vier com texto antes/depois, tenta extrair só o bloco de JSON
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        jsonOut = JSON.parse(match[0]);
      } else {
        jsonOut = { personas: [] };
      }
    }

    if (!jsonOut || !Array.isArray(jsonOut.personas)) {
      jsonOut = { personas: [] };
    }

    return res.status(200).json(jsonOut);
  } catch (err) {
    console.error("OpenAI error in generate-persona:", err);
    return res.status(500).json({ error: "Falha ao gerar personas" });
  }
}
