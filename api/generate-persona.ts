import type { VercelRequest, VercelResponse } from "@vercel/node";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI not configured", hint: "Defina OPENAI_API_KEY e redeploy" });
  try {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });
    const { empresa, publico, objetivos, desafios, motivacoes, canais } = (req.body ?? {});
    const prompt = `
Você é um gerador de personas. Crie de 3 a 5 personas diferentes e realistas
(usando nomes brasileiros variados, como Carla, João, Francisco, Claiton, Maria),
com base nos dados:

Empresa/Projeto: ${empresa || "-"}
Público-alvo: ${publico || "-"}
Objetivos: ${objetivos || "-"}
Desafios: ${desafios || "-"}
Motivações: ${motivacoes || "-"}
Canais de comunicação: ${canais || "-"}

Formate a saída EXCLUSIVAMENTE como JSON válido:
{
  "personas": [
    {
      "nome": "Carla",
      "descricao": "…",
      "objetivos": ["…","…"],
      "desafios": ["…","…"],
      "motivacoes": ["…","…"],
      "canais": ["…","…"],
      "frase": "…"
    }
  ]
}
Sem texto fora do JSON.
`;
    let text = null;
    try {
      const resp = await client.responses.create({ model: "gpt-4o-mini", input: prompt, temperature: 0.8 });
      // @ts-ignore
      text = (resp as any).output_text || null;
    } catch (e) {
      const alt = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.8,
        messages: [
          { role: "system", content: "Você gera apenas JSON válido." },
          { role: "user", content: prompt }
        ]
      });
      text = alt.choices?.[0]?.message?.content || null;
    }
    if (!text) throw new Error("Sem texto retornado pela IA");
    let jsonOut = null;
    try { jsonOut = JSON.parse(text); }
    catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      jsonOut = m ? JSON.parse(m[0]) : { personas: [] };
    }
    if (!jsonOut || !Array.isArray(jsonOut.personas)) jsonOut = { personas: [] };
    return res.status(200).json(jsonOut);
  } catch (err) {
    console.error("OpenAI error:", err);
    return res.status(500).json({ error: "Falha ao gerar personas" });
  }
}
