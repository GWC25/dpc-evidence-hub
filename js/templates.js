/**
 * DPC Evidence Hub — Template Assembler
 * Builds forms from config.json template definitions + web parts
 */

const TemplateAssembler = {

  /**
   * Build a form from a template definition
   * @param {Object} template - template definition from config.json
   * @param {Object} config - entire config.json
   * @returns {HTMLElement} - assembled form container
   */
  buildForm: (template, config) => {
    const form = document.createElement('div');
    form.id = `form-${template.id}`;
    form.className = 'template-form';
    form.style.cssText = 'display:grid; grid-template-columns:2fr 1fr; gap:1rem;';

    const leftColumn = document.createElement('div');
    const rightColumn = document.createElement('div');

    // Build left column (main capture fields)
    const leftWebParts = template.webParts.slice(0, Math.ceil(template.webParts.length / 2));
    leftWebParts.forEach(wpId => {
      const wp = TemplateAssembler.renderWebPart(wpId, template, config);
      if (wp) leftColumn.appendChild(wp.container);
    });

    // Build right column (tags, thread linker, save)
    const rightWebParts = template.webParts.slice(Math.ceil(template.webParts.length / 2));
    rightWebParts.forEach(wpId => {
      const wp = TemplateAssembler.renderWebPart(wpId, template, config);
      if (wp) rightColumn.appendChild(wp.container);
    });

    form.appendChild(leftColumn);
    form.appendChild(rightColumn);

    // Add save buttons at bottom
    const buttons = document.createElement('div');
    buttons.style.cssText = 'grid-column:1/3; display:flex; gap:.5rem; margin-top:1rem;';
    buttons.innerHTML = `
      <button class="btn btn-primary" onclick="saveEntry('${template.id}')">✦ Save entry</button>
      <button class="btn btn-secondary" onclick="clearForm('${template.id}')">Clear</button>
    `;
    form.appendChild(buttons);

    return form;
  },

  /**
   * Render a single web part based on its ID and type
   */
  renderWebPart: (wpId, template, config) => {
    const wpDef = config.webParts[wpId];
    if (!wpDef) return null;

    let wp = null;

    // Route to correct web part based on type
    if (wpId === 'date') {
      wp = WebParts.datePicker(wpId, wpDef.label, wpDef.required);
    } else if (wpId === 'title') {
      wp = WebParts.textInput(wpId, wpDef.label, wpDef.required, wpDef.hasMic);
    } else if (wpId === 'newNotes' || wpId === 'keyPoints' || wpId === 'notes') {
      wp = WebParts.textArea(wpId, wpDef.label, 5, wpDef.hasMic, wpDef.required);
    } else if (wpId === 'areaSelector') {
      wp = WebParts.selectDropdown(wpId, wpDef.label, 'areas', false, config);
    } else if (wpId === 'peoplePicker') {
      wp = WebParts.peoplePicker(wpId, wpDef.label, config);
    } else if (wpId === 'attendeesTable') {
      wp = TemplateAssembler.attendeesTable(wpId, config);
    } else if (wpId === 'moodSliders') {
      wp = WebParts.moodSliders(wpId);
    } else if (wpId === 'previousActions') {
      wp = WebParts.previousActionsLocked(wpId, []);
    } else if (wpId === 'actionPoints') {
      wp = WebParts.actionPoints(wpId);
    } else if (wpId === 'tags') {
      wp = WebParts.tagPicker(wpId, config, template.defaultTags);
    } else if (wpId === 'threadLinker') {
      wp = WebParts.threadLinker(wpId);
    } else if (wpId === 'evidenceLinks') {
      wp = WebParts.evidenceLinks(wpId);
    } else if (wpId === 'coachingPrompt' || wpId === 'reflectionNotes' || wpId === 'resourceLinks' || wpId === 'planningNotes') {
      wp = WebParts.textArea(wpId, wpDef.label, 3, wpDef.hasMic, wpDef.required || false);
    } else if (wpId === 'reviewDate') {
      wp = WebParts.datePicker(wpId, 'Review Date', false);
    } else if (wpId === 'location' || wpId === 'provider' || wpId === 'eventType') {
      wp = WebParts.textInput(wpId, wpDef.label, false, false);
    }

    return wp;
  },

  /**
   * ATTENDEES TABLE — multi-row table with name + role
   */
  attendeesTable: (fieldId, config) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Attendees</label>
      <div id="${fieldId}-table" style="overflow-x:auto; margin-bottom:.5rem;">
        <table class="data-table" style="width:100%;">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role (optional)</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="${fieldId}-rows">
            <tr class="attendee-row">
              <td><input type="text" class="attendee-name" placeholder="Name" style="font-size:.8rem; width:100%;"></td>
              <td><input type="text" class="attendee-role" placeholder="Role" style="font-size:.8rem; width:100%;"></td>
              <td><button class="btn btn-icon btn-sm" onclick="removeAttendeeRow(this)">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="addAttendeeRow('${fieldId}-rows')">+ Add attendee</button>
    `;
    return {
      container,
      getValue: () => {
        const rows = container.querySelectorAll('.attendee-row');
        return Array.from(rows).map(row => ({
          name: row.querySelector('.attendee-name').value,
          role: row.querySelector('.attendee-role').value
        })).filter(a => a.name);
      },
      clear: () => {
        const tbody = container.querySelector(`#${fieldId}-rows`);
        tbody.innerHTML = `
          <tr class="attendee-row">
            <td><input type="text" class="attendee-name" placeholder="Name" style="font-size:.8rem; width:100%;"></td>
            <td><input type="text" class="attendee-role" placeholder="Role" style="font-size:.8rem; width:100%;"></td>
            <td><button class="btn btn-icon btn-sm" onclick="removeAttendeeRow(this)">✕</button></td>
          </tr>
        `;
      }
    };
  }

};

// ATTENDEE TABLE HELPERS
function addAttendeeRow(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  const newRow = document.createElement('tr');
  newRow.className = 'attendee-row';
  newRow.innerHTML = `
    <td><input type="text" class="attendee-name" placeholder="Name" style="font-size:.8rem; width:100%;"></td>
    <td><input type="text" class="attendee-role" placeholder="Role" style="font-size:.8rem; width:100%;"></td>
    <td><button class="btn btn-icon btn-sm" onclick="removeAttendeeRow(this)">✕</button></td>
  `;
  tbody.appendChild(newRow);
}

function removeAttendeeRow(btn) {
  btn.closest('tr').remove();
}

/**
 * Build a quick-capture entry object from form values
 */
function buildEntryFromForm(templateId, config) {
  const form = document.getElementById(`form-${templateId}`);
  if (!form) return null;

  const entry = {
    id: `entry-${Date.now()}`,
    templateId,
    timestamp: new Date().toISOString(),
    data: {}
  };

  // Collect all form values — this is simplified; in production, we'd iterate web parts properly
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (input.id) {
      entry.data[input.id] = input.value;
    }
  });

  return entry;
}
