/**
 * DPC Evidence Hub — Web Parts Library
 * Reusable form components that assemble into different templates
 * WCAG 2.2 AA compliant
 */

const WebParts = {
  
  /**
   * DATE PICKER — ISO date input
   */
  datePicker: (fieldId, label = "Date", required = true) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <input type="date" id="${fieldId}" ${required ? 'required aria-required="true"' : ''}>
    `;
    return {
      container,
      getValue: () => document.getElementById(fieldId).value,
      setValue: (val) => { document.getElementById(fieldId).value = val; },
      clear: () => { document.getElementById(fieldId).value = ''; }
    };
  },

  /**
   * TEXT INPUT — with optional mic button
   */
  textInput: (fieldId, label, required = false, hasMic = false) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    const micBtn = hasMic ? `<button class="mic-btn" onclick="startDictation('${fieldId}')" aria-label="Dictate ${label}">🎤</button>` : '';
    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <div class="input-with-mic">
        <input type="text" id="${fieldId}" ${required ? 'required aria-required="true"' : ''}>
        ${micBtn}
      </div>
    `;
    return {
      container,
      getValue: () => document.getElementById(fieldId).value,
      setValue: (val) => { document.getElementById(fieldId).value = val; },
      clear: () => { document.getElementById(fieldId).value = ''; }
    };
  },

  /**
   * TEXTAREA — multi-line with optional mic button
   */
  textArea: (fieldId, label, rows = 5, hasMic = false, required = false) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    const micBtn = hasMic ? `<button class="mic-btn" onclick="startDictation('${fieldId}')" aria-label="Dictate ${label}" style="margin-top:2px">🎤</button>` : '';
    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <div class="input-with-mic" style="align-items: flex-start;">
        <textarea id="${fieldId}" rows="${rows}" ${required ? 'required aria-required="true"' : ''}></textarea>
        ${micBtn}
      </div>
    `;
    return {
      container,
      getValue: () => document.getElementById(fieldId).value,
      setValue: (val) => { document.getElementById(fieldId).value = val; },
      clear: () => { document.getElementById(fieldId).value = ''; }
    };
  },

  /**
   * DROPDOWN SELECT — linked to config data (areas, people, etc.)
   */
  selectDropdown: (fieldId, label, linkedTo = null, required = false, config = null) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    let options = '<option value="">— select —</option>';
    
    if (linkedTo === 'areas' && config) {
      options += config.areas.map(a => `<option value="${a.code}">${a.code} — ${a.name}</option>`).join('');
    }
    if (linkedTo === 'commonPurposes' && config) {
      options += config.commonPurposes.map(cp => `<option value="${cp.id}">${cp.label}</option>`).join('');
    }
    
    container.innerHTML = `
      <label for="${fieldId}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <select id="${fieldId}" ${required ? 'required aria-required="true"' : ''}>
        ${options}
      </select>
    `;
    return {
      container,
      getValue: () => document.getElementById(fieldId).value,
      setValue: (val) => { document.getElementById(fieldId).value = val; },
      clear: () => { document.getElementById(fieldId).value = ''; }
    };
  },

  /**
   * PEOPLE PICKER — multi-select from people registry
   */
  peoplePicker: (fieldId, label, config = null) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    let options = '';
    if (config && config.peopleRegistry) {
      options = config.peopleRegistry.map(p => `
        <label class="tag-checkbox-row">
          <input type="checkbox" value="${p.id}" class="people-picker-checkbox">
          ${p.name} — ${p.role}
        </label>
      `).join('');
    }
    container.innerHTML = `
      <label>${label}</label>
      <div id="${fieldId}-group" style="display:flex; flex-direction:column; gap:.3rem;">
        ${options}
      </div>
    `;
    return {
      container,
      getValue: () => {
        const checked = container.querySelectorAll('.people-picker-checkbox:checked');
        return Array.from(checked).map(c => c.value);
      },
      setValue: (vals) => {
        container.querySelectorAll('.people-picker-checkbox').forEach(c => {
          c.checked = vals.includes(c.value);
        });
      },
      clear: () => {
        container.querySelectorAll('.people-picker-checkbox').forEach(c => c.checked = false);
      }
    };
  },

  /**
   * MOOD/STRESS SLIDERS — 1-10 scales for tracking
   */
  moodSliders: (fieldIdPrefix) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-top:.5rem;">
        <div>
          <label for="${fieldIdPrefix}-mood" style="display:block; font-size:.75rem; margin-bottom:.5rem;">Mood (1-10)</label>
          <input type="range" id="${fieldIdPrefix}-mood" min="1" max="10" value="5" style="width:100%;">
          <span id="${fieldIdPrefix}-mood-val" style="font-size:.7rem; color:#666;">5</span>
        </div>
        <div>
          <label for="${fieldIdPrefix}-stress" style="display:block; font-size:.75rem; margin-bottom:.5rem;">Stress (1-10)</label>
          <input type="range" id="${fieldIdPrefix}-stress" min="1" max="10" value="5" style="width:100%;">
          <span id="${fieldIdPrefix}-stress-val" style="font-size:.7rem; color:#666;">5</span>
        </div>
        <div>
          <label for="${fieldIdPrefix}-confidence" style="display:block; font-size:.75rem; margin-bottom:.5rem;">Confidence (1-10)</label>
          <input type="range" id="${fieldIdPrefix}-confidence" min="1" max="10" value="5" style="width:100%;">
          <span id="${fieldIdPrefix}-confidence-val" style="font-size:.7rem; color:#666;">5</span>
        </div>
      </div>
    `;
    
    // Update displays on change
    ['mood', 'stress', 'confidence'].forEach(scale => {
      const input = container.querySelector(`#${fieldIdPrefix}-${scale}`);
      const display = container.querySelector(`#${fieldIdPrefix}-${scale}-val`);
      input.addEventListener('input', () => { display.textContent = input.value; });
    });
    
    return {
      container,
      getValue: () => ({
        mood: parseInt(document.getElementById(`${fieldIdPrefix}-mood`).value),
        stress: parseInt(document.getElementById(`${fieldIdPrefix}-stress`).value),
        confidence: parseInt(document.getElementById(`${fieldIdPrefix}-confidence`).value)
      }),
      setValue: (obj) => {
        if (obj.mood) document.getElementById(`${fieldIdPrefix}-mood`).value = obj.mood;
        if (obj.stress) document.getElementById(`${fieldIdPrefix}-stress`).value = obj.stress;
        if (obj.confidence) document.getElementById(`${fieldIdPrefix}-confidence`).value = obj.confidence;
      },
      clear: () => {
        ['mood', 'stress', 'confidence'].forEach(scale => {
          document.getElementById(`${fieldIdPrefix}-${scale}`).value = 5;
          document.getElementById(`${fieldIdPrefix}-${scale}-val`).textContent = '5';
        });
      }
    };
  },

  /**
   * PREVIOUS ACTIONS (LOCKED & TICKABLE) — auto-filled from prior meeting
   */
  previousActionsLocked: (fieldId, previousActions = []) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    let html = `<label>${previousActions.length > 0 ? 'Previous Actions (locked, tickable)' : 'No previous actions'}</label>`;
    if (previousActions.length > 0) {
      html += '<div style="background:#f5f4f0; padding:.6rem; border-radius:6px; border-left:3px solid #d6d3cb;">';
      previousActions.forEach((action, idx) => {
        html += `
          <label class="tag-checkbox-row" style="margin-bottom:.3rem;">
            <input type="checkbox" value="${action}" class="prev-action-checkbox">
            <span style="font-size:.8rem; color:#1a1916;">${action}</span>
          </label>
        `;
      });
      html += '</div>';
    }
    container.innerHTML = html;
    return {
      container,
      getValue: () => {
        const checked = container.querySelectorAll('.prev-action-checkbox:checked');
        return Array.from(checked).map(c => c.value);
      },
      clear: () => {
        container.querySelectorAll('.prev-action-checkbox').forEach(c => c.checked = false);
      }
    };
  },

  /**
   * ACTION POINTS — structured list with deadline, who, support
   */
  actionPoints: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Action Points / Next Steps</label>
      <div id="${fieldId}-list" style="margin-bottom:.5rem;">
        <div class="action-point-row" style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr auto; gap:.5rem; padding:.5rem; background:#f5f4f0; border-radius:6px; margin-bottom:.4rem;">
          <input type="text" class="action-text" placeholder="Action..." style="font-size:.8rem;">
          <input type="date" class="action-date" style="font-size:.8rem;">
          <input type="text" class="action-who" placeholder="Who..." style="font-size:.8rem;">
          <input type="text" class="action-support" placeholder="Support needed..." style="font-size:.8rem;">
          <button class="btn btn-icon btn-sm" onclick="removeActionRow(this)" aria-label="Remove action">✕</button>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="addActionRow('${fieldId}-list')">+ Add action</button>
    `;
    return {
      container,
      getValue: () => {
        const rows = container.querySelectorAll('.action-point-row');
        return Array.from(rows).map(row => ({
          action: row.querySelector('.action-text').value,
          deadline: row.querySelector('.action-date').value,
          who: row.querySelector('.action-who').value,
          support: row.querySelector('.action-support').value
        })).filter(a => a.action);
      },
      clear: () => {
        const list = container.querySelector(`#${fieldId}-list`);
        list.innerHTML = `
          <div class="action-point-row" style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr auto; gap:.5rem; padding:.5rem; background:#f5f4f0; border-radius:6px; margin-bottom:.4rem;">
            <input type="text" class="action-text" placeholder="Action..." style="font-size:.8rem;">
            <input type="date" class="action-date" style="font-size:.8rem;">
            <input type="text" class="action-who" placeholder="Who..." style="font-size:.8rem;">
            <input type="text" class="action-support" placeholder="Support needed..." style="font-size:.8rem;">
            <button class="btn btn-icon btn-sm" onclick="removeActionRow(this)" aria-label="Remove action">✕</button>
          </div>
        `;
      }
    };
  },

  /**
   * TAG PICKER — three-tier (themes, Ofsted, DTPF, KPIs, accountability)
   */
  tagPicker: (fieldId, config = null, preSelectedTags = []) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Tags</label>
      <button class="btn btn-secondary btn-sm" id="${fieldId}-btn" onclick="openTagPicker()">🏷 Tags</button>
      <div id="${fieldId}-chips" class="flex flex-wrap gap-4" style="margin-top:.5rem;" aria-live="polite"></div>
    `;
    return {
      container,
      getValue: () => {
        const tags = container.querySelectorAll('.tag.selected');
        return Array.from(tags).map(t => t.dataset.tagId);
      },
      setValue: (tagIds) => {
        // To be wired to tag picker modal
      },
      setSelectedTags: (tagIds) => {
        const chips = container.querySelector(`#${fieldId}-chips`);
        chips.innerHTML = tagIds.map(tId => {
          const tag = config?.commonPurposes.find(cp => cp.id === tId);
          return `<span class="badge">${tag?.label || tId}</span>`;
        }).join('');
      },
      clear: () => {
        container.querySelector(`#${fieldId}-chips`).innerHTML = '';
      }
    };
  },

  /**
   * THREAD LINKER — link to existing workflow thread or create new
   */
  threadLinker: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label for="${fieldId}">Link to Thread / Workflow</label>
      <select id="${fieldId}">
        <option value="">— not linked to a thread —</option>
      </select>
      <label class="tag-checkbox-row" style="margin-top:.5rem;">
        <input type="checkbox" id="${fieldId}-new" onchange="toggleNewThreadInput('${fieldId}')">
        Or start a new workflow thread
      </label>
      <div id="${fieldId}-new-row" style="display:none; margin-top:.5rem;">
        <div class="form-group">
          <label for="${fieldId}-new-name">Thread name</label>
          <input type="text" id="${fieldId}-new-name" placeholder="e.g. ENG · Thanos Adamos · Coaching · Apr 2026">
        </div>
      </div>
    `;
    return {
      container,
      getValue: () => {
        const isNew = document.getElementById(`${fieldId}-new`).checked;
        return {
          threadId: isNew ? null : document.getElementById(fieldId).value,
          newThreadName: isNew ? document.getElementById(`${fieldId}-new-name`).value : null
        };
      },
      clear: () => {
        document.getElementById(fieldId).value = '';
        document.getElementById(`${fieldId}-new`).checked = false;
        document.getElementById(`${fieldId}-new-row`).style.display = 'none';
        document.getElementById(`${fieldId}-new-name`).value = '';
      }
    };
  },

  /**
   * EVIDENCE LINKS — file, recording, screenshot, link
   */
  evidenceLinks: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Evidence Links</label>
      <p style="font-size:.8rem; color:#4b5563; margin-bottom:.5rem;">SharePoint files, Teams recordings, screenshots, outputs…</p>
      <div id="${fieldId}-list" style="margin-bottom:.5rem;"></div>
      <button class="btn btn-secondary btn-sm" onclick="addEvidenceLink('${fieldId}-list')">+ Add link</button>
    `;
    return {
      container,
      getValue: () => {
        const rows = container.querySelectorAll('.evidence-link-row');
        return Array.from(rows).map(row => ({
          url: row.querySelector('.evidence-url').value,
          label: row.querySelector('.evidence-label').value
        })).filter(e => e.url);
      },
      clear: () => {
        document.getElementById(`${fieldId}-list`).innerHTML = '';
      }
    };
  }

};

// HELPER FUNCTIONS FOR WEB PARTS
function addActionRow(containerId) {
  const container = document.getElementById(containerId);
  const newRow = document.createElement('div');
  newRow.className = 'action-point-row';
  newRow.style.cssText = 'display:grid; grid-template-columns:2fr 1fr 1fr 1fr auto; gap:.5rem; padding:.5rem; background:#f5f4f0; border-radius:6px; margin-bottom:.4rem;';
  newRow.innerHTML = `
    <input type="text" class="action-text" placeholder="Action..." style="font-size:.8rem;">
    <input type="date" class="action-date" style="font-size:.8rem;">
    <input type="text" class="action-who" placeholder="Who..." style="font-size:.8rem;">
    <input type="text" class="action-support" placeholder="Support needed..." style="font-size:.8rem;">
    <button class="btn btn-icon btn-sm" onclick="removeActionRow(this)" aria-label="Remove action">✕</button>
  `;
  container.appendChild(newRow);
}

function removeActionRow(btn) {
  btn.closest('.action-point-row').remove();
}

function toggleNewThreadInput(fieldId) {
  const checkbox = document.getElementById(`${fieldId}-new`);
  const newRow = document.getElementById(`${fieldId}-new-row`);
  const select = document.getElementById(fieldId);
  newRow.style.display = checkbox.checked ? 'block' : 'none';
  select.disabled = checkbox.checked;
  if (checkbox.checked) select.value = '';
}

function addEvidenceLink(containerId) {
  const container = document.getElementById(containerId);
  const newRow = document.createElement('div');
  newRow.className = 'evidence-link-row';
  newRow.style.cssText = 'display:grid; grid-template-columns:2fr 1fr auto; gap:.5rem; padding:.5rem; background:#f5f4f0; border-radius:6px; margin-bottom:.4rem;';
  newRow.innerHTML = `
    <input type="url" class="evidence-url" placeholder="https://..." style="font-size:.8rem;">
    <input type="text" class="evidence-label" placeholder="Label..." style="font-size:.8rem;">
    <button class="btn btn-icon btn-sm" onclick="this.closest('.evidence-link-row').remove()" aria-label="Remove link">✕</button>
  `;
  container.appendChild(newRow);
}

function startDictation(fieldId) {
  // Placeholder — integrate with Web Speech API
  const btn = event.target;
  btn.classList.add('recording');
  btn.textContent = '⏹';
  // On stop: remove 'recording' class, revert text to 🎤
}
