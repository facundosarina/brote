'use strict';

/* =========================================================
   Brote — seguimiento de plantas
   Todo se guarda en el teléfono (IndexedDB). Sin servidor.
   ========================================================= */

const APP_VERSION = '1.0.0';
const DATA_VERSION = 1;

/* ---------- Íconos ---------- */
const svg = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const I = {
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  back: svg('<path d="M15 18l-6-6 6-6"/>'),
  more: svg('<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>'),
  drop: svg('<path d="M12 3.5c3.6 4.3 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.4-6.3 6-10.6z"/>'),
  sprout: svg('<path d="M12 21v-8"/><path d="M12 13c0-4 3-7 8-7 0 4.5-3 7-8 7z"/><path d="M12 15c0-3.3-2.5-5.8-7-5.8 0 3.7 2.6 5.8 7 5.8z"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>'),
  fert: svg('<path d="M7 7h10l-1 13H8L7 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/><path d="M10 13c1.3-1.6 2.7-1.6 4 0"/>'),
  pot: svg('<path d="M5 10h14l-1.6 10H6.6L5 10z"/><path d="M4 10h16"/><path d="M12 10V6m0 0c0-1.7 1.3-3 3-3 0 1.7-1.3 3-3 3zm0 0c0-1.7-1.3-3-3-3 0 1.7 1.3 3 3 3z"/>'),
  scissors: svg('<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5L20 18M8 16.5L20 6"/>'),
  note: svg('<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h5"/>'),
  camera: svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  calendar: svg('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/><path d="M12 13.5v3h2.5"/>'),
  compare: svg('<rect x="3" y="5" width="8" height="14" rx="1.5"/><rect x="13" y="5" width="8" height="14" rx="1.5"/><path d="M12 3v18"/>'),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  star: svg('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="currentColor" stroke="none"/>'),
  starLine: svg('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  edit: svg('<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>'),
  download: svg('<path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 20h14"/>'),
  upload: svg('<path d="M12 20V9m0 0l-4.5 4.5M12 9l4.5 4.5M5 4h14"/>'),
  share: svg('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/>'),
  homeAdd: svg('<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>'),
  clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  pin: svg('<path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
  info: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>'),
};

/* ---------- Utilidades ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const app = $('#app');

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10));
const nowISO = () => new Date().toISOString();

const pad = (n) => String(n).padStart(2, '0');
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseISO(s) {
  const [y, m, d] = s.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}
function addDays(s, n) {
  const t = new Date(parseISO(s) + n * 864e5);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}
const diffDays = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 864e5); // b − a
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fmtDate(s, forceYear = false) {
  if (!s) return '—';
  const [y, m, d] = s.split('-').map(Number);
  const showYear = forceYear || y !== new Date().getFullYear();
  return `${d} ${MESES[m - 1]}${showYear ? ' ' + y : ''}`;
}
function ago(s) {
  if (!s) return 'sin registro';
  const n = diffDays(s, todayISO());
  if (n === 0) return 'hoy';
  if (n === 1) return 'ayer';
  if (n < 0) return fmtDate(s);
  return `hace ${n} días`;
}
function since(s) {
  if (!s) return '';
  const days = diffDays(s, todayISO());
  if (days < 0) return '';
  if (days < 31) return days === 1 ? '1 día' : `${days} días`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return months === 1 ? '1 mes' : `${months} meses`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return `${years} ${years === 1 ? 'año' : 'años'}${rest ? ` y ${rest} ${rest === 1 ? 'mes' : 'meses'}` : ''}`;
}

const LIGHTS = {
  sol: 'Sol directo',
  brillante: 'Luz brillante indirecta',
  media: 'Luz media',
  poca: 'Poca luz',
};
const EVENT_TYPES = {
  water: { label: 'Riego', icon: 'drop', cls: 'water' },
  fertilize: { label: 'Abono', icon: 'fert', cls: 'fertilize' },
  repot: { label: 'Trasplante', icon: 'pot', cls: 'other' },
  prune: { label: 'Poda', icon: 'scissors', cls: 'other' },
  note: { label: 'Nota', icon: 'note', cls: 'other' },
};

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

/* Ajustes simples (preferencias de esta persona en este teléfono) */
const Prefs = {
  get(key, def) {
    try {
      const v = localStorage.getItem('brote:' + key);
      return v === null ? def : JSON.parse(v);
    } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('brote:' + key, JSON.stringify(val)); } catch { /* sin almacenamiento */ }
  },
};

/* URLs de imágenes en memoria: se liberan al cambiar de pantalla */
let liveURLs = [];
function objURL(blob) {
  const u = URL.createObjectURL(blob);
  liveURLs.push(u);
  return u;
}
function revokeURLs() {
  liveURLs.forEach((u) => URL.revokeObjectURL(u));
  liveURLs = [];
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

/* =========================================================
   Base de datos (IndexedDB)
   ========================================================= */
let _db = null;
function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const r = indexedDB.open('brote', 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      if (!d.objectStoreNames.contains('plants')) d.createObjectStore('plants', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('photos')) d.createObjectStore('photos', { keyPath: 'id' }).createIndex('plantId', 'plantId');
      if (!d.objectStoreNames.contains('events')) d.createObjectStore('events', { keyPath: 'id' }).createIndex('plantId', 'plantId');
    };
    r.onsuccess = () => {
      _db = r.result;
      _db.onversionchange = () => { _db.close(); _db = null; };
      resolve(_db);
    };
    r.onerror = () => reject(r.error);
    r.onblocked = () => reject(new Error('La base de datos está bloqueada. Cerrá otras pestañas de Brote.'));
  });
}

/* Ejecuta todo dentro de una sola transacción (más seguro en Safari) */
async function tx(stores, mode, fn) {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const t = d.transaction(stores, mode);
    let result;
    const set = (v) => { result = v; };
    fn(t, set);
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error('Operación cancelada'));
  });
}
const DB = {
  all: (name) => tx(name, 'readonly', (t, set) => { const r = t.objectStore(name).getAll(); r.onsuccess = () => set(r.result); }),
  get: (name, id) => tx(name, 'readonly', (t, set) => { const r = t.objectStore(name).get(id); r.onsuccess = () => set(r.result); }),
  put: (name, obj) => tx(name, 'readwrite', (t) => { t.objectStore(name).put(obj); }).then(() => obj),
  putMany: (name, list) => tx(name, 'readwrite', (t) => { const s = t.objectStore(name); list.forEach((o) => s.put(o)); }),
  del: (name, id) => tx(name, 'readwrite', (t) => { t.objectStore(name).delete(id); }),
  byPlant: (name, plantId) => tx(name, 'readonly', (t, set) => { const r = t.objectStore(name).index('plantId').getAll(plantId); r.onsuccess = () => set(r.result); }),
  getMany: (name, ids) => tx(name, 'readonly', (t, set) => {
    const s = t.objectStore(name);
    const out = {};
    ids.forEach((id) => { const r = s.get(id); r.onsuccess = () => { if (r.result) out[id] = r.result; }; });
    set(out);
  }),
  deletePlant: (plantId) => tx(['plants', 'photos', 'events'], 'readwrite', (t) => {
    t.objectStore('plants').delete(plantId);
    ['photos', 'events'].forEach((name) => {
      const r = t.objectStore(name).index('plantId').openKeyCursor(IDBKeyRange.only(plantId));
      r.onsuccess = () => {
        const c = r.result;
        if (c) { t.objectStore(name).delete(c.primaryKey); c.continue(); }
      };
    });
  }),
  clearAll: () => tx(['plants', 'photos', 'events'], 'readwrite', (t) => {
    ['plants', 'photos', 'events'].forEach((n) => t.objectStore(n).clear());
  }),
};

/* =========================================================
   Lógica de cuidados
   ========================================================= */
function lastOf(plant, type, events) {
  let best = type === 'water' ? plant.waterBase : plant.fertBase;
  for (const e of events) {
    if (e.plantId === plant.id && e.type === type && (!best || e.date > best)) best = e.date;
  }
  return best || null;
}
function careStatus(plant, type, events) {
  const every = type === 'water' ? plant.waterEvery : plant.fertEvery;
  if (!every) return null;
  const last = lastOf(plant, type, events);
  const today = todayISO();
  const next = last ? addDays(last, every) : today;
  return { every, last, next, days: diffDays(today, next) };
}
function statusPill(st, type) {
  if (!st) return '';
  const w = type === 'water';
  if (st.days < 0) return `<span class="pill late">${w ? I.drop : I.fert} ${w ? 'Riego' : 'Abono'} atrasado ${-st.days} d</span>`;
  if (st.days === 0) return `<span class="pill ${w ? 'water' : 'sun'}">${w ? I.drop : I.fert} ${w ? 'Regar hoy' : 'Abonar hoy'}</span>`;
  if (!w) return '';
  return `<span class="pill ok">${I.drop} Riego ${st.days === 1 ? 'mañana' : `en ${st.days} d`}</span>`;
}
function nextText(st) {
  if (st.days < 0) return `Atrasado ${-st.days} ${-st.days === 1 ? 'día' : 'días'}`;
  if (st.days === 0) return 'Hoy';
  if (st.days === 1) return 'Mañana';
  return `En ${st.days} días`;
}
async function logCare(plantId, type, date = todayISO(), note = '') {
  const ev = { id: uid(), plantId, type, date, note: note.trim(), createdAt: nowISO(), v: DATA_VERSION };
  await DB.put('events', ev);
  const p = await DB.get('plants', plantId);
  if (p) { p.updatedAt = nowISO(); await DB.put('plants', p); }
  return ev;
}

/* =========================================================
   Fotos
   ========================================================= */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen.')); };
    img.src = url;
  });
}
function resizeTo(img, max, quality) {
  const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d').drawImage(img, 0, 0, w, h);
  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo procesar la imagen.'))), 'image/jpeg', quality));
}
async function savePhoto(plantId, file, date = todayISO(), note = '') {
  const img = await loadImage(file);
  const blob = await resizeTo(img, 1600, 0.82);
  const thumb = await resizeTo(img, 480, 0.78);
  const photo = { id: uid(), plantId, date, note: note.trim(), blob, thumb, createdAt: nowISO(), v: DATA_VERSION };
  await DB.put('photos', photo);
  return photo;
}
const sortPhotos = (list) => list.sort((a, b) => (a.date === b.date ? a.createdAt.localeCompare(b.createdAt) : a.date.localeCompare(b.date)));

function coverHTML(photo, cls = 'cover') {
  if (photo && photo.thumb) return `<img class="${cls}" src="${objURL(photo.thumb)}" alt="" loading="lazy">`;
  return `<div class="${cls}">${I.sprout}</div>`;
}

/* =========================================================
   Hoja inferior (sheet)
   ========================================================= */
let sheetCleanup = null;
function openSheet(html, onMount) {
  const sheet = $('#sheet');
  sheet.innerHTML = `<div class="grabber"></div>${html}`;
  sheet.hidden = false;
  $('#sheet-backdrop').hidden = false;
  document.body.style.overflow = 'hidden';
  sheetCleanup = onMount ? onMount(sheet) : null;
}
function closeSheet() {
  const sheet = $('#sheet');
  if (sheet.hidden) return;
  sheet.hidden = true;
  sheet.innerHTML = '';
  $('#sheet-backdrop').hidden = true;
  document.body.style.overflow = '';
  if (typeof sheetCleanup === 'function') sheetCleanup();
  sheetCleanup = null;
}
$('#sheet-backdrop').addEventListener('click', closeSheet);

/* =========================================================
   Navegación
   ========================================================= */
function go(path) { location.hash = '#' + path; }
function currentRoute() {
  const raw = location.hash.slice(1) || '/';
  const [path, qs] = raw.split('?');
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(qs || '') };
}

let renderSeq = 0;
async function render({ keepScroll = false } = {}) {
  const y = window.scrollY;
  const seq = ++renderSeq;
  closeSheet();
  const old = liveURLs;
  liveURLs = [];
  const { parts, query } = currentRoute();
  document.body.classList.toggle('detail-hero-page', parts[0] === 'planta');
  try {
    let html;
    if (!parts.length) html = await viewHome();
    else if (parts[0] === 'planta' && parts[1]) html = await viewPlant(parts[1]);
    else if (parts[0] === 'nueva') html = await viewForm(null);
    else if (parts[0] === 'editar' && parts[1]) html = await viewForm(parts[1]);
    else if (parts[0] === 'comparar' && parts[1]) html = await viewCompare(parts[1], query);
    else if (parts[0] === 'ajustes') html = await viewSettings();
    else { go('/'); return; }
    if (seq !== renderSeq) return;
    if (html === null) return; // la vista redirigió
    app.innerHTML = html.html;
    if (html.mount) html.mount();
  } catch (err) {
    console.error(err);
    app.innerHTML = `<div class="empty"><div class="art">${I.info}</div><h2>Algo salió mal</h2><p class="muted">${esc(err.message || err)}</p><a class="btn" href="#/">Volver al inicio</a></div>`;
  } finally {
    old.forEach((u) => URL.revokeObjectURL(u));
  }
  window.scrollTo(0, keepScroll ? y : 0);
}
const rerender = () => render({ keepScroll: true });
window.addEventListener('hashchange', () => render());

/* =========================================================
   Vista: inicio
   ========================================================= */
async function viewHome() {
  const [plants, events] = await Promise.all([DB.all('plants'), DB.all('events')]);
  const covers = await DB.getMany('photos', plants.map((p) => p.coverPhotoId).filter(Boolean));

  const showInstall = !isStandalone() && !Prefs.get('hideInstall', false);
  const installHTML = showInstall ? `
    <div class="install">
      ${I.homeAdd}
      <div style="flex:1">
        <b class="ins-title">Instalá Brote en tu teléfono</b>
        ${isIOS ? `<ol class="steps">
          <li>Abrí este link en <b>Safari</b>.</li>
          <li>Tocá <b>Compartir</b> ${I.share.replace('<svg', '<svg style="width:15px;height:15px;vertical-align:-2px"')}.</li>
          <li>Elegí <b>Agregar a inicio</b>.</li>
        </ol>` : `<span class="small">Desde el menú del navegador, elegí <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</span>`}
        <div class="small muted" style="margin-top:6px">Así se abre como una app, funciona sin internet y tus fotos quedan bien guardadas.</div>
      </div>
      <button class="x" data-action="hide-install" aria-label="Ocultar">×</button>
    </div>` : '';

  const top = `
    <header class="topbar">
      <h1>Brote</h1>
      <button class="icon-btn" data-href="/ajustes" aria-label="Ajustes">${I.gear}</button>
    </header>${installHTML}`;

  if (!plants.length) {
    return {
      html: `${top}
        <div class="empty">
          <div class="art">${I.sprout}</div>
          <h2>Tu jardín empieza acá</h2>
          <p class="muted">Agregá tu primera planta con una foto y cada cuánto la regás. Brote te va a mostrar cuándo le toca.</p>
          <button class="btn" data-href="/nueva">${I.plus} Agregar mi primera planta</button>
        </div>`,
    };
  }

  const rows = plants.map((p) => ({ p, w: careStatus(p, 'water', events), f: careStatus(p, 'fertilize', events) }));
  const due = rows.filter((r) => (r.w && r.w.days <= 0) || (r.f && r.f.days <= 0))
    .sort((a, b) => Math.min(a.w?.days ?? 99, a.f?.days ?? 99) - Math.min(b.w?.days ?? 99, b.f?.days ?? 99));

  const todayHTML = due.length
    ? `<div class="today-list">${due.map(({ p, w, f }) => {
      const parts = [];
      if (w && w.days <= 0) parts.push(w.days < 0 ? `<span style="color:var(--clay)">Riego atrasado ${-w.days} d</span>` : 'Le toca riego');
      if (f && f.days <= 0) parts.push(f.days < 0 ? `<span style="color:var(--clay)">Abono atrasado ${-f.days} d</span>` : 'Le toca abono');
      return `
        <div class="today-item">
          <a href="#/planta/${p.id}" style="display:contents;color:inherit;text-decoration:none">
            ${coverHTML(covers[p.coverPhotoId], 'thumb')}
            <div class="info">
              <div class="name">${esc(p.name)}</div>
              <div class="what muted">${parts.join(' · ')}</div>
            </div>
          </a>
          ${w && w.days <= 0 ? `<button class="btn water sm" data-action="quick" data-type="water" data-id="${p.id}" aria-label="Marcar riego">${I.drop} Regué</button>` : ''}
          ${f && f.days <= 0 && !(w && w.days <= 0) ? `<button class="btn sun sm" data-action="quick" data-type="fertilize" data-id="${p.id}" aria-label="Marcar abono">${I.fert} Aboné</button>` : ''}
        </div>`;
    }).join('')}</div>`
    : `<div class="today-ok">${I.check} Todo al día. Ninguna planta necesita nada hoy.</div>`;

  rows.sort((a, b) => (a.w?.days ?? 999) - (b.w?.days ?? 999) || a.p.name.localeCompare(b.p.name, 'es'));
  const cards = rows.map(({ p, w, f }) => `
    <button class="card" data-href="/planta/${p.id}" data-search="${esc((p.name + ' ' + (p.species || '') + ' ' + (p.location || '')).toLowerCase())}">
      ${coverHTML(covers[p.coverPhotoId])}
      <div class="body">
        <div class="name">${esc(p.name)}</div>
        <div class="sub">${esc(p.location || p.species || ' ')}</div>
        ${statusPill(w, 'water') || (p.waterEvery ? '' : '<span class="pill ok">Sin plan de riego</span>')}
        ${f && f.days <= 0 ? statusPill(f, 'fertilize') : ''}
      </div>
    </button>`).join('');

  return {
    html: `${top}
      <section class="section">
        <div class="section-head"><h2>Hoy</h2><span class="muted">${fmtDate(todayISO())}</span></div>
        ${todayHTML}
      </section>
      <section class="section">
        <div class="section-head"><h2>Mis plantas</h2><span class="muted">${plants.length}</span></div>
        ${plants.length > 5 ? '<input class="search" type="search" id="search" placeholder="Buscar por nombre, especie o lugar" autocomplete="off">' : ''}
        <div class="grid" id="grid">${cards}</div>
        <p class="muted small" id="no-results" hidden style="text-align:center;margin-top:16px">No hay plantas con ese nombre.</p>
      </section>
      <button class="fab" data-href="/nueva">${I.plus} Nueva planta</button>`,
    mount() {
      const s = $('#search');
      if (s) s.addEventListener('input', () => {
        const q = s.value.trim().toLowerCase();
        let n = 0;
        $$('#grid .card').forEach((c) => { const show = !q || c.dataset.search.includes(q); c.hidden = !show; if (show) n++; });
        $('#no-results').hidden = n > 0;
      });
    },
  };
}

/* =========================================================
   Vista: ficha de la planta
   ========================================================= */
async function viewPlant(id) {
  const p = await DB.get('plants', id);
  if (!p) { go('/'); return null; }
  const [photos, events] = await Promise.all([DB.byPlant('photos', id), DB.byPlant('events', id)]);
  sortPhotos(photos);
  const cover = photos.find((ph) => ph.id === p.coverPhotoId) || photos[photos.length - 1];
  const w = careStatus(p, 'water', events);
  const f = careStatus(p, 'fertilize', events);

  const chips = [
    p.location && `<span class="chip">${esc(p.location)}</span>`,
    p.light && LIGHTS[p.light] && `<span class="chip">${LIGHTS[p.light]}</span>`,
    p.acquired && since(p.acquired) && `<span class="chip">Con vos hace ${since(p.acquired)}</span>`,
  ].filter(Boolean).join('');

  const waterCard = w ? `
    <div class="care-card water">
      <div class="label">${I.drop} Riego</div>
      <div class="big" ${w.days < 0 ? 'style="color:var(--clay)"' : ''}>${nextText(w)}</div>
      <div class="meta">Cada ${w.every} ${w.every === 1 ? 'día' : 'días'} · último ${ago(w.last)}</div>
      <button class="btn water sm" data-action="quick" data-type="water" data-id="${p.id}">${I.drop} Regué hoy</button>
    </div>` : `
    <div class="care-card water off">
      <div class="label">${I.drop} Riego</div>
      <div class="meta">Sin frecuencia de riego.</div>
      <button class="btn secondary sm" data-href="/editar/${p.id}">Configurar</button>
    </div>`;
  const fertCard = f ? `
    <div class="care-card fert">
      <div class="label">${I.fert} Abono</div>
      <div class="big" ${f.days < 0 ? 'style="color:var(--clay)"' : ''}>${nextText(f)}</div>
      <div class="meta">Cada ${f.every} días · último ${ago(f.last)}</div>
      <button class="btn sun sm" data-action="quick" data-type="fertilize" data-id="${p.id}">${I.fert} Aboné hoy</button>
    </div>` : `
    <div class="care-card fert off">
      <div class="label">${I.fert} Abono</div>
      <div class="meta">No llevás control de abono.</div>
      <button class="btn secondary sm" data-href="/editar/${p.id}">Configurar</button>
    </div>`;

  const photosDesc = photos.slice().reverse();
  const photoHTML = photos.length ? `
    <div class="photo-strip">
      ${photosDesc.map((ph) => `
        <button class="photo-tile" data-action="photo" data-photo="${ph.id}" aria-label="Foto del ${fmtDate(ph.date, true)}">
          <img src="${objURL(ph.thumb)}" alt="" loading="lazy">
          <span class="date">${fmtDate(ph.date)}</span>
          ${ph.id === p.coverPhotoId ? `<span class="star">${I.star}</span>` : ''}
        </button>`).join('')}
    </div>` : `<p class="muted small">Todavía no hay fotos. Sacale una cada tanto para ver cómo crece.</p>`;

  const evs = events.slice().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const timelineHTML = evs.length ? `
    <ul class="timeline">
      ${evs.map((e) => {
        const t = EVENT_TYPES[e.type] || EVENT_TYPES.note;
        return `<li>
          <span class="dot ${t.cls}">${I[t.icon]}</span>
          <div class="t-body">
            <div class="t-title">${t.label}</div>
            <div class="muted small">${fmtDate(e.date, true)} · ${ago(e.date)}</div>
            ${e.note ? `<div class="t-note">${esc(e.note)}</div>` : ''}
          </div>
          <button class="t-del" data-action="del-event" data-event="${e.id}" aria-label="Borrar registro">${I.trash}</button>
        </li>`;
      }).join('')}
    </ul>` : `<p class="muted small" style="padding:12px 0">Cuando marques riegos, abonos o trasplantes, van a aparecer acá.</p>`;

  const details = [
    ['Especie', p.species],
    ['Ubicación', p.location],
    ['Luz', LIGHTS[p.light]],
    ['Riego', p.waterEvery ? `Cada ${p.waterEvery} ${p.waterEvery === 1 ? 'día' : 'días'}` : 'Sin plan'],
    ['Abono', p.fertEvery ? `Cada ${p.fertEvery} días` : 'Sin control'],
    ['La tenés desde', p.acquired ? fmtDate(p.acquired, true) : ''],
    ['Fotos', String(photos.length)],
  ].filter(([, v]) => v);

  return {
    html: `
      <div class="hero">
        ${cover ? `<img src="${objURL(cover.blob)}" alt="${esc(p.name)}">` : `<div class="cover">${I.sprout}</div>`}
        <div class="hero-bar">
          <button class="icon-btn" data-href="/" aria-label="Volver">${I.back}</button>
          <button class="icon-btn" data-action="plant-menu" data-id="${p.id}" aria-label="Más opciones">${I.more}</button>
        </div>
      </div>
      <div class="title-block">
        <h1>${esc(p.name)}</h1>
        ${p.species ? `<div class="species">${esc(p.species)}</div>` : ''}
      </div>
      ${chips ? `<div class="chips">${chips}</div>` : ''}

      <div class="care-cards">${waterCard}${fertCard}</div>
      <div class="row-actions">
        <button class="btn secondary" data-action="care" data-id="${p.id}">${I.plus} Anotar cuidado</button>
        <button class="btn secondary" data-action="calendar" data-id="${p.id}">${I.calendar} Recordatorio</button>
      </div>

      <section class="section">
        <div class="section-head">
          <h2>Fotos</h2>
          <div style="display:flex;gap:8px">
            ${photos.length >= 2 ? `<button class="btn soft sm" data-href="/comparar/${p.id}">${I.compare} Comparar</button>` : ''}
            <button class="btn sm" data-action="add-photo" data-id="${p.id}">${I.camera} Foto</button>
          </div>
        </div>
        ${photoHTML}
      </section>

      <section class="section">
        <div class="section-head"><h2>Detalles</h2><button class="btn soft sm" data-href="/editar/${p.id}">${I.edit} Editar</button></div>
        <div class="panel">
          ${details.map(([k, v]) => `<div class="kv"><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join('')}
        </div>
      </section>

      ${p.notes ? `<section class="section"><div class="section-head"><h2>Notas</h2></div><div class="panel"><div class="notes">${esc(p.notes)}</div></div></section>` : ''}

      <section class="section">
        <div class="section-head"><h2>Historial</h2><span class="muted small">${evs.length} ${evs.length === 1 ? 'registro' : 'registros'}</span></div>
        <div class="panel">${timelineHTML}</div>
      </section>`,
  };
}

/* =========================================================
   Vista: formulario (nueva / editar)
   ========================================================= */
async function viewForm(id) {
  const p = id ? await DB.get('plants', id) : null;
  if (id && !p) { go('/'); return null; }
  const [all, events] = await Promise.all([DB.all('plants'), id ? DB.byPlant('events', id) : Promise.resolve([])]);
  const locations = [...new Set(all.map((x) => x.location).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const cover = p && p.coverPhotoId ? await DB.get('photos', p.coverPhotoId) : null;

  const v = {
    name: p?.name || '',
    species: p?.species || '',
    location: p?.location || '',
    light: p?.light || '',
    waterEvery: p ? (p.waterEvery || 0) : 7,
    lastWater: p ? (lastOf(p, 'water', events) || '') : todayISO(),
    fertOn: p ? !!p.fertEvery : false,
    fertEvery: p?.fertEvery || 30,
    lastFert: p ? (lastOf(p, 'fertilize', events) || '') : '',
    acquired: p?.acquired || '',
    notes: p?.notes || '',
  };
  let coverFile = null;

  return {
    html: `
      <header class="topbar">
        <button class="icon-btn" data-href="${p ? '/planta/' + p.id : '/'}" aria-label="Cancelar">${I.back}</button>
        <div class="title-sm">${p ? 'Editar planta' : 'Nueva planta'}</div>
        <div class="spacer"></div>
      </header>
      <form class="form" id="plant-form" novalidate>
        <label class="cover-picker" id="cover-picker">
          ${cover ? `<img src="${objURL(cover.thumb)}" alt="">` : ''}
          <span class="cp-label" ${cover ? 'hidden' : ''}>${I.camera}<span>Agregar foto</span><span class="muted small" style="font-weight:400">Opcional</span></span>
          <span class="cp-change" ${cover ? '' : 'hidden'}>Cambiar foto</span>
          <input type="file" accept="image/*" id="cover-input" aria-label="Foto de la planta">
        </label>

        <div class="field">
          <label for="f-name">Nombre *</label>
          <input class="input" id="f-name" name="name" required maxlength="60" placeholder="Ej: Potus del living" value="${esc(v.name)}">
        </div>
        <div class="field">
          <label for="f-species">Especie</label>
          <input class="input" id="f-species" name="species" maxlength="80" placeholder="Ej: Epipremnum aureum" value="${esc(v.species)}">
        </div>
        <div class="two">
          <div class="field">
            <label for="f-location">Ubicación</label>
            <input class="input" id="f-location" name="location" maxlength="50" list="locs" placeholder="Ej: Balcón" value="${esc(v.location)}">
            <datalist id="locs">${locations.map((l) => `<option value="${esc(l)}">`).join('')}</datalist>
          </div>
          <div class="field">
            <label for="f-light">Luz</label>
            <select class="select" id="f-light" name="light">
              <option value="">—</option>
              ${Object.entries(LIGHTS).map(([k, l]) => `<option value="${k}" ${v.light === k ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="section-head" style="margin:10px 0 -4px"><h2 style="font-size:19px">Riego</h2></div>
        <div class="two">
          <div class="field">
            <span class="label">Cada cuántos días</span>
            <div class="stepper">
              <button type="button" data-step="-1" data-target="f-water" aria-label="Menos">−</button>
              <input id="f-water" name="waterEvery" type="number" inputmode="numeric" min="0" max="365" value="${v.waterEvery}">
              <button type="button" data-step="1" data-target="f-water" aria-label="Más">+</button>
            </div>
            <span class="hint">0 = sin plan de riego</span>
          </div>
          <div class="field">
            <label for="f-lastwater">Último riego</label>
            <input class="input" id="f-lastwater" name="lastWater" type="date" max="${todayISO()}" value="${v.lastWater}">
          </div>
        </div>

        <div class="section-head" style="margin:10px 0 -4px"><h2 style="font-size:19px">Abono</h2></div>
        <div class="seg" id="fert-seg">
          <button type="button" data-fert="off" class="${v.fertOn ? '' : 'on'}">No llevo control</button>
          <button type="button" data-fert="on" class="${v.fertOn ? 'on' : ''}">Cada X días</button>
        </div>
        <div class="two" id="fert-fields" ${v.fertOn ? '' : 'hidden'}>
          <div class="field">
            <span class="label">Cada cuántos días</span>
            <div class="stepper">
              <button type="button" data-step="-5" data-target="f-fert" aria-label="Menos">−</button>
              <input id="f-fert" name="fertEvery" type="number" inputmode="numeric" min="1" max="365" value="${v.fertEvery}">
              <button type="button" data-step="5" data-target="f-fert" aria-label="Más">+</button>
            </div>
          </div>
          <div class="field">
            <label for="f-lastfert">Último abono</label>
            <input class="input" id="f-lastfert" name="lastFert" type="date" max="${todayISO()}" value="${v.lastFert}">
          </div>
        </div>

        <div class="section-head" style="margin:10px 0 -4px"><h2 style="font-size:19px">Más datos</h2></div>
        <div class="field">
          <label for="f-acq">La tenés desde</label>
          <input class="input" id="f-acq" name="acquired" type="date" max="${todayISO()}" value="${v.acquired}">
        </div>
        <div class="field">
          <label for="f-notes">Notas</label>
          <textarea class="textarea" id="f-notes" name="notes" maxlength="2000" placeholder="Cuidados especiales, dónde la compraste, etc.">${esc(v.notes)}</textarea>
        </div>

        <div class="form-actions">
          <button class="btn block" type="submit" id="save-btn">${I.check} ${p ? 'Guardar cambios' : 'Guardar planta'}</button>
        </div>
      </form>`,
    mount() {
      const form = $('#plant-form');
      let fertOn = v.fertOn;

      $('#cover-input').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        coverFile = file;
        const picker = $('#cover-picker');
        let img = $('img', picker);
        if (!img) { img = document.createElement('img'); img.alt = ''; picker.prepend(img); }
        img.src = objURL(file);
        $('.cp-label', picker).hidden = true;
        $('.cp-change', picker).hidden = false;
      });

      $$('#fert-seg button').forEach((b) => b.addEventListener('click', () => {
        fertOn = b.dataset.fert === 'on';
        $$('#fert-seg button').forEach((x) => x.classList.toggle('on', x === b));
        $('#fert-fields').hidden = !fertOn;
      }));

      $$('[data-step]', form).forEach((b) => b.addEventListener('click', () => {
        const input = $('#' + b.dataset.target);
        const min = Number(input.min || 0);
        const max = Number(input.max || 365);
        const val = Math.min(max, Math.max(min, (parseInt(input.value, 10) || 0) + Number(b.dataset.step)));
        input.value = val;
      }));

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const name = String(fd.get('name') || '').trim();
        if (!name) {
          toast('Poné un nombre para la planta');
          $('#f-name').focus();
          return;
        }
        const btn = $('#save-btn');
        btn.disabled = true;
        btn.textContent = 'Guardando…';
        try {
          const clampInt = (x, lo, hi) => Math.min(hi, Math.max(lo, parseInt(x, 10) || 0));
          const plant = p ? { ...p } : { id: uid(), createdAt: nowISO(), coverPhotoId: null };
          Object.assign(plant, {
            name,
            species: String(fd.get('species') || '').trim(),
            location: String(fd.get('location') || '').trim(),
            light: String(fd.get('light') || ''),
            waterEvery: clampInt(fd.get('waterEvery'), 0, 365),
            waterBase: String(fd.get('lastWater') || '') || null,
            fertEvery: fertOn ? Math.max(1, clampInt(fd.get('fertEvery'), 1, 365)) : 0,
            fertBase: fertOn ? (String(fd.get('lastFert') || '') || null) : (p?.fertBase || null),
            acquired: String(fd.get('acquired') || '') || null,
            notes: String(fd.get('notes') || '').trim(),
            updatedAt: nowISO(),
            v: DATA_VERSION,
          });
          await DB.put('plants', plant);
          if (coverFile) {
            const photo = await savePhoto(plant.id, coverFile, todayISO());
            plant.coverPhotoId = photo.id;
            await DB.put('plants', plant);
          }
          toast(p ? 'Cambios guardados' : `${name} agregada`);
          go('/planta/' + plant.id);
        } catch (err) {
          console.error(err);
          toast('No se pudo guardar: ' + (err.message || err));
          btn.disabled = false;
          btn.innerHTML = `${I.check} Guardar`;
        }
      });
    },
  };
}

/* =========================================================
   Vista: comparar fotos
   ========================================================= */
async function viewCompare(id, query) {
  const p = await DB.get('plants', id);
  if (!p) { go('/'); return null; }
  const photos = sortPhotos(await DB.byPlant('photos', id));
  if (photos.length < 2) { go('/planta/' + id); return null; }

  const findIdx = (pid, def) => { const i = photos.findIndex((x) => x.id === pid); return i >= 0 ? i : def; };
  let a = findIdx(query.get('a'), 0);
  let b = findIdx(query.get('b'), photos.length - 1);
  let mode = Prefs.get('compareMode', 'lado');

  const urlCache = {};
  const fullURL = (i) => urlCache[i] || (urlCache[i] = objURL(photos[i].blob));
  const label = (i) => `${fmtDate(photos[i].date, true)}`;
  const options = (sel) => photos.map((ph, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${fmtDate(ph.date, true)}${ph.note ? ' · ' + esc(ph.note.slice(0, 24)) : ''}</option>`).join('');
  const gap = () => {
    const d = Math.abs(diffDays(photos[a].date, photos[b].date));
    return d === 0 ? 'Mismo día' : `${since(addDays(todayISO(), -d)) || d + ' días'} entre una y otra`;
  };

  return {
    html: `
      <header class="topbar">
        <button class="icon-btn" data-href="/planta/${p.id}" aria-label="Volver">${I.back}</button>
        <div class="title-sm">Comparar · ${esc(p.name)}</div>
        <div class="spacer"></div>
      </header>
      <div class="seg" id="mode-seg">
        <button type="button" data-mode="lado" class="${mode === 'lado' ? 'on' : ''}">Lado a lado</button>
        <button type="button" data-mode="desliz" class="${mode === 'desliz' ? 'on' : ''}">Deslizador</button>
      </div>
      <div class="compare-pickers">
        <div class="field"><label for="sel-a">Antes</label><select class="select" id="sel-a">${options(a)}</select></div>
        <div class="field"><label for="sel-b">Después</label><select class="select" id="sel-b">${options(b)}</select></div>
      </div>
      <div id="compare-stage"></div>
      <p class="muted small" id="gap" style="text-align:center;margin-top:12px"></p>`,
    mount() {
      const stage = $('#compare-stage');
      let pct = 50;
      const draw = () => {
        $('#gap').textContent = gap();
        if (mode === 'lado') {
          stage.innerHTML = `
            <div class="side-by-side">
              <figure><img src="${fullURL(a)}" alt="Antes"><figcaption>${label(a)}</figcaption></figure>
              <figure><img src="${fullURL(b)}" alt="Después"><figcaption>${label(b)}</figcaption></figure>
            </div>`;
          return;
        }
        stage.innerHTML = `
          <div class="slider-wrap" id="sw">
            <img src="${fullURL(b)}" alt="Después">
            <img class="top" src="${fullURL(a)}" alt="Antes" style="clip-path:inset(0 ${100 - pct}% 0 0)">
            <div class="handle" style="left:${pct}%"></div>
            <span class="tag l">${label(a)}</span>
            <span class="tag r">${label(b)}</span>
          </div>
          <input class="slider-range" type="range" min="0" max="100" value="${pct}" id="sr" aria-label="Deslizar entre fotos">`;
        const wrap = $('#sw');
        const range = $('#sr');
        const setPct = (val) => {
          pct = Math.max(0, Math.min(100, val));
          $('.top', wrap).style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
          $('.handle', wrap).style.left = pct + '%';
          range.value = pct;
        };
        range.addEventListener('input', () => setPct(Number(range.value)));
        let dragging = false;
        const fromEvent = (e) => { const r = wrap.getBoundingClientRect(); setPct(((e.clientX - r.left) / r.width) * 100); };
        wrap.addEventListener('pointerdown', (e) => { dragging = true; wrap.setPointerCapture(e.pointerId); fromEvent(e); });
        wrap.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
        const stop = () => { dragging = false; };
        wrap.addEventListener('pointerup', stop);
        wrap.addEventListener('pointercancel', stop);
      };
      $('#sel-a').addEventListener('change', (e) => { a = Number(e.target.value); draw(); });
      $('#sel-b').addEventListener('change', (e) => { b = Number(e.target.value); draw(); });
      $$('#mode-seg button').forEach((btn) => btn.addEventListener('click', () => {
        mode = btn.dataset.mode;
        Prefs.set('compareMode', mode);
        $$('#mode-seg button').forEach((x) => x.classList.toggle('on', x === btn));
        draw();
      }));
      draw();
    },
  };
}

/* =========================================================
   Vista: ajustes
   ========================================================= */
async function viewSettings() {
  const [plants, events] = await Promise.all([DB.all('plants'), DB.all('events')]);
  let usage = '';
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const est = await navigator.storage.estimate();
      if (est.usage != null) usage = `${(est.usage / 1048576).toFixed(1)} MB usados`;
    }
  } catch { /* no disponible */ }
  let persisted = null;
  try { if (navigator.storage && navigator.storage.persisted) persisted = await navigator.storage.persisted(); } catch { /* no disponible */ }
  const hour = Prefs.get('reminderTime', '09:00');

  return {
    html: `
      <header class="topbar">
        <button class="icon-btn" data-href="/" aria-label="Volver">${I.back}</button>
        <div class="title-sm">Ajustes</div>
        <div class="spacer"></div>
      </header>

      <div class="settings-group">
        <h2>Recordatorios</h2>
        <div class="panel">
          <div class="kv" style="align-items:center">
            <span class="k">Hora de los avisos</span>
            <input class="input" type="time" id="rem-time" value="${esc(hour)}" style="width:auto;min-height:40px;padding:6px 10px">
          </div>
        </div>
        <p class="muted small" style="margin:8px 4px 0">Se usa cuando creás un recordatorio en el Calendario desde la ficha de una planta.</p>
      </div>

      <div class="settings-group">
        <h2>Copia de seguridad</h2>
        <div class="opts" style="display:grid;gap:8px">
          <button class="opt" data-action="export">${I.download}<span>Exportar copia<small>Un archivo con todas tus plantas, fotos e historial. Guardalo en Archivos, iCloud o mandatelo por mail.</small></span></button>
          <label class="opt" style="cursor:pointer">${I.upload}<span>Importar copia<small>Recuperá tus datos en otro teléfono o después de reinstalar.</small></span>
            <input type="file" id="import-input" accept=".json,application/json" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none">
          </label>
        </div>
      </div>

      <div class="settings-group">
        <h2>Este teléfono</h2>
        <div class="panel">
          <div class="kv"><span class="k">Plantas</span><span class="v">${plants.length}</span></div>
          <div class="kv"><span class="k">Registros de cuidado</span><span class="v">${events.length}</span></div>
          ${usage ? `<div class="kv"><span class="k">Espacio</span><span class="v">${usage}</span></div>` : ''}
          <div class="kv"><span class="k">Instalada como app</span><span class="v">${isStandalone() ? 'Sí' : 'No'}</span></div>
          ${persisted !== null ? `<div class="kv"><span class="k">Almacenamiento protegido</span><span class="v">${persisted ? 'Sí' : 'No'}</span></div>` : ''}
        </div>
        <p class="muted small" style="margin:8px 4px 0">Tus datos se guardan solo en este teléfono. Nadie más los ve. Exportá una copia cada tanto por las dudas.</p>
      </div>

      <div class="settings-group">
        <h2>Zona peligrosa</h2>
        <button class="opt danger" data-action="wipe">${I.trash}<span>Borrar todos los datos<small>Elimina todas las plantas, fotos e historial de este teléfono.</small></span></button>
      </div>

      <p class="footer-note">Brote ${APP_VERSION} · hecho con ${I.sprout.replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px"')}</p>`,
    mount() {
      $('#rem-time').addEventListener('change', (e) => { Prefs.set('reminderTime', e.target.value || '09:00'); toast('Hora guardada'); });
      $('#import-input').addEventListener('change', (e) => { const f = e.target.files && e.target.files[0]; if (f) importBackup(f); e.target.value = ''; });
    },
  };
}

/* =========================================================
   Hojas de acción
   ========================================================= */
function careSheet(plantId) {
  let type = 'water';
  openSheet(`
    <h3>Registrar cuidado</h3>
    <div class="form">
      <div class="seg" id="care-seg" style="grid-auto-flow:row;grid-template-columns:repeat(3,1fr);border-radius:16px">
        ${Object.entries(EVENT_TYPES).map(([k, t]) => `<button type="button" data-type="${k}" class="${k === 'water' ? 'on' : ''}">${t.label}</button>`).join('')}
      </div>
      <div class="field"><label for="c-date">Fecha</label><input class="input" type="date" id="c-date" value="${todayISO()}" max="${todayISO()}"></div>
      <div class="field"><label for="c-note">Nota (opcional)</label><textarea class="textarea" id="c-note" maxlength="500" placeholder="Ej: le cambié la tierra, tenía hojas amarillas…"></textarea></div>
      <button class="btn block" id="c-save">${I.check} Guardar</button>
    </div>`, (sheet) => {
    $$('#care-seg button', sheet).forEach((b) => b.addEventListener('click', () => {
      type = b.dataset.type;
      $$('#care-seg button', sheet).forEach((x) => x.classList.toggle('on', x === b));
    }));
    $('#c-save', sheet).addEventListener('click', async () => {
      const date = $('#c-date', sheet).value || todayISO();
      await logCare(plantId, type, date, $('#c-note', sheet).value);
      closeSheet();
      toast(`${EVENT_TYPES[type].label} registrado`);
      rerender();
    });
  });
}

function addPhotoSheet(plantId) {
  let files = [];
  openSheet(`
    <h3>Agregar foto</h3>
    <div class="form">
      <label class="cover-picker" id="ph-picker">
        <span class="cp-label">${I.camera}<span>Sacar o elegir foto</span><span class="muted small" style="font-weight:400">Podés elegir varias</span></span>
        <span class="cp-change" hidden>Cambiar</span>
        <input type="file" accept="image/*" multiple id="ph-input">
      </label>
      <div class="field"><label for="ph-date">Fecha de la foto</label><input class="input" type="date" id="ph-date" value="${todayISO()}" max="${todayISO()}"></div>
      <div class="field"><label for="ph-note">Nota (opcional)</label><input class="input" id="ph-note" maxlength="120" placeholder="Ej: salió una hoja nueva"></div>
      <label class="small" style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="ph-cover"> Usar como foto principal</label>
      <button class="btn block" id="ph-save" disabled>${I.check} Guardar foto</button>
    </div>`, (sheet) => {
    const input = $('#ph-input', sheet);
    input.addEventListener('change', () => {
      files = Array.from(input.files || []);
      if (!files.length) return;
      const picker = $('#ph-picker', sheet);
      let img = $('img', picker);
      if (!img) { img = document.createElement('img'); img.alt = ''; picker.prepend(img); }
      img.src = objURL(files[0]);
      $('.cp-label', picker).hidden = true;
      const ch = $('.cp-change', picker);
      ch.hidden = false;
      ch.textContent = files.length > 1 ? `${files.length} fotos · cambiar` : 'Cambiar';
      $('#ph-save', sheet).disabled = false;
      $('#ph-save', sheet).innerHTML = `${I.check} Guardar ${files.length > 1 ? files.length + ' fotos' : 'foto'}`;
    });
    $('#ph-save', sheet).addEventListener('click', async () => {
      const btn = $('#ph-save', sheet);
      btn.disabled = true;
      btn.textContent = 'Guardando…';
      try {
        const date = $('#ph-date', sheet).value || todayISO();
        const note = $('#ph-note', sheet).value;
        let last = null;
        for (const f of files) last = await savePhoto(plantId, f, date, note);
        const p = await DB.get('plants', plantId);
        if (p && last && ($('#ph-cover', sheet).checked || !p.coverPhotoId)) {
          p.coverPhotoId = last.id;
          p.updatedAt = nowISO();
          await DB.put('plants', p);
        }
        closeSheet();
        toast(files.length > 1 ? `${files.length} fotos guardadas` : 'Foto guardada');
        rerender();
      } catch (err) {
        console.error(err);
        toast('No se pudo guardar: ' + (err.message || err));
        btn.disabled = false;
        btn.innerHTML = `${I.check} Guardar foto`;
      }
    });
  });
}

async function photoSheet(photoId) {
  const ph = await DB.get('photos', photoId);
  if (!ph) return;
  const p = await DB.get('plants', ph.plantId);
  const all = sortPhotos(await DB.byPlant('photos', ph.plantId));
  const isCover = p && p.coverPhotoId === ph.id;
  const firstOther = all.find((x) => x.id !== ph.id);
  openSheet(`
    <img class="viewer-img" src="${objURL(ph.blob)}" alt="">
    <div style="margin:12px 2px 14px">
      <div style="font-weight:600">${fmtDate(ph.date, true)} <span class="muted" style="font-weight:400">· ${ago(ph.date)}</span></div>
      ${ph.note ? `<div class="muted">${esc(ph.note)}</div>` : ''}
    </div>
    <div class="opts">
      ${!isCover ? `<button class="opt" data-sheet="cover">${I.starLine}<span>Usar como foto principal</span></button>` : ''}
      ${firstOther ? `<button class="opt" data-sheet="compare">${I.compare}<span>Comparar con otra foto</span></button>` : ''}
      <button class="opt" data-sheet="date">${I.calendar}<span>Cambiar fecha o nota</span></button>
      <button class="opt danger" data-sheet="delete">${I.trash}<span>Borrar foto</span></button>
    </div>`, (sheet) => {
    sheet.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-sheet]');
      if (!b) return;
      const act = b.dataset.sheet;
      if (act === 'cover') {
        p.coverPhotoId = ph.id;
        p.updatedAt = nowISO();
        await DB.put('plants', p);
        closeSheet();
        toast('Foto principal actualizada');
        rerender();
      } else if (act === 'compare') {
        const older = all[0].id === ph.id ? all[all.length - 1] : all[0];
        const [x, y] = ph.date <= older.date ? [ph, older] : [older, ph];
        closeSheet();
        go(`/comparar/${ph.plantId}?a=${x.id}&b=${y.id}`);
      } else if (act === 'date') {
        openSheet(`
          <h3>Editar foto</h3>
          <div class="form">
            <div class="field"><label for="e-date">Fecha</label><input class="input" type="date" id="e-date" value="${ph.date}" max="${todayISO()}"></div>
            <div class="field"><label for="e-note">Nota</label><input class="input" id="e-note" maxlength="120" value="${esc(ph.note || '')}"></div>
            <button class="btn block" id="e-save">${I.check} Guardar</button>
          </div>`, (s2) => {
          $('#e-save', s2).addEventListener('click', async () => {
            ph.date = $('#e-date', s2).value || ph.date;
            ph.note = $('#e-note', s2).value.trim();
            await DB.put('photos', ph);
            closeSheet();
            toast('Foto actualizada');
            rerender();
          });
        });
      } else if (act === 'delete') {
        if (!confirm('¿Borrar esta foto? No se puede deshacer.')) return;
        await DB.del('photos', ph.id);
        if (isCover) {
          const rest = all.filter((x) => x.id !== ph.id);
          p.coverPhotoId = rest.length ? rest[rest.length - 1].id : null;
          await DB.put('plants', p);
        }
        closeSheet();
        toast('Foto borrada');
        rerender();
      }
    });
  });
}

function plantMenu(plantId) {
  openSheet(`
    <h3>Opciones</h3>
    <div class="opts">
      <button class="opt" data-m="edit">${I.edit}<span>Editar datos</span></button>
      <button class="opt" data-m="photo">${I.camera}<span>Agregar foto</span></button>
      <button class="opt" data-m="calendar">${I.calendar}<span>Recordatorio en el Calendario</span></button>
      <button class="opt danger" data-m="delete">${I.trash}<span>Borrar planta<small>Se borran también sus fotos e historial.</small></span></button>
    </div>`, (sheet) => {
    sheet.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-m]');
      if (!b) return;
      const m = b.dataset.m;
      if (m === 'edit') { closeSheet(); go('/editar/' + plantId); }
      if (m === 'photo') addPhotoSheet(plantId);
      if (m === 'calendar') calendarSheet(plantId);
      if (m === 'delete') {
        const p = await DB.get('plants', plantId);
        if (!confirm(`¿Borrar "${p ? p.name : 'esta planta'}" con todas sus fotos e historial? No se puede deshacer.`)) return;
        await DB.deletePlant(plantId);
        closeSheet();
        toast('Planta borrada');
        go('/');
      }
    });
  });
}

/* =========================================================
   Recordatorios en el Calendario (.ics)
   ========================================================= */
function icsEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}
function buildICS(plant, items, time) {
  const [hh, mm] = (time || '09:00').split(':');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Brote//Plantas//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const it of items) {
    const start = it.next.replace(/-/g, '') + `T${pad(hh)}${pad(mm)}00`;
    const verb = it.type === 'water' ? 'Regar' : 'Abonar';
    lines.push(
      'BEGIN:VEVENT',
      `UID:brote-${plant.id}-${it.type}@brote.app`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${start}`,
      'DURATION:PT15M',
      `RRULE:FREQ=DAILY;INTERVAL=${it.every}`,
      `SUMMARY:${icsEscape(`${it.type === 'water' ? '💧' : '🌱'} ${verb} ${plant.name}`)}`,
      `DESCRIPTION:${icsEscape(`${verb} ${plant.name} (cada ${it.every} días). Después marcalo en Brote.`)}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsEscape(`${verb} ${plant.name}`)}`,
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}
async function calendarSheet(plantId) {
  const p = await DB.get('plants', plantId);
  if (!p) return;
  const events = await DB.byPlant('events', plantId);
  const w = careStatus(p, 'water', events);
  const f = careStatus(p, 'fertilize', events);
  if (!w && !f) {
    openSheet(`<h3>Recordatorio</h3><p class="muted">Primero configurá cada cuántos días regás o abonás esta planta.</p><button class="btn block" data-m="go-edit">${I.edit} Configurar</button>`, (sheet) => {
      $('[data-m="go-edit"]', sheet).addEventListener('click', () => { closeSheet(); go('/editar/' + plantId); });
    });
    return;
  }
  const fixNext = (st) => (st.days < 0 ? todayISO() : st.next);
  openSheet(`
    <h3>Recordatorio en el Calendario</h3>
    <p class="muted small" style="margin-top:-6px">Se crea un evento que se repite solo y te avisa con el teléfono bloqueado.</p>
    <div class="form">
      ${w ? `<label class="opt"><input type="checkbox" id="r-water" checked> <span>${I.drop.replace('<svg', '<svg style="width:18px;height:18px;vertical-align:-3px;color:var(--water)"')} Riego cada ${w.every} días<small>Primer aviso: ${fmtDate(fixNext(w), true)}</small></span></label>` : ''}
      ${f ? `<label class="opt"><input type="checkbox" id="r-fert" checked> <span>${I.fert.replace('<svg', '<svg style="width:18px;height:18px;vertical-align:-3px;color:var(--sun)"')} Abono cada ${f.every} días<small>Primer aviso: ${fmtDate(fixNext(f), true)}</small></span></label>` : ''}
      <div class="field"><label for="r-time">Hora del aviso</label><input class="input" type="time" id="r-time" value="${esc(Prefs.get('reminderTime', '09:00'))}"></div>
      <button class="btn block" id="r-go">${I.calendar} Agregar al Calendario</button>
      <p class="muted small" style="margin:0">Se abre el evento: tocá <b>Agregar</b>. Si más adelante cambiás la frecuencia, borrá el evento viejo del Calendario y creá uno nuevo desde acá.</p>
    </div>`, (sheet) => {
    $('#r-go', sheet).addEventListener('click', () => {
      const items = [];
      if (w && $('#r-water', sheet)?.checked) items.push({ type: 'water', every: w.every, next: fixNext(w) });
      if (f && $('#r-fert', sheet)?.checked) items.push({ type: 'fertilize', every: f.every, next: fixNext(f) });
      if (!items.length) { toast('Elegí al menos un recordatorio'); return; }
      const time = $('#r-time', sheet).value || '09:00';
      Prefs.set('reminderTime', time);
      const ics = buildICS(p, items, time);
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if (!isIOS) a.download = `brote-${p.name.replace(/[^\w\-]+/g, '_')}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      closeSheet();
    });
  });
}

/* =========================================================
   Copia de seguridad
   ========================================================= */
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
function dataURLToBlob(dataURL) {
  const [head, b64] = dataURL.split(',');
  const mime = (head.match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
async function exportBackup() {
  toast('Preparando copia…');
  const [plants, events, photos] = await Promise.all([DB.all('plants'), DB.all('events'), DB.all('photos')]);
  const outPhotos = [];
  for (const ph of photos) {
    const { blob, thumb, ...meta } = ph;
    outPhotos.push({ ...meta, image: await blobToDataURL(blob), thumbImage: thumb ? await blobToDataURL(thumb) : null });
  }
  const data = { app: 'brote', dataVersion: DATA_VERSION, appVersion: APP_VERSION, exportedAt: nowISO(), plants, events, photos: outPhotos };
  const name = `brote-copia-${todayISO()}.json`;
  const file = new File([JSON.stringify(data)], name, { type: 'application/json' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Copia de Brote' });
      return;
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return;
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
async function importBackup(file) {
  try {
    const data = JSON.parse(await file.text());
    if (!data || data.app !== 'brote' || !Array.isArray(data.plants)) throw new Error('El archivo no es una copia de Brote.');
    if ((data.dataVersion || 1) > DATA_VERSION) throw new Error('La copia es de una versión más nueva de Brote. Actualizá la app primero.');
    const nPhotos = (data.photos || []).length;
    if (!confirm(`Se van a importar ${data.plants.length} plantas y ${nPhotos} fotos. Si alguna ya existe, se reemplaza por la de la copia. ¿Seguir?`)) return;
    toast('Importando…');
    await DB.putMany('plants', data.plants);
    await DB.putMany('events', data.events || []);
    for (const ph of data.photos || []) {
      const { image, thumbImage, ...meta } = ph;
      const blob = dataURLToBlob(image);
      let thumb = thumbImage ? dataURLToBlob(thumbImage) : null;
      if (!thumb) thumb = await resizeTo(await loadImage(blob), 480, 0.78);
      await DB.put('photos', { ...meta, blob, thumb });
    }
    toast('Copia importada');
    go('/');
  } catch (err) {
    console.error(err);
    alert('No se pudo importar: ' + (err.message || err));
  }
}

/* =========================================================
   Clicks globales
   ========================================================= */
document.addEventListener('click', async (e) => {
  const hrefEl = e.target.closest('[data-href]');
  if (hrefEl) { e.preventDefault(); go(hrefEl.dataset.href); return; }
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, id } = el.dataset;
  try {
    switch (action) {
      case 'quick': {
        el.disabled = true;
        const type = el.dataset.type;
        await logCare(id, type);
        const p = await DB.get('plants', id);
        toast(type === 'water' ? `💧 Regaste ${p ? p.name : ''}` : `🌱 Abonaste ${p ? p.name : ''}`);
        rerender();
        break;
      }
      case 'care': careSheet(id); break;
      case 'add-photo': addPhotoSheet(id); break;
      case 'photo': photoSheet(el.dataset.photo); break;
      case 'plant-menu': plantMenu(id); break;
      case 'calendar': calendarSheet(id); break;
      case 'del-event':
        if (confirm('¿Borrar este registro del historial?')) {
          await DB.del('events', el.dataset.event);
          toast('Registro borrado');
          rerender();
        }
        break;
      case 'hide-install': Prefs.set('hideInstall', true); rerender(); break;
      case 'export': await exportBackup(); break;
      case 'wipe':
        if (confirm('¿Borrar TODAS las plantas, fotos e historial de este teléfono?') && confirm('Última confirmación: esto no se puede deshacer. Si no exportaste una copia, se pierde todo.')) {
          await DB.clearAll();
          toast('Datos borrados');
          go('/');
        }
        break;
      default: break;
    }
  } catch (err) {
    console.error(err);
    toast('Error: ' + (err.message || err));
  }
});

/* =========================================================
   Arranque, modo offline y actualizaciones
   ========================================================= */
(async function start() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      const already = await navigator.storage.persisted();
      if (!already) navigator.storage.persist().catch(() => {});
    }
  } catch { /* no disponible */ }

  // Al volver a la app otro día, refrescar "Hoy"
  let lastDay = todayISO();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && todayISO() !== lastDay) {
      lastDay = todayISO();
      rerender();
    }
  });

  await render();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      const showUpdate = (worker) => {
        $('#update-bar').hidden = false;
        $('#update-btn').onclick = () => worker.postMessage({ type: 'SKIP_WAITING' });
      };
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(nw);
        });
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    } catch (err) {
      console.warn('Service worker no registrado', err);
    }
  }
})();
