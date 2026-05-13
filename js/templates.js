/**
 * DPC Evidence Hub — templates.js
 * Builds forms from config.json template definitions + web parts
 *
 * COLUMN LOGIC:
 *   LEFT  — all capture fields (notes, people, sliders, attendees, etc.)
 *   RIGHT — always: tags, threadLinker, evidenceLinks, actionPoints, reviewDate
 *   FULL  — date, areaSelector, title (span both columns on wide screens)
 */

const RIGHT_COLUMN_PARTS = new Set(['tags', 'threadLinker', 'evidenceLinks', 'reviewDate']);

const TemplateAssembler = {

  buildForm: (template, config) => {
    const form = document.createElement('div');
    form.id = `form-${template.id}`;
    form.className = 'template-form';

    // Header row — date + area always full width at top
    const headerRow = document.createElement('div');
    headerRow.className = 'form-header-row';

    // Left column — main capture fields
    const left = document.createElement('div');
    left.className = 'form-col-left';

    // Right column — tags, thread, evidence, actions
    const right = document.createElement('div');
    right.className = 'form-col-right';

    template.webParts.forEach(wpId => {
      const wp = TemplateAssembler.renderWebPart(wpId, template, config);
      if (!wp) return;

      if (wpId === 'date' || wpId === 'areaSelector') {
        headerRow.appendChild(wp.container);
      } else if (RIGHT_COLUMN_PARTS.has(wpId)) {
        right.appendChild(wp.container);
      } else {
        left.appendChild(wp.container);
      }
    });

    // Save / clear buttons
    const btnRow = document.createElement('div');
    btnRow.className = 'form-btn-row';
    btnRow.innerHTML = `
      <button class="btn btn-primary" onclick="saveEntry('${template.id}')">✦ Save entry</button>
      <button class="btn btn-secondary" onclick="clearFormById('${template.id}')">Clear</button>
    `;

    // Only append non-empty sections
    if (headerRow.children.length) form.appendChild(headerRow);
    form.appendChild(left);
    if (right.children.length) form.appendChild(right);
    form.appendChild(btnRow);

    return form;
  },

  renderWebPart: (wpId, template, config) => {
    const wpDef = config.webParts ? config.webParts[wpId] : null;
    // Use fallback label if wpDef missing
    const label = wpDef?.label || wpId;

    switch (wpId) {
      case 'date':
        return WebParts.datePicker(wpId, 'Date', true);

      case 'title':
        return WebParts.textInput(wpId, label, false, true);

      case 'location':
      case 'provider':
      case 'targetAudience':
      case 'attendees':
      case 'duration':
        return WebParts.textInput(wpId, label, false, false);

      case 'eventType':
        return WebParts.selectDropdown(wpId, label, null, false, config, [
          'Conference', 'Workshop', 'Networking', 'Training', 'Other'
        ]);

      case 'areaSelector':
        return WebParts.selectDropdown(wpId, 'Curriculum Area', 'areas', false, config);

      case 'peoplePicker':
        return WebParts.peoplePicker(wpId, 'People', config);

      case 'attendeesTable':
        return TemplateAssembler.attendeesTable(wpId);

      case 'keyPoints':
      case 'newNotes':
        return WebParts.textArea(wpId, label, 5, true, false);

      case 'coachingPrompt':
        return WebParts.textArea(wpId, 'Coaching Question / Prompt', 3, true, false);

      case 'reflectionNotes':
        return WebParts.textArea(wpId, 'Reflection', 3, true, false);

      case 'planningNotes':
        return WebParts.textArea(wpId, 'Planning for Next Session', 3, true, false);

      case 'resourceLinks':
      case 'resources':
        return WebParts.resourceLinks(wpId);

      case 'objectives':
        return WebParts.textArea(wpId, 'Objectives / Learning Outcomes', 3, true, false);

      case 'sessionPlan':
        return WebParts.textArea(wpId, 'Session Plan & Delivery Notes', 4, true, false);

      case 'learningTakeaway':
        return WebParts.textArea(wpId, 'Key Learning Takeaway', 3, true, false);

      case 'applicationPlan':
        return WebParts.textArea(wpId, 'How You\'ll Apply This', 3, true, false);

      case 'networkingNotes':
        return WebParts.textArea(wpId, 'Networking Notes & Contacts', 3, true, false);

      case 'learningOutcomes':
        return WebParts.textArea(wpId, 'Expected Learning Outcomes', 3, true, false);

      case 'cogsTheme':
        return WebParts.selectDropdown(wpId, 'COGs Theme', 'cogsThemes', false, config);

      case 'moodSliders':
        return WebParts.moodSliders(wpId);

      case 'previousActions':
        return WebParts.previousActionsLocked(wpId, []);

      case 'actionPoints':
        return WebParts.actionPoints(wpId);

      case 'attendeeCount':
        return WebParts.numberInput(wpId, 'Number of Attendees');

      case 'sessionNumber':
        return null; // auto-populated, not shown

      case 'tags':
        return WebParts.tagPicker(wpId, config, template.defaultTags || []);

      case 'threadLinker':
        return WebParts.threadLinker(wpId);

      case 'resourceUrl':
        return WebParts.resourceUrl(wpId);

      case 'evidenceLinks':
        return WebParts.evidenceLinks(wpId);

      case 'reviewDate':
        return WebParts.datePicker(wpId, 'Review / Follow-up Date', false);

      default:
        // Unknown webpart — render a plain textarea as fallback
        return WebParts.textArea(wpId, wpId, 3, false, false);
    }
  },

  attendeesTable: (fieldId) => {
    const container = document.createElement('div');
    container.className = 'form-group';
    container.innerHTML = `
      <label>Attendees</label>
      <div style="overflow-x:auto; margin-bottom:.5rem;">
        <table class="data-table" style="width:100%;">
          <thead><tr><th>Name</th><th>Role (optional)</th><th></th></tr></thead>
          <tbody id="${fieldId}-rows">
            <tr class="attendee-row">
              <td><input type="text" class="attendee-name" placeholder="Name"></td>
              <td><input type="text" class="attendee-role" placeholder="Role"></td>
              <td><button class="btn btn-icon btn-sm" onclick="removeAttendeeRow(this)" aria-label="Remove">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="addAttendeeRow('${fieldId}-rows')">+ Add attendee</button>
    `;
    return {
      container,
      getValue: () => {
        return Array.from(container.querySelectorAll('.attendee-row')).map(row => ({
          name: row.querySelector('.attendee-name').value,
          role: row.querySelector('.attendee-role').value
        })).filter(a => a.name);
      }
    };
  }

};

// ── HELPERS ──────────────────────────────────────────────────────────────────

function addAttendeeRow(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  const row = document.createElement('tr');
  row.className = 'attendee-row';
  row.innerHTML = `
    <td><input type="text" class="attendee-name" placeholder="Name"></td>
    <td><input type="text" class="attendee-role" placeholder="Role"></td>
    <td><button class="btn btn-icon btn-sm" onclick="removeAttendeeRow(this)" aria-label="Remove">✕</button></td>
  `;
  tbody.appendChild(row);
}

function removeAttendeeRow(btn) {
  btn.closest('tr').remove();
}

function buildEntryFromForm(templateId, config) {
  const form = document.getElementById(`form-${templateId}`);
  if (!form) return null;

  const entry = {
    id: `entry-${Date.now()}`,
    templateId,
    timestamp: new Date().toISOString(),
    data: {}
  };

  form.querySelectorAll('input, textarea, select').forEach(el => {
    if (el.id) {
      entry.data[el.id] = el.type === 'checkbox' ? el.checked : el.value;
    }
  });

  return entry;
}
