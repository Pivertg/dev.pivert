const express      = require("express");
const path         = require("path");
const fs           = require("fs");
const { v4: uuidv4 } = require("uuid");
const cron         = require("node-cron");

const app  = express();
const PORT = process.env.PORT || 3000;

/* ══════════════════════════════════════════════════════════
   BASE DE DONNÉES JSON — stockée dans le volume Railway
══════════════════════════════════════════════════════════ */
const DB_PATH = process.env.DB_PATH
  ? path.join(process.env.DB_PATH, "devcraft.json")
  : path.join(__dirname, "devcraft.json");

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const init = { requests: [] };
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(init, null, 2));
    return init;
  }
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); }
  catch (e) { return { requests: [] }; }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/* ══════════════════════════════════════════════════════════
   ADMIN TOKEN
   Définis ADMIN_PASSWORD dans les variables d'env Railway.
   Le token JWT simplifié est recalculé à chaque démarrage.
══════════════════════════════════════════════════════════ */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "devcraft2025";
const ADMIN_TOKEN    = "tok_" + Buffer.from(ADMIN_PASSWORD + Date.now()).toString("base64");

function requireAdmin(req, res, next) {
  const auth  = req.headers["authorization"] || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: "Non autorisé" });
  next();
}

/* ══════════════════════════════════════════════════════════
   NETTOYAGE AUTOMATIQUE — supprime les demandes traitées
   de plus de 30 jours (pour éviter un volume JSON trop gros)
══════════════════════════════════════════════════════════ */
cron.schedule("0 3 * * *", () => {
  const db    = loadDB();
  const limit = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const before = db.requests.length;
  db.requests = db.requests.filter(r => {
    if (r.status === "done" && new Date(r.created_at).getTime() < limit) return false;
    return true;
  });
  const after = db.requests.length;
  if (before !== after) {
    saveDB(db);
    console.log(`🧹 Nettoyage : ${before - after} demandes traitées supprimées.`);
  }
}, { timezone: "Europe/Paris" });

/* ══════════════════════════════════════════════════════════
   MIDDLEWARE
══════════════════════════════════════════════════════════ */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ══════════════════════════════════════════════════════════
   ROUTES PUBLIQUES
══════════════════════════════════════════════════════════ */

/* Soumettre une demande de devis */
app.post("/api/request", (req, res) => {
  const { service, prenom, contact, type, hebergement, fonctions, techno, description } = req.body;

  /* Validation minimale */
  if (!service || !prenom || !contact) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  const db = loadDB();

  /* Protection anti-spam : max 5 demandes avec le même contact dans les 24h */
  const h24 = Date.now() - 24 * 60 * 60 * 1000;
  const recent = db.requests.filter(r =>
    r.contact?.toLowerCase() === contact.toLowerCase() &&
    new Date(r.created_at).getTime() > h24
  );
  if (recent.length >= 5) {
    return res.status(429).json({ error: "Trop de demandes. Réessaie demain." });
  }

  const request = {
    id:          uuidv4(),
    service:     service.slice(0, 20),
    prenom:      prenom.slice(0, 50),
    contact:     contact.slice(0, 100),
    type:        (type || "").slice(0, 50),
    hebergement: hebergement || null,
    fonctions:   Array.isArray(fonctions) ? fonctions.slice(0, 10).map(f => String(f).slice(0, 60)) : [],
    techno:      Array.isArray(techno)    ? techno.slice(0, 10).map(t => String(t).slice(0, 60))    : [],
    description: (description || "").slice(0, 1000),
    status:      "new",
    created_at:  new Date().toISOString(),
  };

  db.requests.push(request);
  saveDB(db);

  console.log(`📬 Nouvelle demande [${service}] — ${prenom} (${contact})`);
  res.json({ ok: true, id: request.id });
});

/* ══════════════════════════════════════════════════════════
   ROUTES ADMIN (protégées)
══════════════════════════════════════════════════════════ */

/* Login admin — retourne le token de session */
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }
  res.json({ token: ADMIN_TOKEN });
});

/* Liste toutes les demandes */
app.get("/api/admin/requests", requireAdmin, (req, res) => {
  const db = loadDB();
  res.json(db.requests);
});

/* Mettre à jour le statut d'une demande */
app.patch("/api/admin/requests/:id", requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ["new", "seen", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  const db  = loadDB();
  const req_item = db.requests.find(r => r.id === req.params.id);
  if (!req_item) return res.status(404).json({ error: "Introuvable" });

  req_item.status = status;
  req_item.updated_at = new Date().toISOString();
  saveDB(db);
  res.json({ ok: true });
});

/* Supprimer une demande */
app.delete("/api/admin/requests/:id", requireAdmin, (req, res) => {
  const db = loadDB();
  const before = db.requests.length;
  db.requests = db.requests.filter(r => r.id !== req.params.id);
  if (db.requests.length === before) return res.status(404).json({ error: "Introuvable" });
  saveDB(db);
  console.log(`🗑  Demande supprimée : ${req.params.id}`);
  res.json({ ok: true });
});

/* Vider toutes les demandes "done" manuellement */
app.post("/api/admin/purge-done", requireAdmin, (req, res) => {
  const db = loadDB();
  const before = db.requests.length;
  db.requests = db.requests.filter(r => r.status !== "done");
  saveDB(db);
  const removed = before - db.requests.length;
  console.log(`🧹 Purge manuelle : ${removed} demandes supprimées.`);
  res.json({ ok: true, removed });
});

/* ══════════════════════════════════════════════════════════
   SPA FALLBACK
══════════════════════════════════════════════════════════ */
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

/* ══════════════════════════════════════════════════════════
   DÉMARRAGE
══════════════════════════════════════════════════════════ */
app.listen(PORT, () => {
  const host = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${PORT}`;
  console.log(`✅ DevCraft Server → ${host}`);
  console.log(`🔑 Mot de passe admin : ${ADMIN_PASSWORD}`);
  console.log(`📁 Base de données    : ${DB_PATH}`);
});
