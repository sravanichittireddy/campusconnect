// ============================================================
// CampusConnect — App Controller & Router
// ============================================================

const App = (() => {

let _currentPage = null;

// ── Navigation ────────────────────────────────────────────────
function nav(page, params={}) {
  const url = new URL(window.location);
  url.searchParams.set('page', page);
  Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));
  // Clear params not in new set
  ['shopId','productId','query','category','tab'].forEach(k=>{
    if (!(k in params)) url.searchParams.delete(k);
  });
  window.history.pushState({}, '', url);
  render();
}

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    page:      p.get('page') || 'home',
    shopId:    p.get('shopId'),
    productId: p.get('productId'),
    query:     p.get('query') || '',
    category:  p.get('category') || '',
    tab:       p.get('tab') || '',
  };
}

// ── Render ────────────────────────────────────────────────────
function render() {
  const params  = getParams();
  const sess    = CC.Auth.session();
  const main    = document.getElementById('main');
  const navLinks= document.getElementById('nav-links');

  // Scroll to top
  window.scrollTo(0,0);

  // Nav bar update
  renderNav(sess, params.page);

  // Page routing
  switch (params.page) {
    case 'home':      Pages.home(main, sess, params);      break;
    case 'search':    Pages.search(main, sess, params);    break;
    case 'shop':      Pages.shop(main, sess, params);      break;
    case 'product':   Pages.product(main, sess, params);   break;
    case 'compare':   Pages.compare(main, sess, params);   break;
    case 'favorites': Pages.favorites(main, sess, params); break;
    case 'login':     Pages.login(main, sess, params);     break;
    case 'register':  Pages.register(main, sess, params);  break;
    case 'dashboard': Pages.dashboard(main, sess, params); break;
    case 'admin':     Pages.admin(main, sess, params);     break;
    case 'shop-setup':Pages.shopSetup(main, sess, params); break;
    default:          Pages.home(main, sess, params);
  }
  _currentPage = params.page;
}

function renderNav(sess, page) {
  const nav = document.getElementById('navbar');
  const role= sess?.role;
  nav.innerHTML = `
<div class="nav-inner">
  <a class="nav-brand" href="#" onclick="App.nav('home')">
    <span class="brand-icon">🎓</span>
    <span class="brand-text">Campus<span>Connect</span></span>
  </a>

  <div class="nav-search-wrap" id="nav-search-wrap">
    <form class="nav-search-form" onsubmit="event.preventDefault();App.doSearch(document.getElementById('nav-q').value)">
      <input id="nav-q" type="text" placeholder="Search products, shops…" autocomplete="off">
      <button type="submit">🔍</button>
    </form>
  </div>

  <button class="hamburger" id="hamburger" onclick="App.toggleMenu()">☰</button>

  <nav class="nav-links" id="nav-links">
    <a href="#" class="${page==='home'?'active':''}"     onclick="App.nav('home')">Home</a>
    <a href="#" class="${page==='search'?'active':''}"   onclick="App.nav('search')">Browse</a>
    ${sess ? `<a href="#" class="${page==='favorites'?'active':''}" onclick="App.nav('favorites')">Saved</a>` : ''}
    ${role==='provider'||role==='admin' ? `<a href="#" class="${page==='dashboard'||page==='admin'?'active':''}" onclick="App.nav(${role==='admin'?`'admin'`:`'dashboard'`})">${role==='admin'?'Admin':'Dashboard'}</a>` : ''}
    ${sess
      ? `<button class="btn btn-ghost btn-sm" onclick="App.logout()">${sess.avatar} ${sess.name.split(' ')[0]}</button>`
      : `<a href="#" onclick="App.nav('login')" class="btn btn-primary btn-sm">Sign in</a>`
    }
  </nav>
</div>`;
}

// ── Actions ───────────────────────────────────────────────────
function doSearch(q) {
  if (!q.trim()) return;
  nav('search', { query: q.trim() });
}

function openShop(id) { nav('shop', { shopId: id }); }
function openProduct(id) { nav('product', { productId: id }); }

function toggleShopFav(id, btn) {
  const sess = CC.Auth.session();
  if (!sess) { UI.toast('Sign in to save shops','error'); return; }
  const now = CC.Favs.toggleShop(sess.userId, id);
  btn.classList.toggle('fav-active', now);
  UI.toast(now ? 'Shop saved!' : 'Removed from saved');
}

function toggleProdFav(id, btn) {
  const sess = CC.Auth.session();
  if (!sess) { UI.toast('Sign in to save items','error'); return; }
  const now = CC.Favs.toggleProd(sess.userId, id);
  btn.classList.toggle('fav-active', now);
  UI.toast(now ? 'Item saved!' : 'Removed from saved');
}

function logout() {
  CC.Auth.logout();
  UI.toast('Signed out');
  nav('home');
}

function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

// Window resize - close menu
window.addEventListener('resize', ()=>{
  const nl = document.getElementById('nav-links');
  if (nl && window.innerWidth>768) nl.classList.remove('open');
});

// ── Init ──────────────────────────────────────────────────────
function init() {
  window.addEventListener('popstate', render);
  render();
}

return {
  nav, render, doSearch, openShop, openProduct,
  toggleShopFav, toggleProdFav, logout, toggleMenu, init,
};
})();

// ============================================================
// Pages
// ============================================================
const Pages = {};

// ── Home ──────────────────────────────────────────────────────
Pages.home = function(main, sess, params) {
  const shops   = CC.Shops.approved();
  const cats    = CC.CATEGORIES;
  const popular = CC.Products.all()
    .filter(p=>{ const s=CC.Shops.byId(p.shopId); return s&&s.status==='approved'; })
    .slice(0,8);

  main.innerHTML = `
<section class="hero">
  <div class="hero-inner">
    <div class="hero-tag">🎓 For students, by campus</div>
    <h1 class="hero-title">Find any product at any campus shop — <em>before you go</em></h1>
    <p class="hero-sub">Search for a record book, coffee, USB drive, or printing service and instantly compare nearby shops, prices, and availability.</p>
    <form class="hero-search" onsubmit="event.preventDefault();App.doSearch(document.getElementById('hero-q').value)">
      <input id="hero-q" type="text" placeholder='Try "record book", "spiral binding", "tea"…' autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <div class="hero-examples">
      Popular: 
      <span onclick="App.doSearch('record book')">Record Book</span>
      <span onclick="App.doSearch('printing')">Printing</span>
      <span onclick="App.doSearch('coffee')">Coffee</span>
      <span onclick="App.doSearch('USB drive')">USB Drive</span>
      <span onclick="App.doSearch('binding')">Binding</span>
    </div>
  </div>
</section>

<div class="page-wrap">
  ${UI.sectionHeader('Browse by Category', 'View all', "App.nav('search')")}
  <div class="cat-grid">
    ${cats.map(c=>`
      <div class="cat-card" onclick="App.nav('search',{category:'${c.name}'})" style="--cat-color:${c.color}">
        <span class="cat-icon">${c.icon}</span>
        <span class="cat-name">${c.name}</span>
      </div>`).join('')}
  </div>

  ${UI.sectionHeader('Nearby Shops', 'See all', "App.nav('search')")}
  <div class="shop-grid">
    ${shops.slice(0,6).map(s=>UI.shopCard(s)).join('') || UI.empty('🏪','No shops yet')}
  </div>

  ${UI.sectionHeader('Popular Products', 'See all', "App.nav('search')")}
  <div class="product-grid">
    ${popular.map(p=>UI.productCard(p)).join('') || UI.empty('📦','No products yet')}
  </div>
</div>`;
};

// ── Search ────────────────────────────────────────────────────
Pages.search = function(main, sess, params) {
  const { query, category } = params;
  let { shops, products } = CC.searchAll(query);

  if (category) {
    shops    = (query ? shops : CC.Shops.approved()).filter(s=>s.category===category);
    products = (query ? products : CC.Products.all().filter(p=>{ const s=CC.Shops.byId(p.shopId); return s&&s.status==='approved'; }))
               .filter(p=>p.category===category);
  } else if (!query) {
    shops    = CC.Shops.approved();
    products = CC.Products.all().filter(p=>{ const s=CC.Shops.byId(p.shopId); return s&&s.status==='approved'; });
  }

  // Filters
  let sortShops = shops.slice();
  let sortProds = products.slice();

  const avFilter   = document.getElementById('filter-avail')?.value || '';
  const sortShopBy = document.getElementById('sort-shops')?.value || 'rating';
  const sortProdBy = document.getElementById('sort-prods')?.value || 'price';

  if (avFilter) sortProds = sortProds.filter(p=>p.availability===avFilter);

  if (sortShopBy==='distance') sortShops.sort((a,b)=>CC.Shops.distance(a)-CC.Shops.distance(b));
  else if (sortShopBy==='rating') sortShops.sort((a,b)=>(b.rating||0)-(a.rating||0));
  else if (sortShopBy==='name') sortShops.sort((a,b)=>a.name.localeCompare(b.name));

  if (sortProdBy==='price')    sortProds.sort((a,b)=>CC.Products.finalPrice(a)-CC.Products.finalPrice(b));
  else if (sortProdBy==='price-desc') sortProds.sort((a,b)=>CC.Products.finalPrice(b)-CC.Products.finalPrice(a));
  else if (sortProdBy==='name') sortProds.sort((a,b)=>a.name.localeCompare(b.name));

  // Find comparable products (same name in multiple shops)
  const nameCounts = {};
  sortProds.forEach(p=>{ const n=p.name.toLowerCase(); nameCounts[n]=(nameCounts[n]||0)+1; });
  const comparableNames = Object.keys(nameCounts).filter(n=>nameCounts[n]>1);

  main.innerHTML = `
<div class="page-wrap">
  <div class="search-header">
    <h1 class="search-title">${query ? `Results for "<strong>${query}</strong>"` : category ? `<strong>${category}</strong>` : 'Browse All'}</h1>
    ${query ? `<span class="search-count">${shops.length} shops · ${products.length} products</span>` : ''}
  </div>

  <div class="search-bar-wrap">
    <form class="search-bar-form" onsubmit="event.preventDefault();App.doSearch(document.getElementById('search-q').value)">
      <input id="search-q" type="text" value="${query}" placeholder="Search products, shops, services…">
      <button type="submit">🔍 Search</button>
    </form>
  </div>

  <div class="search-cats-scroll">
    <button class="cat-pill ${!category?'active':''}" onclick="App.nav('search',{query:'${query}'})">All</button>
    ${CC.CATEGORIES.map(c=>`<button class="cat-pill ${category===c.name?'active':''}" onclick="App.nav('search',{query:'${query}',category:'${c.name}'})">${c.icon} ${c.name}</button>`).join('')}
  </div>

  ${comparableNames.length&&query ? `
  <div class="compare-tip">
    💡 "${query}" is available at multiple shops — <a href="#" onclick="App.nav('compare',{query:'${query}'})">Compare prices & availability →</a>
  </div>` : ''}

  <div class="search-layout">
    <aside class="search-filters">
      <h3>Filters</h3>
      <label>Availability</label>
      <select id="filter-avail" onchange="Pages.search(document.getElementById('main'),null,{query:'${query}',category:'${category}'})">
        <option value="">All</option>
        <option value="available" ${avFilter==='available'?'selected':''}>Available</option>
        <option value="low_stock" ${avFilter==='low_stock'?'selected':''}>Low Stock</option>
        <option value="out_of_stock" ${avFilter==='out_of_stock'?'selected':''}>Out of Stock</option>
      </select>

      <label>Sort Shops</label>
      <select id="sort-shops" onchange="Pages.search(document.getElementById('main'),null,{query:'${query}',category:'${category}'})">
        <option value="rating">By Rating</option>
        <option value="distance">By Distance</option>
        <option value="name">By Name</option>
      </select>

      <label>Sort Products</label>
      <select id="sort-prods" onchange="Pages.search(document.getElementById('main'),null,{query:'${query}',category:'${category}'})">
        <option value="price">Price: Low→High</option>
        <option value="price-desc">Price: High→Low</option>
        <option value="name">Name A–Z</option>
      </select>
    </aside>

    <div class="search-results">
      ${sortProds.length ? `
        <h2 class="results-section-title">Products & Services (${sortProds.length})</h2>
        <div class="product-grid">
          ${sortProds.map(p=>UI.productCard(p)).join('')}
        </div>` : query||category ? UI.empty('📦','No products found','Try a different search term.') : ''}

      ${sortShops.length ? `
        <h2 class="results-section-title" style="margin-top:2.5rem">Shops (${sortShops.length})</h2>
        <div class="shop-grid">
          ${sortShops.map(s=>UI.shopCard(s)).join('')}
        </div>` : ''}

      ${!sortProds.length && !sortShops.length ? UI.empty('🔍','Nothing found',`We couldn't find anything for "${query||category}". Try a different term.`) : ''}
    </div>
  </div>
</div>`;
};

// ── Shop Page ──────────────────────────────────────────────────
Pages.shop = function(main, sess, params) {
  const shop = CC.Shops.byId(params.shopId);
  if (!shop) { main.innerHTML = UI.empty('🏪','Shop not found'); return; }

  const products = CC.Products.byShop(shop.id);
  const reviews  = CC.Reviews.byShop(shop.id);
  const dist     = CC.Shops.distance(shop);
  const isFav    = sess ? CC.Favs.hasShop(sess.userId, shop.id) : false;
  const tab      = params.tab || 'products';

  // Group products by type
  const prodList = products.filter(p=>p.type==='product');
  const servList = products.filter(p=>p.type==='service');

  const userReview = sess ? reviews.find(r=>r.userId===sess.userId) : null;

  main.innerHTML = `
<div class="shop-hero" style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%)">
  <div class="page-wrap">
    <div class="shop-hero-inner">
      <div class="shop-avatar">${shop.image||'🏪'}</div>
      <div class="shop-hero-info">
        <div class="shop-hero-cat">${shop.category}</div>
        <h1 class="shop-hero-name">${shop.name}</h1>
        <p class="shop-hero-tagline">${shop.tagline||''}</p>
        <div class="shop-hero-meta">
          ${UI.stars(shop.rating||0)} <span>${shop.rating||'–'} (${shop.reviewCount} reviews)</span>
          <span class="dot">·</span><span>📍 ${dist} km</span>
          <span class="dot">·</span><span>📞 <a href="tel:${shop.phone}" style="color:#94a3b8">${shop.phone}</a></span>
        </div>
        <div class="shop-hero-actions">
          <a href="tel:${shop.phone}" class="btn btn-primary btn-sm">📞 Call</a>
          <a href="https://maps.google.com/?q=${shop.lat},${shop.lng}" target="_blank" class="btn btn-ghost-light btn-sm">🗺️ Directions</a>
          ${sess?`<button class="btn ${isFav?'btn-fav-active':'btn-ghost-light'} btn-sm" onclick="App.toggleShopFav('${shop.id}',this)">♥ ${isFav?'Saved':'Save'}</button>`:''}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="page-wrap shop-page">
  <div class="shop-info-bar">
    <div class="shop-info-item"><strong>Address</strong> ${shop.address}</div>
    <div class="shop-info-item"><strong>Hours</strong> ${shop.hours}</div>
    <div class="shop-info-item"><strong>Description</strong> ${shop.description}</div>
  </div>

  <div class="shop-tabs">
    <button class="shop-tab ${tab==='products'?'active':''}" onclick="App.nav('shop',{shopId:'${shop.id}',tab:'products'})">
      Products ${prodList.length?`(${prodList.length})`:''}
    </button>
    <button class="shop-tab ${tab==='services'?'active':''}" onclick="App.nav('shop',{shopId:'${shop.id}',tab:'services'})">
      Services ${servList.length?`(${servList.length})`:''}
    </button>
    <button class="shop-tab ${tab==='reviews'?'active':''}" onclick="App.nav('shop',{shopId:'${shop.id}',tab:'reviews'})">
      Reviews (${reviews.length})
    </button>
  </div>

  <div class="shop-tab-content">
    ${tab==='products' ? (prodList.length
      ? `<div class="product-grid">${prodList.map(p=>UI.productCard(p,false)).join('')}</div>`
      : UI.empty('📦','No products listed','This shop hasn\'t added products yet.'))
    : ''}
    ${tab==='services' ? (servList.length
      ? `<div class="product-grid">${servList.map(p=>UI.productCard(p,false)).join('')}</div>`
      : UI.empty('🔧','No services listed','This shop hasn\'t added services yet.'))
    : ''}
    ${tab==='reviews' ? `
      ${sess&&!userReview ? `
        <div class="review-form-box">
          <h3>Leave a Review</h3>
          <form id="review-form" onsubmit="App.submitReview(event,'${shop.id}')">
            <div class="star-picker" id="star-picker">
              ${[1,2,3,4,5].map(n=>`<span class="star-pick" data-v="${n}" onclick="App.pickStar(${n})">☆</span>`).join('')}
            </div>
            <input type="hidden" id="review-rating" value="0">
            <textarea id="review-text" placeholder="Share your experience…" required></textarea>
            <button class="btn btn-primary" type="submit">Submit Review</button>
          </form>
        </div>` : ''}
      ${userReview ? `<div class="alert alert-info">You've already reviewed this shop. <a href="#" onclick="App.deleteReview('${userReview.id}','${shop.id}')">Delete review</a></div>` : ''}
      ${reviews.length
        ? reviews.map(r=>`
          <div class="review-card">
            <div class="review-header">
              <span class="review-avatar">${r.userName[0]}</span>
              <div>
                <div class="review-name">${r.userName}</div>
                <div>${UI.stars(r.rating)}</div>
              </div>
              <div class="review-date">${new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <p class="review-text">${r.text}</p>
          </div>`).join('')
        : UI.empty('💬','No reviews yet','Be the first to review this shop!')}
    ` : ''}
  </div>
</div>`;
};

// ── Product Page ───────────────────────────────────────────────
Pages.product = function(main, sess, params) {
  const product = CC.Products.byId(params.productId);
  if (!product) { main.innerHTML = UI.empty('📦','Product not found'); return; }
  const shop  = CC.Shops.byId(product.shopId);
  const isFav = sess ? CC.Favs.hasProd(sess.userId, product.id) : false;
  const similar = CC.Products.search(product.name).filter(p=>p.id!==product.id && p.shopId!==product.shopId);

  main.innerHTML = `
<div class="page-wrap product-page">
  <div class="breadcrumb">
    <a href="#" onclick="App.nav('home')">Home</a> ›
    <a href="#" onclick="App.nav('search',{category:'${product.category}'})">${product.category}</a> ›
    ${product.name}
  </div>

  <div class="product-detail-card">
    <div class="product-detail-media">
      <div class="product-detail-emoji">${product.image||'📦'}</div>
      ${product.discount?`<div class="product-discount-badge">${product.discount}% OFF</div>`:''}
    </div>
    <div class="product-detail-info">
      <span class="product-cat-badge">${product.category}</span>
      <h1 class="product-detail-name">${product.name}</h1>
      <p class="product-detail-desc">${product.description||''}</p>
      <div class="product-detail-price">${UI.price(product)} ${product.unit?`<span class="unit">/ ${product.unit}</span>`:''}</div>
      <div style="margin:.75rem 0">${UI.avail(product.availability)}</div>
      ${shop?`
      <div class="product-detail-shop" onclick="App.openShop('${shop.id}')">
        <span class="shop-mini-icon">${shop.image||'🏪'}</span>
        <div>
          <div class="shop-mini-name">${shop.name}</div>
          <div class="shop-mini-meta">${UI.stars(shop.rating||0)} · ${CC.Shops.distance(shop)} km · ${shop.address}</div>
        </div>
        <span class="arrow">›</span>
      </div>`:''}
      <div class="product-detail-actions">
        <button class="btn btn-primary" onclick="App.openShop('${shop?.id||''}')">View Shop</button>
        ${sess?`<button class="btn ${isFav?'btn-fav-active':'btn-ghost'}" onclick="App.toggleProdFav('${product.id}',this)">♥ ${isFav?'Saved':'Save'}</button>`:''}
        ${similar.length?`<button class="btn btn-ghost" onclick="App.nav('compare',{query:'${encodeURIComponent(product.name)}'})">Compare Prices</button>`:''}
      </div>
      <div class="product-updated">Last updated ${new Date(product.updatedAt).toLocaleDateString()}</div>
    </div>
  </div>

  ${similar.length ? `
    ${UI.sectionHeader('Same product at other shops', 'Compare all', `App.nav('compare',{query:'${encodeURIComponent(product.name)}'})`)}
    <div class="similar-table">
      <table>
        <thead><tr><th>Shop</th><th>Price</th><th>Availability</th><th>Distance</th><th></th></tr></thead>
        <tbody>
          ${similar.map(p=>{
            const s=CC.Shops.byId(p.shopId);
            return `<tr>
              <td><strong>${s?.name||'–'}</strong></td>
              <td>${UI.price(p)}</td>
              <td>${UI.avail(p.availability)}</td>
              <td>${s?CC.Shops.distance(s):'-'} km</td>
              <td><button class="btn btn-ghost btn-sm" onclick="App.openShop('${p.shopId}')">View</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>` : ''}
</div>`;
};

// ── Compare Page ───────────────────────────────────────────────
Pages.compare = function(main, sess, params) {
  const query = decodeURIComponent(params.query||'');
  const products = query ? CC.Products.search(query) : [];

  // Group by normalised name
  const groups = {};
  products.forEach(p=>{
    const k = p.name.toLowerCase();
    if (!groups[k]) groups[k]=[];
    groups[k].push(p);
  });
  const multiGroups = Object.values(groups).filter(g=>g.length>1);

  main.innerHTML = `
<div class="page-wrap">
  <h1 class="page-title">Compare Prices</h1>
  <p class="page-sub">See the same product across all campus shops — sorted by price.</p>

  <form class="search-bar-form" style="max-width:500px;margin-bottom:2rem" onsubmit="event.preventDefault();App.nav('compare',{query:document.getElementById('cmp-q').value})">
    <input id="cmp-q" type="text" value="${query}" placeholder="Search a product to compare…">
    <button type="submit">Compare</button>
  </form>

  ${multiGroups.length ? multiGroups.map(group=>{
    const sorted = group.slice().sort((a,b)=>CC.Products.finalPrice(a)-CC.Products.finalPrice(b));
    const best   = sorted[0];
    return `
    <div class="compare-group">
      <div class="compare-group-title">
        <span class="compare-emoji">${group[0].image||'📦'}</span>
        <h2>${group[0].name}</h2>
        <span class="compare-count">${group.length} shops</span>
      </div>
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Shop</th><th>Price</th><th>Availability</th><th>Distance</th><th>Rating</th><th></th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((p,i)=>{
              const shop=CC.Shops.byId(p.shopId);
              return `
              <tr class="${i===0?'compare-best':''}">
                <td>
                  <div class="compare-shop-name">${shop?.name||'–'} ${i===0?'<span class="best-badge">Best Price</span>':''}</div>
                  <div class="compare-shop-addr">${shop?.address||''}</div>
                </td>
                <td class="compare-price">${UI.price(p)}</td>
                <td>${UI.avail(p.availability)}</td>
                <td>${shop?CC.Shops.distance(shop)+' km':'–'}</td>
                <td>${shop?UI.stars(shop.rating||0):''} ${shop?.rating||'–'}</td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="App.openShop('${p.shopId}')">View Shop</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('') : query
    ? UI.empty('🔍','No comparable products','This product is only available at one shop or wasn\'t found.')
    : UI.empty('📊','Compare Products','Search for a product above to see price comparisons.')}
</div>`;
};

// ── Favorites ──────────────────────────────────────────────────
Pages.favorites = function(main, sess, params) {
  if (!sess) { main.innerHTML = UI.empty('🔒','Sign in to view saved items'); return; }
  const favShops = CC.Favs.shops(sess.userId);
  const favProds = CC.Favs.prods(sess.userId);
  const tab = params.tab || 'shops';

  main.innerHTML = `
<div class="page-wrap">
  <h1 class="page-title">Saved</h1>
  <div class="shop-tabs">
    <button class="shop-tab ${tab==='shops'?'active':''}" onclick="App.nav('favorites',{tab:'shops'})">Shops (${favShops.length})</button>
    <button class="shop-tab ${tab==='products'?'active':''}" onclick="App.nav('favorites',{tab:'products'})">Products (${favProds.length})</button>
  </div>
  ${tab==='shops'
    ? (favShops.length ? `<div class="shop-grid">${favShops.map(s=>UI.shopCard(s)).join('')}</div>` : UI.empty('♥','No saved shops','Browse shops and tap ♥ to save them.'))
    : (favProds.length ? `<div class="product-grid">${favProds.map(p=>UI.productCard(p)).join('')}</div>` : UI.empty('♥','No saved products','Browse products and tap ♥ to save them.'))}
</div>`;
};

// ── Login ─────────────────────────────────────────────────────
Pages.login = function(main, sess, params) {
  if (sess) { App.nav('home'); return; }
  main.innerHTML = `
<div class="auth-wrap">
  <div class="auth-card">
    <div class="auth-logo">🎓</div>
    <h1 class="auth-title">Sign in to CampusConnect</h1>
    <p class="auth-sub">Access your saved shops, leave reviews, and more.</p>
    <form id="login-form" onsubmit="App.handleLogin(event)">
      ${UI.field({id:'email',label:'Email',type:'email',placeholder:'you@college.edu',required:true})}
      ${UI.field({id:'password',label:'Password',type:'password',placeholder:'Your password',required:true})}
      <button class="btn btn-primary btn-full" type="submit">Sign In</button>
    </form>
    <p class="auth-switch">No account? <a href="#" onclick="App.nav('register')">Register as a student</a></p>
    <p class="auth-switch">Running a shop? <a href="#" onclick="App.nav('register',{role:'provider'})">Register as a provider</a></p>
    <div class="demo-creds">
      <h4>Demo Credentials</h4>
      <div class="demo-creds-grid">
        <div><strong>Student:</strong> arjun@student.edu / student123</div>
        <div><strong>Provider:</strong> print@campus.edu / print123</div>
        <div><strong>Admin:</strong> admin@campus.edu / admin123</div>
      </div>
    </div>
  </div>
</div>`;
};

// ── Register ──────────────────────────────────────────────────
Pages.register = function(main, sess, params) {
  if (sess) { App.nav('home'); return; }
  const role = params.tab || 'student';
  main.innerHTML = `
<div class="auth-wrap">
  <div class="auth-card">
    <div class="auth-logo">🎓</div>
    <h1 class="auth-title">Create an Account</h1>
    <div class="auth-role-tabs">
      <button class="shop-tab ${role==='student'?'active':''}" onclick="App.nav('register',{tab:'student'})">Student</button>
      <button class="shop-tab ${role==='provider'?'active':''}" onclick="App.nav('register',{tab:'provider'})">Shop/Service Provider</button>
    </div>
    <form id="reg-form" onsubmit="App.handleRegister(event,'${role}')">
      ${UI.field({id:'name',label:role==='provider'?'Your Name':'Full Name',type:'text',placeholder:'Your name',required:true})}
      ${UI.field({id:'email',label:'Email',type:'email',placeholder:'you@email.com',required:true})}
      ${UI.field({id:'password',label:'Password',type:'password',placeholder:'Min. 6 characters',required:true})}
      <button class="btn btn-primary btn-full" type="submit">Create Account</button>
    </form>
    <p class="auth-switch">Already have an account? <a href="#" onclick="App.nav('login')">Sign in</a></p>
  </div>
</div>`;
};

// ── Provider Dashboard ────────────────────────────────────────
Pages.dashboard = function(main, sess, params) {
  if (!sess || sess.role!=='provider') { App.nav('login'); return; }
  const user  = CC.Auth.current();
  const shop  = CC.Shops.byOwner(sess.userId);
  const tab   = params.tab || (shop ? 'products' : 'setup');

  if (!shop) {
    App.nav('shop-setup');
    return;
  }

  const products = CC.Products.byShop(shop.id);
  const reviews  = CC.Reviews.byShop(shop.id);

  main.innerHTML = `
<div class="page-wrap">
  <div class="dash-header">
    <div>
      <h1 class="page-title">${shop.name}</h1>
      <div class="dash-status">
        Status: <span class="status-badge status-${shop.status}">${shop.status.charAt(0).toUpperCase()+shop.status.slice(1)}</span>
        · ${UI.stars(shop.rating||0)} ${shop.rating||'–'} · ${shop.reviewCount} reviews
      </div>
    </div>
    <button class="btn btn-primary" onclick="App.nav('shop',{shopId:'${shop.id}'})">View Public Page →</button>
  </div>

  <div class="shop-tabs">
    <button class="shop-tab ${tab==='products'?'active':''}" onclick="App.nav('dashboard',{tab:'products'})">Products & Services</button>
    <button class="shop-tab ${tab==='reviews'?'active':''}" onclick="App.nav('dashboard',{tab:'reviews'})">Reviews</button>
    <button class="shop-tab ${tab==='edit'?'active':''}" onclick="App.nav('dashboard',{tab:'edit'})">Edit Shop</button>
  </div>

  <div class="dash-tab-content">
  ${tab==='products' ? `
    <div class="dash-product-header">
      <h2>Catalogue (${products.length})</h2>
      <button class="btn btn-primary btn-sm" onclick="App.openAddProduct('${shop.id}')">+ Add Product/Service</button>
    </div>
    ${products.length ? `
    <div class="dash-product-table-wrap">
      <table class="dash-table">
        <thead><tr><th>Name</th><th>Type</th><th>Category</th><th>Price</th><th>Availability</th><th>Actions</th></tr></thead>
        <tbody>
          ${products.map(p=>`
          <tr>
            <td><span style="margin-right:.5rem">${p.image||'📦'}</span><strong>${p.name}</strong></td>
            <td><span class="type-badge">${p.type}</span></td>
            <td>${p.category}</td>
            <td>₹${p.price}${p.discount?` <span class="badge-discount">${p.discount}% off</span>`:''}</td>
            <td>${UI.avail(p.availability)}</td>
            <td class="action-cell">
              <button class="btn btn-ghost btn-xs" onclick="App.openEditProduct('${p.id}')">Edit</button>
              <button class="btn btn-danger btn-xs" onclick="App.deleteProduct('${p.id}')">Delete</button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : UI.empty('📦','No products yet','Add your first product or service.')}
  ` : ''}

  ${tab==='reviews' ? (reviews.length
    ? reviews.map(r=>`
      <div class="review-card">
        <div class="review-header">
          <span class="review-avatar">${r.userName[0]}</span>
          <div><div class="review-name">${r.userName}</div><div>${UI.stars(r.rating)}</div></div>
          <div class="review-date">${new Date(r.createdAt).toLocaleDateString()}</div>
        </div>
        <p class="review-text">${r.text}</p>
      </div>`).join('')
    : UI.empty('💬','No reviews yet','Your customers haven\'t left reviews yet.'))
  : ''}

  ${tab==='edit' ? `
    <div class="edit-shop-form">
      <form id="edit-shop-form" onsubmit="App.saveShopEdit(event,'${shop.id}')">
        ${UI.field({id:'name',label:'Shop Name',value:shop.name,required:true})}
        ${UI.field({id:'tagline',label:'Tagline',value:shop.tagline||'',placeholder:'Short catchy description'})}
        ${UI.field({id:'description',label:'Description',value:shop.description||'',textarea:true})}
        ${UI.field({id:'category',label:'Category',value:shop.category,options:CC.CATEGORIES.map(c=>c.name),required:true})}
        ${UI.field({id:'address',label:'Address',value:shop.address,required:true})}
        ${UI.field({id:'phone',label:'Phone',value:shop.phone})}
        ${UI.field({id:'hours',label:'Opening Hours',value:shop.hours})}
        ${UI.field({id:'image',label:'Shop Emoji/Icon',value:shop.image,placeholder:'e.g. 🏪'})}
        <button class="btn btn-primary" type="submit">Save Changes</button>
      </form>
    </div>` : ''}
  </div>
</div>`;
};

// ── Shop Setup ────────────────────────────────────────────────
Pages.shopSetup = function(main, sess, params) {
  if (!sess || sess.role!=='provider') { App.nav('login'); return; }
  main.innerHTML = `
<div class="page-wrap auth-wrap">
  <div class="auth-card" style="max-width:600px">
    <div class="auth-logo">🏪</div>
    <h1 class="auth-title">Set Up Your Shop</h1>
    <p class="auth-sub">Your listing will be reviewed before going live. This usually takes less than a day.</p>
    <form id="shop-setup-form" onsubmit="App.handleShopSetup(event)">
      ${UI.field({id:'name',label:'Shop Name',required:true,placeholder:'e.g. My Stationery Store'})}
      ${UI.field({id:'tagline',label:'Tagline',placeholder:'Short catchy description'})}
      ${UI.field({id:'description',label:'Description',textarea:true,placeholder:'Describe what you offer…'})}
      ${UI.field({id:'category',label:'Category',options:CC.CATEGORIES.map(c=>c.name),required:true})}
      ${UI.field({id:'address',label:'Address',required:true,placeholder:'Shop number, street, area…'})}
      ${UI.field({id:'phone',label:'Phone Number',placeholder:'+91 98765 00000'})}
      ${UI.field({id:'hours',label:'Opening Hours',placeholder:'Mon–Sat 9 AM – 7 PM'})}
      ${UI.field({id:'image',label:'Shop Icon (emoji)',placeholder:'🏪'})}
      <button class="btn btn-primary btn-full" type="submit">Submit for Approval</button>
    </form>
  </div>
</div>`;
};

// ── Admin ─────────────────────────────────────────────────────
Pages.admin = function(main, sess, params) {
  if (!sess || sess.role!=='admin') { App.nav('login'); return; }
  const tab    = params.tab || 'overview';
  const stats  = CC.Stats.get();
  const shops  = CC.Shops.all();
  const users  = (localStorage.getItem('cc_users')?JSON.parse(localStorage.getItem('cc_users')):[]);
  const reports= CC.Reports.all();

  main.innerHTML = `
<div class="page-wrap">
  <h1 class="page-title">Admin Dashboard</h1>

  <div class="stats-grid">
    <div class="stat-card"><div class="stat-num">${stats.students}</div><div class="stat-lbl">Students</div></div>
    <div class="stat-card"><div class="stat-num">${stats.providers}</div><div class="stat-lbl">Providers</div></div>
    <div class="stat-card"><div class="stat-num">${stats.shops}</div><div class="stat-lbl">Live Shops</div></div>
    <div class="stat-card stat-alert"><div class="stat-num">${stats.pending}</div><div class="stat-lbl">Pending Approvals</div></div>
    <div class="stat-card"><div class="stat-num">${stats.products}</div><div class="stat-lbl">Products</div></div>
    <div class="stat-card stat-alert"><div class="stat-num">${stats.reports}</div><div class="stat-lbl">Open Reports</div></div>
  </div>

  <div class="shop-tabs">
    <button class="shop-tab ${tab==='overview'?'active':''}" onclick="App.nav('admin',{tab:'overview'})">Shops</button>
    <button class="shop-tab ${tab==='users'?'active':''}" onclick="App.nav('admin',{tab:'users'})">Users</button>
    <button class="shop-tab ${tab==='reports'?'active':''}" onclick="App.nav('admin',{tab:'reports'})">Reports</button>
  </div>

  <div class="dash-tab-content">
  ${tab==='overview' ? `
    <table class="dash-table">
      <thead><tr><th>Shop</th><th>Category</th><th>Owner</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${shops.map(s=>{
          const owner=users.find(u=>u.id===s.ownerId);
          return `<tr>
            <td><strong>${s.name}</strong></td>
            <td>${s.category}</td>
            <td>${owner?.name||'–'}</td>
            <td><span class="status-badge status-${s.status}">${s.status}</span></td>
            <td class="action-cell">
              <button class="btn btn-ghost btn-xs" onclick="App.openShop('${s.id}')">View</button>
              ${s.status==='pending'?`<button class="btn btn-primary btn-xs" onclick="App.adminApprove('${s.id}')">Approve</button><button class="btn btn-danger btn-xs" onclick="App.adminReject('${s.id}')">Reject</button>`:''}
              <button class="btn btn-danger btn-xs" onclick="App.adminDeleteShop('${s.id}')">Delete</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>` : ''}

  ${tab==='users' ? `
    <table class="dash-table">
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Since</th><th>Action</th></tr></thead>
      <tbody>
        ${users.filter(u=>u.role!=='admin').map(u=>`
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td><span class="type-badge">${u.role}</span></td>
          <td>${new Date(u.createdAt).toLocaleDateString()}</td>
          <td><button class="btn btn-danger btn-xs" onclick="App.adminDeleteUser('${u.id}')">Remove</button></td>
        </tr>`).join('')}
      </tbody>
    </table>` : ''}

  ${tab==='reports' ? (reports.length ? `
    <table class="dash-table">
      <thead><tr><th>Type</th><th>Detail</th><th>Reporter</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        ${reports.map(r=>`
        <tr>
          <td><strong>${r.type||'Report'}</strong></td>
          <td>${r.detail||'–'}</td>
          <td>${r.reporterName||'Anonymous'}</td>
          <td><span class="status-badge status-${r.status}">${r.status}</span></td>
          <td class="action-cell">
            ${r.status==='pending'?`<button class="btn btn-primary btn-xs" onclick="App.adminResolveReport('${r.id}')">Resolve</button>`:''}
            <button class="btn btn-danger btn-xs" onclick="App.adminDeleteReport('${r.id}')">Delete</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>` : UI.empty('✓','No open reports','Everything is clear.'))
  : ''}
  </div>
</div>`;
};

// ── Action Handlers ───────────────────────────────────────────
App.handleLogin = function(e) {
  e.preventDefault();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const sess = CC.Auth.login(email, password);
  if (!sess) { UI.toast('Invalid email or password','error'); return; }
  UI.toast(`Welcome back, ${sess.name.split(' ')[0]}!`);
  if (sess.role==='admin')    App.nav('admin');
  else if (sess.role==='provider') App.nav('dashboard');
  else App.nav('home');
};

App.handleRegister = function(e, role) {
  e.preventDefault();
  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (password.length<6) { UI.toast('Password must be at least 6 characters','error'); return; }
  const res = CC.Auth.register({ name, email, password, role });
  if (res.error) { UI.toast(res.error,'error'); return; }
  UI.toast('Account created! Welcome.');
  if (role==='provider') App.nav('shop-setup');
  else App.nav('home');
};

App.handleShopSetup = function(e) {
  e.preventDefault();
  const sess = CC.Auth.session();
  if (!sess) return;
  const f = UI.formData(e.target);
  const shop = CC.Shops.create({
    ownerId: sess.userId,
    name: f.name, tagline: f.tagline, description: f.description,
    category: f.category, address: f.address, phone: f.phone,
    hours: f.hours, image: f.image||'🏪',
    lat: 17.385 + (Math.random()-0.5)*0.01,
    lng: 78.486 + (Math.random()-0.5)*0.01,
    tags: [],
  });
  UI.toast('Shop submitted for approval!');
  App.nav('dashboard');
};

App.saveShopEdit = function(e, shopId) {
  e.preventDefault();
  const f = UI.formData(e.target);
  CC.Shops.update(shopId, {
    name:f.name, tagline:f.tagline, description:f.description,
    category:f.category, address:f.address, phone:f.phone,
    hours:f.hours, image:f.image,
  });
  UI.toast('Shop updated!');
  App.nav('dashboard', {tab:'products'});
};

App.openAddProduct = function(shopId) {
  const id = UI.modal({
    title: 'Add Product / Service', wide: true,
    body: `
      <form id="add-prod-form" onsubmit="App.submitAddProduct(event,'${shopId}','${id||'PLACEHOLDER'}')">
        ${UI.field({id:'pname',label:'Name',required:true,placeholder:'e.g. Record Book'})}
        ${UI.field({id:'ptype',label:'Type',options:['product','service'],required:true})}
        ${UI.field({id:'pcategory',label:'Category',options:CC.CATEGORIES.map(c=>c.name),required:true})}
        ${UI.field({id:'pdescription',label:'Description',textarea:true})}
        ${UI.field({id:'pprice',label:'Price (₹)',type:'number',required:true,min:0,step:0.5})}
        ${UI.field({id:'punit',label:'Unit (e.g. per page, each, pack)',placeholder:'each'})}
        ${UI.field({id:'pdiscount',label:'Discount (%)',type:'number',min:0,max:100,step:1})}
        ${UI.field({id:'pavailability',label:'Availability',options:Object.keys(CC.AVAILABILITY_LABELS),required:true})}
        ${UI.field({id:'pimage',label:'Icon (emoji)',placeholder:'📦'})}
        <button class="btn btn-primary" type="submit">Add</button>
      </form>`,
  });
  // Fix the modal id in form submit
  setTimeout(()=>{
    const form = document.getElementById('add-prod-form');
    if (form) form.onsubmit = (e)=>App.submitAddProduct(e, shopId, id);
  },30);
};

App.submitAddProduct = function(e, shopId, modalId) {
  e.preventDefault();
  const f = UI.formData(e.target);
  CC.Products.create({
    shopId,
    name:f.pname, type:f.ptype, category:f.pcategory,
    description:f.pdescription, price:+f.pprice, unit:f.punit,
    discount:+f.pdiscount||0, availability:f.pavailability,
    image:f.pimage||'📦', tags:[],
  });
  UI.closeModal(modalId);
  UI.toast('Product added!');
  App.nav('dashboard',{tab:'products'});
};

App.openEditProduct = function(productId) {
  const p = CC.Products.byId(productId);
  if (!p) return;
  const id = UI.modal({
    title: 'Edit Product', wide: true,
    body: `
      <form id="edit-prod-form">
        ${UI.field({id:'pname',label:'Name',value:p.name,required:true})}
        ${UI.field({id:'pcategory',label:'Category',value:p.category,options:CC.CATEGORIES.map(c=>c.name)})}
        ${UI.field({id:'pdescription',label:'Description',value:p.description||'',textarea:true})}
        ${UI.field({id:'pprice',label:'Price (₹)',type:'number',value:p.price,min:0})}
        ${UI.field({id:'punit',label:'Unit',value:p.unit||''})}
        ${UI.field({id:'pdiscount',label:'Discount (%)',type:'number',value:p.discount||0,min:0,max:100})}
        ${UI.field({id:'pavailability',label:'Availability',value:p.availability,options:Object.keys(CC.AVAILABILITY_LABELS)})}
        ${UI.field({id:'pimage',label:'Icon',value:p.image||''})}
        <button class="btn btn-primary" type="button" id="save-edit-prod-btn">Save Changes</button>
      </form>`,
  });
  setTimeout(()=>{
    const btn=document.getElementById('save-edit-prod-btn');
    if(btn) btn.onclick=()=>{
      const f=UI.formData(document.getElementById('edit-prod-form'));
      CC.Products.update(productId,{
        name:f.pname,category:f.pcategory,description:f.pdescription,
        price:+f.pprice,unit:f.punit,discount:+f.pdiscount||0,
        availability:f.pavailability,image:f.pimage||p.image,
      });
      UI.closeModal(id);
      UI.toast('Product updated!');
      App.nav('dashboard',{tab:'products'});
    };
  },30);
};

App.deleteProduct = function(id) {
  UI.confirm('Delete this product? This cannot be undone.', ()=>{
    CC.Products.delete(id);
    UI.toast('Product deleted');
    App.nav('dashboard',{tab:'products'});
  }, true);
};

App.pickStar = function(n) {
  document.getElementById('review-rating').value = n;
  document.querySelectorAll('.star-pick').forEach((s,i)=>{
    s.textContent = i<n ? '★' : '☆';
    s.classList.toggle('star-picked', i<n);
  });
};

App.submitReview = function(e, shopId) {
  e.preventDefault();
  const sess   = CC.Auth.session();
  const rating = +document.getElementById('review-rating').value;
  const text   = document.getElementById('review-text').value.trim();
  if (!rating) { UI.toast('Please pick a star rating','error'); return; }
  CC.Reviews.add({ shopId, userId:sess.userId, userName:sess.name, rating, text });
  UI.toast('Review submitted!');
  App.nav('shop',{shopId,tab:'reviews'});
};

App.deleteReview = function(id, shopId) {
  UI.confirm('Delete your review?', ()=>{
    CC.Reviews.delete(id);
    UI.toast('Review deleted');
    App.nav('shop',{shopId,tab:'reviews'});
  }, true);
};

App.adminApprove = function(id) {
  CC.Shops.approve(id);
  UI.toast('Shop approved!');
  App.nav('admin',{tab:'overview'});
};
App.adminReject = function(id) {
  CC.Shops.reject(id);
  UI.toast('Shop rejected');
  App.nav('admin',{tab:'overview'});
};
App.adminDeleteShop = function(id) {
  UI.confirm('Permanently delete this shop and all its products?', ()=>{
    CC.Shops.delete(id);
    UI.toast('Shop deleted');
    App.nav('admin',{tab:'overview'});
  }, true);
};
App.adminDeleteUser = function(id) {
  UI.confirm('Remove this user?', ()=>{
    const users = JSON.parse(localStorage.getItem('cc_users')||'[]').filter(u=>u.id!==id);
    localStorage.setItem('cc_users', JSON.stringify(users));
    UI.toast('User removed');
    App.nav('admin',{tab:'users'});
  }, true);
};
App.adminResolveReport = function(id) {
  CC.Reports.resolve(id);
  UI.toast('Report resolved');
  App.nav('admin',{tab:'reports'});
};
App.adminDeleteReport = function(id) {
  CC.Reports.delete(id);
  UI.toast('Report deleted');
  App.nav('admin',{tab:'reports'});
};

// Start
window.addEventListener('DOMContentLoaded', App.init);
