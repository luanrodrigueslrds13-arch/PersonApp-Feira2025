// ==============================
// CONFIG
// ==============================
const CONFIG = {
  API_URL: "/api/generate-persona",
  ESTRATEGIAS_URL: "/api/estrategias-persona",
};

// ==============================
// DEFINIÇÃO DAS 6 ETAPAS
// ==============================
const steps = [
  {
    id: "view-step-1",
    idx: "1/6",
    title: "Empresa / Projeto",
    help: "Qual o nome da empresa e o que ela faz?",
    hint: `
      <div class="helper">
        <p>Inclua:</p>
        <ul>
          <li>Nome da empresa ou projeto</li>
          <li>O que oferece (produtos ou serviços)</li>
          <li>Algum diferencial simples</li>
        </ul>
        <p class="ex">
          <em>Ex.: Loja de roupas femininas com vendas pelo Instagram e entregas rápidas.</em>
        </p>
      </div>
    `,
    field: "f-empresa",
    placeholder: "Digite aqui o nome e o que a empresa faz…"
  },
  {
    id: "view-step-2",
    idx: "2/6",
    title: "Público-alvo",
    help: "Descreva o público que você quer transformar em persona.",
    hint: `
      <div class="helper">
        <p>Inclua alguns pontos (não precisa todos):</p>
        <ul>
          <li>Idade aproximada</li>
          <li>Ocupação (estudante, profissional, autônomo…)</li>
          <li>Rotina ou estilo de vida</li>
        </ul>
        <p class="ex">
          <em>Ex.: Jovens de 15–18 anos, ensino médio, rotina corrida, estudam à noite.</em>
        </p>
      </div>
    `,
    field: "f-publico",
    placeholder: "Quem é esse público? Idade, rotina, contexto…"
  },
  {
    id: "view-step-3",
    idx: "3/6",
    title: "Objetivos",
    help: "O que esse público deseja alcançar?",
    hint: `
      <div class="helper">
        <p>Pense no resultado e na meta:</p>
        <ul>
          <li>Resultado prático (ex.: aprender mais rápido)</li>
          <li>Benefício pessoal (ex.: ganhar confiança)</li>
          <li>Meta concreta (ex.: passar no vestibular)</li>
        </ul>
        <p class="ex">
          <em>Ex.: Melhorar notas, falar sem travar, ter mais autonomia.</em>
        </p>
      </div>
    `,
    field: "f-objetivos",
    placeholder: "Quais resultados esse público quer ver na prática?"
  },
  {
    id: "view-step-4",
    idx: "4/6",
    title: "Desafios",
    help: "Quais são os principais desafios?",
    hint: `
      <div class="helper">
        <p>Barreiras que atrapalham os objetivos:</p>
        <ul>
          <li>Pouco tempo / rotina irregular</li>
          <li>Orçamento limitado</li>
          <li>Dificuldade em manter foco ou começar</li>
        </ul>
        <p class="ex">
          <em>Ex.: Não consegue praticar todo dia, sente insegurança, tem pouca grana para materiais.</em>
        </p>
      </div>
    `,
    field: "f-desafios",
    placeholder: "O que atrapalha esse público a chegar onde quer?"
  },
  {
    id: "view-step-5",
    idx: "5/6",
    title: "Motivações",
    help: "Por que esse público escolhe sua solução?",
    hint: `
      <div class="helper">
        <p>O que pesa na escolha:</p>
        <ul>
          <li>Qualidade e confiança</li>
          <li>Atendimento acolhedor / suporte fácil</li>
          <li>Preço, praticidade ou localização</li>
        </ul>
        <p class="ex">
          <em>Ex.: Gostam do cuidado no atendimento e das aulas objetivas.</em>
        </p>
      </div>
    `,
    field: "f-motivacoes",
    placeholder: "O que faz o público dizer: “quero essa solução”?"
  },
  {
    id: "view-step-6",
    idx: "6/6",
    title: "Comunicação",
    help: "Como esse público se comunica?",
    hint: `
      <div class="helper">
        <p>Onde falar e com qual tom:</p>
        <ul>
          <li>Canais: WhatsApp, Instagram, YouTube, presencial, e-mail…</li>
          <li>Tom de voz: direto, acolhedor, técnico, divertido…</li>
        </ul>
        <p class="ex">
          <em>Ex.: WhatsApp e Instagram; tom direto, simples e acolhedor.</em>
        </p>
      </div>
    `,
    field: "f-canais",
    placeholder: "Onde e como essa empresa conversa com o público?"
  }
];

// ==============================
// RENDERIZAÇÃO DAS ETAPAS
// ==============================
const stepsRoot = document.getElementById("steps-root");

steps.forEach((s, i) => {
  const prev = i === 0 ? "view-home" : steps[i - 1].id;
  const next = i === steps.length - 1 ? null : steps[i + 1].id;

  const sec = document.createElement("section");
  sec.className = "view";
  sec.id = s.id;
  sec.innerHTML = `
    <header class="topbar">
      <span>Etapa ${s.idx}</span>
      <h2>${s.title}</h2>
    </header>

    <main class="content">
      <p class="help">${s.help}</p>
      ${s.hint}
      <textarea id="${s.field}" placeholder="${s.placeholder}"></textarea>
    </main>

    <footer class="actions">
      <button class="btn ghost" data-prev="${prev}">Voltar</button>
      ${
        next
          ? `<button class="btn primary" data-next="${next}">Avançar</button>`
          : `<button class="btn primary" id="btn-gerar">Gerar persona 🤖</button>`
      }
    </footer>
  `;
  stepsRoot.appendChild(sec);
});

// ==============================
// NAVEGAÇÃO ENTRE VIEWS
// ==============================
const views = [...document.querySelectorAll(".view")];

function show(id) {
  views.forEach((v) => v.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  window.scrollTo(0, 0);
}

// Sai do Splash para Home
setTimeout(() => show("view-home"), 1200);

// Navegar via data-next / data-prev
document.body.addEventListener("click", (e) => {
  const nextBtn = e.target.closest("[data-next]");
  if (nextBtn) {
    show(nextBtn.dataset.next);
    return;
  }
  const prevBtn = e.target.closest("[data-prev]");
  if (prevBtn) {
    show(prevBtn.dataset.prev);
    return;
  }
});

// Botões da Home
document.getElementById("btn-sobre").addEventListener("click", () => show("view-sobre"));

document.getElementById("btn-minhas").addEventListener("click", () => {
  renderMinhas();
  show("view-minhas");
});

// ==============================
// MODAL: O que é persona?
// ==============================
document.getElementById("btn-oque-persona").addEventListener("click", () => {
  document.getElementById("modal-persona").classList.remove("hidden");
});

document.getElementById("modal-persona").addEventListener("click", (e) => {
  if (e.target.dataset.close === "persona" || e.target.closest("[data-close='persona']")) {
    document.getElementById("modal-persona").classList.add("hidden");
  }
});

// ==============================
// HELPER: inferir gênero pelo nome
// ==============================
function inferirGeneroPorNome(nome) {
  if (!nome) return null;
  const n = nome.trim().toLowerCase();

  const masc = [
    "joão", "francisco", "josé", "pedro", "lucas",
    "mateus", "carlos", "antônio", "antonio", "luan"
  ];
  const fem = [
    "maria", "claudia", "carla", "ana", "juliana",
    "mariana", "beatriz", "camila", "fernanda",
    "patrícia", "patricia", "sofia", "luana"
  ];

  if (masc.includes(n)) return "masculino";
  if (fem.includes(n))  return "feminino";
  return null;
}

// ==============================
// AVATAR (DiceBear) — neutro e por gênero
// ==============================
function setAvatar(nome, genero) {
  const img = document.getElementById("p-avatar");
  const base = (nome || "Persona").trim() || "Persona";
  const seed = base.replace(/\s+/g, "_").toLowerCase();
  const g = (genero || "").toLowerCase();

  const style =
    g.startsWith("masc") ? "adventurer-neutral" :
    g.startsWith("fem")  ? "lorelei" :
                           "avataaars";

  const params = "radius=50&flip=false";

  img.src = `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(seed)}&${params}`;
}

// ==============================
// HELPERS DE TEXTO E LISTA
// ==============================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || "";
}

function fillList(id, arr) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  (arr || []).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    el.appendChild(li);
  });
}

// ==============================
// CHAMADA À IA: gerar personas
// ==============================
async function gerarPersonas(payload) {
  const r = await fetch(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error("Falha (" + r.status + "): " + t);
  }

  const data = await r.json();
  return Array.isArray(data.personas) ? data.personas : [];
}

// ==============================
// BOTÃO: Gerar persona 🤖
// ==============================
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "btn-gerar") {
    (async () => {
      const dados = {
        empresa: document.getElementById("f-empresa").value.trim(),
        publico: document.getElementById("f-publico").value.trim(),
        objetivos: document.getElementById("f-objetivos").value.trim(),
        desafios: document.getElementById("f-desafios").value.trim(),
        motivacoes: document.getElementById("f-motivacoes").value.trim(),
        canais: document.getElementById("f-canais").value.trim(),
      };

      // guardar último input
      localStorage.setItem("personapp:lastInput", JSON.stringify(dados));

      show("view-loading");

      try {
        const personas = await gerarPersonas(dados);
        if (!personas.length) throw new Error("Sem retorno da IA.");

        const primeira = personas[0];
        renderPersona(primeira);
        show("view-persona");

        // salvar todas as geradas
        const all = JSON.parse(localStorage.getItem("personapp:saved") || "[]");
        personas.forEach((p) => all.push({ ...p, ts: Date.now() }));
        localStorage.setItem("personapp:saved", JSON.stringify(all));
      } catch (err) {
        alert(err.message || "Não foi possível gerar agora.");
        show("view-step-6");
      }
    })();
  }
});

// ==============================
// RENDERIZAR PERSONA NA TELA
// ==============================
function renderPersona(p) {
  window.currentPersona = p;

  const gen = p?.genero || inferirGeneroPorNome(p?.nome);
  setAvatar(p?.nome || "P", gen);

  setText("p-nome", p?.nome || "");
  setText("p-idade", p?.idade ? `Idade aproximada: ${p.idade}` : "");
  setText("p-descricao", p?.descricao || "");
  fillList("p-objetivos", p?.objetivos || []);
  fillList("p-desafios", p?.desafios || []);
  fillList("p-motivacoes", p?.motivacoes || []);
  fillList("p-canais", p?.canais || []);
  setText("p-frase", p?.frase || "");
}

// ==============================
// MINHAS PERSONAS (lista)
// ==============================
function renderMinhas() {
  const wrap = document.getElementById("lista-personas");
  wrap.innerHTML = "";

  const all = JSON.parse(localStorage.getItem("personapp:saved") || "[]")
    .sort((a, b) => b.ts - a.ts);

  if (!all.length) {
    wrap.innerHTML = '<p class="hint">Nenhuma persona salva ainda.</p>';
    return;
  }

  all.forEach((p) => {
    const div = document.createElement("div");
    div.className = "persona-card";
    div.innerHTML = `
      <h4>${p.nome}</h4>
      <button class="btn">Abrir</button>
    `;
    div.querySelector("button").onclick = () => {
      renderPersona(p);
      show("view-persona");
    };
    wrap.appendChild(div);
  });
}

// ==============================
// SALVAR / EDITAR / EXPORTAR
// ==============================
document.getElementById("btn-salvar").addEventListener("click", () => {
  if (!window.currentPersona) {
    alert("Nenhuma persona carregada.");
    return;
  }
  const all = JSON.parse(localStorage.getItem("personapp:saved") || "[]");
  all.push({ ...window.currentPersona, ts: Date.now() });
  localStorage.setItem("personapp:saved", JSON.stringify(all));
  alert("Persona salva!");
});

document.getElementById("btn-editar").addEventListener("click", () => {
  const last = JSON.parse(localStorage.getItem("personapp:lastInput") || "{}");
  document.getElementById("f-empresa").value   = last.empresa   || "";
  document.getElementById("f-publico").value   = last.publico   || "";
  document.getElementById("f-objetivos").value = last.objetivos || "";
  document.getElementById("f-desafios").value  = last.desafios  || "";
  document.getElementById("f-motivacoes").value= last.motivacoes|| "";
  document.getElementById("f-canais").value    = last.canais    || "";

  show("view-step-1");
});

// MENU DE EXPORTAÇÃO (PNG / PDF)
document.getElementById("btn-exportar").addEventListener("click", () => {
  let menu = document.querySelector(".export-menu");
  if (menu) menu.remove();

  menu = document.createElement("div");
  menu.className = "card persona export-menu";
  menu.style.position = "fixed";
  menu.style.bottom = "20px";
  menu.style.left = "50%";
  menu.style.transform = "translateX(-50%)";
  menu.style.zIndex = "3000";

  menu.innerHTML = `
    <b>Exportar</b><br />
    <button class="btn" id="exp-png">Imagem (PNG)</button>
    <button class="btn" id="exp-pdf">PDF (A4)</button>
    <button class="btn ghost" id="exp-close">Fechar</button>
  `;

  document.body.appendChild(menu);

  document.getElementById("exp-close").onclick = () => menu.remove();
  document.getElementById("exp-png").onclick = exportPNG;
  document.getElementById("exp-pdf").onclick = exportPDF;
});

// Exportar PNG
async function exportPNG() {
  const node = document.getElementById("persona-card");
  const canvas = await html2canvas(node, {
    backgroundColor: "#054179",
    scale: 2,
  });

  const link = document.createElement("a");
  const nome = (window.currentPersona?.nome || "persona").toLowerCase();
  link.download = `persona-${nome}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Exportar PDF
async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const node = document.getElementById("persona-card");
  const canvas = await html2canvas(node, {
    backgroundColor: "#054179",
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageW = 210;
  const pageH = 297;
  const margin = 12;
  const imgW = pageW - margin * 2;
  const imgH = (canvas.height / canvas.width) * imgW;

  pdf.setFontSize(12);
  pdf.text("PersonApp – Persona gerada por IA", margin, 10);
  pdf.setFontSize(9);
  pdf.text(new Date().toLocaleString(), pageW - margin, 10, { align: "right" });

  pdf.addImage(imgData, "JPEG", margin, 16, imgW, imgH, undefined, "FAST");

  pdf.setFontSize(8);
  pdf.text(
    "Protótipo do PersonApp – Dia D da EPT 2025",
    pageW / 2,
    pageH - 8,
    { align: "center" }
  );

  const nome = (window.currentPersona?.nome || "persona").toLowerCase();
  pdf.save(`persona-${nome}.pdf`);
}

// ==============================
// BOTÃO: O que fazer com minha persona?
// ==============================
document
  .getElementById("btn-estrategias")
  .addEventListener("click", gerarEstrategiasParaPersona);

const modalEstr = document.getElementById("modal-estrategias");

modalEstr.addEventListener("click", (e) => {
  if (e.target.dataset.close === "estrategias" || e.target.closest("[data-close='estrategias']")) {
    modalEstr.classList.add("hidden");
  }
});

async function gerarEstrategiasParaPersona() {
  if (!window.currentPersona) {
    alert("Nenhuma persona carregada.");
    return;
  }

  const modal = document.getElementById("modal-estrategias");
  const statusEl = document.getElementById("estrategias-status");
  const contEl = document.getElementById("estrategias-conteudo");

  modal.classList.remove("hidden");
  statusEl.textContent = "Gerando estratégias com IA…";
  contEl.innerHTML = "";

  try {
    const r = await fetch(CONFIG.ESTRATEGIAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(window.currentPersona),
    });

    if (!r.ok) throw new Error("Erro " + r.status);

    const data = await r.json();
    const lista = data.estrategias || [];

    statusEl.textContent = "";

    if (!lista.length) {
      contEl.innerHTML = "<p>Não foi possível gerar estratégias agora.</p>";
      return;
    }

    const ul = document.createElement("ul");
    lista.forEach((tx) => {
      const li = document.createElement("li");
      li.textContent = tx;
      ul.appendChild(li);
    });
    contEl.appendChild(ul);
  } catch (e) {
    statusEl.textContent = "Não foi possível gerar agora. Tente novamente.";
  }
}
