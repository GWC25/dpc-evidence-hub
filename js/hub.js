/**
 * DPC Evidence Hub — hub.js
 * Main app logic: navigation, config loading, form rendering, data persistence
 * Data saved to OneDrive as domain-split JSON files (via export/import)
 */

let CONFIG = null;
let ENTRIES = {};

/**
 * NAVIGATION — switch between sections
 */
function navigateTo(sectionId) {
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Show selected section
  const section = document.getElementById(`section-${sectionId}`);
  if (section) {
    section.classList.add('active');
  }

  // Mark nav button as active
  event.target.closest('.nav-item')?.classList.add('active');
}

/**
 * LOAD CONFIG — fetch config.json from data folder
 */
async function loadConfig() {
  try {
    const response = await fetch('data/config.json');
    CONFIG = await response.json();
    
    // Update settings page
    document.getElementById('config-status').innerHTML = `
      ✓ Configuration loaded successfully.<br>
      <strong>${CONFIG.areas?.length || 0} curriculum areas</strong><br>
      <strong>${CONFIG.templates?.length || 0} templates</strong><br>
      <strong>${CONFIG.commonPurposes?.length || 0} common purposes</strong>
    `;

    // Load areas
    loadAreas();

    showToast('Configuration loaded', 'success');
  } catch (err) {
    showToast('Failed to load config: ' + err.message, 'error');
    console.error(err);
  }
}

/**
 * LOAD AREAS — display curriculum areas in settings
 */
function loadAreas() {
  if (!CONFIG || !CONFIG.areas) return;
  
  const areaCount = CONFIG.areas.length;
  let areasHtml = `<p><strong>${areaCount} Curriculum Areas</strong></p>`;
  areasHtml += '<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:.5rem; font-size:.8rem;">';
  
  CONFIG.areas.forEach(area => {
    areasHtml += `<div style="padding:.5rem; background:#f5f4f0; border-radius:6px;">
      <strong>${area.code}</strong> — ${area.name}
    </div>`;
  });
  
  areasHtml += '</div>';
  document.getElementById('areas-status').innerHTML = areasHtml;
}

/**
 * LOAD TEMPLATE — when user selects an activity type in Quick Capture
 */
function loadTemplate(templateId) {
  if (!CONFIG) {
    showToast('Please load config first', 'error');
    return;
  }

  if (!templateId) return;

  const template = CONFIG.templates.find(t => t.id === templateId);
  if (!template) {
    showToast('Template not found', 'error');
    return;
  }

  // Build the form
  const form = TemplateAssembler.buildForm(template, CONFIG);
  document.getElementById('qc-form-container').innerHTML = '';
  document.getElementById('qc-form-container').appendChild(form);

  // Show right panel
  document.getElementById('qc-right-panel').style.display = 'block';

  showToast(`Loaded: ${template.name}`, 'success');
}

/**
 * SAVE ENTRY — collect form data and prepare for export
 */
function saveEntry(templateId) {
  if (!CONFIG) {
    showToast('Config not loaded', 'error');
    return;
  }

  const template = CONFIG.templates.find(t => t.id === templateId);
  if (!template) return;

  // Build entry object from form
  const entry = buildEntryFromForm(templateId, CONFIG);
  if (!entry) {
    showToast('Failed to create entry', 'error');
    return;
  }

  // Store in memory (will be exported to JSON)
  if (!ENTRIES[templateId]) ENTRIES[templateId] = [];
  ENTRIES[templateId].push(entry);

  // Update entry count
  const totalEntries = Object.values(ENTRIES).flat().length;
  document.getElementById('entry-count').textContent = totalEntries;

  // Log to evidence log
  logEntryToEvidence(entry, template);

  showToast(`Saved: ${template.name}`, 'success');
  clearFormById(templateId);
}

/**
 * LOG ENTRY TO EVIDENCE LOG VIEW
 */
function logEntryToEvidence(entry, template) {
  const logContainer = document.getElementById('evidence-log-placeholder');
  
  if (logContainer.innerHTML.includes('No entries')) {
    logContainer.innerHTML = '';
  }

  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.style.cssText = 'margin-bottom:.5rem; padding:.6rem; background:#f5f4f0; border-radius:6px; border-left:3px solid #1d4e89;';
  logEntry.innerHTML = `
    <div class="log-meta">
      <strong>${template.name}</strong> · 
      <span style="font-family:var(--font-mono); font-size:.75rem;">
        ${new Date().toLocaleString()}
      </span>
    </div>
    <div style="font-size:.8rem; color:#4b5563; margin-top:.3rem;">
      Entry ID: ${entry.id}
    </div>
  `;
  
  logContainer.insertBefore(logEntry, logContainer.firstChild);
}

/**
 * CLEAR FORM
 */
function clearFormById(templateId) {
  const form = document.getElementById(`form-${templateId}`);
  if (form) {
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.value = '';
    });
  }
}

/**
 * EXPORT TO JSON — prepare entries for OneDrive upload
 * Routes entries to appropriate domain-split files
 */
function exportToJSON() {
  if (Object.keys(ENTRIES).length === 0) {
    showToast('No entries to export', 'error');
    return;
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    entries: ENTRIES,
    metadata: {
      totalEntries: Object.values(ENTRIES).flat().length,
      templates: Object.keys(ENTRIES).map(tId => {
        const t = CONFIG.templates.find(x => x.id === tId);
        return t?.name || tId;
      })
    }
  };

  // Create downloadable JSON
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dpc-evidence-hub-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  showToast('Exported to JSON file. Upload to OneDrive data folder.', 'success');
}

/**
 * TOAST NOTIFICATIONS
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.cssText = 'padding:.65rem 1rem; border-radius:10px; font-size:.82rem; margin-bottom:.5rem;';
  toast.textContent = message;

  if (type === 'success') toast.style.background = '#15803d';
  if (type === 'error') toast.style.background = '#b91c1c';
  if (type === 'info') toast.style.background = '#0c1f35';
  toast.style.color = '#fff';

  container.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * INITIALIZE APP ON PAGE LOAD
 */
document.addEventListener('DOMContentLoaded', () => {
  // Load config on startup
  loadConfig();
});
