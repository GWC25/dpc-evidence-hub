/**
 * DPC Evidence Hub — hub.js
 * Navigation, config loading, template rendering, persistence, export
 */

let CONFIG = null;
let ENTRIES = {};
let DARK_MODE = localStorage.getItem('dpc-dark-mode') === 'true';

// ── DARK MODE ────────────────────────────────────────────────────────────────
function toggleDarkMode() {
  DARK_MODE = !DARK_MODE;
  localStorage.setItem('dpc-dark-mode', String(DARK_MODE));
  document.body.classList.toggle('dark-mode', DARK_MODE);
  const btn = document.querySelector('.dark-mode-toggle');
  if (btn) btn.textContent = DARK_MODE ? '☀️ Light mode' : '🌙 Dark mode';
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────
function navigateTo(sectionId, btn) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.remove('active');
    n.removeAttribute('aria-current');
  });
  const section = document.getElementById(`section-${sectionId}`);
  if (section) section.classList.add('active');
  if (btn) { btn.classList.add('active'); btn.setAttribute('aria-current', 'page'); }
}

// ── LOAD CONFIG ──────────────────────────────────────────────────────────────
async function loadConfig() {
  try {
    const res = await fetch('data/config.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    CONFIG = await res.json();

    document.getElementById('config-status').innerHTML = `
      <strong style="color:var(--color-success)">✓ Loaded</strong><br>
      ${CONFIG.areas?.length || 0} areas · 
      ${CONFIG.templates?.length || 0} templates · 
      ${CONFIG.commonPurposes?.length || 0} tags · 
      ${CONFIG.peopleRegistry?.length || 0} people
    `;
    loadAreas();
    showToast('Configuration loaded', 'success');
  } catch (err) {
    showToast('Config load failed: ' + err.message, 'error');
    console.error('loadConfig error:', err);
  }
}

// ── AREAS IN SETTINGS ────────────────────────────────────────────────────────
function loadAreas() {
  if (!CONFIG?.areas) return;
  const html = CONFIG.areas.map(a =>
    `<div style="padding:.4rem .6rem;background:var(--color-grey-bg);border-radius:4px;font-size:.8rem;">
       <strong>${a.code}</strong> — ${a.name}
     </div>`
  ).join('');
  document.getElementById('areas-status').innerHTML =
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.4rem;margin-top:.5rem;">${html}</div>`;
}

// ── LOAD TEMPLATE — renders the correct form for the selected activity ────────
function loadTemplate(templateId) {
  const container = document.getElementById('qc-form-container');
  container.innerHTML = '';

  if (!templateId) return;

  if (!CONFIG) {
    showToast('Load Config first (button in header)', 'error');
    document.getElementById('qc-activity-type').value = '';
    return;
  }

  const template = CONFIG.templates?.find(t => t.id === templateId);
  if (!template) {
    showToast(`Template "${templateId}" not found in config`, 'error');
    return;
  }

  const form = TemplateAssembler.buildForm(template, CONFIG);
  container.appendChild(form);
  showToast(`Loaded: ${template.name}`, 'success');
}

// ── SAVE ENTRY ───────────────────────────────────────────────────────────────
function saveEntry(templateId) {
  if (!CONFIG) { showToast('Config not loaded', 'error'); return; }

  const template = CONFIG.templates?.find(t => t.id === templateId);
  if (!template) return;

  const entry = buildEntryFromForm(templateId, CONFIG);
  if (!entry) { showToast('Could not build entry', 'error'); return; }

  if (!ENTRIES[templateId]) ENTRIES[templateId] = [];
  ENTRIES[templateId].push(entry);

  const total = Object.values(ENTRIES).flat().length;
  const countEl = document.getElementById('entry-count');
  if (countEl) countEl.textContent = total;

  logEntryToEvidence(entry, template);
  showToast(`Saved: ${template.name}`, 'success');

  // Reset dropdown and clear form container
  document.getElementById('qc-activity-type').value = '';
  document.getElementById('qc-form-container').innerHTML = '';
}

// ── EVIDENCE LOG ─────────────────────────────────────────────────────────────
function logEntryToEvidence(entry, template) {
  const container = document.getElementById('evidence-log-placeholder');
  if (container.textContent.includes('No entries')) container.innerHTML = '';

  const item = document.createElement('div');
  item.className = 'log-entry';
  item.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap;">
      <strong>${template.name}</strong>
      <span style="font-family:var(--font-mono);font-size:.75rem;color:var(--color-slate);">${new Date().toLocaleString('en-GB')}</span>
    </div>
    <div style="font-size:.78rem;color:var(--color-slate);margin-top:.25rem;">ID: ${entry.id}</div>
  `;
  container.insertBefore(item, container.firstChild);
}

// ── CLEAR FORM ───────────────────────────────────────────────────────────────
function clearFormById(templateId) {
  const form = document.getElementById(`form-${templateId}`);
  if (!form) return;
  form.querySelectorAll('input[type="text"], input[type="date"], input[type="number"], textarea, select').forEach(f => f.value = '');
  form.querySelectorAll('input[type="checkbox"]').forEach(f => f.checked = false);
  form.querySelectorAll('input[type="range"]').forEach(f => { f.value = 5; });
}

// ── EXPORT ───────────────────────────────────────────────────────────────────
function exportToJSON() {
  if (!Object.keys(ENTRIES).length) {
    showToast('No entries to export yet', 'error');
    return;
  }
  const data = {
    exportedAt: new Date().toISOString(),
    totalEntries: Object.values(ENTRIES).flat().length,
    entries: ENTRIES
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `dpc-export-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  showToast('Export downloaded — upload to OneDrive', 'success');
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.style.cssText = `
    padding:.65rem 1rem;
    border-radius:8px;
    font-size:.82rem;
    margin-bottom:.4rem;
    color:#fff;
    box-shadow:0 4px 12px rgba(0,0,0,.2);
    background:${type === 'success' ? '#15803d' : type === 'error' ? '#b91c1c' : '#0c1f35'};
  `;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (DARK_MODE) {
    document.body.classList.add('dark-mode');
    const btn = document.querySelector('.dark-mode-toggle');
    if (btn) btn.textContent = '☀️ Light mode';
  }
  loadConfig();
});
