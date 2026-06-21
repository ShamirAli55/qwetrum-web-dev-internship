import products from './products.js';

let cart = JSON.parse(localStorage.getItem('lumina_cart')) || [];
let currentProducts = [...products];

const productGrid = document.getElementById('product-grid');
const categoryFilter = document.getElementById('category-filter');
const sortPrice = document.getElementById('sort-price');
const searchInput = document.getElementById('product-search');
const cartToggle = document.getElementById('cart-toggle');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const modalOverlay = document.getElementById('modal-overlay');

function init() {
    renderProducts(products);
    updateCartUI();
    setupEventListeners();
}

function renderProducts(items) {
    productGrid.innerHTML = '';
    
    if (items.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No products found.</p>';
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="star"><i class="fa-solid fa-star"></i></span>
                    <span>${product.rating}</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <button class="btn-add" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-add')) {
                openProductDetail(product);
            }
        });

        productGrid.appendChild(card);
    });

    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        });
    });
}

function openProductDetail(product) {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="modal-close" id="close-modal">&times;</div>
        <div class="modal-img-container">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
            <span class="product-category">${product.category}</span>
            <h1 class="modal-title">${product.name}</h1>
            <div class="product-rating" style="margin-bottom: 0.5rem">
                <i class="fa-solid fa-star star"></i>
                <i class="fa-solid fa-star star"></i>
                <i class="fa-solid fa-star star"></i>
                <i class="fa-solid fa-star star"></i>
                <i class="fa-solid fa-star-half-stroke star"></i>
                <span>(${product.rating})</span>
            </div>
            <p class="modal-price">$${product.price}</p>
            <p class="modal-desc">${product.description}</p>
            
            <div class="modal-actions">
                <div class="qty-selector">
                    <button class="qty-btn" id="modal-qty-minus"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" value="1" min="1" id="modal-qty-input" class="qty-input">
                    <button class="qty-btn" id="modal-qty-plus"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="checkout-btn" id="modal-add-btn">Add to Cart</button>
            </div>
        </div>
    `;

    modalOverlay.style.display = 'flex';

    const qtyInput = document.getElementById('modal-qty-input');
    document.getElementById('modal-qty-minus').onclick = () => { if(qtyInput.value > 1) qtyInput.value--; };
    document.getElementById('modal-qty-plus').onclick = () => { qtyInput.value++; };

    document.getElementById('close-modal').onclick = () => { modalOverlay.style.display = 'none'; };
    
    modalOverlay.onclick = (e) => {
        if(e.target === modalOverlay) modalOverlay.style.display = 'none';
    };

    document.getElementById('modal-add-btn').onclick = () => {
        const qty = parseInt(qtyInput.value);
        addToCart(product.id, qty);
        modalOverlay.style.display = 'none';
    };
}

function addToCart(productId, quantity = 1) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity });
    }
    saveCart();
    updateCartUI();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price}</p>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                    <span class="remove-btn" onclick="remove(${item.id})">Remove</span>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = count;
}

window.updateQty = (id, delta) => updateQuantity(id, delta);
window.remove = (id) => removeFromCart(id);

function filterAndSort() {
    const category = categoryFilter.value;
    const sort = sortPrice.value;
    const query = searchInput.value.toLowerCase();

    let filtered = products.filter(p => {
        const matchesCategory = category === 'all' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    if (sort === 'low-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
}

function setupEventListeners() {
    categoryFilter.addEventListener('change', filterAndSort);
    sortPrice.addEventListener('change', filterAndSort);
    searchInput.addEventListener('input', filterAndSort);

    cartToggle.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartDrawer);
    cartOverlay.addEventListener('click', (e) => {
        if(e.target === cartOverlay) closeCartDrawer();
    });
}

function openCart() {
    cartOverlay.classList.add('open');
}

function closeCartDrawer() {
    cartOverlay.classList.remove('open');
}

init();
