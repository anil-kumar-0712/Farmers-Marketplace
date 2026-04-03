/**
 * Admin Dashboard - Stats, Revenue, Search Users, Transactions
 */

const STORAGE_FARMERS = 'farmerMarketplace_farmers';
const STORAGE_TRANSACTIONS = 'farmerMarketplace_transactions';
const STORAGE_BUYERS = 'farmerMarketplace_buyers';

function getFarmers() {
  return JSON.parse(localStorage.getItem(STORAGE_FARMERS) || '[]');
}

function getBuyers() {
  return JSON.parse(localStorage.getItem(STORAGE_BUYERS) || '[]');
}

function getTransactions() {
  return JSON.parse(localStorage.getItem(STORAGE_TRANSACTIONS) || '[]');
}

function saveFarmers(farmers) {
  localStorage.setItem(STORAGE_FARMERS, JSON.stringify(farmers));
}

function ensureSampleUsers() {
  let farmers = getFarmers();
  let buyers = getBuyers();

  if (farmers.length === 0) {
    farmers = [
      { id: 'f1', name: 'Raj Kumar', email: 'raj@farmer.com', role: 'farmer', status: 'active' },
      { id: 'f2', name: 'Suresh Patel', email: 'suresh@farmer.com', role: 'farmer', status: 'active' }
    ];
    saveFarmers(farmers);
  }

  if (buyers.length === 0) {
    buyers = [
      { id: 'b1', name: 'ABC Traders', email: 'abc@buyer.com', password: 'abc123', role: 'buyer', status: 'active' },
      { id: 'b2', name: 'Fresh Foods Ltd', email: 'fresh@buyer.com', password: 'fresh123', role: 'buyer', status: 'active' }
    ];
    localStorage.setItem(STORAGE_BUYERS, JSON.stringify(buyers));
  }

  return { farmers, buyers };
}

function renderStats() {
  const { farmers, buyers } = ensureSampleUsers();
  const transactions = getTransactions();

  document.getElementById('total-farmers').textContent = farmers.length;
  document.getElementById('total-buyers').textContent = buyers.length;
  document.getElementById('total-transactions').textContent = transactions.length;

  const revenue = transactions.reduce((sum, t) => sum + parseFloat(t.total || 0), 0);
  document.getElementById('total-revenue').textContent = `₹${revenue.toFixed(2)}`;
}

function renderUsersTable() {
  const { farmers, buyers } = ensureSampleUsers();
  const searchTerm = (document.getElementById('search-user')?.value || '').toLowerCase().trim();

  let users = [
    ...farmers.map(f => ({ ...f, displayRole: 'Farmer' })),
    ...buyers.map(b => ({ ...b, displayRole: 'Buyer' }))
  ];

  if (searchTerm) {
    users = users.filter(u =>
      (u.name || '').toLowerCase().includes(searchTerm) ||
      (u.email || '').toLowerCase().includes(searchTerm)
    );
  }

  const tbody = document.getElementById('users-table-body');
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No users found.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map((u, i) => `
    <tr data-id="${u.id}" data-role="${u.role}">
      <td>${i + 1}</td>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${u.displayRole || u.role}</td>
      <td><span class="status-badge">${u.status || 'active'}</span></td>
      <td>
        <button class="btn-block" onclick="blockUser('${u.id}', '${u.role}')">Block</button>
        <button class="btn-small btn-delete" onclick="deleteUser('${u.id}', '${u.role}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderTransactionsTable() {
  const transactions = getTransactions().slice(-20).reverse();
  const tbody = document.getElementById('transactions-table-body');

  if (transactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No transactions yet.</td></tr>';
    return;
  }

  tbody.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.date || 'N/A'}</td>
      <td>${escapeHtml(t.cropName || '-')}</td>
      <td>${escapeHtml(t.farmerName || '-')}</td>
      <td>${t.quantity || 0} kg</td>
      <td>₹${parseFloat(t.total || 0).toFixed(2)}</td>
    </tr>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function blockUser(id, role) {
  if (!confirm('Block this user?')) return;
  if (role === 'farmer') {
    const farmers = getFarmers().map(f => f.id === id ? { ...f, status: 'blocked' } : f);
    saveFarmers(farmers);
  } else {
    const buyers = getBuyers().map(b => b.id === id ? { ...b, status: 'blocked' } : b);
    localStorage.setItem(STORAGE_BUYERS, JSON.stringify(buyers));
  }
  renderUsersTable();
  alert('User blocked.');
}

function deleteUser(id, role) {
  if (!confirm('Permanently delete this user?')) return;
  if (role === 'farmer') {
    const farmers = getFarmers().filter(f => f.id !== id);
    saveFarmers(farmers);
  } else {
    const buyers = getBuyers().filter(b => b.id !== id);
    localStorage.setItem(STORAGE_BUYERS, JSON.stringify(buyers));
  }
  renderUsersTable();
  renderStats();
  alert('User deleted.');
}

window.blockUser = blockUser;
window.deleteUser = deleteUser;

// Search user
document.getElementById('search-user')?.addEventListener('input', renderUsersTable);
document.getElementById('search-user')?.addEventListener('keyup', renderUsersTable);

// Status badge
const style = document.createElement('style');
style.textContent = '.status-badge { background: var(--light-green); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }';
document.head.appendChild(style);

// Init
renderStats();
renderUsersTable();
renderTransactionsTable();
