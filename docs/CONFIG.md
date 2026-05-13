# Configuration Guide

## Overview

The `data/config.json` file is the master configuration file. Edit it to customize:
- Curriculum areas (add/remove/rename)
- People registry
- Common purposes (tags)
- COGs themes
- Default tags for templates

After editing, reload the app to load the new configuration.

## Curriculum Areas

Edit `data/areas.json` or directly in `config.json` under the `areas` array:

```json
{
  "code": "ENG",
  "name": "Engineering",
  "hoa": "John Smith",
  "digitalLead": "Sarah Johnson"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `code` | string | Yes | 3-letter code (e.g., ENG, HAC, PSF). Used in filters. |
| `name` | string | Yes | Full name of curriculum area |
| `hoa` | string | No | Head of Area name. Update during HoA meetings. |
| `digitalLead` | string | No | Named Digital Lead. Update as identified. |

### Current 34 Areas

```
AGF, AHE, ANM, BUI, BUS, CED, CON, DCI, EEY, EFE, EGL, EHE, EMV,
ENG, ESO, EXT, FAU, FCO, FEH, FPL, GMA, HAC, HBH, MAT, PAP, PRA,
PRE, PRS, PSF, SKB, SMS, SMX, SPO
```

## People Registry

Add staff to the people registry for the **People Picker** component:

```json
{
  "id": "jsmith",
  "name": "John Smith",
  "role": "Head of Engineering"
}
```

The `id` should be unique and short (used internally). The `name` and `role` appear in the picker UI.

### Core Team (Pre-populated)

```json
{ "id": "gw", "name": "Graeme Wright", "role": "Digital Pedagogy Coach" },
{ "id": "nd", "name": "Neil Davies", "role": "Assistant Principal, Quality" },
{ "id": "bm", "name": "Ben Manning", "role": "Vice Principal, Quality" }
```

## Common Purposes (Tags)

Tags organize evidence by theme, framework, or outcome. They appear in the **Tag Picker** component.

```json
{
  "id": "accessibility",
  "category": "Accessibility & Inclusion",
  "label": "Accessibility + Inclusion",
  "description": "WCAG 2.2 AA, assistive tech, accessible resources"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique ID. Used in exports and filters. |
| `category` | string | Grouping category (appears in tag picker UI) |
| `label` | string | Display label in forms and reports |
| `description` | string | Longer description for tooltips/documentation |

### Standard Common Purposes

- **Accessibility & Inclusion**: accessibility, lwb (Learning Without Barriers)
- **Digital Skills**: jisc, ai
- **TLA Pedagogy**: tla
- **Systems**: teams
- **Leadership**: dlsb (Digital Leads Support)
- **Learner Skills**: lsb
- **Quality**: qa
- **Compliance**: ofsted

## Phases

Phases auto-populate entry dates. Edit the phase date ranges if needed:

```json
{
  "id": "phase1",
  "name": "Phase 1 — Finish & Formalise",
  "dateRange": "Jan–Mar 2026",
  "description": "Initial coaching, baseline, HoA meetings..."
}
```

## COGs Themes

Add/remove COGs programme themes:

```json
"cogsThemes": [
  "AI & Generative AI",
  "Accessibility & Inclusive Practice",
  "Teams Environments",
  "Jisc Digital Capability",
  "Learning Without Barriers",
  ...
]
```

## Template Defaults

Set pre-selected tags for a template to auto-populate:

```json
{
  "id": "meeting-lm",
  "name": "Line Manager 1:1",
  "defaultTags": []
}
```

For example, Digital Leads Coaching should default to `["dlsb"]`:

```json
{
  "id": "meeting-dl",
  "name": "Digital Leads Coaching",
  "defaultTags": ["dlsb"]
}
```

## Web Parts Reference

Web parts define the actual form fields. Most are read-only in config, but you can customize:

- **label** — Display text for the form field
- **hasMic** — Show dictation button (true/false)
- **required** — Is this a required field? (true/false)

Example: Rename a field label

```json
"webParts": {
  "newNotes": {
    "type": "textarea",
    "label": "My Custom Label",
    "hasMic": true
  }
}
```

## Adding Custom Tags

1. Add a new object to `commonPurposes` array:

```json
{
  "id": "my-custom-tag",
  "category": "My Category",
  "label": "My Custom Tag",
  "description": "What this tag is for"
}
```

2. Save the file
3. Reload the app
4. The new tag appears in the Tag Picker

## Adding Custom Templates

(Coming in a future version) Currently, templates are fixed. To add a new template type:

1. Add template definition to `config.json` `templates` array
2. Specify which web parts to include
3. Set default tags
4. Reload the app

Example structure (not yet functional):

```json
{
  "id": "my-custom-template",
  "name": "My Custom Activity",
  "category": "Custom",
  "webParts": ["date", "title", "newNotes", "actionPoints", "tags"],
  "defaultTags": ["my-custom-tag"]
}
```

## Exporting Configuration

To back up or share your configuration:

1. Go to **Settings & Administration** page
2. (Coming soon) Click "Download Config"
3. Save the `config.json` file

## Resetting to Defaults

If something breaks, restore the original `config.json` from the GitHub repository:

```bash
git checkout data/config.json
```

Then reload the app.

## Best Practices

✅ **Do:**
- Keep area codes 3 letters
- Use consistent naming (e.g., "Digital Leads" not "DigLeads")
- Update `hoa` and `digitalLead` fields as you identify staff
- Review tags quarterly and remove unused ones
- Validate JSON using a tool like [jsonlint.com](https://www.jsonlint.com)

❌ **Don't:**
- Use special characters in IDs (stick to lowercase letters, numbers, hyphens)
- Leave `code` or `name` fields blank for areas
- Add very similar tag IDs (confusing)
- Edit template definitions unless you know what you're doing

## Troubleshooting

**Config won't load:**
- Check browser console for JSON syntax errors
- Validate JSON at [jsonlint.com](https://www.jsonlint.com)
- Make sure file is at `data/config.json`

**New tags don't appear:**
- Reload the app (Ctrl+Shift+R for hard refresh)
- Check the JSON is valid
- Verify the tag `id` is unique

**Fields are missing from forms:**
- Check `webParts` array matches the web parts defined in the webparts library
- Ensure template definition includes the web part ID in `webParts` array

---

**Questions?** Check the README.md or open an issue on GitHub.
