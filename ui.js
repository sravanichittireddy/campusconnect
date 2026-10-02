// ============================================================
// CampusConnect — UI Utilities & Router
// ============================================================

const UI = (() => {

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type='success') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${type==='success'?'✓':type==='error'?'✕':'ℹ'}</span> ${msg}`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(()=>t.classList.add('show'),10);
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); },3000);
}

// ── Modal ─────────────────────────────────────────────────────
function modal({ title, body, footer='', wide=false }) {
  const id = 'modal-'+Date.now();
  const el = document.createElement('div');
  el.className = 'modal-overlay';
  el.id = id;
  el.innerHTML = `
    <div class="modal-box${wide?' modal-wide':''}">
      <div class="modal-head">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" onclick="UI.closeModal('${id}')">✕</button>
      </div>
      <div class="modal-body">${body}</div>
      ${footer?`<div class="modal-foot">${footer}</div>`:''}
    </div>`;
  document.body.appendChild(el);
  setTimeout(()=>el.classList.add('open'),10);
  return id;
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  setTimeout(()=>el.remove(),300);
}

// ── Confirm ───────────────────────────────────────────────────
function confirm(msg, onYes, danger=false) {
  const id = modal({
    title: 'Are you sure?',
    body: `<p>${msg}</p>`,
    footer: `
      <button class="btn btn-ghost" onclick="UI.closeModal('${id}')">Cancel</button>
      <button class="${danger?'btn btn-danger':'btn btn-primary'}" id="confirm-yes-${id}">Confirm</button>`,
  });
  setTimeout(()=>{
    const btn = document.getElementById(`confirm-yes-${id}`);
    if (btn) btn.onclick = ()=>{ closeModal(id); onYes(); };
  },20);
}

// ── Rating Stars ─────────────────────────────────────────────
function stars(rating, max=5) {
  let s='';
  for (let i=1;i<=max;i++) {
    if (i<=Math.floor(rating)) s+='★';
    else if (i-0.5<=rating)    s+='½';
    else                        s+='☆';
  }
  return `<span class="stars" title="${rating}/${max}">${s}</span>`;
}

// ── Price Display ─────────────────────────────────────────────
function price(product) {
  const fp = CC.Products.finalPrice(product);
  if (product.discount) {
    return `<span class="price-final">₹${fp}</span> <span class="price-orig">₹${product.price}</span> <span class="badge-discount">${product.discount}% off</span>`;
  }
  return `<span class="price-final">₹${fp}</span>`;
}

// ── Availability Badge ────────────────────────────────────────
function avail(status) {
  const info = CC.AVAILABILITY_LABELS[status] || CC.AVAILABILITY_LABELS.available;
  return `<span class="avail-badge" style="color:${info.color};background:${info.bg}">${info.label}</span>`;
}

// ── Shop Card ─────────────────────────────────────────────────
function shopCard(shop, opts={}) {
  const dist   = CC.Shops.distance(shop);
  const sess   = CC.Auth.session();
  const isFav  = sess ? CC.Favs.hasShop(sess.userId, shop.id) : false;
  const prods  = CC.Products.byShop(shop.id).length;
  return `
<div class="shop-card" onclick="App.openShop('${shop.id}')">
  <div class="shop-card-banner">
    <span class="shop-emoji">${shop.image||'🏪'}</span>
    ${sess ? `<button class="fav-btn ${isFav?'fav-active':''}" onclick="event.stopPropagation();App.toggleShopFav('${shop.id}',this)" title="Save">♥</button>` : ''}
  </div>
  <div class="shop-card-body">
    <div class="shop-card-cat">${shop.category}</div>
    <h3 class="shop-card-name">${shop.name}</h3>
    <p class="shop-card-tagline">${shop.tagline||''}</p>
    <div class="shop-card-meta">
      <span>${stars(shop.rating||0)} <span class="shop-rating-num">${shop.rating||'–'}</span></span>
      <span class="dot">·</span>
      <span>${dist} km</span>
      <span class="dot">·</span>
      <span>${prods} items</span>
    </div>
    <div class="shop-card-address">📍 ${shop.address}</div>
  </div>
</div>`;
}

// ── Product Card ──────────────────────────────────────────────
function productCard(product, showShop=true) {
  const shop = CC.Shops.byId(product.shopId);
  const sess = CC.Auth.session();
  const isFav= sess ? CC.Favs.hasProd(sess.userId, product.id) : false;
  return `
<div class="product-card" onclick="App.openProduct('${product.id}')">
  <div class="product-card-top">
    <span class="product-emoji">${product.image||'📦'}</span>
    ${sess?`<button class="fav-btn ${isFav?'fav-active':''}" onclick="event.stopPropagation();App.toggleProdFav('${product.id}',this)">♥</button>`:''}
  </div>
  <div class="product-card-body">
    <span class="product-cat-badge">${product.category}</span>
    <h4 class="product-name">${product.name}</h4>
    <p class="product-desc">${(product.description||'').slice(0,70)}${product.description&&product.description.length>70?'…':''}</p>
    <div class="product-price-row">${price(product)} ${product.unit?`<span class="unit">/ ${product.unit}</span>`:''}</div>
    ${avail(product.availability)}
    ${showShop&&shop?`<div class="product-shop-name">📍 ${shop.name}</div>`:''}
  </div>
</div>`;
}

// ── Empty State ───────────────────────────────────────────────
function empty(icon, title, msg='') {
  return `<div class="empty-state"><div class="empty-icon">${icon}</div><h3>${title}</h3>${msg?`<p>${msg}</p>`:''}</div>`;
}

// ── Loading ───────────────────────────────────────────────────
function loading() {
  return `<div class="loading-state"><div class="spinner"></div><p>Loading…</p></div>`;
}

// ── Section Header ────────────────────────────────────────────
function sectionHeader(title, action='', href='') {
  return `<div class="section-header">
    <h2 class="section-title">${title}</h2>
    ${action?`<a href="#" class="section-link" onclick="${href}">${action}</a>`:''}
  </div>`;
}

// ── Input / Form Helpers ──────────────────────────────────────
function field({ id, label, type='text', value='', placeholder='', required=false, options=null, textarea=false, min, max, step }) {
  const req = required ? 'required' : '';
  const val = value !== undefined ? `value="${String(value).replace(/"/g,'&quot;')}"` : '';
  if (textarea) {
    return `<div class="field"><label for="${id}">${label}${required?'*':''}</label>
      <textarea id="${id}" name="${id}" placeholder="${placeholder}" ${req}>${value}</textarea></div>`;
  }
  if (options) {
    const opts = options.map(o=>
      typeof o==='string'
        ? `<option value="${o}" ${value===o?'selected':''}>${o}</option>`
        : `<option value="${o.value}" ${value===o.value?'selected':''}>${o.label}</option>`
    ).join('');
    return `<div class="field"><label for="${id}">${label}${required?'*':''}</label>
      <select id="${id}" name="${id}" ${req}><option value="">Select…</option>${opts}</select></div>`;
  }
  const extras = [min!==undefined?`min="${min}"`:'', max!==undefined?`max="${max}"`:'', step?`step="${step}"`:''].filter(Boolean).join(' ');
  return `<div class="field"><label for="${id}">${label}${required?'*':''}</label>
    <input type="${type}" id="${id}" name="${id}" placeholder="${placeholder}" ${val} ${req} ${extras}></div>`;
}

function formData(form) {
  const fd = new FormData(form);
  const out = {};
  for (const [k,v] of fd.entries()) out[k] = v;
  return out;
}

return {
  toast, modal, closeModal, confirm,
  stars, price, avail, shopCard, productCard,
  empty, loading, sectionHeader, field, formData,
};
})();
