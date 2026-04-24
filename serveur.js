const express      = require("express");
const path         = require("path");
const fs           = require("fs");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const webpush      = require("web-push");
const cron         = require("node-cron");

const app  = express();
const PORT = process.env.PORT || 3000;

/* ══════════════════════════════════════════════════════════
   BASE DE DONNÉES JSON
══════════════════════════════════════════════════════════ */
const DB_PATH = process.env.DB_PATH || "nous.json";

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    const init = { users: [], widgets: {}, push_subs: {} };
    fs.writeFileSync(DB_PATH, JSON.stringify(init, null, 2));
    return init;
  }
  try { return JSON.parse(fs.readFileSync(DB_PATH, "utf8")); }
  catch(e) { return { users: [], widgets: {}, push_subs: {} }; }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/* ══════════════════════════════════════════════════════════
   VAPID KEYS
══════════════════════════════════════════════════════════ */
const VAPID_PATH = process.env.DB_PATH
  ? path.join(path.dirname(process.env.DB_PATH), "vapid.json")
  : "vapid.json";

let VAPID_PUBLIC, VAPID_PRIVATE;

if (fs.existsSync(VAPID_PATH)) {
  const v = JSON.parse(fs.readFileSync(VAPID_PATH));
  VAPID_PUBLIC  = v.public;
  VAPID_PRIVATE = v.private;
} else {
  const keys    = webpush.generateVAPIDKeys();
  VAPID_PUBLIC  = keys.publicKey;
  VAPID_PRIVATE = keys.privateKey;
  fs.writeFileSync(VAPID_PATH, JSON.stringify({ public: VAPID_PUBLIC, private: VAPID_PRIVATE }));
  console.log("🔑 VAPID keys générées.");
}

webpush.setVapidDetails("mailto:nous@nous.app", VAPID_PUBLIC, VAPID_PRIVATE);

/* ══════════════════════════════════════════════════════════
   RESET QUOTIDIEN minuit
══════════════════════════════════════════════════════════ */
cron.schedule("0 2 * * *", () => {
  const db = loadDB();
  for (const id in db.widgets) {
    db.widgets[id] = { ...db.widgets[id], humeur: null, meteo: null, occupation: null, mot: null, updated_at: new Date().toISOString() };
  }
  saveDB(db);
  console.log("🔄 Reset quotidien effectué.");
}, { timezone: "Europe/Paris" });

/* ══════════════════════════════════════════════════════════
   MIDDLEWARE
══════════════════════════════════════════════════════════ */
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function getCurrentUser(req) {
  const cookieId = req.cookies["nous_id"];
  if (!cookieId) return null;
  const db = loadDB();
  return db.users.find(u => u.cookie_id === cookieId) || null;
}

function parseDevice(ua = "") {
  if (!ua) return "Appareil inconnu";
  if (/iPhone/i.test(ua))  return "📱 iPhone";
  if (/iPad/i.test(ua))    return "📟 iPad";
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) return "📱 Android";
  if (/Android/i.test(ua)) return "📟 Tablette Android";
  if (/Windows/i.test(ua)) return "💻 Windows";
  if (/Macintosh/i.test(ua)) return "🖥️ Mac";
  if (/Linux/i.test(ua))   return "🖥️ Linux";
  return "💻 Navigateur";
}

function getIP(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "?";
}

async function notifyOther(senderId, message) {
  const db     = loadDB();
  const sender = db.users.find(u => u.id === senderId);
  const others = db.users.filter(u => u.id !== senderId);

  for (const u of others) {
    const subs = db.push_subs[u.id] || [];
    const keep = [];
    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub, JSON.stringify({
          title: `💌 ${sender?.name || "Quelqu'un"} t'a écrit`,
          body: message
        }));
        keep.push(sub);
      } catch (e) {
        if (e.statusCode !== 410) keep.push(sub);
      }
    }
    db.push_subs[u.id] = keep;
  }
  saveDB(db);
}

/* ══════════════════════════════════════════════════════════
   ROUTES AUTH
══════════════════════════════════════════════════════════ */
app.get("/api/names", (req, res) => {
  const db = loadDB();
  res.json(db.users.map(u => u.name));
});

app.post("/api/login", (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 2) return res.status(400).json({ error: "Prénom trop court (min 2 lettres)" });

  const trimmed = name.trim();
  const db      = loadDB();
  let user      = db.users.find(u => u.name.toLowerCase() === trimmed.toLowerCase());

  if (!user) {
    if (db.users.length >= 2) return res.status(403).json({ error: "Les 2 profils sont déjà créés 💕" });
    const id = uuidv4(), cookieId = uuidv4();
    user = { id, name: trimmed, cookie_id: cookieId, created_at: new Date().toISOString() };
    db.users.push(user);
    db.widgets[id] = { humeur: null, meteo: null, occupation: null, mot: null, updated_at: new Date().toISOString() };
    saveDB(db);
    console.log(`👤 Nouveau profil créé : ${trimmed}`);
  }

  const device = parseDevice(req.headers["user-agent"]);
  const ip     = getIP(req);
  console.log(`🔐 Connexion : ${user.name} — ${device} — IP: ${ip}`);

  res.cookie("nous_id", user.cookie_id, { maxAge: 365*24*60*60*1000, httpOnly: false, sameSite: "lax" });
  res.json({ ok: true, name: user.name, id: user.id });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("nous_id");
  res.json({ ok: true });
});

app.get("/api/me", (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.json({ logged: false });

  const device = parseDevice(req.headers["user-agent"]);
  const ip     = getIP(req);
  console.log(`👁️  Actif : ${user.name} — ${device} — IP: ${ip}`);

  res.json({ logged: true, name: user.name, id: user.id });
});

/* ══════════════════════════════════════════════════════════
   ROUTES WIDGETS
══════════════════════════════════════════════════════════ */
app.get("/api/widgets", (req, res) => {
  const me = getCurrentUser(req);
  if (!me) return res.status(401).json({ error: "Non connecté" });

  const db    = loadDB();
  const users = db.users.map(u => ({
    id: u.id, name: u.name,
    humeur:     db.widgets[u.id]?.humeur    ?? null,
    meteo:      db.widgets[u.id]?.meteo     ?? null,
    occupation: db.widgets[u.id]?.occupation ?? null,
    mot:        db.widgets[u.id]?.mot        ?? null,
    updated_at: db.widgets[u.id]?.updated_at ?? null,
  }));

  res.json({ me: me.id, users });
});

app.post("/api/widgets", async (req, res) => {
  const me = getCurrentUser(req);
  if (!me) return res.status(401).json({ error: "Non connecté" });

  const db  = loadDB();
  const cur = db.widgets[me.id] || {};
  const { humeur, meteo, occupation, mot } = req.body;

  db.widgets[me.id] = {
    humeur:     humeur     !== undefined ? humeur     : cur.humeur,
    meteo:      meteo      !== undefined ? meteo      : cur.meteo,
    occupation: occupation !== undefined ? occupation : cur.occupation,
    mot:        mot        !== undefined ? mot        : cur.mot,
    updated_at: new Date().toISOString()
  };
  saveDB(db);

  const delay = process.env.NODE_ENV === "production" ? 5*60*1000 : 30000;
  const parts = [];
  if (humeur     !== undefined) parts.push("son humeur");
  if (mot        !== undefined && mot) parts.push("un mot doux");
  if (occupation !== undefined) parts.push("son occupation");
  if (parts.length) {
    setTimeout(() => notifyOther(me.id, `${me.name} a mis à jour ${parts.join(", ")} 💕`), delay);
  }

  const device = parseDevice(req.headers["user-agent"]);
  console.log(`📝 Màj widgets : ${me.name} — ${device}`);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════════
   ROUTES PUSH
══════════════════════════════════════════════════════════ */
app.get("/api/vapid-public", (req, res) => res.json({ key: VAPID_PUBLIC }));

app.post("/api/push/subscribe", (req, res) => {
  const me = getCurrentUser(req);
  if (!me) return res.status(401).json({ error: "Non connecté" });
  const db = loadDB();
  if (!db.push_subs[me.id]) db.push_subs[me.id] = [];
  const subStr = JSON.stringify(req.body);
  if (!db.push_subs[me.id].some(s => JSON.stringify(s) === subStr)) db.push_subs[me.id].push(req.body);
  saveDB(db);
  res.json({ ok: true });
});

app.post("/api/push/unsubscribe", (req, res) => {
  const me = getCurrentUser(req);
  if (!me) return res.status(401).json({ error: "Non connecté" });
  const db = loadDB();
  db.push_subs[me.id] = [];
  saveDB(db);
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════════
   RESET MANUEL
══════════════════════════════════════════════════════════ */
app.post("/api/reset", (req, res) => {
  const db = loadDB();
  for (const id in db.widgets) {
    db.widgets[id] = { ...db.widgets[id], humeur: null, meteo: null, occupation: null, mot: null, updated_at: new Date().toISOString() };
  }
  saveDB(db);
  console.log("🔄 Reset manuel effectué.");
  res.json({ ok: true });
});

/* ══════════════════════════════════════════════════════════
   SPA FALLBACK
══════════════════════════════════════════════════════════ */
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => {
  const host = process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : `http://localhost:${PORT}`;
  console.log(`✅ Serveur lancé → ${host}`);
});
