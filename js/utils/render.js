// =============================================
// DOM Rendering Utilities
// =============================================

function clearContainer(selector) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = '';
  return el;
}

function showLoading(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.innerHTML = `
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    `;
  }
}

function hideLoading(selector) {
  const el = document.querySelector(selector);
  if (el) {
    const loader = el.querySelector('.animate-spin');
    if (loader) loader.parentElement.remove();
  }
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const toast = document.createElement('div');
  toast.className = `toast-notification fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function createSkeletonCards(container, count = 3) {
  const el = document.querySelector(container);
  if (!el) return;
  el.innerHTML = Array(count).fill(`
    <div class="bg-white rounded-xl shadow p-4 animate-pulse">
      <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
      <div class="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
      <div class="bg-gray-200 h-4 rounded w-1/2"></div>
    </div>
  `).join('');
}
