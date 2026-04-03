/**
 * Farmer Marketplace - Shared Utilities
 * Used across pages for common functionality
 */

// Storage keys - shared across modules
const STORAGE_KEYS = {
  crops: 'farmerMarketplace_crops',
  farmers: 'farmerMarketplace_farmers',
  buyers: 'farmerMarketplace_buyers',
  transactions: 'farmerMarketplace_transactions',
  currentFarmer: 'farmerMarketplace_currentFarmer'
};

// Form validation helper
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile) {
  return /^\d{10,15}$/.test(mobile.replace(/\s/g, ''));
}

// Logout - clear session and redirect to login
function logout() {
  localStorage.removeItem('farmerMarketplace_currentUser');
  localStorage.removeItem('farmerMarketplace_currentFarmer');
  window.location.href = 'login.html';
}

