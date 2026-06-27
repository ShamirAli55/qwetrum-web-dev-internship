// ── Cart helpers ──────────────────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? "inline-block" : "none";
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart`);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (qty < 1) { removeFromCart(id); renderCart(); return; }
  item.qty = qty;
  saveCart(cart);
  renderCart();
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ── Stars helper ──────────────────────────────────────────────
function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

// ── Shop / Products page ──────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = `<p class="no-results">No products found.</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <a href="product-detail.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}">
      </a>
      <div class="card-body">
        <span class="badge">${p.category}</span>
        <h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
        <div class="rating">${stars(p.rating)} <span>${p.rating}</span></div>
        <div class="card-footer">
          <strong>$${p.price.toFixed(2)}</strong>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

function initShop() {
  if (!document.getElementById("product-grid")) return;

  // Populate category filter
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filterEl = document.getElementById("category-filter");
  if (filterEl) {
    filterEl.innerHTML = categories.map(c =>
      `<option value="${c}">${c}</option>`
    ).join("");
  }

  function getFiltered() {
    const search = (document.getElementById("search-input")?.value || "").toLowerCase();
    const category = document.getElementById("category-filter")?.value || "All";
    const sort = document.getElementById("sort-select")?.value || "default";

    let list = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function update() { renderProducts(getFiltered()); }

  document.getElementById("search-input")?.addEventListener("input", update);
  document.getElementById("category-filter")?.addEventListener("change", update);
  document.getElementById("sort-select")?.addEventListener("change", update);

  // Handle URL search param from homepage
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get("q");
  if (q) {
    const si = document.getElementById("search-input");
    if (si) si.value = q;
  }

  update();
}

// ── Product Detail page ───────────────────────────────────────
function initDetail() {
  const container = document.getElementById("detail-container");
  if (!container) return;
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));
  const p = products.find(p => p.id === id);
  if (!p) { container.innerHTML = "<p>Product not found.</p>"; return; }

  container.innerHTML = `
    <div class="detail-img">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="detail-info">
      <span class="badge">${p.category}</span>
      <h1>${p.name}</h1>
      <div class="rating">${stars(p.rating)} <span>${p.rating} / 5</span></div>
      <p class="detail-desc">${p.description}</p>
      <div class="detail-price">$${p.price.toFixed(2)}</div>
      <div class="qty-row">
        <label>Qty:</label>
        <input type="number" id="qty-input" value="1" min="1" max="99">
      </div>
      <button class="btn-primary" onclick="addDetailToCart(${p.id})">Add to Cart</button>
      <a href="shop.html" class="btn-secondary">← Back to Shop</a>
    </div>
  `;

  // Related
  const related = products.filter(r => r.category === p.category && r.id !== p.id).slice(0, 3);
  const relGrid = document.getElementById("related-grid");
  if (relGrid) renderProductsMini(related, relGrid);
}

function addDetailToCart(id) {
  const qty = parseInt(document.getElementById("qty-input")?.value || 1);
  const product = products.find(p => p.id === id);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart`);
}

function renderProductsMini(list, container) {
  container.innerHTML = list.map(p => `
    <div class="product-card">
      <a href="product-detail.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
      <div class="card-body">
        <h3><a href="product-detail.html?id=${p.id}">${p.name}</a></h3>
        <div class="card-footer">
          <strong>$${p.price.toFixed(2)}</strong>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ── Cart page ─────────────────────────────────────────────────
function renderCart() {
  const container = document.getElementById("cart-container");
  const summaryEl = document.getElementById("cart-summary");
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><p>Your cart is empty.</p><a href="shop.html" class="btn-primary">Shop Now</a></div>`;
    if (summaryEl) summaryEl.innerHTML = "";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <span class="badge">${item.category}</span>
        <div class="cart-price">$${item.price.toFixed(2)} each</div>
      </div>
      <div class="cart-controls">
        <button onclick="updateQty(${item.id}, ${item.qty - 1})">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
      </div>
      <div class="cart-subtotal">$${(item.price * item.qty).toFixed(2)}</div>
      <button class="remove-btn" onclick="removeFromCart(${item.id}); renderCart();">✕</button>
    </div>
  `).join("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (summaryEl) {
    summaryEl.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</span></div>
      ${shipping > 0 ? `<p class="free-ship-note">Add $${(50 - subtotal).toFixed(2)} more for free shipping</p>` : ""}
      <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      <a href="checkout.html" class="btn-primary">Proceed to Checkout</a>
    `;
  }
}

// ── Checkout page ─────────────────────────────────────────────
function initCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  // Show order summary
  const cart = getCart();
  const summaryEl = document.getElementById("checkout-summary");
  if (summaryEl && cart.length > 0) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    summaryEl.innerHTML = `
      ${cart.map(i => `<div class="co-item"><span>${i.name} × ${i.qty}</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`).join("")}
      <hr>
      <div class="co-item"><span>Shipping</span><span>${shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</span></div>
      <div class="co-item total"><span>Total</span><span>$${(subtotal + shipping).toFixed(2)}</span></div>
    `;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    // Clear errors
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");

    const fields = {
      "full-name": "Full name is required",
      "email": "Valid email is required",
      "address": "Address is required",
      "city": "City is required",
      "zip": "ZIP code is required",
      "card-number": "Card number must be 16 digits",
      "expiry": "Expiry is required (MM/YY)",
      "cvv": "CVV must be 3-4 digits"
    };

    for (const [id, msg] of Object.entries(fields)) {
      const el = document.getElementById(id);
      const err = document.getElementById(id + "-error");
      if (!el || !err) continue;
      const val = el.value.trim();

      let ok = val.length > 0;
      if (id === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (id === "card-number") ok = /^\d{16}$/.test(val.replace(/\s/g, ""));
      if (id === "cvv") ok = /^\d{3,4}$/.test(val);
      if (id === "expiry") ok = /^\d{2}\/\d{2}$/.test(val);
      if (id === "zip") ok = /^\d{4,10}$/.test(val);

      if (!ok) { err.textContent = msg; valid = false; }
    }

    if (valid) {
      localStorage.removeItem("cart");
      updateCartBadge();
      document.getElementById("checkout-form-wrap").style.display = "none";
      document.getElementById("order-success").style.display = "block";
    }
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initShop();
  initDetail();
  renderCart();
  initCheckout();
});