// =============================================
// Messages View - Admin
// =============================================

let messagesList = [];
let currentMessageId = null;

async function loadMessages() {
  const loadingEl = document.getElementById('messages-loading');
  const listEl = document.getElementById('messages-list');
  const emptyEl = document.getElementById('messages-empty');

  try {
    messagesList = await getMessages();

    loadingEl.classList.add('hidden');

    if (messagesList.length === 0) {
      emptyEl.classList.remove('hidden');
      lucide.createIcons();
      return;
    }

    listEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');

    renderMessages();

  } catch (err) {
    console.error('Error loading messages:', err);
    loadingEl.innerHTML = `
      <div class="bg-red-50 text-red-600 p-4 rounded-lg">
        Erro ao carregar mensagens. Tente recarregar a pagina.
      </div>
    `;
  }
}

function renderMessages() {
  const listEl = document.getElementById('messages-list');

  listEl.innerHTML = messagesList.map(msg => `
    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!msg.is_read ? 'border-l-4 border-primary' : ''}"
         onclick="openMessage('${msg.id}')">
      <div class="p-5 flex items-start gap-4">
        <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${!msg.is_read ? 'bg-primary/10' : 'bg-gray-100'}">
          <i data-lucide="${!msg.is_read ? 'mail' : 'mail-open'}" class="w-5 h-5 ${!msg.is_read ? 'text-primary' : 'text-gray-400'}"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="font-medium text-gray-800 ${!msg.is_read ? 'font-semibold' : ''}">${sanitizeHTML(msg.sender_name)}</p>
              <p class="text-sm text-gray-500 truncate">${sanitizeHTML(msg.sender_email)}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              ${!msg.is_read ? '<span class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>' : ''}
              <span class="text-xs text-gray-400 whitespace-nowrap">${timeAgo(msg.created_at)}</span>
            </div>
          </div>
          ${msg.subject ? `<p class="text-sm font-medium text-gray-700 mt-1">${sanitizeHTML(msg.subject)}</p>` : ''}
          <p class="text-sm text-gray-400 mt-1 truncate">${sanitizeHTML(msg.message)}</p>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

async function openMessage(id) {
  const msg = messagesList.find(m => m.id === id);
  if (!msg) return;

  currentMessageId = id;

  // Populate modal
  document.getElementById('message-sender').textContent = msg.sender_name;
  document.getElementById('message-email').textContent = msg.sender_email;
  document.getElementById('message-subject').textContent = msg.subject || '(sem assunto)';
  document.getElementById('message-body').textContent = msg.message;
  document.getElementById('message-date').textContent = formatDate(msg.created_at);
  document.getElementById('message-reply-link').href = `mailto:${msg.sender_email}?subject=Re: ${encodeURIComponent(msg.subject || '')}`;

  // Show modal
  document.getElementById('message-modal').classList.remove('hidden');
  lucide.createIcons();

  // Mark as read if unread
  if (!msg.is_read) {
    try {
      await markMessageRead(id);
      msg.is_read = true;
      renderMessages();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  }
}

function closeMessageModal() {
  document.getElementById('message-modal').classList.add('hidden');
  currentMessageId = null;
}

// Close modal on backdrop click
document.getElementById('message-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeMessageModal();
});

// Delete message from modal
document.getElementById('message-delete-btn').addEventListener('click', async () => {
  if (!currentMessageId) return;

  const msg = messagesList.find(m => m.id === currentMessageId);
  const name = msg ? msg.sender_name : '';

  if (!confirm(`Tem certeza que deseja excluir a mensagem de "${name}"?`)) return;

  try {
    await deleteMessage(currentMessageId);
    showToast('Mensagem excluida com sucesso!');
    closeMessageModal();
    messagesList = messagesList.filter(m => m.id !== currentMessageId);

    if (messagesList.length === 0) {
      document.getElementById('messages-list').classList.add('hidden');
      document.getElementById('messages-empty').classList.remove('hidden');
      lucide.createIcons();
    } else {
      renderMessages();
    }
  } catch (err) {
    console.error('Error deleting message:', err);
    showToast('Erro ao excluir mensagem.', 'error');
  }
});
