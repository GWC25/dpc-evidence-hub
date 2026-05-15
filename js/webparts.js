/**
 * DPC Evidence Hub — webparts.js
 * Reusable form components — all read from config, no hardcoded data
 * WCAG 2.2 AA compliant
 */

const WebParts = {

  // ── DATE PICKER ────────────────────────────────────────────────────────────
  datePicker: (fieldId, label = 'Date', required = true) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <input type="date" id="${fieldId}" ${required ? 'required aria-required="true"' : ''}>
    `;
    return { container, getValue: () => document.getElementById(fieldId)?.value };
  },

  // ── NUMBER INPUT ───────────────────────────────────────────────────────────
  numberInput: (fieldId, label) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label for="${fieldId}">${label}</label>
      <input type="number" id="${fieldId}" min="0" style="max-width:120px;">
    `;
    return { container, getValue: () => document.getElementById(fieldId)?.value };
  },

  // ── TEXT INPUT ─────────────────────────────────────────────────────────────
  textInput: (fieldId, label, required = false, hasMic = false) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    const mic = hasMic ? `<button type="button" class="mic-btn" onclick="startDictation('${fieldId}')" aria-label="Dictate ${label}">🎤</button>` : '';
    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <div class="input-with-mic">
        <input type="text" id="${fieldId}" ${required ? 'required aria-required="true"' : ''}>
        ${mic}
      </div>
    `;
    return { container, getValue: () => document.getElementById(fieldId)?.value };
  },

  // ── TEXTAREA ───────────────────────────────────────────────────────────────
  textArea: (fieldId, label, rows = 5, hasMic = false, required = false) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    const mic = hasMic ? `<button type="button" class="mic-btn" onclick="startDictation('${fieldId}')" aria-label="Dictate ${label}">🎤</button>` : '';
    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <div class="input-with-mic" style="align-items:flex-start;">
        <textarea id="${fieldId}" rows="${rows}" ${required ? 'required aria-required="true"' : ''}></textarea>
        ${mic}
      </div>
    `;
    return { container, getValue: () => document.getElementById(fieldId)?.value };
  },

  // ── DROPDOWN SELECT ────────────────────────────────────────────────────────
  // linkedTo: 'areas' | 'cogsThemes' | null (pass staticOptions array instead)
  selectDropdown: (fieldId, label, linkedTo = null, required = false, config = null, staticOptions = []) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    let opts = '<option value="">— select —</option>';

    if (linkedTo === 'areas' && config?.areas) {
      opts += config.areas.map(a => `<option value="${a.code}">${a.code} — ${a.name}</option>`).join('');
    } else if (linkedTo === 'cogsThemes' && config?.cogsThemes) {
      opts += config.cogsThemes.map(t => `<option value="${t}">${t}</option>`).join('');
    } else if (staticOptions.length) {
      opts += staticOptions.map(o => `<option value="${o}">${o}</option>`).join('');
    }

    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <select id="${fieldId}" ${required ? 'required aria-required="true"' : ''}>${opts}</select>
    `;
    return { container, getValue: () => document.getElementById(fieldId)?.value };
  },

  // ── PEOPLE PICKER — reads from config.peopleRegistry ─────────────────────
  peoplePicker: (fieldId, label, config = null) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    const people = config?.peopleRegistry || [];
    const rows = people.map(p => `
      <label class="tag-checkbox-row">
        <input type="checkbox" value="${p.id}" class="people-picker-cb" name="${fieldId}-people">
        <span>${p.name}${p.role ? ' — <em style="font-weight:400;font-style:normal;color:var(--color-slate)">' + p.role + '</em>' : ''}</span>
      </label>
    `).join('');

    container.innerHTML = `
      <label>${label}</label>
      <div id="${fieldId}-group" class="people-picker-group">
        ${rows || '<p style="font-size:.8rem;color:var(--color-slate)">No people in registry — add to config.json</p>'}
      </div>
    `;
    return {
      container,
      getValue: () => Array.from(container.querySelectorAll('.people-picker-cb:checked')).map(c => c.value)
    };
  },

  // ── MOOD / STRESS / CONFIDENCE SLIDERS ────────────────────────────────────
  moodSliders: (fieldIdPrefix) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Wellbeing Check-in</label>
      <div class="sliders-grid">
        ${['Mood', 'Stress', 'Confidence'].map(name => {
          const id = `${fieldIdPrefix}-${name.toLowerCase()}`;
          return `
            <div class="slider-item">
              <label for="${id}" style="font-size:.8rem;">${name} (1–10)</label>
              <div style="display:flex;gap:.5rem;align-items:center;">
                <input type="range" id="${id}" min="1" max="10" value="5" style="flex:1;" aria-valuemin="1" aria-valuemax="10" aria-valuenow="5">
                <output id="${id}-val" for="${id}" style="min-width:1.5rem;text-align:right;font-family:var(--font-mono);font-size:.85rem;">5</output>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    // Wire live output updates
    ['mood','stress','confidence'].forEach(s => {
      const input = container.querySelector(`#${fieldIdPrefix}-${s}`);
      const out   = container.querySelector(`#${fieldIdPrefix}-${s}-val`);
      input.addEventListener('input', () => { out.value = input.value; input.setAttribute('aria-valuenow', input.value); });
    });
    return {
      container,
      getValue: () => ({
        mood:       parseInt(document.getElementById(`${fieldIdPrefix}-mood`)?.value),
        stress:     parseInt(document.getElementById(`${fieldIdPrefix}-stress`)?.value),
        confidence: parseInt(document.getElementById(`${fieldIdPrefix}-confidence`)?.value)
      })
    };
  },

  // ── PREVIOUS ACTIONS — locked & tickable ──────────────────────────────────
  previousActionsLocked: (fieldId, previousActions = []) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    if (!previousActions.length) {
      container.innerHTML = `<p class="prev-actions-empty">No previous actions</p>`;
    } else {
      container.innerHTML = `
        <label>Previous Actions <span style="font-size:.75rem;font-weight:400;">(locked — tick to mark complete)</span></label>
        <div class="prev-actions-list">
          ${previousActions.map(a => `
            <label class="tag-checkbox-row prev-action-item">
              <input type="checkbox" class="prev-action-cb" value="${a}">
              <span>${a}</span>
            </label>
          `).join('')}
        </div>
      `;
    }
    return {
      container,
      getValue: () => Array.from(container.querySelectorAll('.prev-action-cb:checked')).map(c => c.value)
    };
  },

  // ── ACTION POINTS ──────────────────────────────────────────────────────────
  actionPoints: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Action Points / Next Steps</label>
      <div id="${fieldId}-list">
        ${WebParts._actionRow()}
      </div>
      <button type="button" class="btn btn-secondary btn-sm" style="margin-top:.5rem;" onclick="addActionRow('${fieldId}-list')">+ Add action</button>
    `;
    return {
      container,
      getValue: () => Array.from(container.querySelectorAll('.action-point-row')).map(row => ({
        action:   row.querySelector('.action-text')?.value,
        deadline: row.querySelector('.action-date')?.value,
        who:      row.querySelector('.action-who')?.value,
        support:  row.querySelector('.action-support')?.value
      })).filter(a => a.action)
    };
  },

  _actionRow: () => `
    <div class="action-point-row">
      <input type="text"  class="action-text"    placeholder="Action…">
      <input type="date"  class="action-date">
      <input type="text"  class="action-who"     placeholder="Who…">
      <input type="text"  class="action-support" placeholder="Support needed…">
      <button type="button" class="btn btn-icon btn-sm" onclick="removeActionRow(this)" aria-label="Remove action">✕</button>
    </div>
  `,

  // ── TAG PICKER — reads from config.commonPurposes ─────────────────────────
  tagPicker: (fieldId, config = null, preSelected = []) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    const purposes = config?.commonPurposes || [];

    // Group by category
    const grouped = {};
    purposes.forEach(cp => {
      if (!grouped[cp.category]) grouped[cp.category] = [];
      grouped[cp.category].push(cp);
    });

    const rows = Object.entries(grouped).map(([cat, items]) => `
      <div class="tag-category">
        <div class="tag-category-label">${cat}</div>
        <div class="tag-options">
          ${items.map(cp => `
            <label class="tag-option ${preSelected.includes(cp.id) ? 'selected' : ''}">
              <input type="checkbox" class="tag-cb" value="${cp.id}" name="${fieldId}-tags" ${preSelected.includes(cp.id) ? 'checked' : ''}>
              ${cp.label}
            </label>
          `).join('')}
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <label>Tags</label>
      <div id="${fieldId}-tags-panel" class="tags-panel">${rows || '<p style="font-size:.8rem;color:var(--color-slate)">No tags in config</p>'}</div>
    `;
    return {
      container,
      getValue: () => Array.from(container.querySelectorAll('.tag-cb:checked')).map(c => c.value)
    };
  },

  // ── THREAD LINKER ──────────────────────────────────────────────────────────
  threadLinker: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label for="${fieldId}">Link to Thread / Workflow</label>
      <select id="${fieldId}">
        <option value="">— not linked —</option>
      </select>
      <label class="tag-checkbox-row" style="margin-top:.5rem;">
        <input type="checkbox" id="${fieldId}-new" onchange="toggleNewThreadInput('${fieldId}')">
        Start a new thread
      </label>
      <div id="${fieldId}-new-row" style="display:none;margin-top:.5rem;">
        <input type="text" id="${fieldId}-new-name" placeholder="e.g. ENG · Coaching · May 2026" style="width:100%;">
      </div>
    `;
    return {
      container,
      getValue: () => ({
        threadId: document.getElementById(`${fieldId}-new`)?.checked ? null : document.getElementById(fieldId)?.value,
        newThreadName: document.getElementById(`${fieldId}-new`)?.checked ? document.getElementById(`${fieldId}-new-name`)?.value : null
      })
    };
  },

  // ── EVIDENCE LINKS ─────────────────────────────────────────────────────────
  evidenceLinks: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Evidence Links</label>
      <p style="font-size:.78rem;color:var(--color-slate);margin-bottom:.4rem;">SharePoint files, Teams recordings, screenshots…</p>
      <div id="${fieldId}-list"></div>
      <button type="button" class="btn btn-secondary btn-sm" onclick="addEvidenceLink('${fieldId}-list')">+ Add link</button>
    `;
    return {
      container,
      getValue: () => Array.from(container.querySelectorAll('.evidence-link-row')).map(row => ({
        url:   row.querySelector('.evidence-url')?.value,
        label: row.querySelector('.evidence-label')?.value
      })).filter(e => e.url)
    };
  },

  // ── RESOURCE LINKS — attach files, links, SharePoint docs ─────────────────
  // Used for: Resources in COGs, coaching planning materials, session resources
  resourceLinks: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Resources / Links
        <span style="font-size:.75rem;font-weight:400;color:var(--color-slate)"> — SharePoint files, AI agents, Teams recordings, websites</span>
      </label>
      <div id="${fieldId}-list" class="resource-links-list"></div>
      <button type="button" class="btn btn-secondary btn-sm" style="margin-top:.5rem;" onclick="addResourceLink('${fieldId}-list')">+ Add resource</button>
    `;
    // Auto-add one blank row so it's immediately usable
    setTimeout(() => addResourceLink(`${fieldId}-list`), 0);
    return {
      container,
      getValue: () => Array.from(container.querySelectorAll('.resource-link-row')).map(row => ({
        label: row.querySelector('.resource-link-label')?.value,
        url:   row.querySelector('.resource-link-url')?.value,
        type:  row.querySelector('.resource-link-type')?.value
      })).filter(r => r.url || r.label)
    };
  },

  // ── RESOURCE / AI AGENT LINK ──────────────────────────────────────────────
  resourceUrl: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label for="${fieldId}">Resource / AI Agent Link <span style="font-size:.75rem;font-weight:400;color:var(--color-slate)">(optional)</span></label>
      <div class="resource-url-row">
        <input type="url" id="${fieldId}" placeholder="https://…" style="flex:1;">
        <button type="button" class="btn btn-secondary btn-sm" id="${fieldId}-open"
          onclick="openResourceUrl('${fieldId}')" aria-label="Open link in new tab">Open ↗</button>
      </div>
      <p style="font-size:.75rem;color:var(--color-slate);margin-top:.25rem;">
        Paste a SharePoint resource, AI agent URL, or any reference link here.
      </p>
    `;
    return {
      container,
      getValue: () => document.getElementById(fieldId)?.value
    };
  },


};

// ── GLOBAL HELPERS ────────────────────────────────────────────────────────────

function addActionRow(containerId) {
  document.getElementById(containerId).insertAdjacentHTML('beforeend', WebParts._actionRow());
}

function removeActionRow(btn) {
  btn.closest('.action-point-row').remove();
}

function toggleNewThreadInput(fieldId) {
  const cb    = document.getElementById(`${fieldId}-new`);
  const row   = document.getElementById(`${fieldId}-new-row`);
  const sel   = document.getElementById(fieldId);
  row.style.display = cb.checked ? 'block' : 'none';
  sel.disabled = cb.checked;
}

function addEvidenceLink(containerId) {
  const div = document.createElement('div');
  div.className = 'evidence-link-row';
  div.innerHTML = `
    <input type="url"  class="evidence-url"   placeholder="https://…">
    <input type="text" class="evidence-label" placeholder="Label…">
    <button type="button" class="btn btn-icon btn-sm" onclick="this.closest('.evidence-link-row').remove()" aria-label="Remove">✕</button>
  `;
  document.getElementById(containerId).appendChild(div);
}

function startDictation(fieldId) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = 'en-GB';
  recognition.interimResults = false;
  recognition.onresult = (e) => {
    const el = document.getElementById(fieldId);
    if (el) el.value += (el.value ? ' ' : '') + e.results[0][0].transcript;
  };
  recognition.start();
}

function openResourceUrl(fieldId) {
  const url = document.getElementById(fieldId)?.value;
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    alert('Enter a URL first.');
  }
}

function addResourceLink(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'resource-link-row';
  row.innerHTML = `
    <input type="text" class="resource-link-label" placeholder="Label e.g. Session slides">
    <select class="resource-link-type" aria-label="Resource type">
      <option value="link">Link</option>
      <option value="sharepoint">SharePoint</option>
      <option value="teams">Teams recording</option>
      <option value="ai-agent">AI Agent</option>
      <option value="file">File / other</option>
    </select>
    <input type="url" class="resource-link-url" placeholder="https://…">
    <button type="button" class="btn btn-secondary btn-sm resource-open-btn"
      onclick="openResourceLinkRow(this)" aria-label="Open link">↗</button>
    <button type="button" class="btn btn-icon btn-sm"
      onclick="this.closest('.resource-link-row').remove()" aria-label="Remove">✕</button>
  `;
  container.appendChild(row);
}

function openResourceLinkRow(btn) {
  const url = btn.closest('.resource-link-row').querySelector('.resource-link-url')?.value;
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
  else alert('Enter a URL first.');
}
