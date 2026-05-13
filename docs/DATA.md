# Data Architecture & Export Format

## Overview

The DPC Evidence Hub uses **domain-split JSON storage** in OneDrive. This document explains:
- How data is organized in the app (browser localStorage)
- How to export entries as JSON
- How to organize files in OneDrive
- How Claude reads and synthesizes the data

## Browser Storage (Local)

During your day, all entries are stored in **browser localStorage** as JavaScript objects:

```javascript
ENTRIES = {
  "meeting-lm": [
    { id: "entry-1714...", templateId: "meeting-lm", timestamp: "2026-05-11T...", data: {...} },
    { id: "entry-1715...", templateId: "meeting-lm", timestamp: "2026-05-11T...", data: {...} }
  ],
  "coaching-1to1": [
    { id: "entry-1716...", templateId: "coaching-1to1", timestamp: "2026-05-11T...", data: {...} }
  ]
}
```

This is **volatile** — if you clear your browser cache, entries are lost. So you must **export regularly**.

## Export Format

When you click **"Export"** button, the app generates a JSON file:

```json
{
  "exportedAt": "2026-05-11T15:30:00Z",
  "entries": {
    "meeting-lm": [
      {
        "id": "entry-1714567890",
        "templateId": "meeting-lm",
        "timestamp": "2026-05-11T15:20:00Z",
        "data": {
          "date": "2026-05-11",
          "peoplePicker": ["nd"],
          "previousActions": [],
          "moodSliders": { "mood": 7, "stress": 4, "confidence": 8 },
          "newNotes": "Discussed RAG tracking and evidence collection for HoA meetings...",
          "actionPoints": [
            {
              "action": "Email RAG summary to quality team",
              "deadline": "2026-05-17",
              "who": "gw",
              "support": ""
            }
          ],
          "tags": ["qa", "lwb"],
          "threadLinker": { "threadId": "thread-2026-05-hoa-tracking" }
        }
      }
    ],
    "coaching-1to1": [...]
  },
  "metadata": {
    "totalEntries": 42,
    "templates": [
      "Line Manager 1:1",
      "Coaching — 1:1"
    ]
  }
}
```

## OneDrive Folder Structure

Upload exported JSON files to this structure:

```
OneDrive/Digital-Coach-Evidence/
├── hoa-meetings/
│   ├── HAC.json
│   ├── ENG.json
│   ├── PSF.json
│   └── ... (one per area)
├── learning-walks/
│   ├── HAC-walks.json
│   ├── ENG-walks.json
│   └── ... (one per area)
├── training-delivered/
│   ├── accessibility.json
│   ├── jisc-discovery.json
│   ├── ai-literacy.json
│   └── ... (one per training theme)
├── digital-leads/
│   ├── coaching-log.json
│   ├── progression-tracking.json
│   └── ...
├── learning-observations/
│   ├── dev-obs.json
│   └── ...
├── cpd/
│   ├── own-professional-development.json
│   ├── external-events.json
│   └── ...
├── metadata/
│   ├── areas.json (reference: all 34 areas)
│   ├── common-purposes.json (reference: all tags)
│   ├── kpis.json (reference: 10 responsibilities)
│   └── people-registry.json (optional: full people list)
└── reporting/
    ├── preparation-index.json (timestamp of last synthesis)
    └── hoa-tracker-snapshot.json (latest HoA RAG state)
```

## File Organization Rules

### hoa-meetings/

**File naming:** `[AREA-CODE].json`

**Content:** All meetings with that area's Head of Area, including:
- One-off HoA meetings
- Coaching sessions
- Follow-ups
- Action tracking

**What's in each entry:**
```json
{
  "id": "entry-...",
  "templateId": "meeting-hoa",
  "data": {
    "date": "2026-05-11",
    "areaSelector": "ENG",
    "peoplePicker": ["john-smith"],
    "keyPoints": "Discussed Teams environment accessibility...",
    "actionPoints": [...],
    "tags": ["accessibility", "lwb"]
  }
}
```

### learning-walks/

**File naming:** `[AREA-CODE]-walks.json`

**Content:** All learning walks for that area, with:
- Date
- Strengths observed
- Areas for improvement
- Evidence of impact
- Link to Hyper document (if applicable)

### training-delivered/

**File naming:** `[TOPIC].json` (e.g., `accessibility.json`, `ai-literacy.json`)

**Content:** All training sessions delivered on that topic:
- Date
- Attendees (area + staff)
- Content covered
- Resources used
- Participant feedback

### digital-leads/

**File naming:** Varies (e.g., `coaching-log.json`, `progression-tracking.json`)

**Content:**
- One-to-one coaching with Digital Leads
- Group coaching sessions
- CPD activities
- Progression tracking against self-assessment tool

### cpd/

**File naming:** By type (`own-professional-development.json`, `external-events.json`)

**Content:** Your own professional learning
- Courses taken
- Reading
- External events (BETT, Digifest, etc.)
- Networking activities

### metadata/

**Reference files** (read-only, updated from config.json)

```json
// areas.json
{
  "areas": [
    { "code": "ENG", "name": "Engineering", "hoa": "...", "digitalLead": "..." },
    ...
  ]
}

// common-purposes.json
{
  "purposes": [
    { "id": "accessibility", "label": "Accessibility + Inclusion", ... },
    ...
  ]
}

// kpis.json
{
  "kpis": [
    { "id": "teaching-quality", "name": "Teaching Quality Indicators", ... },
    ...
  ]
}
```

### reporting/

**preparation-index.json** — Timestamp of last Claude synthesis
```json
{
  "lastSynthesisAt": "2026-05-10T19:30:00Z",
  "lastReportType": "hoa-tracker-update",
  "entriesIncluded": 127,
  "dateRange": "2026-04-20 to 2026-05-10"
}
```

**hoa-tracker-snapshot.json** — Latest RAG ratings + action status
```json
{
  "snapshotAt": "2026-05-11T15:35:00Z",
  "areas": [
    {
      "code": "ENG",
      "name": "Engineering",
      "rag": 3,
      "ragHistory": [
        { "date": "2026-03-15", "rating": 4 },
        { "date": "2026-04-10", "rating": 3 }
      ],
      "actions": [
        { "action": "Training scheduled", "deadline": "2026-05-31", "status": "in-progress" }
      ]
    }
  ]
}
```

## Entry Data Schema

Every entry has this structure:

```typescript
interface DPCEntry {
  id: string;                  // Unique ID (entry-[timestamp])
  templateId: string;          // Which template was used
  timestamp: string;           // ISO 8601 timestamp
  data: {
    // Form fields filled in by the template
    date?: string;
    title?: string;
    peoplePicker?: string[];   // Array of people IDs
    areaSelector?: string;     // Area code
    keyPoints?: string;
    newNotes?: string;
    actionPoints?: ActionPoint[];
    tags?: string[];           // Array of tag IDs
    threadLinker?: {
      threadId: string | null;
      newThreadName?: string;
    };
    evidenceLinks?: EvideceLink[];
    moodSliders?: {
      mood: number;            // 1-10
      stress: number;
      confidence: number;
    };
    // ... other template-specific fields
  };
}

interface ActionPoint {
  action: string;
  deadline: string;            // ISO date
  who: string;                 // Person ID
  support: string;             // What support needed
}

interface EvidenceLink {
  url: string;
  label: string;
}
```

## Export Workflow

1. **Throughout the day:**
   - Use Quick Capture to log activities
   - Entries stored in browser localStorage

2. **End of day / end of week:**
   - Click **"Export"** button in header
   - JSON file downloads (e.g., `dpc-evidence-hub-export-2026-05-11.json`)

3. **Manual routing to OneDrive:**
   - Open the JSON file
   - Copy entries by template type
   - Paste into appropriate OneDrive folder:
     - `meeting-lm` → `hoa-meetings/`
     - `coaching-1to1` → `digital-leads/coaching-log.json`
     - etc.

4. **Metadata update:**
   - Update `reporting/preparation-index.json` with export timestamp
   - Update `reporting/hoa-tracker-snapshot.json` with latest RAG state

## For Claude (AI Synthesis)

When you ask me to generate a report, provide the **folder path** and I will:

1. Read the domain-split JSON files from that path
2. Synthesize across all entries for the requested audience
3. Generate:
   - **For Ben:** 18-month narrative + KPI progress + evidence portfolio
   - **For Neil:** Detail against 10 responsibilities + targets + concerns
   - **For Quality Team:** Headlines + blockers + asks + themes + wins
   - **HoA Tracker update:** Per-area RAG + actions + training + S+AFI

Example request:
> "Read OneDrive/Digital-Coach-Evidence/ and generate a 9-month review report for Ben (Vice Principal) covering Jan–May 2026."

I will:
- Read all files in hoa-meetings/, learning-walks/, training-delivered/, etc.
- Extract entries matching date range
- Synthesize evidence by area, by KPI, by theme (Learning Without Barriers, accessibility, etc.)
- Generate structured narrative + supporting evidence

## Backup & Recovery

### Backing up entries:
1. Export regularly (daily/weekly)
2. Keep export files in a separate folder (e.g., `OneDrive/DPC-Exports/`)
3. Version files by date: `export-2026-05-11.json`, `export-2026-05-18.json`, etc.

### Recovering entries:
- If you lose browser localStorage, you can re-upload a previous export
- The JSON structure is preserved, so Claude can still synthesize from old exports

## Data Privacy & Security

- **Storage:** OneDrive (ISO 27001 certified M365 tenant)
- **Access:** Only you + authorized quality leadership
- **Retention:** Follow college GDPR/FOIA policies
- **No personally identifiable information:** Entries contain names of people you work with, but no sensitive personal data

## Troubleshooting

**Export file is too large:**
- You have too many entries
- Manually delete old entries before exporting (coming soon: archive feature)

**JSON won't import to OneDrive:**
- Check file format is valid JSON (use [jsonlint.com](https://www.jsonlint.com))
- Don't rename the file to .xlsx or .docx
- OneDrive requires raw JSON files

**Can't find entries in OneDrive after upload:**
- Make sure you uploaded to the correct folder structure
- Check folder names match exactly (case-sensitive on Mac/Linux)

---

**Next step:** See `CONFIG.md` for how to customize areas, people, and tags.
