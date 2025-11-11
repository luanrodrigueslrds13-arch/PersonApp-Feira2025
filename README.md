# PersonApp — CLEAN Reimplantação (Brand + PWA + Debug)
- Visual PersonApp (#054179 + degradê sutil, brilho metálico, tipografia fluída)
- PWA completo
- IA **desconectada** por padrão
- Endpoint de diagnóstico: `/api/debug-env` (retorna { hasOpenAIKey: true|false })
- Gerador de personas: `/api/generate-persona` (retorna 503 até configurar a chave)

## Deploy (Vercel)
1) Novo repositório no GitHub → enviar todos os arquivos desta pasta
2) Vercel → Import Project (Other) → sem Build Command e sem Output Directory
3) Acessar o site publicado

## Conectar a IA (depois)
1) OpenAI → crie uma nova chave (API Keys) `sk-...`
2) Vercel → Settings → Environment Variables
   - Name: OPENAI_API_KEY
   - Value: sua chave
   - Environments: Production
   - Save → Redeploy
3) Teste `/api/debug-env` → deve retornar `{ "hasOpenAIKey": true }`
4) Teste gerar persona no app
