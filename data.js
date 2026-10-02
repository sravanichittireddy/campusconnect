// ============================================================
// CampusConnect — Data Layer
// All data is stored in localStorage; demo data is seeded once.
// ============================================================

const CC = (() => {

// ── Keys ────────────────────────────────────────────────────
const KEYS = {
  users:    'cc_users',
  shops:    'cc_shops',
  products: 'cc_products',
  reviews:  'cc_reviews',
  reports:  'cc_reports',
  session:  'cc_session',
  favShops: 'cc_fav_shops',
  favProds: 'cc_fav_products',
  seeded:   'cc_seeded',
};

// ── Helpers ──────────────────────────────────────────────────
const load  = k => JSON.parse(localStorage.getItem(k) || 'null');
const save  = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const uid   = () => Math.random().toString(36).slice(2,10);
const now   = () => new Date().toISOString();
const clone = x => JSON.parse(JSON.stringify(x));

// ── Seed Data ────────────────────────────────────────────────
const SEED_USERS = [
  { id:'u001', role:'admin',    name:'Admin',             email:'admin@campus.edu',        password:'admin123',    avatar:'A', createdAt: now() },
  { id:'u002', role:'provider', name:'Campus Print Hub',  email:'print@campus.edu',        password:'print123',    avatar:'P', shopId:'s001', createdAt: now() },
  { id:'u003', role:'provider', name:'Student Corner',    email:'corner@campus.edu',       password:'corner123',   avatar:'S', shopId:'s002', createdAt: now() },
  { id:'u004', role:'provider', name:'Tech Point',        email:'tech@campus.edu',         password:'tech123',     avatar:'T', shopId:'s003', createdAt: now() },
  { id:'u005', role:'provider', name:'Campus Cafe',       email:'cafe@campus.edu',         password:'cafe123',     avatar:'C', shopId:'s004', createdAt: now() },
  { id:'u006', role:'provider', name:'Project Materials', email:'project@campus.edu',      password:'proj123',     avatar:'M', shopId:'s005', createdAt: now() },
  { id:'u007', role:'provider', name:'College Book House',email:'books@campus.edu',        password:'books123',    avatar:'B', shopId:'s006', createdAt: now() },
  { id:'u008', role:'student',  name:'Arjun Sharma',      email:'arjun@student.edu',       password:'student123',  avatar:'A', createdAt: now() },
  { id:'u009', role:'student',  name:'Priya Reddy',       email:'priya@student.edu',       password:'student123',  avatar:'P', createdAt: now() },
];

const SEED_SHOPS = [
  {
    id:'s001', ownerId:'u002', status:'approved',
    name:'Campus Print Hub',
    tagline:'Fast prints, perfect binding',
    category:'Printing & Xerox',
    description:'Your one-stop printing and binding centre. B/W, colour, scanning, lamination, spiral binding — all under one roof.',
    address:'Shop 3, Main Gate Complex, College Road',
    lat:17.385, lng:78.486,
    phone:'+91 98765 11111',
    hours:'Mon–Sat 8 AM – 8 PM, Sun 9 AM – 5 PM',
    rating:4.5, reviewCount:24,
    image:'🖨️',
    tags:['printing','xerox','binding','lamination','scanning'],
    createdAt: now(),
  },
  {
    id:'s002', ownerId:'u003', status:'approved',
    name:'Student Corner Stationery',
    tagline:'Everything you need, right here',
    category:'Stationery',
    description:'Wide range of stationery, record books, drawing materials, files, and all your college supply needs.',
    address:'Shop 7, College Gate Market',
    lat:17.386, lng:78.487,
    phone:'+91 98765 22222',
    hours:'Mon–Sat 9 AM – 9 PM',
    rating:4.2, reviewCount:31,
    image:'✏️',
    tags:['stationery','record book','pen','pencil','files'],
    createdAt: now(),
  },
  {
    id:'s003', ownerId:'u004', status:'approved',
    name:'Tech Point',
    tagline:'Gadgets, accessories & repairs',
    category:'Electronics',
    description:'Laptops, USB drives, chargers, earphones, calculators, accessories, and repair services for all electronics.',
    address:'Shop 12, Electronics Row, Near Hostel Gate',
    lat:17.387, lng:78.485,
    phone:'+91 98765 33333',
    hours:'Mon–Sat 10 AM – 8 PM',
    rating:4.0, reviewCount:18,
    image:'💻',
    tags:['electronics','USB','calculator','charger','repair','laptop'],
    createdAt: now(),
  },
  {
    id:'s004', ownerId:'u005', status:'approved',
    name:'Campus Cafe',
    tagline:'Fuel your study sessions',
    category:'Food & Cafes',
    description:'Hot and cold beverages, snacks, meals, and fresh juices. Perfect spot to take a break between classes.',
    address:'Block C, Ground Floor, Near Auditorium',
    lat:17.384, lng:78.488,
    phone:'+91 98765 44444',
    hours:'Mon–Sun 7 AM – 10 PM',
    rating:4.6, reviewCount:57,
    image:'☕',
    tags:['food','cafe','coffee','tea','snacks','meals'],
    createdAt: now(),
  },
  {
    id:'s005', ownerId:'u006', status:'approved',
    name:'Project Materials Store',
    tagline:'All your project needs',
    category:'Project Materials',
    description:'Complete range of project materials — chart papers, foam boards, thermocol, paints, craft supplies, and more.',
    address:'Shop 5, Opposite College Library',
    lat:17.388, lng:78.486,
    phone:'+91 98765 55555',
    hours:'Mon–Sat 9 AM – 7 PM',
    rating:4.1, reviewCount:12,
    image:'🎨',
    tags:['project','chart paper','thermocol','foam board','craft'],
    createdAt: now(),
  },
  {
    id:'s006', ownerId:'u007', status:'approved',
    name:'College Book House',
    tagline:'Textbooks old & new',
    category:'Books',
    description:'New and second-hand textbooks, reference books, notebooks, and record books. Best prices guaranteed.',
    address:'Shop 2, Library Complex, East Wing',
    lat:17.383, lng:78.489,
    phone:'+91 98765 66666',
    hours:'Mon–Sat 9 AM – 6 PM',
    rating:4.3, reviewCount:22,
    image:'📚',
    tags:['books','textbook','notebook','record book','second-hand'],
    createdAt: now(),
  },
];

const SEED_PRODUCTS = [
  // Campus Print Hub (s001)
  { id:'p001', shopId:'s001', type:'service', name:'B/W Printing', category:'Printing & Xerox', description:'Black & white laser printing on A4 sheets. Fast turnaround.', price:1, unit:'per page', availability:'available', image:'🖨️', discount:0, tags:['printing','xerox','black white'], updatedAt: now() },
  { id:'p002', shopId:'s001', type:'service', name:'Colour Printing', category:'Printing & Xerox', description:'High-quality colour printing on A4. Vivid colours, sharp output.', price:5, unit:'per page', availability:'available', image:'🎨', discount:0, tags:['colour printing','color'], updatedAt: now() },
  { id:'p003', shopId:'s001', type:'service', name:'Spiral Binding', category:'Binding & Lamination', description:'Spiral binding for reports and projects. Up to 200 pages.', price:30, unit:'per bind', availability:'available', image:'📎', discount:0, tags:['binding','spiral','project'], updatedAt: now() },
  { id:'p004', shopId:'s001', type:'service', name:'Lamination', category:'Binding & Lamination', description:'Matt or gloss lamination for certificates, IDs, and documents.', price:20, unit:'per sheet', availability:'available', image:'✨', discount:0, tags:['lamination','certificate'], updatedAt: now() },
  { id:'p005', shopId:'s001', type:'service', name:'Scanning', category:'Printing & Xerox', description:'High-resolution scanning to PDF or image. Email delivery available.', price:5, unit:'per page', availability:'available', image:'📄', discount:0, tags:['scanning','scan','pdf'], updatedAt: now() },
  { id:'p006', shopId:'s001', type:'service', name:'Hard Binding', category:'Binding & Lamination', description:'Hardcover binding for final year projects and thesis.', price:150, unit:'per bind', availability:'available', image:'📗', discount:10, tags:['hard binding','thesis','project'], updatedAt: now() },

  // Student Corner (s002)
  { id:'p007', shopId:'s002', type:'product', name:'Record Book', category:'Stationery', description:'200-page ruled record book. A4 size, hard cover.', price:45, unit:'each', availability:'available', image:'📓', discount:0, tags:['record book','notebook','stationery'], updatedAt: now() },
  { id:'p008', shopId:'s002', type:'product', name:'A4 Sheets (500 pack)', category:'Stationery', description:'80 GSM white A4 paper, ream of 500 sheets.', price:280, unit:'ream', availability:'available', image:'📄', discount:5, tags:['a4 sheets','paper','printing'], updatedAt: now() },
  { id:'p009', shopId:'s002', type:'product', name:'Pen (Blue)', category:'Stationery', description:'Smooth-flow ballpoint pen, blue ink, pack of 10.', price:80, unit:'pack of 10', availability:'available', image:'🖊️', discount:0, tags:['pen','ballpoint','blue'], updatedAt: now() },
  { id:'p010', shopId:'s002', type:'product', name:'File Folder', category:'Stationery', description:'A4 plastic file folder with document organiser pockets.', price:25, unit:'each', availability:'available', image:'📁', discount:0, tags:['file','folder','organiser'], updatedAt: now() },
  { id:'p011', shopId:'s002', type:'product', name:'Drawing Sheet', category:'Stationery', description:'A1 white drawing sheet. 120 GSM cartridge paper.', price:5, unit:'each', availability:'available', image:'📐', discount:0, tags:['drawing sheet','chart paper','art'], updatedAt: now() },
  { id:'p012', shopId:'s002', type:'product', name:'Geometry Box', category:'Stationery', description:'Complete geometry set — compass, protractor, set squares, ruler.', price:85, unit:'each', availability:'low_stock', image:'📏', discount:0, tags:['geometry','compass','ruler'], updatedAt: now() },
  { id:'p013', shopId:'s002', type:'product', name:'Highlighter Set', category:'Stationery', description:'Pack of 5 colour highlighters — yellow, green, pink, blue, orange.', price:60, unit:'pack', availability:'available', image:'🖍️', discount:0, tags:['highlighter','marker','colour'], updatedAt: now() },
  { id:'p014', shopId:'s002', type:'product', name:'Spiral Notebook', category:'Stationery', description:'A5 spiral notebook, 200 pages, ruled.', price:50, unit:'each', availability:'available', image:'📔', discount:0, tags:['notebook','spiral','notes'], updatedAt: now() },

  // Tech Point (s003)
  { id:'p015', shopId:'s003', type:'product', name:'USB Drive 32GB', category:'Electronics', description:'Fast USB 3.0 flash drive, 32GB. Compatible with all systems.', price:350, unit:'each', availability:'available', image:'💾', discount:0, tags:['usb drive','pen drive','flash drive','storage'], updatedAt: now() },
  { id:'p016', shopId:'s003', type:'product', name:'USB Drive 16GB', category:'Electronics', description:'USB 2.0 flash drive, 16GB. Budget-friendly option.', price:220, unit:'each', availability:'available', image:'💾', discount:0, tags:['usb drive','pen drive','flash drive','storage'], updatedAt: now() },
  { id:'p017', shopId:'s003', type:'product', name:'Scientific Calculator', category:'Electronics', description:'Casio FX-991EX scientific calculator. Ideal for engineering students.', price:1200, unit:'each', availability:'available', image:'🔢', discount:8, tags:['calculator','scientific','casio','engineering'], updatedAt: now() },
  { id:'p018', shopId:'s003', type:'product', name:'Laptop Charger (Universal)', category:'Electronics', description:'Universal laptop charger with multiple connector tips. 65W.', price:850, unit:'each', availability:'low_stock', image:'🔌', discount:0, tags:['charger','laptop','adapter'], updatedAt: now() },
  { id:'p019', shopId:'s003', type:'product', name:'Earphones', category:'Electronics', description:'Wired earphones with mic. 3.5mm jack. Bass-boosted sound.', price:299, unit:'each', availability:'available', image:'🎧', discount:0, tags:['earphones','headphones','audio'], updatedAt: now() },
  { id:'p020', shopId:'s003', type:'service', name:'Laptop Repair', category:'Repair Services', description:'Hardware and software repair, virus removal, OS installation, screen replacement.', price:200, unit:'starting price', availability:'available', image:'🔧', discount:0, tags:['laptop repair','repair','service','screen'], updatedAt: now() },
  { id:'p021', shopId:'s003', type:'product', name:'Mouse (Wired)', category:'Electronics', description:'Plug-and-play USB wired mouse. Ergonomic design, 1200 DPI.', price:199, unit:'each', availability:'available', image:'🖱️', discount:0, tags:['mouse','wired','computer'], updatedAt: now() },

  // Campus Cafe (s004)
  { id:'p022', shopId:'s004', type:'product', name:'Tea', category:'Food & Cafes', description:'Hot masala chai with ginger and cardamom. Fresh milk daily.', price:15, unit:'cup', availability:'available', image:'🍵', discount:0, tags:['tea','chai','hot drink','beverage'], updatedAt: now() },
  { id:'p023', shopId:'s004', type:'product', name:'Coffee', category:'Food & Cafes', description:'Strong filter coffee or instant coffee, your choice.', price:25, unit:'cup', availability:'available', image:'☕', discount:0, tags:['coffee','hot drink','beverage'], updatedAt: now() },
  { id:'p024', shopId:'s004', type:'product', name:'Veg Sandwich', category:'Food & Cafes', description:'Grilled veggie sandwich with cheese, tomato, capsicum, onion.', price:50, unit:'each', availability:'available', image:'🥪', discount:0, tags:['sandwich','snack','veg','food'], updatedAt: now() },
  { id:'p025', shopId:'s004', type:'product', name:'Veg Fried Rice', category:'Food & Cafes', description:'Tasty veg fried rice with mixed vegetables. Full meal portion.', price:80, unit:'plate', availability:'available', image:'🍚', discount:0, tags:['fried rice','rice','meal','veg','food'], updatedAt: now() },
  { id:'p026', shopId:'s004', type:'product', name:'Cold Coffee', category:'Food & Cafes', description:'Chilled blended coffee with ice cream and whipped cream.', price:60, unit:'glass', availability:'available', image:'🥤', discount:0, tags:['cold coffee','cold drink','coffee','beverage'], updatedAt: now() },
  { id:'p027', shopId:'s004', type:'product', name:'Maggi', category:'Food & Cafes', description:'Classic Maggi noodles, hot and spicy. Quick snack fix.', price:30, unit:'plate', availability:'available', image:'🍜', discount:0, tags:['maggi','noodles','snack','food'], updatedAt: now() },
  { id:'p028', shopId:'s004', type:'product', name:'Fresh Juice', category:'Food & Cafes', description:'Seasonal fresh fruit juice — orange, watermelon, or mango.', price:45, unit:'glass', availability:'available', image:'🍊', discount:0, tags:['juice','fruit','cold drink','beverage'], updatedAt: now() },

  // Project Materials Store (s005)
  { id:'p029', shopId:'s005', type:'product', name:'Chart Paper (White)', category:'Project Materials', description:'A0 white chart paper for projects and presentations. 100 GSM.', price:12, unit:'each', availability:'available', image:'📋', discount:0, tags:['chart paper','white','project','presentation'], updatedAt: now() },
  { id:'p030', shopId:'s005', type:'product', name:'Thermocol Sheet', category:'Project Materials', description:'White thermocol sheet, 12mm thick, A2 size. Lightweight and sturdy.', price:35, unit:'each', availability:'available', image:'⬜', discount:0, tags:['thermocol','foam','project','model'], updatedAt: now() },
  { id:'p031', shopId:'s005', type:'product', name:'Foam Board', category:'Project Materials', description:'White foam board, 5mm. Perfect for project displays and models.', price:60, unit:'each', availability:'available', image:'🟫', discount:0, tags:['foam board','project','display','model'], updatedAt: now() },
  { id:'p032', shopId:'s005', type:'product', name:'Poster Colours Set', category:'Project Materials', description:'Set of 12 bright poster colours, 15ml each. Vibrant and quick-drying.', price:120, unit:'set', availability:'available', image:'🎨', discount:0, tags:['poster colours','paint','art','project'], updatedAt: now() },
  { id:'p033', shopId:'s005', type:'product', name:'Sketch Pens Set', category:'Project Materials', description:'24-colour sketch pen set for colouring and project work.', price:90, unit:'set', availability:'available', image:'🖊️', discount:0, tags:['sketch pen','colour','art','project'], updatedAt: now() },
  { id:'p034', shopId:'s005', type:'product', name:'Record Book', category:'Stationery', description:'A4 hard-cover record book, 150 pages. Ruling on both sides.', price:42, unit:'each', availability:'available', image:'📓', discount:0, tags:['record book','notebook','stationery'], updatedAt: now() },
  { id:'p035', shopId:'s005', type:'product', name:'Glue Gun (Mini)', category:'Project Materials', description:'Mini glue gun with 10 glue sticks. Great for craft projects.', price:180, unit:'each', availability:'low_stock', image:'🔫', discount:0, tags:['glue gun','glue','craft','project'], updatedAt: now() },

  // College Book House (s006)
  { id:'p036', shopId:'s006', type:'product', name:'Record Book', category:'Stationery', description:'200-page hard-cover record book. Standard A4 size. Best quality.', price:48, unit:'each', availability:'available', image:'📓', discount:0, tags:['record book','notebook','stationery'], updatedAt: now() },
  { id:'p037', shopId:'s006', type:'product', name:'Engineering Drawing Book', category:'Books', description:'A3 size drawing book with plain pages, hard cover. 60 sheets.', price:95, unit:'each', availability:'available', image:'📐', discount:0, tags:['drawing book','engineering drawing','A3'], updatedAt: now() },
  { id:'p038', shopId:'s006', type:'product', name:'Lab Manual', category:'Books', description:'General lab manual for first year engineering. Physics, Chemistry & more.', price:150, unit:'each', availability:'available', image:'🧪', discount:0, tags:['lab manual','lab','first year','engineering'], updatedAt: now() },
  { id:'p039', shopId:'s006', type:'product', name:'A4 Sheets (500 pack)', category:'Stationery', description:'Good quality 75 GSM A4 paper ream, 500 sheets.', price:265, unit:'ream', availability:'available', image:'📄', discount:0, tags:['a4 sheets','paper','printing'], updatedAt: now() },
  { id:'p040', shopId:'s006', type:'service', name:'Book Binding', category:'Binding & Lamination', description:'Spiral or hard binding for reports, records, and projects.', price:25, unit:'starting price', availability:'available', image:'📚', discount:0, tags:['binding','book binding','spiral','hard'], updatedAt: now() },
];

const SEED_REVIEWS = [
  { id:'r001', shopId:'s001', userId:'u008', userName:'Arjun Sharma', rating:5, text:'Super fast printing! Got my project bound in 10 minutes.', createdAt: now() },
  { id:'r002', shopId:'s001', userId:'u009', userName:'Priya Reddy',  rating:4, text:'Good service and reasonable prices for binding.', createdAt: now() },
  { id:'r003', shopId:'s002', userId:'u008', userName:'Arjun Sharma', rating:4, text:'Found everything I needed. Good stock.', createdAt: now() },
  { id:'r004', shopId:'s004', userId:'u009', userName:'Priya Reddy',  rating:5, text:'Best chai on campus! Quick service too.', createdAt: now() },
  { id:'r005', shopId:'s003', userId:'u008', userName:'Arjun Sharma', rating:4, text:'Got a good USB drive here. Fair price.', createdAt: now() },
  { id:'r006', shopId:'s006', userId:'u009', userName:'Priya Reddy',  rating:4, text:'Nice collection of books. The record books are good quality.', createdAt: now() },
];

// ── Bootstrap ────────────────────────────────────────────────
function seed() {
  if (load(KEYS.seeded)) return;
  save(KEYS.users,    SEED_USERS);
  save(KEYS.shops,    SEED_SHOPS);
  save(KEYS.products, SEED_PRODUCTS);
  save(KEYS.reviews,  SEED_REVIEWS);
  save(KEYS.reports,  []);
  save(KEYS.favShops, {});
  save(KEYS.favProds, {});
  save(KEYS.seeded,   true);
}

// ── Auth ─────────────────────────────────────────────────────
const Auth = {
  login(email, password) {
    const users = load(KEYS.users) || [];
    const user  = users.find(u => u.email===email && u.password===password);
    if (!user) return null;
    const sess = { userId: user.id, role: user.role, name: user.name, avatar: user.avatar };
    save(KEYS.session, sess);
    return sess;
  },
  register({ name, email, password, role='student' }) {
    const users = load(KEYS.users) || [];
    if (users.find(u => u.email===email)) return { error: 'Email already registered' };
    const user = { id:uid(), role, name, email, password, avatar: name[0].toUpperCase(), createdAt: now() };
    users.push(user);
    save(KEYS.users, users);
    const sess = { userId: user.id, role: user.role, name: user.name, avatar: user.avatar };
    save(KEYS.session, sess);
    return { user: sess };
  },
  logout()    { localStorage.removeItem(KEYS.session); },
  session()   { return load(KEYS.session); },
  current()   {
    const sess = load(KEYS.session);
    if (!sess) return null;
    return (load(KEYS.users)||[]).find(u => u.id === sess.userId) || null;
  },
};

// ── Shops ─────────────────────────────────────────────────────
const Shops = {
  all()       { return load(KEYS.shops) || []; },
  approved()  { return Shops.all().filter(s => s.status==='approved'); },
  pending()   { return Shops.all().filter(s => s.status==='pending'); },
  byId(id)    { return Shops.all().find(s => s.id===id) || null; },
  byOwner(uid){ return Shops.all().find(s => s.ownerId===uid) || null; },
  create(data) {
    const shops = Shops.all();
    const shop  = { id:uid(), status:'pending', rating:0, reviewCount:0, createdAt:now(), ...data };
    shops.push(shop);
    save(KEYS.shops, shops);
    // Link to user
    const users = load(KEYS.users)||[];
    const idx   = users.findIndex(u=>u.id===data.ownerId);
    if (idx>=0) { users[idx].shopId = shop.id; save(KEYS.users, users); }
    return shop;
  },
  update(id, data) {
    const shops = Shops.all();
    const idx   = shops.findIndex(s=>s.id===id);
    if (idx<0) return null;
    shops[idx] = { ...shops[idx], ...data, updatedAt:now() };
    save(KEYS.shops, shops);
    return shops[idx];
  },
  approve(id) { return Shops.update(id, { status:'approved' }); },
  reject(id)  { return Shops.update(id, { status:'rejected' }); },
  delete(id)  {
    save(KEYS.shops, Shops.all().filter(s=>s.id!==id));
    save(KEYS.products, Products.all().filter(p=>p.shopId!==id));
  },
  distance(shop, lat=17.386, lng=78.487) {
    const R = 6371;
    const dLat = (shop.lat-lat)*Math.PI/180;
    const dLng = (shop.lng-lng)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat*Math.PI/180)*Math.cos(shop.lat*Math.PI/180)*Math.sin(dLng/2)**2;
    return +(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1);
  },
};

// ── Products ─────────────────────────────────────────────────
const Products = {
  all()        { return load(KEYS.products) || []; },
  byId(id)     { return Products.all().find(p=>p.id===id) || null; },
  byShop(sid)  { return Products.all().filter(p=>p.shopId===sid); },
  create(data) {
    const prods = Products.all();
    const prod  = { id:uid(), createdAt:now(), updatedAt:now(), ...data };
    prods.push(prod);
    save(KEYS.products, prods);
    return prod;
  },
  update(id, data) {
    const prods = Products.all();
    const idx   = prods.findIndex(p=>p.id===id);
    if (idx<0) return null;
    prods[idx] = { ...prods[idx], ...data, updatedAt:now() };
    save(KEYS.products, prods);
    return prods[idx];
  },
  delete(id) { save(KEYS.products, Products.all().filter(p=>p.id!==id)); },
  finalPrice(p) { return p.discount ? +(p.price*(1-p.discount/100)).toFixed(0) : p.price; },
  search(query) {
    const q = query.toLowerCase().trim();
    return Products.all().filter(p => {
      const shop = Shops.byId(p.shopId);
      if (!shop || shop.status!=='approved') return false;
      return p.name.toLowerCase().includes(q) ||
             (p.description||'').toLowerCase().includes(q) ||
             (p.tags||[]).some(t=>t.toLowerCase().includes(q)) ||
             p.category.toLowerCase().includes(q);
    });
  },
};

// ── Reviews ──────────────────────────────────────────────────
const Reviews = {
  all()       { return load(KEYS.reviews) || []; },
  byShop(sid) { return Reviews.all().filter(r=>r.shopId===sid); },
  byUser(uid) { return Reviews.all().filter(r=>r.userId===uid); },
  add(data) {
    const reviews = Reviews.all();
    const existing = reviews.findIndex(r=>r.shopId===data.shopId && r.userId===data.userId);
    const rev = { id:uid(), createdAt:now(), ...data };
    if (existing>=0) reviews[existing] = rev; else reviews.push(rev);
    save(KEYS.reviews, reviews);
    // Recalculate shop rating
    const shopRevs = Reviews.byShop(data.shopId);
    const avg = shopRevs.reduce((s,r)=>s+r.rating,0)/shopRevs.length;
    Shops.update(data.shopId, { rating: +avg.toFixed(1), reviewCount: shopRevs.length });
    return rev;
  },
  delete(id) {
    const rev = Reviews.all().find(r=>r.id===id);
    save(KEYS.reviews, Reviews.all().filter(r=>r.id!==id));
    if (rev) {
      const shopRevs = Reviews.byShop(rev.shopId);
      const avg = shopRevs.length ? shopRevs.reduce((s,r)=>s+r.rating,0)/shopRevs.length : 0;
      Shops.update(rev.shopId, { rating: +avg.toFixed(1), reviewCount: shopRevs.length });
    }
  },
};

// ── Reports ──────────────────────────────────────────────────
const Reports = {
  all()    { return load(KEYS.reports) || []; },
  add(data){ const reps=[...Reports.all(),{id:uid(),status:'pending',createdAt:now(),...data}]; save(KEYS.reports,reps); },
  resolve(id){ save(KEYS.reports, Reports.all().map(r=>r.id===id?{...r,status:'resolved'}:r)); },
  delete(id) { save(KEYS.reports, Reports.all().filter(r=>r.id!==id)); },
};

// ── Favourites ───────────────────────────────────────────────
const Favs = {
  _shops(uid)  { return (load(KEYS.favShops)||{})[uid]||[]; },
  _prods(uid)  { return (load(KEYS.favProds)||{})[uid]||[]; },
  toggleShop(uid,sid) {
    const m=load(KEYS.favShops)||{}; m[uid]=m[uid]||[];
    m[uid]=m[uid].includes(sid)?m[uid].filter(x=>x!==sid):[...m[uid],sid];
    save(KEYS.favShops,m);
    return m[uid].includes(sid);
  },
  toggleProd(uid,pid) {
    const m=load(KEYS.favProds)||{}; m[uid]=m[uid]||[];
    m[uid]=m[uid].includes(pid)?m[uid].filter(x=>x!==pid):[...m[uid],pid];
    save(KEYS.favProds,m);
    return m[uid].includes(pid);
  },
  hasShop(uid,sid) { return Favs._shops(uid).includes(sid); },
  hasProd(uid,pid) { return Favs._prods(uid).includes(pid); },
  shops(uid)  { return Favs._shops(uid).map(id=>Shops.byId(id)).filter(Boolean); },
  prods(uid)  { return Favs._prods(uid).map(id=>Products.byId(id)).filter(Boolean); },
};

// ── Stats ─────────────────────────────────────────────────────
const Stats = {
  get() {
    const users    = load(KEYS.users)||[];
    const shops    = Shops.all();
    const products = Products.all();
    return {
      students:  users.filter(u=>u.role==='student').length,
      providers: users.filter(u=>u.role==='provider').length,
      shops:     shops.filter(s=>s.status==='approved').length,
      pending:   shops.filter(s=>s.status==='pending').length,
      products:  products.length,
      reviews:   (load(KEYS.reviews)||[]).length,
      reports:   Reports.all().filter(r=>r.status==='pending').length,
    };
  },
};

// ── Categories ────────────────────────────────────────────────
const CATEGORIES = [
  { name:'Stationery',           icon:'✏️',  color:'#4F46E5' },
  { name:'Printing & Xerox',     icon:'🖨️',  color:'#0891B2' },
  { name:'Project Materials',    icon:'🎨',  color:'#059669' },
  { name:'Electronics',          icon:'💻',  color:'#DC2626' },
  { name:'Food & Cafes',         icon:'☕',  color:'#D97706' },
  { name:'Books',                icon:'📚',  color:'#7C3AED' },
  { name:'Binding & Lamination', icon:'📎',  color:'#BE185D' },
  { name:'Repair Services',      icon:'🔧',  color:'#B45309' },
  { name:'College Supplies',     icon:'🎒',  color:'#0F766E' },
  { name:'Other Services',       icon:'🛍️',  color:'#64748B' },
];

// ── Search ─────────────────────────────────────────────────────
function searchAll(query) {
  const q = query.toLowerCase().trim();
  if (!q) return { shops:[], products:[] };
  const shops = Shops.approved().filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    (s.tags||[]).some(t=>t.toLowerCase().includes(q)) ||
    (s.description||'').toLowerCase().includes(q)
  );
  const products = Products.search(q);
  return { shops, products };
}

// Init
seed();

return {
  Auth, Shops, Products, Reviews, Reports, Favs, Stats,
  CATEGORIES, searchAll, uid, now, clone,
  AVAILABILITY_LABELS: {
    available:  { label:'Available',          color:'#059669', bg:'#D1FAE5' },
    low_stock:  { label:'Low Stock',          color:'#D97706', bg:'#FEF3C7' },
    out_of_stock:{ label:'Out of Stock',      color:'#DC2626', bg:'#FEE2E2' },
    on_request: { label:'Available on Request',color:'#6366F1',bg:'#EEF2FF' },
  },
};
})();
