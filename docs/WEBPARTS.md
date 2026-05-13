# Web Parts Reference

## Overview

Web Parts are reusable form components. All templates are built from web parts. This document lists all available web parts and their properties.

## Quick Reference Table

| ID | Type | Purpose | Required | Notes |
|----|------|---------|----------|-------|
| `date` | Date | Activity date | Yes | Required in all templates |
| `title` | Text | Short title/summary | No | Optional unless template specifies |
| `peoplePicker` | Select | Choose people (multi) | No | Linked to peopleRegistry |
| `attendeesTable` | Table | Meeting attendees (table) | No | Name + role columns |
| `areaSelector` | Dropdown | Curriculum area | No | Linked to 34 areas |
| `keyPoints` | Textarea | Discussion summary | No | With optional mic button |
| `newNotes` | Textarea | Detailed notes | No | With optional mic button |
| `previousActions` | Locked list | Prior actions (locked) | No | Auto-filled, tickable |
| `previousNotes` | Locked text | Prior notes (read-only) | No | Auto-filled, audit trail |
| `actionPoints` | Structured | Action points with deadline | No | Multi-row with who/support |
| `moodSliders` | Sliders | Mood/stress/confidence (1-10) | No | Three separate scales |
| `tags` | Tag picker | Common purposes | No | Three-tier selector |
| `threadLinker` | Select + text | Link to workflow thread | No | Existing or new thread |
| `evidenceLinks` | Link picker | File/recording/screenshot URLs | No | Multiple links allowed |
| `reviewDate` | Date | Follow-up date | No | Optional review/check-in |
| `location` | Text | Event location/venue | No | For external events |
| `provider` | Text | Training provider | No | For CPD entries |
| `eventType` | Dropdown | Type of event | No | Conference/Workshop/Networking/etc |
| `duration` | Text | Training duration | No | E.g., "2 hours", "3-day course" |
| `learningTakeaway` | Textarea | Key learning | No | With mic button |
| `applicationPlan` | Textarea | How to apply learning | No | With mic button |
| `coachingPrompt` | Textarea | Coaching question | No | Optional, with mic |
| `reflectionNotes` | Textarea | Reflection on session | No | With mic button |
| `resourceLinks` | Picker | Resources used | No | Linked to resource library |
| `planningNotes` | Textarea | Plan for next session | No | With mic button |
| `attendees` | Text | Who attended | No | For CPD/external events |
| `networkingNotes` | Textarea | Networking notes/contacts | No | With mic button |
| `cogsTheme` | Dropdown | COGs programme theme | No | Linked to cogsThemes array |
| `objectives` | Textarea | Learning objectives | No | With mic button |
| `targetAudience` | Text | Who should attend | No | Text field |
| `resources` | Picker | Resources needed | No | Multiple resource links |
| `learningOutcomes` | Textarea | Expected learning outcomes | No | With mic button |
| `sessionNumber` | Hidden | Session 1/2/3/4 | Auto | Auto-populated |
| `sessionPlan` | Textarea | Delivery notes | No | With mic button |
| `attendeeCount` | Number | Number of people | No | Numeric input |

## Detailed Specifications

### Core Form Fields

#### `date`
**Type:** Date input  
**HTML:** `<input type="date">`  
**Required:** Yes in most templates  
**Output:** ISO 8601 string (YYYY-MM-DD)  
**WCAG:** Label + focus indicators

```javascript
WebParts.datePicker(fieldId, label, required = true)
```

#### `title`
**Type:** Text with optional mic  
**HTML:** `<input type="text">` + 🎤 button  
**Mic:** Optional (hasMic: true/false)  
**Output:** String  
**Use in:** Most templates

```javascript
WebParts.textInput(fieldId, label, required, hasMic = true)
```

#### `newNotes` / `keyPoints`
**Type:** Textarea with optional mic  
**HTML:** `<textarea rows="5">` + 🎤 button  
**Mic:** Optional  
**Output:** String (multi-line)  
**Use in:** Meetings, coaching, training

```javascript
WebParts.textArea(fieldId, label, rows = 5, hasMic = true, required = false)
```

---

### Selection Fields

#### `peoplePicker`
**Type:** Multi-checkbox select  
**Linked to:** `config.peopleRegistry`  
**Output:** Array of person IDs  
**UI:** Vertical list of checkboxes (Name — Role)  
**Use in:** Meetings, coaching, training

```javascript
WebParts.peoplePicker(fieldId, label, config)
// Returns: ["gw", "nd", "bm"]
```

#### `areaSelector`
**Type:** Dropdown select  
**Linked to:** `config.areas`  
**Output:** Area code (e.g., "ENG")  
**UI:** Dropdown with "CODE — Name" format  
**Use in:** Most templates

```javascript
WebParts.selectDropdown(fieldId, label, linkedTo = 'areas', required = false, config)
// Returns: "ENG"
```

#### `tags`
**Type:** Three-tier tag picker  
**Linked to:** `config.commonPurposes`  
**Output:** Array of tag IDs  
**UI:** Modal/panel with categories (Accessibility, Digital Skills, etc.)  
**Default tags:** Set per template  
**Use in:** All templates

```javascript
WebParts.tagPicker(fieldId, config, preSelectedTags = [])
// Returns: ["accessibility", "lwb", "qa"]
```

---

### Tables

#### `attendeesTable`
**Type:** Dynamic table (add/remove rows)  
**Columns:** Name, Role (optional)  
**Output:** Array of objects

```javascript
[
  { "name": "John Smith", "role": "Engineering Lead" },
  { "name": "Sarah Jones", "role": "TLAM" }
]
```

**UI:** Editable rows with "+" and "−" buttons

#### `actionPoints`
**Type:** Structured list (add/remove rows)  
**Columns:** Action, Deadline (date), Who (person), Support needed  
**Output:** Array of action objects

```javascript
[
  {
    "action": "Email RAG summary",
    "deadline": "2026-05-17",
    "who": "gw",
    "support": "Template from quality team"
  }
]
```

---

### Mood & Reflection

#### `moodSliders`
**Type:** Three range sliders (1-10)  
**Scales:** Mood, Stress, Confidence  
**Output:** Object with three values

```javascript
{ "mood": 7, "stress": 4, "confidence": 8 }
```

**UI:** Three horizontal sliders with live display of current value

---

### Linked Data

#### `threadLinker`
**Type:** Select dropdown + checkbox + text input  
**Linked to:** Existing workflow threads  
**Output:** Object with threadId or newThreadName

```javascript
{
  "threadId": "thread-2026-05-hoa-tracking",
  "newThreadName": null
}
// OR
{
  "threadId": null,
  "newThreadName": "ENG · Digital Leads · May 2026"
}
```

**UI:**
- Dropdown of existing threads
- Checkbox: "Start new thread"
- If checked, text input for thread name

#### `evidenceLinks`
**Type:** Dynamic list of URL + label pairs  
**Output:** Array of link objects

```javascript
[
  { "url": "https://sharepoint.com/.../document.docx", "label": "Learning Walk HAC" },
  { "url": "https://teams.com/...recording", "label": "Coaching session video" }
]
```

---

### Locked / Read-Only Fields

#### `previousActions`
**Type:** Locked list (auto-filled, tickable)  
**Output:** Array of ticked actions  
**UI:** Background color change, disabled (can't edit), checkbox to mark complete  
**Purpose:** Audit trail — shows what was committed to in prior meeting

```javascript
[
  "Email RAG summary to quality team",
  "Complete Jisc Discovery Tool"
]
```

#### `previousNotes`
**Type:** Locked text area (read-only)  
**Output:** String (read-only)  
**UI:** Greyed-out textarea, no edit possible  
**Purpose:** Audit trail — shows prior notes for reference

---

### Specialized Fields

#### `moodSliders`
**What it is:** Three 1-10 scales on a single component  
**Use case:** Check in on relational wellbeing during coaching sessions  
**Visual:** Side-by-side sliders with labels + numeric display

#### `attendeesTable`
**What it is:** Quick way to log who was at a meeting  
**Columns:** Name, Role  
**Add/remove:** Buttons to add blank rows or remove rows

#### `coachingPrompt` + `reflectionNotes` + `planningNotes`
**Combined in:** Coaching templates  
**Purpose:** Structure coaching session (question → reflection → next steps)  
**Each:** Textarea with optional mic

---

## Mic Button (Voice Dictation)

**Components with mic option:**
- `title`
- `keyPoints`
- `newNotes`
- `coachingPrompt`
- `reflectionNotes`
- `planningNotes`
- `learningTakeaway`
- `applicationPlan`
- `networkingNotes`
- `sessionPlan`

**How it works:**
1. Click 🎤 button
2. Browser prompts for microphone permission
3. Speak your entry
4. Text auto-fills into the field
5. Button shows ⏹ while recording

**Browsers supported:**
- Chrome 25+
- Edge 79+
- Firefox 25+
- Safari 14.1+

**Accessibility note:** Not all users can use mic. All fields are equally usable without it.

---

## Building a Template from Web Parts

Example: **Line Manager 1:1** meeting template

```javascript
{
  "id": "meeting-lm",
  "name": "Line Manager 1:1",
  "webParts": [
    "date",                    // When?
    "peoplePicker",            // Who (should be Neil Davies)
    "previousActions",         // What was committed to last time?
    "moodSliders",             // How are you doing?
    "newNotes",                // What happened this month?
    "actionPoints",            // What's next?
    "tags",                    // What was this about?
    "threadLinker"             // Link to ongoing workflow?
  ],
  "defaultTags": []            // Neil will see all context
}
```

When this template is loaded, the form renders in order:
1. Date picker
2. People picker (Neil)
3. Locked list of prior actions
4. Three mood sliders
5. Large notes textarea
6. Action points table
7. Tag selector
8. Thread linker

---

## Accessibility Compliance

All web parts meet **WCAG 2.2 AA**:

✅ **Labels:** Every input has associated `<label>`  
✅ **Focus:** Clear focus indicators (2px outline, 2px offset)  
✅ **Keyboard:** All fields keyboard-navigable (Tab, Arrow, Enter)  
✅ **Color:** Contrast ratios >= 4.5:1 for text  
✅ **Mic button:** Keyboard-accessible (Enter/Space to start)  
✅ **Sliders:** `<input type="range">` with native accessibility  
✅ **Dropdowns:** Native `<select>` or ARIA-compliant custom select  
✅ **ARIA:** Proper role, aria-label, aria-required attributes

---

## Extending Web Parts

To add a new web part:

1. Add to `webparts.js`:

```javascript
WebParts.myCustomPart = (fieldId, label) => {
  const container = document.createElement('div');
  // ... build the component
  return {
    container,
    getValue: () => { /* extract value */ },
    setValue: (val) => { /* set value */ },
    clear: () => { /* clear value */ }
  };
};
```

2. Register in `templates.js` renderWebPart():

```javascript
} else if (wpId === 'myCustomPart') {
  wp = WebParts.myCustomPart(wpId, wpDef.label);
}
```

3. Add to `config.json` webParts:

```json
"myCustomPart": {
  "type": "custom",
  "label": "My Custom Part"
}
```

4. Use in templates by adding the ID to `webParts` array.

---

## Troubleshooting

**Web part not showing in form:**
- Check it's listed in template's `webParts` array
- Check the ID exactly matches (case-sensitive)
- Check the web part function exists in `webparts.js`

**Web part not saving data:**
- Check `getValue()` function returns correct type
- Verify form submission captures all web parts
- Check browser console for errors

**Focus indicator not visible:**
- Ensure CSS has `.input:focus-visible` rule
- Check color contrast (should be 2px solid var(--color-primary))

---

See `CONFIG.md` for customization, or `README.md` for overview.
