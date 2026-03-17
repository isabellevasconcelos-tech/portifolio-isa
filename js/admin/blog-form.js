// =============================================
// Blog Posts CRUD - Admin
// =============================================

let postsList = [];

async function loadPosts() {
  const loadingEl = document.getElementById('posts-loading');
  const tableEl = document.getElementById('posts-table');
  const emptyEl = document.getElementById('posts-empty');
  const tbody = document.getElementById('posts-tbody');

  try {
    postsList = await getAllBlogPosts();

    loadingEl.classList.add('hidden');

    if (postsList.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }

    tableEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');

    tbody.innerHTML = postsList.map(post => `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            ${post.cover_image_url
              ? `<img src="${post.cover_image_url}" alt="" class="w-10 h-10 rounded-lg object-cover">`
              : `<div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><i data-lucide="file-text" class="w-5 h-5 text-gray-300"></i></div>`
            }
            <div>
              <p class="font-medium text-gray-800">${sanitizeHTML(post.title)}</p>
              <p class="text-xs text-gray-400 max-w-xs truncate">${sanitizeHTML(post.excerpt || '')}</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <code class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${sanitizeHTML(post.slug)}</code>
        </td>
        <td class="px-6 py-4">
          <div class="flex flex-wrap gap-1">
            ${(post.tags || []).map(tag =>
              `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">${sanitizeHTML(tag)}</span>`
            ).join('')}
          </div>
        </td>
        <td class="px-6 py-4 text-center">
          ${post.is_published
            ? '<span class="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Publicado</span>'
            : '<span class="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">Rascunho</span>'
          }
        </td>
        <td class="px-6 py-4 text-sm text-gray-500">
          ${post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
        </td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="editPost('${post.id}')" class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Editar">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="confirmDeletePost('${post.id}', '${sanitizeHTML(post.title)}')" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    lucide.createIcons();

  } catch (err) {
    console.error('Error loading posts:', err);
    loadingEl.innerHTML = `
      <div class="bg-red-50 text-red-600 p-4 rounded-lg">
        Erro ao carregar posts. Tente recarregar a pagina.
      </div>
    `;
  }
}

function openPostModal(post = null) {
  const modal = document.getElementById('post-modal');
  const title = document.getElementById('post-modal-title');
  const form = document.getElementById('post-form');

  form.reset();
  document.getElementById('post-id').value = '';
  document.getElementById('post-cover-url').value = '';
  document.getElementById('post-cover-preview').classList.add('hidden');

  if (post) {
    title.textContent = 'Editar Post';
    document.getElementById('post-id').value = post.id;
    document.getElementById('post-title').value = post.title || '';
    document.getElementById('post-slug').value = post.slug || '';
    document.getElementById('post-excerpt').value = post.excerpt || '';
    document.getElementById('post-content').value = post.content || '';
    document.getElementById('post-tags').value = (post.tags || []).join(', ');
    document.getElementById('post-published').checked = post.is_published || false;
    document.getElementById('post-cover-url').value = post.cover_image_url || '';

    if (post.cover_image_url) {
      const preview = document.getElementById('post-cover-preview');
      preview.querySelector('img').src = post.cover_image_url;
      preview.classList.remove('hidden');
    }
  } else {
    title.textContent = 'Novo Post';
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closePostModal() {
  document.getElementById('post-modal').classList.add('hidden');
}

function editPost(id) {
  const post = postsList.find(p => p.id === id);
  if (post) openPostModal(post);
}

async function confirmDeletePost(id, title) {
  if (!confirm(`Tem certeza que deseja excluir o post "${title}"? Esta acao nao pode ser desfeita.`)) return;

  try {
    await deleteBlogPost(id);
    showToast('Post excluido com sucesso!');
    loadPosts();
  } catch (err) {
    console.error('Error deleting post:', err);
    showToast('Erro ao excluir post.', 'error');
  }
}

// Auto-generate slug from title
document.getElementById('post-title').addEventListener('input', (e) => {
  const slugField = document.getElementById('post-slug');
  // Only auto-generate if slug is empty or was auto-generated before
  if (!document.getElementById('post-id').value) {
    slugField.value = generateSlug(e.target.value);
  }
});

// Manual slug generation button
document.getElementById('generate-slug-btn').addEventListener('click', () => {
  const title = document.getElementById('post-title').value;
  if (title) {
    document.getElementById('post-slug').value = generateSlug(title);
  }
});

// Cover image preview
document.getElementById('post-cover').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = document.getElementById('post-cover-preview');
      preview.querySelector('img').src = ev.target.result;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
});

// Close modal on backdrop click
document.getElementById('post-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closePostModal();
});

// Form submit
document.getElementById('post-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('post-save-btn');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    const id = document.getElementById('post-id').value;
    let coverUrl = document.getElementById('post-cover-url').value;

    // Upload cover image if new file selected
    const coverFile = document.getElementById('post-cover').files[0];
    if (coverFile) {
      const uploadedUrl = await uploadImage(coverFile, 'blog');
      if (uploadedUrl) coverUrl = uploadedUrl;
    }

    const tagsInput = document.getElementById('post-tags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

    const isPublished = document.getElementById('post-published').checked;

    const postData = {
      title: document.getElementById('post-title').value.trim(),
      slug: document.getElementById('post-slug').value.trim() || generateSlug(document.getElementById('post-title').value),
      excerpt: document.getElementById('post-excerpt').value.trim() || null,
      content: document.getElementById('post-content').value.trim(),
      cover_image_url: coverUrl || null,
      tags: tags,
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null
    };

    // If editing and already published, keep original published_at
    if (id) {
      const existingPost = postsList.find(p => p.id === id);
      if (existingPost && existingPost.is_published && isPublished) {
        postData.published_at = existingPost.published_at;
      }
    }

    if (id) {
      await updateBlogPost(id, postData);
      showToast('Post atualizado com sucesso!');
    } else {
      await createBlogPost(postData);
      showToast('Post criado com sucesso!');
    }

    closePostModal();
    loadPosts();

  } catch (err) {
    console.error('Error saving post:', err);
    showToast('Erro ao salvar post.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Salvar';
  }
});
