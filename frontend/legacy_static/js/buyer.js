const API_URL = 'http://localhost:5000/api';
const STORAGE_CART = 'farmerMarketplace_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_CART) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
  updateCartBadge();
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = count;
}

// Render crops with filters
async function renderCrops() {
  const container = document.getElementById('buyer-crops-container');
  const searchTerm = document.getElementById('search-crop').value.toLowerCase().trim();
  const priceFilter = document.getElementById('filter-price').value;
  const cropFilter = document.getElementById('filter-crop-type').value;

  try {
    const response = await fetch(`${API_URL}/crops`);
    const data = await response.json();
    let crops = data.data.filter(c => (c.quantity || 0) > 0);

    if (searchTerm) {
      crops = crops.filter(c => c.cropName.toLowerCase().includes(searchTerm));
    }
    if (cropFilter !== 'all') {
      crops = crops.filter(c => c.cropName === cropFilter);
    }
    if (priceFilter === 'low') {
      crops = [...crops].sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (priceFilter === 'high') {
      crops = [...crops].sort((a, b) => b.pricePerKg - a.pricePerKg);
    }

    const cropEmoji = { Wheat: '🌾', Rice: '🍚', Corn: '🌽', Tomato: '🍅', Potato: '🥔', Onion: '🧅' };

    if (crops.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No crops found.</p>';
      return;
    }

    container.innerHTML = crops.map(crop => {
      const emoji = cropEmoji[crop.cropName] || '🌱';
      return `
      <div class="crop-card">
        <div class="crop-card-image">${emoji}</div>
        <h3>${escapeHtml(crop.cropName)}</h3>
        <p><strong>Farmer:</strong> ${escapeHtml(crop.farmer ? crop.farmer.name : 'Unknown')}</p>
        <p><strong>Price:</strong> ₹${crop.pricePerKg.toFixed(2)}/kg</p>
        <p><strong>Available:</strong> ${crop.quantity} kg</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem;">
          <button class="btn btn-order" onclick="addToCart('${crop._id}', '${escapeHtml(crop.cropName)}', ${crop.pricePerKg}, ${crop.quantity})">Add to Cart</button>
        </div>
      </div>
    `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<p>Error loading crops.</p>';
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addToCart(cropId, cropName, pricePerKg, maxQty) {
  const cart = getCart();
  const existing = cart.find(item => item.cropId === cropId);
  if (existing) {
    existing.quantity = Math.min((existing.quantity || 1) + 1, maxQty);
  } else {
    cart.push({ cropId, cropName, pricePerKg, quantity: 1, maxQty });
  }
  saveCart(cart);
  showToast('Added to cart!');
}

async function renderOrderHistory() {
  const container = document.getElementById('order-history-container');
  // Order history integration would use a 'Transactions' model on backend.
  // For now, let's keep it simple or implement it if requested.
  container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Connect backend for live order history.</p>';
}

// Event listeners
document.getElementById('search-crop')?.addEventListener('input', renderCrops);
document.getElementById('filter-price')?.addEventListener('change', renderCrops);
document.getElementById('filter-crop-type')?.addEventListener('change', renderCrops);

updateCartBadge();
renderCrops();
renderOrderHistory();

