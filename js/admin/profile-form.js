// =============================================
// Profile Form - Load, Edit & Save
// =============================================

let currentProfile = null;
let socialLinksData = [];

async function loadProfile() {
  const loadingEl = document.getElementById('profile-loading');
  const formEl = document.getElementById('profile-form');

  try {
    currentProfile = await getProfile();

    if (currentProfile) {
      document.getElementById('full_name').value = currentProfile.full_name || '';
      document.getElementById('title').value = currentProfile.title || '';
      document.getElementById('subtitle').value = currentProfile.subtitle || '';
      document.getElementById('bio').value = currentProfile.bio || '';
      document.getElementById('description').value = currentProfile.description || '';
      document.getElementById('resume_url').value = currentProfile.resume_url || '';

      // Photo preview
      if (currentProfile.photo_url) {
        const preview = document.getElementById('photo-preview');
        preview.innerHTML = `<img src="${currentProfile.photo_url}" alt="Foto" class="w-full h-full object-cover">`;
      }

      // Social links
      socialLinksData = currentProfile.social_links || [];
      renderSocialLinks();
    }

    loadingEl.classList.add('hidden');
    formEl.classList.remove('hidden');
    lucide.createIcons();

  } catch (err) {
    console.error('Error loading profile:', err);
    loadingEl.innerHTML = `
      <div class="bg-red-50 text-red-600 p-4 rounded-lg">
        Erro ao carregar perfil. Tente recarregar a pagina.
      </div>
    `;
  }
}

function renderSocialLinks() {
  const container = document.getElementById('social-links-container');
  const noMsg = document.getElementById('no-socials-msg');

  if (socialLinksData.length === 0) {
    container.innerHTML = '';
    noMsg.classList.remove('hidden');
    return;
  }

  noMsg.classList.add('hidden');
  container.innerHTML = socialLinksData.map((link, index) => `
    <div class="flex items-center gap-3" data-index="${index}">
      <input type="text" value="${sanitizeHTML(link.platform || '')}" placeholder="Plataforma (ex: GitHub)"
        class="social-platform flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm">
      <input type="url" value="${sanitizeHTML(link.url || '')}" placeholder="URL"
        class="social-url flex-[2] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm">
      <input type="text" value="${sanitizeHTML(link.icon || '')}" placeholder="Icone (ex: github)"
        class="social-icon flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm">
      <button type="button" onclick="removeSocialLink(${index})" class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');

  lucide.createIcons();
}

function addSocialLink() {
  socialLinksData.push({ platform: '', url: '', icon: '' });
  renderSocialLinks();
}

function removeSocialLink(index) {
  socialLinksData.splice(index, 1);
  renderSocialLinks();
}

function collectSocialLinks() {
  const rows = document.querySelectorAll('#social-links-container > div');
  const links = [];
  rows.forEach(row => {
    const platform = row.querySelector('.social-platform').value.trim();
    const url = row.querySelector('.social-url').value.trim();
    const icon = row.querySelector('.social-icon').value.trim();
    if (platform && url) {
      links.push({ platform, url, icon });
    }
  });
  return links;
}

// Photo file preview
document.getElementById('photo-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = document.getElementById('photo-preview');
      preview.innerHTML = `<img src="${ev.target.result}" alt="Preview" class="w-full h-full object-cover">`;
    };
    reader.readAsDataURL(file);
  }
});

// Add social link button
document.getElementById('add-social-btn').addEventListener('click', addSocialLink);

// Save form
document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('save-btn');
  btn.disabled = true;
  btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Salvando...';

  try {
    let photoUrl = currentProfile?.photo_url || null;

    // Upload new photo if selected
    const photoFile = document.getElementById('photo-file').files[0];
    if (photoFile) {
      const uploadedUrl = await uploadImage(photoFile, 'profile');
      if (uploadedUrl) {
        photoUrl = uploadedUrl;
      }
    }

    const profileData = {
      full_name: document.getElementById('full_name').value.trim(),
      title: document.getElementById('title').value.trim(),
      subtitle: document.getElementById('subtitle').value.trim(),
      bio: document.getElementById('bio').value.trim(),
      description: document.getElementById('description').value.trim(),
      resume_url: document.getElementById('resume_url').value.trim(),
      photo_url: photoUrl,
      social_links: collectSocialLinks()
    };

    currentProfile = await updateProfile(profileData);
    showToast('Perfil salvo com sucesso!');

  } catch (err) {
    console.error('Error saving profile:', err);
    showToast('Erro ao salvar perfil.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Salvar alteracoes';
    lucide.createIcons();
  }
});
