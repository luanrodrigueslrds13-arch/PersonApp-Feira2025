// Config
const CONFIG = { API_URL: "/api/generate-persona", AVATAR_STYLE: "avataaars" };

// Steps with hints/examples restored
const steps = [
  {
    id:'view-step-1', idx:'1/6', title:'Empresa/Projeto',
    help:'Qual o nome da empresa e o que ela faz?',
    hint:`<div class="helper"><p>Inclua:</p>
      <ul><li>Nome da empresa/projeto</li><li>O que oferece (produtos/serviços)</li><li>Diferencial simples (ex.: “rápido”, “acolhedor”, “acessível”)</li></ul>
      <p class="ex"><em>Ex.: Loja de roupas femininas com vendas pelo Instagram e entregas rápidas.</em></p>
    </div>`,
    field:'f-empresa', placeholder:'Digite aqui…'
  },
  {
    id:'view-step-2', idx:'2/6', title:'Público‑alvo',
    help:'Descreva o público que você quer transformar em persona.',
    hint:`<div class="helper"><p>Inclua alguns pontos (não precisa todos):</p>
      <ul><li>Idade aproximada</li><li>Ocupação (estudante, profissional, autônomo…)</li><li>Rotina/estilo de vida</li></ul>
      <p class="ex"><em>Ex.: Jovens 15–18, ensino médio, rotina corrida, estudam à noite.</em></p>
    </div>`,
    field:'f-publico', placeholder:'Digite aqui…'
  },
  {
    id:'view-step-3', idx:'3/6', title:'Objetivos',
    help:'O que esse público deseja alcançar?',
    hint:`<div class="helper"><p>Pense no resultado e na meta:</p>
      <ul><li>Resultado prático (ex.: “aprender rápido”)</li><li>Benefício pessoal (ex.: “ganhar confiança”)</li><li>Meta concreta (ex.: “passar no vestibular”)</li></ul>
      <p class="ex"><em>Ex.: Melhorar notas, falar sem travar, ter mais autonomia.</em></p>
    </div>`,
    field:'f-objetivos', placeholder:'Digite aqui…'
  },
  {
    id:'view-step-4', idx:'4/6', title:'Desafios',
    help:'Quais são os principais desafios?',
    hint:`<div class="helper"><p>Barreiras comuns que atrapalham os objetivos:</p>
      <ul><li>Pouco tempo / rotina irregular</li><li>Orçamento limitado</li><li>Dificuldade em começar ou manter foco</li></ul>
      <p class="ex"><em>Ex.: Não consegue praticar todo dia; sente-se inseguro; pouca grana para materiais.</em></p>
    </div>`,
    field:'f-desafios', placeholder:'Digite aqui… (pode separar por vírgula)'
  },
  {
    id:'view-step-5', idx:'5/6', title:'Motivações',
    help:'Por que esse público escolhe sua solução?',
    hint:`<div class="helper"><p>O que pesa na escolha:</p>
      <ul><li>Qualidade / confiança</li><li>Atendimento acolhedor / suporte fácil</li><li>Preço / praticidade / localização</li></ul>
      <p class="ex"><em>Ex.: Gostam do cuidado no atendimento e das aulas objetivas.</em></p>
    </div>`,
    field:'f-motivacoes', placeholder:'Digite aqui… (pode separar por vírgula)'
  },
  {
    id:'view-step-6', idx:'6/6', title:'Comunicação',
    help:'Como esse público se comunica?',
    hint:`<div class="helper"><p>Onde falar e com qual tom:</p>
      <ul><li>Canais: WhatsApp, Instagram, YouTube, presencial, e‑mail…</li><li>Tom de voz: direto, acolhedor, técnico, divertido…</li></ul>
      <p class="ex"><em>Ex.: WhatsApp e Instagram; tom direto e acolhedor.</em></p>
    </div>`,
    field:'f-canais', placeholder:'Digite aqui…'
  },
];

// Render steps
const stepsRoot = document.getElementById('steps-root');
steps.forEach((s,i)=>{
  const prev = i===0 ? 'view-home' : steps[i-1].id;
  const next = i===steps.length-1 ? null : steps[i+1].id;
  const sec = document.createElement('section');
  sec.className = 'view'; sec.id = s.id;
  sec.innerHTML = `
    <header class="stepbar"><span>Etapa ${s.idx}</span><h2>${s.title}</h2></header>
    <main class="content">
      <p class="help">${s.help}</p>
      ${s.hint}
      <textarea id="${s.field}" placeholder="${s.placeholder}"></textarea>
    </main>
    <footer class="actions">
      <button class="btn ghost" data-prev="${prev}">Voltar</button>
      ${next ? `<button class="btn primary" data-next="${next}">Avançar</button>` : `<button class="btn primary" id="btn-gerar">Gerar persona 🤖</button>`}
    </footer>`;
  stepsRoot.appendChild(sec);
});

// Navigation
const views=[...document.querySelectorAll('.view')];
const show = id => { views.forEach(v=>v.classList.remove('active')); document.getElementById(id).classList.add('active'); window.scrollTo(0,0); };
document.body.addEventListener('click', e=>{ const n=e.target.closest('[data-next]'); if(n) show(n.dataset.next); const p=e.target.closest('[data-prev]'); if(p) show(p.dataset.prev); });
setTimeout(()=> show('view-home'), 1200);

// Top buttons
document.getElementById('btn-minhas').addEventListener('click', ()=>{ renderMinhas(); show('view-minhas'); });
document.getElementById('btn-sobre').addEventListener('click', ()=> show('view-sobre'));
document.getElementById('btn-conceito-sobre').addEventListener('click', ()=>{ const m=document.getElementById('modal-conceito'); m.classList.remove('hidden'); });
document.getElementById('modal-conceito').addEventListener('click', (e)=>{ if (e.target.dataset.close === 'modal' || e.target.closest('[data-close="modal"]')) document.getElementById('modal-conceito').classList.add('hidden'); });

// API
async function gerarPersonas(payload){
  const r = await fetch(CONFIG.API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!r.ok) { const t = await r.text(); throw new Error("Falha ("+r.status+"): "+t); }
  const data = await r.json();
  return Array.isArray(data.personas) ? data.personas : [];
}

// Generate button
document.addEventListener('click', e=>{
  if(e.target && e.target.id === 'btn-gerar'){
    (async ()=>{
      const dados = Object.fromEntries(['empresa','publico','objetivos','desafios','motivacoes','canais'].map(k=>[k, document.getElementById('f-'+k).value.trim()]));
      localStorage.setItem('personapp:lastInput', JSON.stringify(dados));
      show('view-loading');
      try{
        const personas = await gerarPersonas(dados);
        if(!personas.length) throw new Error("Sem retorno da IA");
        renderPersona(personas[0]); show('view-persona');
        const all = JSON.parse(localStorage.getItem('personapp:saved')||"[]");
        personas.forEach(p=> all.push({ ...p, ts: Date.now() }));
        localStorage.setItem('personapp:saved', JSON.stringify(all));
      }catch(e){ alert(e.message || "Não foi possível gerar agora."); show('view-step-6'); }
    })();
  }
});

// Avatar helper (DiceBear avataaars)
function setAvatar(nome){
  const img=document.getElementById('p-avatar'); const seed=(nome||'P').trim()||'P';
  img.src='https://api.dicebear.com/8.x/'+CONFIG.AVATAR_STYLE+'/svg?seed='+encodeURIComponent(seed);
}
function setText(id, val){ document.getElementById(id).textContent = val || ""; }
function fillList(id, arr){ const el=document.getElementById(id); el.innerHTML=""; (arr||[]).forEach(t=>{ const li=document.createElement('li'); li.textContent=t; el.appendChild(li); }); }
function renderPersona(p){ window.currentPersona = p; setAvatar(p?.nome||'P'); setText('p-nome', p?.nome||''); setText('p-descricao', p?.descricao||''); fillList('p-objetivos', p?.objetivos||[]); fillList('p-desafios', p?.desafios||[]); fillList('p-motivacoes', p?.motivacoes||[]); fillList('p-canais', p?.canais||[]); document.getElementById('p-frase').textContent = p?.frase || ''; }

// Minhas personas
function renderMinhas(){
  const wrap=document.getElementById('lista-personas'); wrap.innerHTML="";
  const all=JSON.parse(localStorage.getItem('personapp:saved')||"[]").sort((a,b)=>b.ts-a.ts);
  if(!all.length){ wrap.innerHTML='<p class="hint">Nenhuma persona salva ainda.</p>'; return; }
  all.forEach(p=>{ const div=document.createElement('div'); div.className='persona-card';
    div.innerHTML=`<h4>${p.nome}</h4><button class="btn">Abrir</button>`;
    div.querySelector('button').onclick=()=>{ renderPersona(p); show('view-persona'); };
    wrap.appendChild(div);
  });
}

// Export (PNG/PDF)
document.getElementById('btn-salvar').addEventListener('click', ()=>{ const all=JSON.parse(localStorage.getItem('personapp:saved')||"[]"); all.push({...window.currentPersona, ts:Date.now()}); localStorage.setItem('personapp:saved', JSON.stringify(all)); alert("Persona salva!"); });
document.getElementById('btn-editar').addEventListener('click', ()=>{ const last=JSON.parse(localStorage.getItem('personapp:lastInput')||"{}"); ['empresa','publico','objetivos','desafios','motivacoes','canais'].forEach(k=>document.getElementById('f-'+k).value=last[k]||""); show('view-step-1'); });
document.getElementById('btn-exportar').addEventListener('click', ()=>{
  let menu=document.querySelector('.export-menu'); if(menu) menu.remove();
  menu=document.createElement('div'); menu.className='card persona export-menu';
  menu.innerHTML=`<b>Exportar</b><br><button class="btn" id="exp-png">Imagem (PNG)</button><button class="btn" id="exp-pdf">PDF (A4)</button><button class="btn ghost" id="exp-close">Fechar</button>`;
  document.body.appendChild(menu);
  document.getElementById('exp-close').onclick=()=>menu.remove();
  document.getElementById('exp-png').onclick=exportPNG; document.getElementById('exp-pdf').onclick=exportPDF;
});

async function exportPNG(){ const node=document.getElementById('persona-card'); const canvas=await html2canvas(node,{backgroundColor:'#054179',scale:2}); const link=document.createElement('a'); link.download=`persona-${(window.currentPersona?.nome||'persona').toLowerCase()}.png`; link.href=canvas.toDataURL('image/png'); link.click(); }
async function exportPDF(){ const { jsPDF }=window.jspdf; const node=document.getElementById('persona-card'); const canvas=await html2canvas(node,{backgroundColor:'#054179',scale:2}); const imgData=canvas.toDataURL('image/jpeg',0.95); const pdf=new jsPDF({unit:'mm',format:'a4',orientation:'portrait'}); const pageW=210,pageH=297,margin=12; const imgW=pageW-margin*2; const imgH=(canvas.height/canvas.width)*imgW; pdf.setFontSize(12); pdf.text('PersonApp – Persona gerada por IA', margin, 10); pdf.setFontSize(9); pdf.text(new Date().toLocaleString(), pageW - margin, 10, { align:'right' }); pdf.addImage(imgData, 'JPEG', margin, 16, imgW, imgH, undefined, 'FAST'); pdf.setFontSize(8); pdf.text('Protótipo do PersonApp – Feira das Profissões 2025', pageW/2, pageH-8, { align:'center' }); pdf.save(`persona-${(window.currentPersona?.nome||'persona').toLowerCase()}.pdf`); }

// PWA
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js')); }
