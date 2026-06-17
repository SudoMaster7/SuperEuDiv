import { useState, useEffect, useRef } from "react";

// ── PALETTE & TOKENS ──────────────────────────────────────────────
// Obsidian · Deep Violet · Liquid Gold · Sacred White
// Cinzel (display) · Cormorant Garamond (body) → via Google Fonts fallback stack

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --obsidian:   #0A0A0F;
    --void:       #060608;
    --surface:    #111118;
    --surface2:   #16161F;
    --border:     rgba(180,150,80,0.18);
    --border2:    rgba(180,150,80,0.08);
    --gold:       #C8A84B;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,168,75,0.35);
    --violet:     #6B3FA0;
    --violet2:    #8B5CC8;
    --violet-dim: rgba(107,63,160,0.25);
    --white:      #F5F0E8;
    --muted:      rgba(245,240,232,0.45);
    --muted2:     rgba(245,240,232,0.22);
    --danger:     #C84B4B;
    --success:    #4B9C8A;
    --r:          12px;
    --r2:         8px;
  }

  html, body, #root { height: 100%; background: var(--void); color: var(--white); font-family: 'Cormorant Garamond', Georgia, serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--void); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .app {
    min-height: 100vh;
    background: var(--void);
    display: flex;
    flex-direction: column;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
  }

  /* ── SACRED GEOMETRY BG ── */
  .sacred-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .sacred-bg svg { opacity: 0.04; position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; }

  /* ── HEADER ── */
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(6,6,8,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border2);
    padding: 14px 20px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-brand { display: flex; flex-direction: column; gap: 1px; }
  .header-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.22em;
    color: var(--gold);
    text-transform: uppercase;
  }
  .header-sub { font-size: 10px; letter-spacing: 0.15em; color: var(--muted2); font-family: 'DM Mono', monospace; }
  .header-orb {
    width: 34px; height: 34px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, var(--violet2), var(--violet), #1a0a2e);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; cursor: pointer;
    box-shadow: 0 0 16px var(--violet-dim);
  }

  /* ── NAV ── */
  .nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 480px;
    z-index: 50;
    background: rgba(6,6,8,0.96);
    backdrop-filter: blur(24px);
    border-top: 1px solid var(--border2);
    display: flex;
    padding: 8px 4px 20px;
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; gap: 4px;
    padding: 6px 4px;
    cursor: pointer; border: none; background: none;
    transition: all 0.2s;
  }
  .nav-icon { font-size: 18px; transition: all 0.25s; }
  .nav-label { font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.12em; color: var(--muted2); text-transform: uppercase; transition: all 0.2s; }
  .nav-item.active .nav-icon { filter: drop-shadow(0 0 8px var(--gold)); transform: translateY(-2px); }
  .nav-item.active .nav-label { color: var(--gold); }

  /* ── MAIN CONTENT ── */
  .main { flex: 1; padding: 16px 16px 100px; position: relative; z-index: 1; }

  /* ── CARDS ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: var(--r);
    overflow: hidden;
    position: relative;
  }
  .card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  }
  .card-body { padding: 18px; }
  .card + .card { margin-top: 12px; }

  /* ── SECTION LABEL ── */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 0.25em; color: var(--gold);
    text-transform: uppercase; margin-bottom: 12px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ── GREETING / ORACLE ── */
  .oracle-card {
    background: linear-gradient(135deg, #0d0a1a 0%, #100a20 50%, #0A0A0F 100%);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 22px 20px;
    position: relative;
    overflow: hidden;
    margin-bottom: 12px;
  }
  .oracle-card::after {
    content: '';
    position: absolute; bottom: -40px; right: -40px;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, var(--violet-dim), transparent 70%);
  }
  .oracle-date { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted2); letter-spacing: 0.18em; margin-bottom: 8px; }
  .oracle-greeting { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; color: var(--white); line-height: 1.3; margin-bottom: 10px; }
  .oracle-greeting span { color: var(--gold); }
  .oracle-quote {
    font-size: 13px; font-style: italic; color: var(--muted);
    line-height: 1.6; border-left: 2px solid var(--gold-dim); padding-left: 12px;
    margin-top: 12px;
  }
  .oracle-principle { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--violet2); letter-spacing: 0.1em; margin-top: 8px; }

  /* ── STATS ROW ── */
  .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: var(--r2); padding: 14px 12px; text-align: center;
    position: relative; overflow: hidden;
  }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.gold::before { background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .stat-card.violet::before { background: linear-gradient(90deg, transparent, var(--violet2), transparent); }
  .stat-card.teal::before { background: linear-gradient(90deg, transparent, var(--success), transparent); }
  .stat-value { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; line-height: 1; }
  .stat-card.gold .stat-value { color: var(--gold); }
  .stat-card.violet .stat-value { color: var(--violet2); }
  .stat-card.teal .stat-value { color: var(--success); }
  .stat-label { font-family: 'DM Mono', monospace; font-size: 8px; color: var(--muted2); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px; }

  /* ── PROGRESS BAR ── */
  .progress-wrap { margin-bottom: 6px; }
  .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .progress-name { font-size: 13px; color: var(--white); font-weight: 400; }
  .progress-pct { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--gold); }
  .progress-bar { height: 3px; background: var(--border2); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--violet), var(--gold)); transition: width 0.8s cubic-bezier(.4,0,.2,1); }

  /* ── PHASE BADGES ── */
  .phase-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.12em;
    padding: 3px 8px; border-radius: 20px; text-transform: uppercase;
  }
  .phase-badge.immediate { background: rgba(200,168,75,0.12); color: var(--gold); border: 1px solid rgba(200,168,75,0.25); }
  .phase-badge.week1 { background: rgba(139,92,200,0.12); color: var(--violet2); border: 1px solid rgba(139,92,200,0.25); }
  .phase-badge.month1 { background: rgba(75,156,138,0.12); color: var(--success); border: 1px solid rgba(75,156,138,0.25); }
  .phase-badge.month23 { background: rgba(245,240,232,0.06); color: var(--muted); border: 1px solid var(--border2); }

  /* ── PURCHASE LIST ── */
  .purchase-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border2);
  }
  .purchase-item:last-child { border-bottom: none; padding-bottom: 0; }
  .purchase-check {
    width: 20px; height: 20px; border-radius: 50%;
    border: 1px solid var(--border); background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; cursor: pointer; margin-top: 2px;
    transition: all 0.2s;
  }
  .purchase-check.done { background: var(--gold); border-color: var(--gold); }
  .purchase-info { flex: 1; }
  .purchase-name { font-size: 14px; color: var(--white); margin-bottom: 3px; }
  .purchase-name.done { color: var(--muted2); text-decoration: line-through; }
  .purchase-why { font-size: 11px; color: var(--muted2); line-height: 1.4; margin-bottom: 5px; }
  .purchase-range { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold-light); }

  /* ── HABIT TRACKER ── */
  .habit-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid var(--border2);
  }
  .habit-row:last-child { border-bottom: none; }
  .habit-icon { font-size: 18px; width: 30px; text-align: center; }
  .habit-name { flex: 1; font-size: 13px; color: var(--white); }
  .habit-streak { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); }
  .habit-dots { display: flex; gap: 3px; }
  .habit-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--border2); cursor: pointer; transition: all 0.15s;
  }
  .habit-dot.done { background: var(--gold); box-shadow: 0 0 6px var(--gold-dim); }

  /* ── INCOME / FINANCE ── */
  .finance-total {
    font-family: 'Cinzel', serif; font-size: 32px; font-weight: 700;
    color: var(--gold); text-align: center; letter-spacing: 0.05em;
    margin: 8px 0;
  }
  .finance-sub { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted2); text-align: center; letter-spacing: 0.15em; margin-bottom: 16px; }

  .income-entry {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--border2);
  }
  .income-entry:last-child { border-bottom: none; }
  .income-source { font-size: 13px; color: var(--white); }
  .income-date { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted2); }
  .income-value { font-family: 'DM Mono', monospace; font-size: 13px; }
  .income-value.positive { color: var(--success); }
  .income-value.negative { color: var(--danger); }

  /* ── DIARY ── */
  .diary-entry {
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--r2); padding: 14px; margin-bottom: 10px;
  }
  .diary-meta { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .diary-date-tag { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--gold); letter-spacing: 0.12em; }
  .diary-mood { font-size: 14px; }
  .diary-text { font-size: 14px; line-height: 1.65; color: var(--muted); font-style: italic; }
  .diary-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .diary-tag {
    font-family: 'DM Mono', monospace; font-size: 8px; letter-spacing: 0.1em;
    color: var(--violet2); background: var(--violet-dim); padding: 2px 8px;
    border-radius: 20px;
  }

  /* ── INPUT FIELDS ── */
  .field-label { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted2); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px; }
  .field-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--r2); padding: 10px 14px;
    color: var(--white); font-size: 14px; font-family: 'Cormorant Garamond', serif;
    outline: none; transition: border-color 0.2s;
  }
  .field-input:focus { border-color: var(--gold-dim); }
  .field-input::placeholder { color: var(--muted2); }
  textarea.field-input { resize: none; min-height: 90px; line-height: 1.6; }
  .field-group { margin-bottom: 14px; }
  .btn {
    width: 100%; padding: 13px; border-radius: var(--r2); border: none;
    font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.2em;
    text-transform: uppercase; cursor: pointer; transition: all 0.2s;
  }
  .btn-gold { background: linear-gradient(135deg, var(--gold), #A8882C); color: var(--void); font-weight: 700; }
  .btn-gold:hover { box-shadow: 0 4px 20px rgba(200,168,75,0.3); transform: translateY(-1px); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--muted); }

  /* ── GOAL ITEM ── */
  .goal-item {
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--r2); padding: 14px; margin-bottom: 8px;
  }
  .goal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .goal-title { font-family: 'Cinzel', serif; font-size: 14px; color: var(--white); }
  .goal-category { font-family: 'DM Mono', monospace; font-size: 8px; color: var(--violet2); letter-spacing: 0.12em; }
  .goal-deadline { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted2); margin-bottom: 8px; }

  /* ── REPORT CHART ── */
  .bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 80px; margin: 12px 0; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bar-fill { width: 100%; border-radius: 3px 3px 0 0; transition: height 0.6s ease; }
  .bar-lbl { font-family: 'DM Mono', monospace; font-size: 8px; color: var(--muted2); }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.82);
    z-index: 100; display: flex; align-items: flex-end;
    backdrop-filter: blur(6px);
  }
  .modal {
    width: 100%; max-width: 480px; margin: 0 auto;
    background: var(--surface); border-radius: 20px 20px 0 0;
    border: 1px solid var(--border2); border-bottom: none;
    padding: 20px 20px 40px; max-height: 85vh; overflow-y: auto;
  }
  .modal-handle { width: 36px; height: 3px; background: var(--border); border-radius: 2px; margin: 0 auto 18px; }
  .modal-title { font-family: 'Cinzel', serif; font-size: 16px; color: var(--white); margin-bottom: 18px; text-align: center; }

  /* ── MISC ── */
  .divider { height: 1px; background: var(--border2); margin: 16px 0; }
  .row { display: flex; gap: 10px; }
  .row > * { flex: 1; }
  .text-center { text-align: center; }
  .mt-8 { margin-top: 8px; }
  .mt-12 { margin-top: 12px; }
  .mb-12 { margin-bottom: 12px; }
  .spark { display: inline-block; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  /* ── KABBALISTIC TREE MINI ── */
  .tree-mini { display: flex; justify-content: center; padding: 10px 0; opacity: 0.7; }

  /* tab animation */
  .tab-content { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }

  /* ── ORACLE SPINNER ── */
  .oracle-loading { display: flex; align-items: center; gap: 8px; color: var(--muted2); font-size: 13px; font-style: italic; }
  .oracle-spin { width: 16px; height: 16px; border: 1px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .mood-row { display: flex; gap: 8px; justify-content: center; margin: 12px 0; }
  .mood-btn { font-size: 22px; background: none; border: 1px solid var(--border2); border-radius: 8px; padding: 6px 10px; cursor: pointer; transition: all 0.15s; }
  .mood-btn.active { border-color: var(--gold); background: rgba(200,168,75,0.08); transform: scale(1.1); }
`;

// ── DATA ─────────────────────────────────────────────────────────

const ORACLE_PHRASES = [
  { quote: "Kether é o ponto de origem — tudo o que você manifesta começa na intenção pura.", principle: "Princípio da Mentalidade · Hermetismo" },
  { quote: "EU SOU aquele que sou. Antes de qualquer conquista, declare sua identidade.", principle: "I AM Presence · Kabbalah" },
  { quote: "Como é em cima, é embaixo. Ordena o espaço externo e o interno se alinha.", principle: "Princípio da Correspondência" },
  { quote: "O ouro não é o destino — é o símbolo da consciência purificada.", principle: "Tradição Alquímica" },
  { quote: "Toda transformação começa com o que você está disposto a soltar.", principle: "Gevurah · Força e Discernimento" },
  { quote: "Chesed é a misericórdia que você oferece a si mesmo ao começar de novo.", principle: "Sefirot · Árvore da Vida" },
  { quote: "A grande obra não é externa. É a alquimia do ser.", principle: "Opus Magnum · Hermetismo" },
  { quote: "Netzach é a vitória — mas a verdadeira vitória é sobre suas próprias limitações.", principle: "Sefirot · Netzach" },
];

const HABITS_DEFAULT = [
  { id: 1, icon: "🧘", name: "Meditação (10-20 min)", streak: 0, days: [false,false,false,false,false,false,false] },
  { id: 2, icon: "📖", name: "Journaling matinal", streak: 0, days: [false,false,false,false,false,false,false] },
  { id: 3, icon: "🚿", name: "Cold shower", streak: 0, days: [false,false,false,false,false,false,false] },
  { id: 4, icon: "💪", name: "Academia / Movimento", streak: 0, days: [false,false,false,false,false,false,false] },
  { id: 5, icon: "📚", name: "Estudo direcionado (1h)", streak: 0, days: [false,false,false,false,false,false,false] },
  { id: 6, icon: "💻", name: "Programar (2h+ Soumente)", streak: 0, days: [false,false,false,false,false,false,false] },
];

const PURCHASES_DEFAULT = [
  // Fase 1 — Imediato
  { id: 1, phase: "immediate", category: "Corpo", name: "3 Camisas lisas premium", why: "Uniforme minimalista — menos decisão mental", min: 120, max: 300, done: false },
  { id: 2, phase: "immediate", category: "Corpo", name: "3 Regatas lisas", why: "Camada base. Define o corpo com elegância.", min: 60, max: 150, done: false },
  { id: 3, phase: "immediate", category: "Corpo", name: "Meias (pack 10)", why: "Detalhe invisível que o Super Eu cuida.", min: 50, max: 120, done: false },
  { id: 4, phase: "immediate", category: "Corpo", name: "Cuecas (pack 7)", why: "Renovação simbólica. Fundação do autocuidado.", min: 70, max: 180, done: false },
  { id: 5, phase: "immediate", category: "Corpo", name: "Hidratante facial + corporal", why: "Pele cuidada = relação saudável com o corpo.", min: 60, max: 180, done: false },
  { id: 6, phase: "immediate", category: "Corpo", name: "Kit higiene premium", why: "Escova elétrica, fio dental, pasta branqueadora.", min: 120, max: 280, done: false },
  { id: 7, phase: "immediate", category: "Corpo", name: "Óleo para locs", why: "Ritual de cuidado com a identidade.", min: 30, max: 80, done: false },
  { id: 8, phase: "immediate", category: "Casa", name: "Espelho grande (banheiro)", why: "Ver a si mesmo com clareza — ritual diário.", min: 80, max: 300, done: false },
  { id: 9, phase: "immediate", category: "Casa", name: "Cama + colchão", why: "Recuperação de qualidade = performance.", min: 600, max: 2000, done: false },
  { id: 10, phase: "immediate", category: "Casa", name: "Mesa de trabalho dedicada", why: "Workspace sagrado. Sem isso não existe foco profundo.", min: 200, max: 600, done: false },
  // Fase 2 — Semana 1
  { id: 11, phase: "week1", category: "Corpo", name: "3 Shorts lisos", why: "Mobilidade + estética. Linho ou tactel premium.", min: 90, max: 210, done: false },
  { id: 12, phase: "week1", category: "Corpo", name: "3 Calças de linho", why: "Material nobre. Sinaliza refinamento sem esforço.", min: 150, max: 360, done: false },
  { id: 13, phase: "week1", category: "Corpo", name: "Máquina de cortar cabelo", why: "Soberania sobre a própria imagem. ROI imediato.", min: 120, max: 300, done: false },
  { id: 14, phase: "week1", category: "Corpo", name: "Suplementos (whey + creatina + Vit D)", why: "Performance biológica intencional.", min: 200, max: 450, done: false },
  { id: 15, phase: "week1", category: "Corpo", name: "Tênis versátil (branco ou preto)", why: "Um par bom vale mais que três mediocres.", min: 250, max: 600, done: false },
  { id: 16, phase: "week1", category: "Casa", name: "Máquina de lavar", why: "Autonomia doméstica. Roupa limpa = clareza mental.", min: 800, max: 1800, done: false },
  { id: 17, phase: "week1", category: "Casa", name: "Armário de roupa", why: "Organização do vestuário = organização da mente.", min: 300, max: 900, done: false },
  { id: 18, phase: "week1", category: "Casa", name: "Cadeira ergonômica", why: "Você passa horas codando. Coluna é seu ativo.", min: 300, max: 800, done: false },
  { id: 19, phase: "week1", category: "Digital", name: "Headset para calls internacionais", why: "Áudio limpo. Clientes internacionais exigem isso.", min: 150, max: 400, done: false },
  // Fase 3 — Mês 1
  { id: 20, phase: "month1", category: "Corpo", name: "Perfume de qualidade", why: "Assinatura olfativa. Presença antes de você falar.", min: 150, max: 400, done: false },
  { id: 21, phase: "month1", category: "Corpo", name: "Relógio minimalista", why: "Âncora de presença e tempo.", min: 200, max: 800, done: false },
  { id: 22, phase: "month1", category: "Corpo", name: "Mochila premium", why: "O Super Eu se move com elegância.", min: 180, max: 500, done: false },
  { id: 23, phase: "month1", category: "Corpo", name: "Cinto de couro", why: "Detalhe que define o nível de qualquer conjunto.", min: 80, max: 200, done: false },
  { id: 24, phase: "month1", category: "Casa", name: "Iluminação quente (lâmpadas)", why: "Luz quente = ambiente de alta vibração.", min: 60, max: 200, done: false },
  { id: 25, phase: "month1", category: "Casa", name: "Difusor de aromas", why: "Ambiente olfativo = estado mental alinhado.", min: 60, max: 200, done: false },
  { id: 26, phase: "month1", category: "Digital", name: "Webcam HD", why: "Vídeos e reuniões — imagem comunica antes das palavras.", min: 150, max: 500, done: false },
  { id: 27, phase: "month1", category: "Digital", name: "Curso/Certificação técnica", why: "Cybersec, AWS ou mobile — abre portas no exterior.", min: 200, max: 800, done: false },
  // Fase 4 — Mês 2-3
  { id: 28, phase: "month23", category: "Digital", name: "Monitor externo", why: "Produtividade. Duas telas = dobro de foco.", min: 700, max: 2000, done: false },
  { id: 29, phase: "month23", category: "Digital", name: "Teclado mecânico", why: "Ergonomia + prazer de codar. Ferramental de artesão.", min: 200, max: 600, done: false },
  { id: 30, phase: "month23", category: "Corpo", name: "Óculos de sol", why: "Proteção + presença visual. Define o rosto.", min: 80, max: 350, done: false },
  { id: 31, phase: "month23", category: "Casa", name: "Frigobar / organização alimentar", why: "Alimentação de qualidade começa pela estrutura.", min: 300, max: 700, done: false },
];

const GOALS_DEFAULT = [
  { id: 1, title: "Lançar Soumente v1 pública", category: "Produto", deadline: "2026-08-31", progress: 42, priority: "high" },
  { id: 2, title: "Fechar 1 cliente internacional SUDO", category: "Negócio", deadline: "2026-07-31", progress: 25, priority: "high" },
  { id: 3, title: "Academia 3x/semana por 30 dias", category: "Corpo", deadline: "2026-07-17", progress: 10, priority: "medium" },
  { id: 4, title: "Fundo de emergência 3 meses", category: "Finanças", deadline: "2026-09-30", progress: 5, priority: "medium" },
];

const FINANCE_DEFAULT = [
  { id: 1, type: "income", source: "SUDO — CURAIV Project", amount: 2800, date: "2026-06-10", note: "Vídeos série completa" },
  { id: 2, type: "expense", source: "Kit higiene + hidratante", amount: -220, date: "2026-06-12", note: "Fase 1" },
  { id: 3, type: "expense", source: "Camisas + regatas (2)", amount: -180, date: "2026-06-14", note: "Uniforme minimalista" },
  { id: 4, type: "income", source: "Upwork — Projeto Fintara", amount: 1200, date: "2026-06-16", note: "Frontend development" },
];

const DIARY_DEFAULT = [
  {
    id: 1, date: "17 Jun 2026", mood: "🔥",
    text: "Hoje é o dia zero do Super Eu manifesto. Li o plano, senti o peso e a clareza ao mesmo tempo. A Fase 1 começa agora — não amanhã. Vou iniciar com a meditação e o journaling ainda hoje.",
    tags: ["#início", "#supereu", "#intenção"]
  }
];

// ── SACRED GEOMETRY SVG ───────────────────────────────────────────
const SacredBG = () => (
  <div className="sacred-bg">
    <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <circle cx="400" cy="400" r="300" fill="none" stroke="#C8A84B" strokeWidth="0.5"/>
      <circle cx="400" cy="400" r="200" fill="none" stroke="#C8A84B" strokeWidth="0.5"/>
      <circle cx="400" cy="400" r="100" fill="none" stroke="#C8A84B" strokeWidth="0.5"/>
      <polygon points="400,100 669,550 131,550" fill="none" stroke="#C8A84B" strokeWidth="0.5"/>
      <polygon points="400,700 131,250 669,250" fill="none" stroke="#6B3FA0" strokeWidth="0.5"/>
      <line x1="400" y1="100" x2="400" y2="700" stroke="#C8A84B" strokeWidth="0.3"/>
      <line x1="100" y1="400" x2="700" y2="400" stroke="#C8A84B" strokeWidth="0.3"/>
      <line x1="188" y1="188" x2="612" y2="612" stroke="#6B3FA0" strokeWidth="0.3"/>
      <line x1="612" y1="188" x2="188" y2="612" stroke="#6B3FA0" strokeWidth="0.3"/>
      <circle cx="400" cy="250" r="8" fill="#C8A84B" opacity="0.6"/>
      <circle cx="400" cy="550" r="8" fill="#C8A84B" opacity="0.6"/>
      <circle cx="250" cy="400" r="8" fill="#6B3FA0" opacity="0.6"/>
      <circle cx="550" cy="400" r="8" fill="#6B3FA0" opacity="0.6"/>
      <circle cx="400" cy="400" r="15" fill="none" stroke="#C8A84B" strokeWidth="1"/>
    </svg>
  </div>
);

// ── UTILS ─────────────────────────────────────────────────────────
const today = () => {
  const d = new Date();
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
};
const fmtBRL = (n) => `R$ ${Math.abs(n).toLocaleString("pt-BR")}`;
const phaseLabel = { immediate: "● Imediato", week1: "● Semana 1", month1: "● Mês 1", month23: "● Mês 2-3" };

// ── COMPONENT: ORACLE CARD ────────────────────────────────────────
function OracleCard({ onRefresh }) {
  const [phrase, setPhrase] = useState(ORACLE_PHRASES[0]);
  const [loading, setLoading] = useState(false);
  const [aiQuote, setAiQuote] = useState(null);

  const fetchAI = async () => {
    setLoading(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Você é um oráculo esotérico que une Kabbalah, Hermetismo e Alquimia. Gere UMA frase meditativa poderosa (máx 2 linhas) para hoje, em português. Responda APENAS com JSON puro (sem markdown): {"quote":"...", "principle":"..."}. O principle deve ser algo como "Princípio X · Kabbalah" ou "Sefirot · Árvore da Vida" etc.`
          }]
        })
      });
      const d = await r.json();
      const txt = d.content?.map(c => c.text || "").join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      setAiQuote(parsed);
    } catch {
      const idx = Math.floor(Math.random() * ORACLE_PHRASES.length);
      setPhrase(ORACLE_PHRASES[idx]);
    }
    setLoading(false);
  };

  const displayed = aiQuote || phrase;

  return (
    <div className="oracle-card" onClick={fetchAI} style={{ cursor: "pointer" }}>
      <div className="oracle-date">{today()}</div>
      <div className="oracle-greeting">EU SOU o <span>Super Eu</span> manifesto.</div>
      {loading
        ? <div className="oracle-loading" style={{marginTop:12}}><div className="oracle-spin"/><span>O oráculo contempla...</span></div>
        : <>
            <div className="oracle-quote">"{displayed.quote}"</div>
            <div className="oracle-principle">✦ {displayed.principle}</div>
          </>
      }
      <div style={{marginTop:10, fontSize:9, color:"var(--muted2)", fontFamily:"'DM Mono',monospace"}}>toque para nova mensagem</div>
    </div>
  );
}

// ── COMPONENT: HABIT TRACKER TAB ─────────────────────────────────
function HabitsTab({ habits, setHabits }) {
  const toggleDay = (habitId, dayIdx) => {
    setHabits(h => h.map(hab => {
      if (hab.id !== habitId) return hab;
      const days = [...hab.days];
      days[dayIdx] = !days[dayIdx];
      const streak = days.filter(Boolean).length;
      return { ...hab, days, streak };
    }));
  };
  const dayLabels = ["D","S","T","Q","Q","S","S"];
  const totalDone = habits.reduce((a,h) => a + h.days.filter(Boolean).length, 0);
  const totalPossible = habits.length * 7;
  const pct = Math.round((totalDone / totalPossible) * 100);

  return (
    <div className="tab-content">
      <div className="stats-row mb-12">
        <div className="stat-card gold">
          <div className="stat-value">{pct}%</div>
          <div className="stat-label">Consistência</div>
        </div>
        <div className="stat-card violet">
          <div className="stat-value">{habits.filter(h => h.streak >= 5).length}</div>
          <div className="stat-label">Hábitos sólidos</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-value">{totalDone}</div>
          <div className="stat-label">Check-ins semana</div>
        </div>
      </div>

      <div className="section-label">Rituais da Semana</div>
      <div className="card">
        <div className="card-body">
          {/* Day header */}
          <div style={{display:"flex", gap:10, marginBottom:10, paddingLeft:52}}>
            {dayLabels.map((l,i) => (
              <div key={i} style={{flex:1, textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:9, color:"var(--muted2)"}}>{l}</div>
            ))}
          </div>
          {habits.map(h => (
            <div className="habit-row" key={h.id}>
              <div className="habit-icon">{h.icon}</div>
              <div className="habit-name" style={{fontSize:12}}>{h.name}</div>
              <div className="habit-dots">
                {h.days.map((done, i) => (
                  <div key={i} className={`habit-dot${done ? " done" : ""}`} onClick={() => toggleDay(h.id, i)}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label mt-12">Princípios Ativos</div>
      <div className="card">
        <div className="card-body">
          {[
            "Hábitos > Compras. Consistência supera qualquer item.",
            "O corpo é o primeiro templo — cuide do que te carrega.",
            "A frequência muda quando o comportamento muda."
          ].map((p, i) => (
            <div key={i} style={{padding:"10px 0", borderBottom: i<2 ? "1px solid var(--border2)" : "none", fontSize:13, fontStyle:"italic", color:"var(--muted)", lineHeight:1.6}}>
              <span style={{color:"var(--gold)", marginRight:8}}>✦</span>{p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT: PURCHASES TAB ──────────────────────────────────────
function PurchasesTab({ purchases, setPurchases }) {
  const [activePhase, setActivePhase] = useState("all");
  const phases = ["all","immediate","week1","month1","month23"];
  const phaseColor = { immediate:"gold", week1:"violet", month1:"teal", month23:"month23" };

  const toggle = (id) => setPurchases(p => p.map(x => x.id===id ? {...x, done:!x.done} : x));

  const filtered = activePhase === "all" ? purchases : purchases.filter(p => p.phase === activePhase);
  const doneCount = purchases.filter(p => p.done).length;
  const totalMin = purchases.filter(p=>!p.done).reduce((a,p) => a+p.min, 0);

  return (
    <div className="tab-content">
      <div className="stats-row mb-12">
        <div className="stat-card gold">
          <div className="stat-value">{doneCount}</div>
          <div className="stat-label">Conquistados</div>
        </div>
        <div className="stat-card violet">
          <div className="stat-value">{purchases.length - doneCount}</div>
          <div className="stat-label">Pendentes</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-value">{Math.round((doneCount/purchases.length)*100)}%</div>
          <div className="stat-label">Progresso</div>
        </div>
      </div>

      {/* Progress */}
      <div className="card mb-12">
        <div className="card-body">
          <div className="progress-wrap">
            <div className="progress-header">
              <span className="progress-name">Plano de Aquisição</span>
              <span className="progress-pct">{Math.round((doneCount/purchases.length)*100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width:`${(doneCount/purchases.length)*100}%`}}/>
            </div>
          </div>
          <div style={{fontSize:11, color:"var(--muted2)", marginTop:8, fontFamily:"'DM Mono',monospace"}}>
            Investimento restante mín: <span style={{color:"var(--gold)"}}>{fmtBRL(totalMin)}</span>
          </div>
        </div>
      </div>

      {/* Phase filter */}
      <div style={{display:"flex", gap:6, marginBottom:12, overflowX:"auto", paddingBottom:4}}>
        {phases.map(p => (
          <button key={p} onClick={() => setActivePhase(p)}
            style={{
              flexShrink:0, padding:"5px 12px", borderRadius:20,
              border: `1px solid ${activePhase===p ? "var(--gold)" : "var(--border2)"}`,
              background: activePhase===p ? "rgba(200,168,75,0.1)" : "transparent",
              color: activePhase===p ? "var(--gold)" : "var(--muted2)",
              fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", cursor:"pointer"
            }}>
            {p === "all" ? "TODOS" : phaseLabel[p].replace("● ","")}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          {filtered.map(item => (
            <div className="purchase-item" key={item.id}>
              <div className={`purchase-check${item.done ? " done" : ""}`} onClick={() => toggle(item.id)}>
                {item.done && <span style={{color:"var(--void)", fontSize:11}}>✓</span>}
              </div>
              <div className="purchase-info">
                <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:4}}>
                  <div className={`purchase-name${item.done ? " done" : ""}`}>{item.name}</div>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <span className={`phase-badge ${item.phase}`}>{phaseLabel[item.phase]}</span>
                  <span className="purchase-range">{fmtBRL(item.min)} – {fmtBRL(item.max)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENT: GOALS TAB ──────────────────────────────────────────
function GoalsTab({ goals, setGoals }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:"", category:"Produto", deadline:"", progress:0 });
  const [aiInsight, setAiInsight] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const addGoal = () => {
    if (!form.title) return;
    setGoals(g => [...g, { id: Date.now(), ...form, priority:"medium" }]);
    setForm({ title:"", category:"Produto", deadline:"", progress:0 });
    setShowAdd(false);
  };

  const updateProgress = (id, v) => setGoals(g => g.map(x => x.id===id ? {...x, progress: Math.min(100,Math.max(0,v))} : x));

  const getAIInsight = async (goal) => {
    setLoadingAI(true);
    setAiInsight("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Você é um mentor esotérico e estratégico de alta performance. O objetivo é: "${goal.title}" (${goal.progress}% concluído, prazo: ${goal.deadline}). Dê 2-3 próximas ações concretas + uma frase meditativa relacionada à Kabbalah ou Hermetismo. Seja direto e poderoso. Máx 120 palavras. Em português.`
          }]
        })
      });
      const d = await r.json();
      setAiInsight(d.content?.map(c=>c.text||"").join("") || "");
    } catch { setAiInsight("Consulte sua intuição — o próximo passo já é conhecido."); }
    setLoadingAI(false);
  };

  const catColor = { Produto:"var(--gold)", Negócio:"var(--violet2)", Corpo:"var(--success)", Finanças:"#C84B9C" };

  return (
    <div className="tab-content">
      <div className="stats-row mb-12">
        <div className="stat-card gold">
          <div className="stat-value">{goals.length}</div>
          <div className="stat-label">Objetivos</div>
        </div>
        <div className="stat-card violet">
          <div className="stat-value">{goals.filter(g=>g.progress>=100).length}</div>
          <div className="stat-label">Concluídos</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-value">{Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length)}%</div>
          <div className="stat-label">Média</div>
        </div>
      </div>

      {goals.map(g => (
        <div className="goal-item" key={g.id}>
          <div className="goal-header">
            <div>
              <div className="goal-title">{g.title}</div>
              <div className="goal-category" style={{color: catColor[g.category] || "var(--violet2)"}}>
                ✦ {g.category}
              </div>
            </div>
            <button onClick={() => getAIInsight(g)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"4px 10px",color:"var(--gold)",cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace"}}>AI ✦</button>
          </div>
          {g.deadline && <div className="goal-deadline">⟶ Prazo: {g.deadline}</div>}
          <div className="progress-wrap">
            <div className="progress-header">
              <span style={{fontSize:11,color:"var(--muted2)"}}>Progresso</span>
              <span className="progress-pct">{g.progress}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${g.progress}%`}}/></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button onClick={()=>updateProgress(g.id,g.progress-10)} style={{flex:1,padding:"5px",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:6,color:"var(--muted2)",cursor:"pointer",fontSize:13}}>−</button>
            <button onClick={()=>updateProgress(g.id,g.progress+10)} style={{flex:1,padding:"5px",background:"var(--surface2)",border:"1px solid var(--border2)",borderRadius:6,color:"var(--gold)",cursor:"pointer",fontSize:13}}>+</button>
          </div>
        </div>
      ))}

      {aiInsight && (
        <div className="card mt-12" style={{borderColor:"var(--gold-dim)"}}>
          <div className="card-body">
            <div className="section-label">Guia do Oráculo</div>
            {loadingAI
              ? <div className="oracle-loading"><div className="oracle-spin"/>Contemplando...</div>
              : <div style={{fontSize:13,lineHeight:1.7,color:"var(--muted)",fontStyle:"italic"}}>{aiInsight}</div>
            }
          </div>
        </div>
      )}

      <button className="btn btn-gold mt-12" onClick={() => setShowAdd(true)}>+ Novo Objetivo</button>

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-title">Novo Objetivo</div>
            <div className="field-group">
              <div className="field-label">Título</div>
              <input className="field-input" placeholder="O que você vai manifestar?" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
            </div>
            <div className="field-group">
              <div className="field-label">Categoria</div>
              <select className="field-input" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {["Produto","Negócio","Corpo","Finanças","Espiritual","Relacionamentos"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field-group">
              <div className="field-label">Prazo</div>
              <input className="field-input" type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/>
            </div>
            <div className="row">
              <button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancelar</button>
              <button className="btn btn-gold" onClick={addGoal}>Manifestar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── COMPONENT: FINANCE TAB ────────────────────────────────────────
function FinanceTab({ entries, setEntries }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type:"income", source:"", amount:"", date:"", note:"" });

  const total = entries.reduce((a,e) => a + (e.type==="income" ? e.amount : e.amount), 0);
  const income = entries.filter(e=>e.type==="income").reduce((a,e)=>a+e.amount,0);
  const expense = entries.filter(e=>e.type==="expense").reduce((a,e)=>a+Math.abs(e.amount),0);

  // Bar chart data (last 4 weeks mock)
  const barData = [
    { lbl:"S1", income:1200, expense:400 },
    { lbl:"S2", income:800, expense:220 },
    { lbl:"S3", income:2800, expense:180 },
    { lbl:"S4", income:1200, expense:0 },
  ];
  const maxBar = Math.max(...barData.map(d=>d.income));

  const addEntry = () => {
    if (!form.source || !form.amount) return;
    const amt = parseFloat(form.amount) * (form.type==="expense" ? -1 : 1);
    setEntries(e => [...e, { id: Date.now(), type:form.type, source:form.source, amount:amt, date:form.date||today(), note:form.note }]);
    setForm({ type:"income", source:"", amount:"", date:"", note:"" });
    setShowAdd(false);
  };

  return (
    <div className="tab-content">
      {/* Total */}
      <div className="oracle-card mb-12">
        <div className="oracle-date">SALDO ATUAL</div>
        <div className="finance-total">{fmtBRL(total)}</div>
        <div className="finance-sub">FREQUÊNCIA FINANCEIRA</div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div style={{textAlign:"center",flex:1}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--success)"}}>{fmtBRL(income)}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"var(--muted2)",letterSpacing:"0.12em"}}>ENTRADAS</div>
          </div>
          <div style={{width:1,background:"var(--border2)"}}/>
          <div style={{textAlign:"center",flex:1}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--danger)"}}>{fmtBRL(expense)}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"var(--muted2)",letterSpacing:"0.12em"}}>SAÍDAS</div>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card mb-12">
        <div className="card-body">
          <div className="section-label">Fluxo Semanal</div>
          <div className="bar-chart">
            {barData.map((d,i) => (
              <div className="bar-col" key={i}>
                <div className="bar-fill" style={{height:`${(d.income/maxBar)*70}px`, background:"linear-gradient(var(--violet2),var(--gold))"}}/>
                <div className="bar-lbl">{d.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="section-label">Movimentações</div>
      <div className="card">
        <div className="card-body">
          {entries.slice().reverse().map(e => (
            <div className="income-entry" key={e.id}>
              <div>
                <div className="income-source">{e.source}</div>
                {e.note && <div style={{fontSize:10,color:"var(--muted2)",marginTop:2}}>{e.note}</div>}
                <div className="income-date">{e.date}</div>
              </div>
              <div className={`income-value ${e.amount>=0?"positive":"negative"}`}>
                {e.amount>=0?"+":""}{fmtBRL(e.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-gold mt-12" onClick={()=>setShowAdd(true)}>+ Registrar</button>

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-title">Nova Movimentação</div>
            <div className="field-group">
              <div className="field-label">Tipo</div>
              <div style={{display:"flex",gap:8}}>
                {["income","expense"].map(t=>(
                  <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{
                    flex:1,padding:"8px",borderRadius:8,cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:"0.1em",
                    border:`1px solid ${form.type===t?"var(--gold)":"var(--border2)"}`,
                    background: form.type===t?"rgba(200,168,75,0.1)":"var(--surface2)",
                    color: form.type===t?"var(--gold)":"var(--muted2)"
                  }}>{t==="income"?"✦ ENTRADA":"▼ SAÍDA"}</button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <div className="field-label">Fonte / Descrição</div>
              <input className="field-input" placeholder="Ex: SUDO — CURAIV Project" value={form.source} onChange={e=>setForm(f=>({...f,source:e.target.value}))}/>
            </div>
            <div className="field-group">
              <div className="field-label">Valor (R$)</div>
              <input className="field-input" type="number" placeholder="0,00" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
            </div>
            <div className="field-group">
              <div className="field-label">Nota (opcional)</div>
              <input className="field-input" placeholder="..." value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
            </div>
            <div className="row">
              <button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancelar</button>
              <button className="btn btn-gold" onClick={addEntry}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── COMPONENT: DIARY TAB ─────────────────────────────────────────
function DiaryTab({ entries, setEntries }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ text:"", mood:"🔥", tags:"" });
  const [aiReflection, setAiReflection] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const MOODS = ["🔥","⚡","🌊","🌑","✨","🌿","💎","🌙"];

  const addEntry = () => {
    if (!form.text) return;
    const tags = form.tags.split(",").map(t=>t.trim()).filter(Boolean).map(t=>t.startsWith("#")?t:`#${t}`);
    setEntries(e => [{ id:Date.now(), date: today(), mood:form.mood, text:form.text, tags }, ...e]);
    setForm({ text:"", mood:"🔥", tags:"" });
    setShowAdd(false);
  };

  const getAIReflection = async (entry) => {
    setLoadingAI(true);
    setAiReflection("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Você é um guia espiritual e mentor de alta performance. Leia este diário pessoal e ofereça uma reflexão profunda (máx 3 parágrafos curtos), conectando a experiência descrita com um princípio da Kabbalah, Hermetismo ou Alquimia. Termine com uma pergunta transformadora. Em português, tom elevado mas humano.\n\nDiário: "${entry.text}"`
          }]
        })
      });
      const d = await r.json();
      setAiReflection(d.content?.map(c=>c.text||"").join("") || "");
    } catch { setAiReflection("Sua escrita já é a alquimia. Releia com outros olhos."); }
    setLoadingAI(false);
  };

  return (
    <div className="tab-content">
      <div className="oracle-card mb-12" style={{padding:"16px 18px"}}>
        <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"var(--muted2)",letterSpacing:"0.15em",marginBottom:4}}>SEGUNDA MENTE</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"var(--white)",marginBottom:6}}>Tua jornada é teu legado.</div>
        <div style={{fontSize:12,fontStyle:"italic",color:"var(--muted)",lineHeight:1.6}}>
          Cada entrada aqui é um arquivo da alquimia pessoal em curso.
        </div>
      </div>

      {entries.map(e => (
        <div className="diary-entry" key={e.id}>
          <div className="diary-meta">
            <div className="diary-date-tag">{e.date}</div>
            <div className="diary-mood">{e.mood}</div>
          </div>
          <div className="diary-text">{e.text}</div>
          {e.tags?.length > 0 && (
            <div className="diary-tags">{e.tags.map((t,i)=><span className="diary-tag" key={i}>{t}</span>)}</div>
          )}
          <button onClick={() => getAIReflection(e)} style={{
            marginTop:10, background:"none", border:"1px solid var(--border2)", borderRadius:6,
            padding:"5px 12px", color:"var(--violet2)", cursor:"pointer",
            fontSize:10, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em"
          }}>✦ Reflexão do Oráculo</button>
        </div>
      ))}

      {aiReflection && (
        <div className="card" style={{borderColor:"var(--violet-dim)"}}>
          <div className="card-body">
            <div className="section-label" style={{color:"var(--violet2)"}}>Reflexão Oracular</div>
            {loadingAI
              ? <div className="oracle-loading"><div className="oracle-spin"/>Contemplando...</div>
              : <div style={{fontSize:13,lineHeight:1.75,color:"var(--muted)",fontStyle:"italic"}}>{aiReflection}</div>
            }
          </div>
        </div>
      )}

      <button className="btn btn-gold mt-12" onClick={()=>setShowAdd(true)}>+ Nova Entrada</button>

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-handle"/>
            <div className="modal-title">Escrever no Diário</div>
            <div className="field-group">
              <div className="field-label">Estado de hoje</div>
              <div className="mood-row">
                {MOODS.map(m=>(
                  <button key={m} className={`mood-btn${form.mood===m?" active":""}`} onClick={()=>setForm(f=>({...f,mood:m}))}>{m}</button>
                ))}
              </div>
            </div>
            <div className="field-group">
              <div className="field-label">Reflexão</div>
              <textarea className="field-input" placeholder="O que o dia revelou? O que você percebeu? Que movimento interno ocorreu?" value={form.text} onChange={e=>setForm(f=>({...f,text:e.target.value}))}/>
            </div>
            <div className="field-group">
              <div className="field-label">Tags (separadas por vírgula)</div>
              <input className="field-input" placeholder="supereu, intenção, foco" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))}/>
            </div>
            <div className="row">
              <button className="btn btn-outline" onClick={()=>setShowAdd(false)}>Cancelar</button>
              <button className="btn btn-gold" onClick={addEntry}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── COMPONENT: HOME TAB ───────────────────────────────────────────
function HomeTab({ habits, goals, purchases, finance }) {
  const habitsToday = habits.reduce((a,h) => a + (h.days[new Date().getDay()] ? 1 : 0), 0);
  const goalAvg = goals.length ? Math.round(goals.reduce((a,g)=>a+g.progress,0)/goals.length) : 0;
  const purchasesDone = purchases.filter(p=>p.done).length;
  const balance = finance.reduce((a,e)=>a+e.amount,0);

  return (
    <div className="tab-content">
      <OracleCard/>

      {/* Stats */}
      <div className="stats-row mb-12">
        <div className="stat-card gold">
          <div className="stat-value">{habitsToday}/{habits.length}</div>
          <div className="stat-label">Rituais hoje</div>
        </div>
        <div className="stat-card violet">
          <div className="stat-value">{goalAvg}%</div>
          <div className="stat-label">Objetivos</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-value">{purchasesDone}</div>
          <div className="stat-label">Fases done</div>
        </div>
      </div>

      {/* Plan Progress */}
      <div className="section-label">Plano Super Eu — 4 Fases</div>
      <div className="card mb-12">
        <div className="card-body">
          {[
            { label:"Fase 1 · Fundação Imediata", pct: Math.round((purchases.filter(p=>p.phase==="immediate"&&p.done).length / purchases.filter(p=>p.phase==="immediate").length)*100) || 0 },
            { label:"Fase 2 · Estrutura", pct: Math.round((purchases.filter(p=>p.phase==="week1"&&p.done).length / purchases.filter(p=>p.phase==="week1").length)*100) || 0 },
            { label:"Fase 3 · Refinamento", pct: Math.round((purchases.filter(p=>p.phase==="month1"&&p.done).length / purchases.filter(p=>p.phase==="month1").length)*100) || 0 },
            { label:"Fase 4 · Expansão", pct: Math.round((purchases.filter(p=>p.phase==="month23"&&p.done).length / purchases.filter(p=>p.phase==="month23").length)*100) || 0 },
          ].map((f,i) => (
            <div className="progress-wrap" key={i} style={{marginBottom:i<3?12:0}}>
              <div className="progress-header">
                <span className="progress-name">{f.label}</span>
                <span className="progress-pct">{f.pct}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${f.pct}%`}}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* Finance snapshot */}
      <div className="section-label">Frequência Financeira</div>
      <div className="card mb-12">
        <div className="card-body" style={{textAlign:"center"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted2)",letterSpacing:"0.15em",marginBottom:4}}>SALDO ATUAL</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:28,color:"var(--gold)"}}>{fmtBRL(balance)}</div>
        </div>
      </div>

      {/* Principles */}
      <div className="section-label">Princípios do Super Eu</div>
      <div className="card">
        <div className="card-body">
          {[
            { n:"01", t:"Compre com intenção", d:"Cada compra é um voto na versão que você quer ser." },
            { n:"02", t:"O corpo é o primeiro templo", d:"Cuide do que te carrega antes de qualquer ambição." },
            { n:"03", t:"Hábitos > Compras", d:"Consistência supera qualquer aquisição material." },
            { n:"07", t:"A frequência muda com o comportamento", d:"Não espere sentir-se pronto. Comece agora." },
          ].map((p,i) => (
            <div key={i} style={{padding:"10px 0", borderBottom: i<3?"1px solid var(--border2)":"none", display:"flex", gap:12, alignItems:"flex-start"}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"var(--gold)",opacity:0.5,minWidth:20}}>{p.n}</div>
              <div>
                <div style={{fontSize:13,color:"var(--white)",marginBottom:3}}>{p.t}</div>
                <div style={{fontSize:11,fontStyle:"italic",color:"var(--muted2)",lineHeight:1.5}}>{p.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{textAlign:"center",marginTop:20,fontFamily:"'Cinzel',serif",fontSize:10,color:"var(--muted2)",letterSpacing:"0.15em"}}>
        SUDO · LUXURY DIGITAL SOLUTIONS · {new Date().getFullYear()}
      </div>
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [habits, setHabits] = useState(HABITS_DEFAULT);
  const [goals, setGoals] = useState(GOALS_DEFAULT);
  const [purchases, setPurchases] = useState(PURCHASES_DEFAULT);
  const [finance, setFinance] = useState(FINANCE_DEFAULT);
  const [diary, setDiary] = useState(DIARY_DEFAULT);

  const NAV = [
    { id:"home",     icon:"◈", label:"Home" },
    { id:"habits",   icon:"◉", label:"Rituais" },
    { id:"goals",    icon:"△", label:"Objetivos" },
    { id:"purchases",icon:"◇", label:"Plano" },
    { id:"finance",  icon:"$", label:"Finanças" },
    { id:"diary",    icon:"✦", label:"Diário" },
  ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <SacredBG/>

        {/* Header */}
        <div className="header">
          <div className="header-brand">
            <div className="header-title">Super Eu</div>
            <div className="header-sub">PLANO DE TRANSFORMAÇÃO INTEGRAL</div>
          </div>
          <div className="header-orb">◈</div>
        </div>

        {/* Content */}
        <div className="main">
          {tab === "home"      && <HomeTab habits={habits} goals={goals} purchases={purchases} finance={finance}/>}
          {tab === "habits"    && <HabitsTab habits={habits} setHabits={setHabits}/>}
          {tab === "goals"     && <GoalsTab goals={goals} setGoals={setGoals}/>}
          {tab === "purchases" && <PurchasesTab purchases={purchases} setPurchases={setPurchases}/>}
          {tab === "finance"   && <FinanceTab entries={finance} setEntries={setFinance}/>}
          {tab === "diary"     && <DiaryTab entries={diary} setEntries={setDiary}/>}
        </div>

        {/* Nav */}
        <nav className="nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-item${tab===n.id?" active":""}`} onClick={()=>setTab(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
