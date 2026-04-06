/* ── Reset & Variables ───────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:          #07060d;
  --surface:     #0e0c17;
  --surface2:    #15121f;
  --surface3:    #1c1828;
  --border:      rgba(255,255,255,0.06);
  --border-h:    rgba(255,255,255,0.12);

  --accent:      #7c6aff;
  --accent2:     #ff6ac1;
  --discord:     #5865F2;
  --web:         #00d4aa;

  --text:        #ede8ff;
  --text-muted:  #6b6485;
  --text-dim:    #9d97b8;

  --font-display: 'Syne', sans-serif;
  --font-mono:    'DM Mono', monospace;
  --font-serif:   'Instrument Serif', serif;

  --radius:      1.6rem;
  --radius-sm:   0.8rem;

  --glow-discord: rgba(88,101,242,0.35);
  --glow-web:     rgba(0,212,170,0.35);
  --glow-accent:  rgba(124,106,255,0.35);
}

html { scroll-behavior: smooth; }

body {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-display);
  font-size: 16px;
  overflow-x: hidden;
  cursor: none;
}

/* ── Curseur custom ──────────────────────────────────────── */
#cursor, #cursor-trail {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition-property: width, height, background, opacity;
  transition-timing-function: ease;
}
#cursor {
  width: 10px; height: 10px;
  background: var(--accent);
  transition-duration: 0.1s;
  mix-blend-mode: difference;
}
#cursor-trail {
  width: 32px; height: 32px;
  border: 1.5px solid rgba(124,106,255,0.5);
  background: transparent;
  transition-duration: 0.35s;
}
body.cursor-hover #cursor { width: 16px; height: 16px; }
body.cursor-hover #cursor-trail { width: 52px; height: 52px; border-color: rgba(124,106,255,0.8); }

/* ── Arrière-plan ────────────────────────────────────────── */
.bg-grid {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(124,106,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,106,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}
.bg-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}
.g1 {
  width: 45vw; height: 45vw;
  background: rgba(88,101,242,0.12);
  top: -10%; left: -15%;
  animation: glowDrift1 18s ease-in-out infinite alternate;
}
.g2 {
  width: 35vw; height: 35vw;
  background: rgba(0,212,170,0.1);
  bottom: -5%; right: -10%;
  animation: glowDrift2 22s ease-in-out infinite alternate;
}
@keyframes glowDrift1 { to { transform: translate(8%, 12%); } }
@keyframes glowDrift2 { to { transform: translate(-8%, -10%); } }

.bg-noise {
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

/* ── HERO ────────────────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem 4rem;
  gap: 2rem;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-dim);
  letter-spacing: 0.05rem;
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 0.5rem 1.2rem;
  border-radius: 99px;
  animation: fadeUp 0.7s ease both;
}

.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--web);
  flex-shrink: 0;
}
.dot.pulse { animation: pulseDot 2s ease-in-out infinite; }
@keyframes pulseDot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,170,0.6); }
  50% { box-shadow: 0 0 0 6px rgba(0,212,170,0); }
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--text);
  animation: fadeUp 0.7s ease 0.1s both;
}
.hero-title em {
  font-style: normal;
  font-family: var(--font-serif);
  font-weight: 400;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 50ch;
  animation: fadeUp 0.7s ease 0.2s both;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.9rem 2rem;
  border-radius: 99px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  animation: fadeUp 0.7s ease 0.3s both;
  letter-spacing: 0.01rem;
}
.hero-cta svg { width: 1.1rem; height: 1.1rem; }
.hero-cta:hover { background: #6957f0; box-shadow: 0 0 32px rgba(124,106,255,0.5); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── SERVICES ────────────────────────────────────────────── */
.services {
  position: relative;
  z-index: 1;
  padding: 4rem 2rem 8rem;
  max-width: 1100px;
  margin: 0 auto;
}

.section-label {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  letter-spacing: 0.08rem;
  margin-bottom: 3rem;
  text-align: center;
}

.cards-row {
  display: flex;
  align-items: stretch;
  gap: 1rem;
}

/* ── SERVICE CARD ────────────────────────────────────────── */
.service-card {
  flex: 1;
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  overflow: hidden;
  cursor: none;
  transition: border-color 0.3s, transform 0.3s;
}
.service-card:hover { border-color: var(--border-h); transform: translateY(-4px); }

/* Bruit sur la carte */
.card-noise {
  position: absolute; inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
}

/* Bordure lumineuse */
.card-border-glow {
  position: absolute;
  inset: -1px;
  border-radius: var(--radius);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
[data-type="discord"] .card-border-glow {
  background: linear-gradient(135deg, rgba(88,101,242,0.5), transparent 60%);
}
[data-type="website"] .card-border-glow {
  background: linear-gradient(135deg, rgba(0,212,170,0.5), transparent 60%);
}
.service-card:hover .card-border-glow { opacity: 1; }

/* Badges tech flottants */
.tech-badges {
  position: absolute;
  top: 1.6rem; right: 1.6rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
  max-width: 55%;
}
.badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 400;
  padding: 0.25rem 0.7rem;
  border-radius: 99px;
  border: 1px solid;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: none;
}
.service-card:hover .badge { animation: badgeDrift 0.5s ease both; }
.service-card:hover .badge:nth-child(2) { animation-delay: 0.05s; }
.service-card:hover .badge:nth-child(3) { animation-delay: 0.1s; }
.service-card:hover .badge:nth-child(4) { animation-delay: 0.15s; }

@keyframes badgeDrift {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.badge-discord { color: #8b97f8; border-color: rgba(88,101,242,0.4); background: rgba(88,101,242,0.1); }
.badge-python  { color: #ffd85c; border-color: rgba(255,216,92,0.3); background: rgba(255,216,92,0.08); }
.badge-js      { color: #f7e05a; border-color: rgba(247,224,90,0.3); background: rgba(247,224,90,0.08); }
.badge-node    { color: #84c77b; border-color: rgba(132,199,123,0.3); background: rgba(132,199,123,0.08); }
.badge-html    { color: #ff8c5a; border-color: rgba(255,140,90,0.3); background: rgba(255,140,90,0.08); }
.badge-css     { color: #5ab4ff; border-color: rgba(90,180,255,0.3); background: rgba(90,180,255,0.08); }

/* Icône de la carte */
.card-icon {
  width: 3.5rem; height: 3.5rem;
  border-radius: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: box-shadow 0.3s;
}
.card-icon svg { width: 1.8rem; height: 1.8rem; }

.discord-icon {
  background: rgba(88,101,242,0.15);
  color: var(--discord);
  border: 1px solid rgba(88,101,242,0.3);
}
.service-card:hover .discord-icon { box-shadow: 0 0 24px rgba(88,101,242,0.4); }

.web-icon {
  background: rgba(0,212,170,0.12);
  color: var(--web);
  border: 1px solid rgba(0,212,170,0.25);
}
.service-card:hover .web-icon { box-shadow: 0 0 24px rgba(0,212,170,0.3); }

.card-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
  margin-top: 0.2rem;
}

.card-desc {
  font-size: 0.95rem;
  color: var(--text-dim);
  line-height: 1.65;
}

.card-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}
.card-features li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.9rem;
  color: var(--text-dim);
}
.check {
  color: var(--accent);
  font-size: 0.7rem;
  flex-shrink: 0;
}
[data-type="discord"] .check { color: var(--discord); }
[data-type="website"] .check { color: var(--web); }

.card-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.9rem 1.5rem;
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: auto;
}
.card-cta svg { width: 1rem; height: 1rem; transition: transform 0.2s; }
.card-cta:hover svg { transform: translateX(3px); }

[data-type="discord"] .card-cta {
  background: rgba(88,101,242,0.15);
  color: #8b97f8;
  border: 1px solid rgba(88,101,242,0.3);
}
[data-type="discord"] .card-cta:hover {
  background: rgba(88,101,242,0.25);
  box-shadow: 0 0 20px rgba(88,101,242,0.25);
}
[data-type="website"] .card-cta {
  background: rgba(0,212,170,0.12);
  color: var(--web);
  border: 1px solid rgba(0,212,170,0.25);
}
[data-type="website"] .card-cta:hover {
  background: rgba(0,212,170,0.2);
  box-shadow: 0 0 20px rgba(0,212,170,0.2);
}

/* Séparateur entre cartes */
.cards-sep {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0 0.5rem;
  flex-shrink: 0;
}
.sep-line { width: 1px; flex: 1; background: var(--border); }
.sep-or {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  writing-mode: vertical-rl;
  letter-spacing: 0.1rem;
}

/* ── FOOTER ──────────────────────────────────────────────── */
.site-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--border);
  padding: 2rem;
  text-align: center;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.footer-brand {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--accent);
}
.footer-sep { opacity: 0.4; }

/* ── MODAL ───────────────────────────────────────────────── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(7,6,13,0.85);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
}
.modal-overlay.open { opacity: 1; pointer-events: all; }

.modal {
  background: var(--surface);
  border: 1px solid var(--border-h);
  border-radius: 2rem;
  width: min(560px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  position: relative;
  transform: translateY(20px) scale(0.97);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s;
}
.modal-overlay.open .modal { transform: translateY(0) scale(1); }

.modal-close {
  position: absolute;
  top: 1.2rem; right: 1.4rem;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-muted);
  font-size: 0.9rem;
  width: 2rem; height: 2rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}
.modal-close:hover { color: var(--text); background: var(--surface3); }

.modal-progress {
  height: 2px;
  background: var(--border);
  border-radius: 99px;
  margin-bottom: 2rem;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 99px;
  transition: width 0.4s ease;
}

/* Étapes */
.modal-step {
  display: none;
  flex-direction: column;
  gap: 1.4rem;
  animation: fadeUp 0.3s ease both;
}
.modal-step.active { display: flex; }

.step-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.08rem;
}
.step-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
}
.step-sub {
  font-size: 0.9rem;
  color: var(--text-dim);
  margin-top: -0.8rem;
  line-height: 1.6;
}

/* Options radio */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}
.opt-btn {
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 1rem;
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  display: flex; flex-direction: column; gap: 0.4rem;
}
.opt-btn .opt-emoji { font-size: 1.4rem; }
.opt-btn:hover { border-color: var(--border-h); color: var(--text); }
.opt-btn.selected {
  border-color: var(--accent);
  background: rgba(124,106,255,0.12);
  color: var(--text);
}

/* Checkbox multi */
.checks-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.85rem 1rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  font-size: 0.9rem;
  color: var(--text-dim);
}
.check-item input { display: none; }
.check-box {
  width: 1.1rem; height: 1.1rem;
  border: 1.5px solid var(--border-h);
  border-radius: 0.3rem;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  font-size: 0.7rem;
}
.check-item.checked { border-color: var(--accent); background: rgba(124,106,255,0.1); color: var(--text); }
.check-item.checked .check-box { background: var(--accent); border-color: var(--accent); }
.check-item.checked .check-box::after { content: '✓'; color: #fff; }

/* Champs texte / textarea */
.field-group { display: flex; flex-direction: column; gap: 0.5rem; }
.field-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  letter-spacing: 0.05rem;
}
.field-input, .field-textarea {
  background: var(--surface2);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: var(--font-display);
  font-size: 0.95rem;
  padding: 0.9rem 1.2rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
.field-textarea {
  resize: vertical;
  min-height: 8rem;
  line-height: 1.6;
}
.field-input::placeholder, .field-textarea::placeholder { color: var(--text-muted); }
.field-input:focus, .field-textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(124,106,255,0.15);
}

/* Succès */
.step-success {
  text-align: center;
  gap: 1.2rem;
}
.success-icon {
  width: 4rem; height: 4rem;
  background: rgba(0,212,170,0.12);
  border: 1px solid rgba(0,212,170,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
  margin: 0 auto;
  animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Navigation modale */
.modal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}
.nav-btn {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-dim);
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.75rem 1.6rem;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-btn:hover { color: var(--text); border-color: var(--border-h); }
.nav-btn.nav-next {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  flex: 1;
  text-align: center;
}
.nav-btn.nav-next:hover { background: #6957f0; box-shadow: 0 0 20px rgba(124,106,255,0.35); }
.nav-btn.nav-prev { flex-shrink: 0; }
.nav-btn:disabled { opacity: 0.4; pointer-events: none; }

/* ── TOAST ───────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 2rem; left: 50%;
  transform: translateX(-50%) translateY(80px);
  background: var(--surface);
  border: 1px solid var(--border-h);
  border-radius: 99px;
  padding: 0.75rem 2rem;
  font-size: 0.9rem;
  color: var(--text);
  z-index: 2000;
  white-space: nowrap;
  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
  opacity: 0;
  pointer-events: none;
}
.toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

/* ── Magnetic helper ─────────────────────────────────────── */
.magnetic { position: relative; display: inline-flex; }

/* ── RESPONSIVE ──────────────────────────────────────────── */
@media (max-width: 720px) {
  .cards-row { flex-direction: column; }
  .cards-sep { flex-direction: row; }
  .sep-line { flex: 1; height: 1px; width: auto; }
  .sep-or { writing-mode: horizontal-tb; }
  .tech-badges { position: static; max-width: 100%; justify-content: flex-start; }
  .options-grid { grid-template-columns: 1fr; }
  #cursor, #cursor-trail { display: none; }
  body { cursor: default; }
}
