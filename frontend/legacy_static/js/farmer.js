const API_URL = 'http://localhost:5000/api';
const STORAGE_CURRENT_FARMER = 'farmerMarketplace_currentFarmer';

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Check if farmer is logged in
function initFarmerPage() {
  const currentFarmer = JSON.parse(localStorage.getItem(STORAGE_CURRENT_FARMER) || 'null');
  const registerTab = document.getElementById('tab-register');
  const registerContent = document.getElementById('register');
  const listCropsTab = document.querySelector('[data-tab="crop-listing"]');
  const listCropsContent = document.getElementById('crop-listing');
  const welcomeText = document.getElementById('farmer-welcome');
  const profileCard = document.getElementById('profile-card');

  if (currentFarmer) {
    if (registerTab) registerTab.style.display = 'none';
    if (registerContent) registerContent.classList.remove('active');
    if (listCropsTab) listCropsTab.classList.add('active');
    if (listCropsContent) listCropsContent.classList.add('active');
    if (welcomeText) welcomeText.textContent = `Welcome, ${currentFarmer.name}! List your crops and connect with buyers.`;
    if (profileCard) {
      profileCard.style.display = 'block';
      document.getElementById('profile-name').textContent = currentFarmer.name;
      document.getElementById('profile-email').textContent = currentFarmer.email;
      document.getElementById('profile-mobile').textContent = currentFarmer.mobile || 'N/A';
    }
    renderMyCrops();
  } else {
    // Show registration tab if not logged in
    if (registerTab) registerTab.style.display = 'block';
    if (registerContent) registerContent.classList.add('active');
  }
}

initFarmerPage();

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// Modal
const addCropModal = document.getElementById('add-crop-modal');
const addCropBtn = document.getElementById('add-crop-btn');
const modalClose = document.getElementById('modal-close');

if (addCropBtn) addCropBtn.addEventListener('click', () => {
  const form = document.getElementById('modal-crop-form');
  if (form) {
    form.dataset.mode = 'add';
    form.reset();
  }
  if (addCropModal) addCropModal.classList.add('active');
});
if (modalClose) modalClose.addEventListener('click', () => {
  if (addCropModal) addCropModal.classList.remove('active');
});

// Helper for saving crops
async function saveCropAPI(cropData, mode, id) {
  try {
    const token = localStorage.getItem('token');
    const url = mode === 'edit' ? `${API_URL}/crops/${id}` : `${API_URL}/crops`;
    const method = mode === 'edit' ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cropData)
    });

    const data = await response.json();
    if (data.success) {
      if (addCropModal) addCropModal.classList.remove('active');
      renderMyCrops();
      showToast(mode === 'edit' ? 'Crop updated!' : 'Crop added!');
      return true;
    } else {
      alert(data.error || 'Failed to save crop.');
      return false;
    }
  } catch (err) {
    console.error(err);
    alert('Network error. Check server.');
    return false;
  }
}

// Modal form submit
document.getElementById('modal-crop-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cropName = document.getElementById('modal-crop-name').value;
  const quantity = parseInt(document.getElementById('modal-crop-quantity').value);
  const pricePerKg = parseFloat(document.getElementById('modal-crop-price').value);
  const mode = e.target.dataset.mode;
  const id = e.target.dataset.id;

  if (await saveCropAPI({ cropName, quantity, pricePerKg }, mode, id)) {
    e.target.reset();
  }
});

// Inline form submit (prevent reload and use API)
document.getElementById('crop-listing-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cropName = document.getElementById('crop-name').value;
  const quantity = parseInt(document.getElementById('crop-quantity').value);
  const pricePerKg = parseFloat(document.getElementById('crop-price').value);

  if (await saveCropAPI({ cropName, quantity, pricePerKg }, 'add')) {
    e.target.reset();
  }
});

// Farmer Registration Form
document.getElementById('farmer-registration-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('farmer-name').value;
  const email = document.getElementById('farmer-email').value;
  const mobile = document.getElementById('farmer-mobile').value;
  const password = document.getElementById('farmer-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, password, role: 'farmer' })
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem(STORAGE_CURRENT_FARMER, JSON.stringify(data.user));
      showToast('Registration successful!');
      e.target.reset();
      initFarmerPage();
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert('Registration failed.');
  }
});

// Render My Listed Crops
async function renderMyCrops() {
  const container = document.getElementById('my-crops-container');
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/crops`);
    const result = await response.json();

    const currentFarmer = JSON.parse(localStorage.getItem(STORAGE_CURRENT_FARMER) || 'null');
    if (!currentFarmer) return;

    // Correctly filter by farmer ID
    const myCrops = result.data.filter(c => c.farmer && (c.farmer._id === currentFarmer.id || c.farmer === currentFarmer.id));

    if (myCrops.length === 0) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No crops listed yet. Add your first crop above!</p>';
      return;
    }

    const cropEmoji = { Wheat: '🌾', Rice: '🍚', Corn: '🌽', Tomato: '🍅', Potato: '🥔', Onion: '🧅', Mango: '🥭', Banana: '🍌', Cotton: '☁️', Sugarcane: '🎋' };

    container.innerHTML = myCrops.map(crop => {
      const status = (crop.quantity || 0) > 0 ? 'available' : 'sold';
      const statusClass = status === 'available' ? 'status-available' : 'status-sold';
      const statusText = status === 'available' ? 'Available' : 'Sold';
      const emoji = cropEmoji[crop.cropName] || '🌱';
      return `
      <div class="crop-card">
        <div class="crop-card-image">${emoji}</div>
        <h3>${escapeHtml(crop.cropName)}</h3>
        <p><strong>Quantity:</strong> ${crop.quantity} kg</p>
        <p><strong>Price:</strong> ₹${crop.pricePerKg.toFixed(2)}/kg</p>
        <span class="status-badge ${statusClass}">${statusText}</span>
        <div class="card-actions">
          <button class="btn-small btn-edit" onclick="editCrop('${crop._id}', '${crop.cropName}', ${crop.quantity}, ${crop.pricePerKg})">Edit</button>
          <button class="btn-small btn-delete" onclick="deleteCrop('${crop._id}')">Delete</button>
        </div>
      </div>
    `}).join('');
  } catch (err) {
    container.innerHTML = '<p>Error loading crops.</p>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function deleteCrop(id) {
  if (!confirm('Are you sure you want to delete this crop?')) return;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/crops/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
      renderMyCrops();
      showToast('Crop deleted.');
    }
  } catch (err) {
    alert('Delete failed.');
  }
}

function editCrop(id, name, qty, price) {
  const modalName = document.getElementById('modal-crop-name');
  const modalQty = document.getElementById('modal-crop-quantity');
  const modalPrice = document.getElementById('modal-crop-price');

  if (modalName) modalName.value = name;
  if (modalQty) modalQty.value = qty;
  if (modalPrice) modalPrice.value = price;

  const form = document.getElementById('modal-crop-form');
  if (form) {
    form.dataset.mode = 'edit';
    form.dataset.id = id;
  }

  if (addCropModal) addCropModal.classList.add('active');
}

window.editCrop = editCrop;
window.deleteCrop = deleteCrop;
