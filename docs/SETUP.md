# Getting Started — Quick Start Guide

## 5-Minute Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gwc25/dpc-evidence-hub.git
cd dpc-evidence-hub
```

Or fork and clone your own copy.

### 2. Open in Browser

**Option A: Local file**
- Open `hub.html` directly in your browser

**Option B: Local web server** (recommended)
```bash
# If you have Python 3:
python3 -m http.server 8000

# Then visit: http://localhost:8000/hub.html
```

**Option C: GitHub Pages** (once you push to GitHub)
- Push to `main` branch
- Go to Settings > Pages > Select `main` branch
- Hub will be live at `https://[your-username].github.io/dpc-evidence-hub/hub.html`

### 3. Load Configuration

1. Click **"Load Config"** button in the header
2. Configuration loads from `data/config.json`
3. You should see:
   - ✓ Configuration loaded successfully
   - 34 curriculum areas
   - 30+ templates
   - 10+ common purposes

### 4. Test Quick Capture

1. Click **"Quick Capture"** in sidebar
2. Select a template (e.g., "Line Manager 1:1")
3. Fill in a test entry
4. Click **"Save entry"**
5. See it logged in Evidence Log

### 5. Export (Daily)

1. Click **"Export"** button
2. JSON file downloads
3. Keep export files safe (e.g., in a "Exports" folder)

---

## First Day Checklist

- [ ] Load configuration
- [ ] Test Quick Capture with 2-3 templates
- [ ] Verify form fields render correctly
- [ ] Export and inspect JSON file
- [ ] Bookmark hub.html or GitHub Pages URL
- [ ] Set reminder to export daily

---

## Customization (First Week)

### Add Your Team

Edit `data/config.json` → `peopleRegistry`:

```json
"peopleRegistry": [
  { "id": "gw", "name": "Graeme Wright", "role": "Digital Pedagogy Coach" },
  { "id": "nd", "name": "Neil Davies", "role": "Assistant Principal, Quality" },
  { "id": "bm", "name": "Ben Manning", "role": "Vice Principal, Quality" },
  { "id": "jsmith", "name": "John Smith", "role": "Head of Engineering" },
  { "id": "sgreen", "name": "Sarah Green", "role": "Head of Health" }
]
```

Then reload the app.

### Customize Tags

Edit `data/config.json` → `commonPurposes`:

Add a custom tag (e.g., for a project):

```json
{
  "id": "teams-migration",
  "category": "Projects",
  "label": "Teams Migration Project",
  "description": "Ongoing migration to new Teams structure"
}
```

Then reload the app.

### Update HoA Info

Edit `data/areas.json` (or in `config.json`):

```json
{
  "code": "ENG",
  "name": "Engineering",
  "hoa": "John Smith",
  "digitalLead": "Sarah Johnson"
}
```

Reload to see updates.

---

## Daily Workflow

### Morning
1. Open hub.html (or GitHub Pages URL)
2. Click "Load Config" (if first time today)
3. Ready to log

### Throughout the Day
1. **After meeting:** Quick Capture → select template → fill form → save
2. **After learning walk:** Quick Capture → Learning Walks (coming soon)
3. **After training:** Quick Capture → Teach.Meet template → save

### End of Day
1. Click **"Export"** button
2. Save JSON to a safe location (e.g., OneDrive/DPC-Exports/)
3. (Optional) Upload to OneDrive data folder

### Weekly
1. Review entries in Evidence Log
2. Update HoA tracker (manual or auto-generated)
3. Archive old entries (coming soon)

---

## OneDrive Integration (Optional)

If you want to sync to OneDrive automatically (coming in future version):

1. Create folder: `OneDrive/Digital-Coach-Evidence/`
2. Create subfolders:
   - `hoa-meetings/`
   - `learning-walks/`
   - `training-delivered/`
   - `digital-leads/`
   - `cpd/`
   - `metadata/`
   - `reporting/`

3. Upload exported JSON files to these folders

See `docs/DATA.md` for complete folder structure.

---

## Troubleshooting

### Config Won't Load

**Error:** "Failed to load config"

**Fix:**
1. Check `data/config.json` exists
2. Validate JSON at https://www.jsonlint.com
3. Check browser console (F12) for errors
4. Try hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)

### Form Won't Render

**Error:** Template loads but form is blank

**Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Verify template ID exists in config
4. Check web parts are registered in templates.js

### Export Button Not Working

**Error:** Click export, nothing happens

**Fix:**
1. Make sure you've created at least one entry
2. Check browser console for errors
3. Try different browser
4. Check disk space

### Can't Find Entries

**Error:** Saved entries, but they disappeared

**Fix:**
1. Check localStorage wasn't cleared
   - Open DevTools → Application → Storage → Local Storage
   - Look for entries in ENTRIES object
2. If cleared, check your exported JSON files
3. (Coming soon) Ability to re-import from JSON

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Tab | Navigate between fields |
| Shift+Tab | Navigate backwards |
| Enter | Submit form / click button |
| Space | Toggle checkbox / slider focus |
| Escape | Close modals (coming soon) |
| Ctrl+S / Cmd+S | Save entry (when focused on form) |

---

## Performance Tips

- **Clear cache periodically** — localStorage can get large after many entries
- **Export regularly** — Don't rely solely on browser storage
- **Archive old entries** — (Coming soon) Move old entries to "archive" folder
- **Use specific dates** — Filter by date range to load fewer entries

---

## Browser Requirements

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 90+ | Recommended |
| Edge | 90+ | Recommended |
| Firefox | 88+ | Works well |
| Safari | 14+ | Works, less testing |
| Mobile Safari (iOS) | 14+ | Responsive layout |
| Chrome Android | 90+ | Responsive layout |

---

## What's Coming Soon

- [ ] Learning Walks integration (with Hyper tagging)
- [ ] Dev Obs integration (with Hyper tagging)
- [ ] Dashboard with charts
- [ ] Report Builder (filter + export for Ben, Neil, Quality Team)
- [ ] HoA Tracker visualization (RAG progression over time)
- [ ] Archive feature (auto-move old entries)
- [ ] Search across all entries
- [ ] Direct OneDrive sync (one-click upload)

---

## Getting Help

1. **Check documentation:** Read README.md, CONFIG.md, DATA.md, WEBPARTS.md
2. **Browser console:** F12 → Console tab — most errors logged here
3. **GitHub Issues:** Open an issue on the repo
4. **Email:** Feedback to [your email]

---

## Next Steps

1. ✅ Set up the hub (you're here)
2. 📖 Read `docs/CONFIG.md` to customize
3. 💾 Read `docs/DATA.md` to understand data flow
4. 🔧 Read `docs/WEBPARTS.md` if you want to extend

---

**Happy capturing!**

Questions? Check the README or open an issue.
