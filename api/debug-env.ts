import type { VercelRequest, VercelResponse } from "@vercel/node";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const has = !!process.env.OPENAI_API_KEY;
  return res.status(200).json({ hasOpenAIKey: has });
}
