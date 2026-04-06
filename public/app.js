/* ══════════════════════════════════════════════════════════
   CURSEUR CUSTOM + EFFETS MAGNÉTIQUES
══════════════════════════════════════════════════════════ */
const cursor      = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursor-trail");
let mx = -100, my = -100, tx = -100, ty = -100;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top  = my + "px";
});

(function tickTrail() {
  tx += (mx - tx) * 0.14;
  ty += (my - ty) * 0.14;
  cursorTrail.style.left = tx + "px";
  cursorTrail.style.top  = ty + "px";
  requestAnimationFrame(tickTrail);
})();

/* Hover state */
document.querySelectorAll("button, a, .service-card, .opt-btn, .check-item, .card-cta")
  .forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

/* ── Effet magnétique sur les boutons .magnetic ── */
document.querySelectorAll(".magnetic").forEach(el => {
  el.addEventListener("mousemove", e => {
    const r    = el.getBoundingClientRect();
    const dx   = e.clientX - (r.left + r.width / 2);
    const dy   = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transform = ""; });
});

/* ══════════════════════════════════════════════════════════
   DÉFINITION DES ÉTAPES DU FORMULAIRE
══════════════════════════════════════════════════════════ */
const FLOWS = {
  discord: [
    {
      id: "type",
      eyebrow: "Bot Discord — 1/4",
      title: "Quel type de bot ?",
      sub: "Choisis ce qui correspond le mieux à ton projet.",
      type: "radio",
      options: [
        { emoji: "🛡️", label: "Modération", value: "moderation" },
        { emoji: "🎵", label: "Musique",    value: "music" },
        { emoji: "🎮", label: "Jeux / RPG", value: "games" },
        { emoji: "⚙️",  label: "Custom / Autre", value: "custom" },
      ]
    },
    {
      id: "fonctions",
      eyebrow: "Bot Discord — 2/4",
      title: "Fonctionnalités voulues",
      sub: "Coche tout ce dont tu as besoin.",
      type: "checkboxes",
      options: [
        { label: "Commandes slash (/)"},
        { label: "Système de tickets"},
        { label: "Gestion des rôles auto"},
        { label: "Dashboard web de configuration"},
        { label: "Logs & statistiques"},
        { label: "Intégration API externe"},
      ]
    },
    {
      id: "hebergement",
      eyebrow: "Bot Discord — 3/4",
      title: "Hébergement inclus ?",
      sub: "Je peux héberger ton bot 24/7 sur mes serveurs Railway.",
      type: "radio",
      options: [
        { emoji: "☁️", label: "Oui, hébergement inclus",  value: "yes" },
        { emoji: "💻", label: "Non, j'héberge moi-même", value: "no" },
      ]
    },
    {
      id: "contact",
      eyebrow: "Bot Discord — 4/4",
      title: "Comment te contacter ?",
      sub: "Je reviens vers toi rapidement.",
      type: "contact",
    }
  ],

  website: [
    {
      id: "type",
      eyebrow: "Site Web — 1/4",
      title: "Quel type de site ?",
      sub: "Décris au mieux ton projet.",
      type: "radio",
      options: [
        { emoji: "🏠", label: "Vitrine / Landing",  value: "vitrine" },
        { emoji: "🎨", label: "Portfolio",           value: "portfolio" },
        { emoji: "🛒", label: "E-commerce",          value: "ecommerce" },
        { emoji: "⚡", label: "App web complète",    value: "webapp" },
      ]
    },
    {
      id: "techno",
      eyebrow: "Site Web — 2/4",
      title: "Technologies souhaitées",
      sub: "Je m'adapte à tes préférences ou je choisis ce qui convient le mieux.",
      type: "checkboxes",
      options: [
        { label: "HTML / CSS / JS vanilla"},
        { label: "React / Next.js"},
        { label: "Node.js backend"},
        { label: "Python (Flask / FastAPI)"},
        { label: "Base de données (SQLite / Postgres)"},
        { label: "Pas de préférence — laisse décider"},
      ]
    },
    {
      id: "hebergement",
      eyebrow: "Site Web — 3/4",
      title: "Hébergement inclus ?",
      sub: "Je déploie sur Railway avec domaine + SSL offerts.",
      type: "radio",
      options: [
        { emoji: "☁️", label: "Oui, hébergement inclus",   value: "yes" },
        { emoji: "💻", label: "Non, déploiement autonome", value: "no" },
      ]
    },
    {
      id: "contact",
      eyebrow: "Site Web — 4/4",
      title: "Décris ton projet",
      sub: "Plus c'est précis, mieux je peux t'aider.",
      type: "contact",
    }
  ]
};

/* ══════════════════════════════════════════════════════════
   LOGIQUE MODALE
══════════════════════════════════════════════════════════ */
const overlay   = document.getElementById("modal-overlay");
const stepsEl   = document.getElementById("modalSteps");
const progressEl= document.getElementById("progressBar");
const prevBtn   = document.getElementById("prevBtn");
const nextBtn   = document.getElementById("nextBtn");
const closeBtn  = document.getElementById("modalClose");

let currentFlow = null;
let currentStep = 0;
let answers     = {};

function openModal(type) {
  currentFlow = FLOWS[type];
  currentStep = 0;
  answers     = { service: type };
  renderStep();
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderStep() {
  const step = currentFlow[currentStep];
  const total = currentFlow.length;
  progressEl.style.width = `${((currentStep + 1) / (total + 1)) * 100}%`;

  stepsEl.innerHTML = "";
  const div = document.createElement("div");
  div.className = "modal-step active";

  if (step.type === "radio") {
    div.innerHTML = `
      <div class="step-eyebrow">${step.eyebrow}</div>
      <div class="step-title">${step.title}</div>
      <p class="step-sub">${step.sub}</p>
      <div class="options-grid">
        ${step.options.map(o => `
          <button class="opt-btn${answers[step.id] === o.value ? " selected" : ""}" data-value="${o.value}">
            ${o.emoji ? `<span class="opt-emoji">${o.emoji}</span>` : ""}
            ${o.label}
          </button>
        `).join("")}
      </div>`;
  } else if (step.type === "checkboxes") {
    const saved = answers[step.id] || [];
    div.innerHTML = `
      <div class="step-eyebrow">${step.eyebrow}</div>
      <div class="step-title">${step.title}</div>
      <p class="step-sub">${step.sub}</p>
      <div class="checks-list">
        ${step.options.map(o => `
          <label class="check-item${saved.includes(o.label) ? " checked" : ""}">
            <input type="checkbox" value="${o.label}"${saved.includes(o.label) ? " checked" : ""}>
            <div class="check-box"></div>
            ${o.label}
          </label>
        `).join("")}
      </div>`;
  } else if (step.type === "contact") {
    div.innerHTML = `
      <div class="step-eyebrow">${step.eyebrow}</div>
      <div class="step-title">${step.title}</div>
      <p class="step-sub">${step.sub}</p>
      <div class="field-group">
        <label class="field-label">TON PRÉNOM</label>
        <input class="field-input" id="f-prenom" type="text" placeholder="Ex : Julien" value="${answers.prenom || ""}">
      </div>
      <div class="field-group">
        <label class="field-label">DISCORD OU EMAIL</label>
        <input class="field-input" id="f-contact" type="text" placeholder="discord#0000 ou email@..." value="${answers.contact || ""}">
      </div>
      <div class="field-group">
        <label class="field-label">DESCRIPTION DU PROJET</label>
        <textarea class="field-textarea" id="f-desc" placeholder="Explique ton projet en quelques lignes…">${answers.description || ""}</textarea>
      </div>`;
  }

  stepsEl.appendChild(div);
  bindStep(step);
  updateNav();
}

function bindStep(step) {
  if (step.type === "radio") {
    stepsEl.querySelectorAll(".opt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        stepsEl.querySelectorAll(".opt-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        answers[step.id] = btn.dataset.value;
      });
      btn.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      btn.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  } else if (step.type === "checkboxes") {
    stepsEl.querySelectorAll(".check-item").forEach(item => {
      item.addEventListener("click", () => {
        const inp = item.querySelector("input");
        inp.checked = !inp.checked;
        item.classList.toggle("checked", inp.checked);
      });
    });
  }
}

function collectStep() {
  const step = currentFlow[currentStep];
  if (step.type === "checkboxes") {
    answers[step.id] = [...stepsEl.querySelectorAll("input:checked")].map(i => i.value);
  } else if (step.type === "contact") {
    answers.prenom      = document.getElementById("f-prenom")?.value?.trim() || "";
    answers.contact     = document.getElementById("f-contact")?.value?.trim() || "";
    answers.description = document.getElementById("f-desc")?.value?.trim() || "";
  }
}

function validateStep() {
  const step = currentFlow[currentStep];
  if (step.type === "radio" && !answers[step.id]) {
    showToast("⚡ Choisis une option pour continuer.");
    return false;
  }
  if (step.type === "contact") {
    if (!answers.prenom)  { showToast("✦ Entre ton prénom !"); return false; }
    if (!answers.contact) { showToast("✦ Entre ton Discord ou email !"); return false; }
  }
  return true;
}

function updateNav() {
  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent = currentStep === currentFlow.length - 1 ? "Envoyer la demande ✦" : "Continuer →";
}

nextBtn.addEventListener("click", async () => {
  collectStep();
  if (!validateStep()) return;

  if (currentStep < currentFlow.length - 1) {
    currentStep++;
    renderStep();
  } else {
    await submitRequest();
  }
});

prevBtn.addEventListener("click", () => {
  collectStep();
  if (currentStep > 0) { currentStep--; renderStep(); }
});

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ── Boutons d'ouverture ── */
document.querySelectorAll(".card-cta").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.type));
});

/* ══════════════════════════════════════════════════════════
   ENVOI DE LA DEMANDE
══════════════════════════════════════════════════════════ */
async function submitRequest() {
  nextBtn.disabled = true;
  nextBtn.textContent = "Envoi…";

  try {
    const res = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    });

    if (!res.ok) throw new Error("Erreur serveur");

    progressEl.style.width = "100%";
    stepsEl.innerHTML = `
      <div class="modal-step active step-success">
        <div class="success-icon">✓</div>
        <div class="step-title">Demande envoyée !</div>
        <p class="step-sub">
          Merci ${answers.prenom} 💜 Je reviens vers toi rapidement sur <strong>${answers.contact}</strong>.
        </p>
      </div>`;
    prevBtn.style.display = "none";
    nextBtn.style.display  = "none";

  } catch (e) {
    nextBtn.disabled = false;
    nextBtn.textContent = "Envoyer la demande ✦";
    showToast("❌ Erreur lors de l'envoi, réessaie.");
  }
}

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}
