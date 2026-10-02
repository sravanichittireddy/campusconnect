# 🎓 CampusConnect

**A local student services and product discovery platform.**

> Search for any product — "record book", "spiral binding", "coffee", "USB drive" — and instantly see which campus shops have it, compare prices, and check real-time availability.

---

## 📸 What's Included

| Feature | Status |
|---|---|
| Product & shop search | ✅ Fully working |
| Cross-shop price comparison | ✅ Fully working |
| Product catalogues per shop | ✅ Fully working |
| Availability filter (Available / Low Stock / Out of Stock) | ✅ Fully working |
| Student registration & login | ✅ Fully working |
| Provider dashboard + product management | ✅ Fully working |
| Admin dashboard + approvals + reports | ✅ Fully working |
| Save/favourite shops & products | ✅ Fully working |
| Reviews & ratings | ✅ Fully working |
| Responsive mobile design | ✅ Fully working |
| 6 demo shops + 40+ products pre-loaded | ✅ Included |

---

## 🏗 Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Vanilla HTML + CSS + JavaScript | Zero build step, GitHub Pages compatible, fast |
| Data storage | localStorage (browser) | No backend needed, works offline, GitHub Pages compatible |
| Fonts | Google Fonts (Inter) | Clean, professional |
| Deployment | GitHub Pages | Free, static, instant |

> **No backend, no database server, no Node.js, no build step required.**
> Everything runs in the browser. Data persists in the user's localStorage.

---

## 🚀 Running Locally

### Option 1 — Open directly (simplest)

Just double-click `index.html` and open it in any modern browser (Chrome, Firefox, Edge, Safari).

> **Note:** Some browsers restrict `file://` origins. If you see a blank page, use Option 2.

### Option 2 — Use a local server (recommended)

If you have Python installed:

```bash
cd campusconnect
python -m http.server 8080
```

Then open: **http://localhost:8080**

If you have Node.js:

```bash
npx serve .
```

Then open the URL it prints.

---

## 🌐 Deploying to GitHub Pages (Step-by-Step)

### Step 1 — Extract the ZIP

1. Download `campusconnect.zip`
2. Extract it — you'll get a folder called `campusconnect/`
3. This folder contains: `index.html`, `css/`, `js/`, `README.md`

### Step 2 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or sign up — it's free)
2. Click the **+** icon → **New repository**
3. Name it: `campusconnect` (or anything you like)
4. Set it to **Public**
5. Do **NOT** check "Add a README" (we already have one)
6. Click **Create repository**

### Step 3 — Upload the files

#### Method A — GitHub Web Upload (Easiest, no Git needed)

1. In your new repository, click **uploading an existing file** (shown on the empty repo page)
2. Drag and drop ALL the files from your extracted `campusconnect/` folder:
   - `index.html`
   - `README.md`
   - The entire `css/` folder (drag the folder itself)
   - The entire `js/` folder (drag the folder itself)
3. Scroll down and click **Commit changes**

> ⚠️ **Important:** Make sure `index.html` is at the ROOT of the repository, not inside a subfolder.

#### Method B — Git command line

```bash
cd campusconnect
git init
git add .
git commit -m "Initial commit: CampusConnect"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campusconnect.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 4 — Enable GitHub Pages

1. In your repository, click the **Settings** tab (top menu)
2. Scroll down to the **Pages** section in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, select `main` and folder `/` (root)
5. Click **Save**
6. Wait 1–3 minutes for GitHub to build your site
7. Refresh the Settings → Pages page
8. You will see a green banner: **"Your site is live at https://YOUR_USERNAME.github.io/campusconnect/"**

### Step 5 — Open your live site

Visit: `https://YOUR_USERNAME.github.io/campusconnect/`

Your CampusConnect app is now live on the internet! 🎉

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | arjun@student.edu | student123 |
| **Student** | priya@student.edu | student123 |
| **Provider** (Print Hub) | print@campus.edu | print123 |
| **Provider** (Stationery) | corner@campus.edu | corner123 |
| **Provider** (Tech Point) | tech@campus.edu | tech123 |
| **Provider** (Cafe) | cafe@campus.edu | cafe123 |
| **Admin** | admin@campus.edu | admin123 |

---

## 🏪 Demo Shops & Products

The app comes pre-loaded with realistic demo data:

| Shop | Category | Products |
|---|---|---|
| Campus Print Hub | Printing & Xerox | B/W Printing, Colour Printing, Spiral Binding, Lamination, Hard Binding, Scanning |
| Student Corner Stationery | Stationery | Record Book, A4 Sheets, Pens, Files, Drawing Sheets, Geometry Box, Highlighters |
| Tech Point | Electronics | USB Drives, Scientific Calculator, Charger, Earphones, Mouse, Laptop Repair |
| Campus Cafe | Food & Cafes | Tea, Coffee, Sandwich, Fried Rice, Cold Coffee, Maggi, Juice |
| Project Materials Store | Project Materials | Chart Paper, Thermocol, Foam Board, Poster Colours, Sketch Pens, Record Book |
| College Book House | Books | Record Book, Engineering Drawing Book, Lab Manual, A4 Sheets, Book Binding |

> "Record Book" exists in 3 shops at different prices — great for testing the **Compare** feature!

---

## 🧪 Testing Key Features

### Search
- Type "record book" → see products from multiple shops + compare tip
- Type "spiral binding" → see services
- Type "coffee" → see cafe products
- Click the "Compare prices" button to see the comparison table

### Price Comparison
- Search "record book" and click **Compare prices & availability →**
- See all shops selling it, sorted by price, with Best Price highlighted

### Provider Dashboard
- Sign in as `print@campus.edu` / `print123`
- Go to Dashboard → Add/edit/delete products
- Update availability to "Out of Stock" and see it reflect in search

### Admin
- Sign in as `admin@campus.edu` / `admin123`
- Approve/reject shops, remove users, resolve reports

### Favourites
- Sign in as a student, browse, click ♥ on shops/products
- Visit "Saved" in the nav

---

## 📁 Project Structure

```
campusconnect/
├── index.html          ← Single-page app entry point
├── README.md           ← This file
├── css/
│   └── style.css       ← Complete design system (1 file)
└── js/
    ├── data.js         ← Data layer: seed data, localStorage, all CRUD
    ├── ui.js           ← UI utilities: toasts, modals, cards, forms
    └── app.js          ← Router, all pages, all action handlers
```

---

## 🔄 Resetting Demo Data

If you want to reset the app to its original demo state (clear all changes):

1. Open the browser console (F12 → Console)
2. Run: `localStorage.clear(); location.reload();`

This wipes all localStorage and re-seeds the demo data on next load.

---

## 📌 Known Limitations (GitHub Pages / localStorage)

| Limitation | Explanation |
|---|---|
| Data is per-browser | Each user's data is stored locally in their own browser. Not shared across devices. |
| No real server | Suitable for demos and portfolios. For production, replace localStorage with a real backend (Firebase, Supabase, etc.) |
| Location is simulated | Distances shown are based on demo coordinates. For real GPS, add `navigator.geolocation` |
| Images are emojis | No real image upload (requires server). For production, use Cloudinary or Firebase Storage. |

---

## 🚀 Upgrading to a Real Backend (Optional)

If you want to make this production-ready:

| Feature | Tool |
|---|---|
| Database | Firebase Firestore or Supabase |
| Auth | Firebase Auth or Supabase Auth |
| Image upload | Cloudinary or Firebase Storage |
| Hosting | Vercel, Netlify, or Firebase Hosting |
| Real location | `navigator.geolocation` API |

The data layer (`js/data.js`) is designed so all data calls go through `CC.Shops`, `CC.Products`, etc. — replace those implementations with API calls and the rest of the app stays the same.

---

## 📄 License

This project is open source. Feel free to use it for learning, college projects, or as a portfolio piece.

---

**Built with ❤️ — CampusConnect**
