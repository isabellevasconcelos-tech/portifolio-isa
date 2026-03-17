// =============================================
// Projects CRUD - Admin
// =============================================

let projectsList = [];

async function loadProjects() {
  const loadingEl = document.getElementById('projects-loading');
  const tableEl = document.getElementById('projects-table');
  const emptyEl = document.getElementById('projects-empty');
  const tbody = document.getElementById('projects-tbody');

  try {
    // getProjects() already returns all projects ordered by display_order
    projectsList = await getProjects();

    loadingEl.classList.add('hidden');

    if (projectsList.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }

    tableEl.classList.remove('hidden');
    tbody.innerHTML = projectsList.map(project => `
      <tr class="hover:bg-gray-50 transition-colors ${!project.is_visible ? 'opacity-50' : ''}">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            ${project.image_url
              ? `<img src="${project.image_url}" alt="" class="w-10 h-10 rounded-lg object-cover">`
              : `<div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><i data-lucide="image" class="w-5 h-5 text-gray-300"></i></div>`
            }
            <div>
              <p class="font-medium text-gray-800">${sanitizeHTML(project.title)}</p>
              <p class="text-xs text-gray-400 max-w-xs truncate">${sanitizeHTML(project.description)}</p>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex flex-wrap gap-1">
            ${(project.tech_stack || []).map(tech =>
              `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">${sanitizeHTML(tech)}</span>`
            ).join('')}
          </div>
        </td>
        <td class="px-6 py-4 text-center">
          ${project.is_featured
            ? '<span class="text-yellow-500"><i data-lucide="star" class="w-4 h-4 inline"></i></span>'
            : '<span class="text-gray-300"><i data-lucide="star" class="w-4 h-4 inline"></i></span>'
          }
        </td>
        <td class="px-6 py-4 text-center">
          ${project.is_visible
            ? '<span class="text-green-500"><i data-lucide="eye" class="w-4 h-4 inline"></i></span>'
            : '<span class="text-gray-300"><i data-lucide="eye-off" class="w-4 h-4 inline"></i></span>'
          }
        </td>
        <td class="px-6 py-4 text-center text-sm text-gray-500">${project.display_order}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="editProject('${project.id}')" class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Editar">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="confirmDeleteProject('${project.id}', '${sanitizeHTML(project.title)}')" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    lucide.createIcons();

  } catch (err) {
    console.error('Error loading projects:', err);
    loadingEl.innerHTML = `
      <div class="bg-red-50 text-red-600 p-4 rounded-lg">
        Erro ao carregar projetos. Tente recarregar a pagina.
      </div>
    `;
  }
}

function openProjectModal(project = null) {
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('modal-title');
  const form = document.getElementById('project-form');

  form.reset();
  document.getElementById('project-id').value = '';
  document.getElementById('project-image-url').value = '';
  document.getElementById('project-image-preview').classList.add('hidden');
  document.getElementById('project-visible').checked = true;

  if (project) {
    title.textContent = 'Editar Projeto';
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-title').value = project.title || '';
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-live-url').value = project.live_url || '';
    document.getElementById('project-repo-url').value = project.repo_url || '';
    document.getElementById('project-tech').value = (project.tech_stack || []).join(', ');
    document.getElementById('project-order').value = project.display_order || 0;
    document.getElementById('project-featured').checked = project.is_featured || false;
    document.getElementById('project-visible').checked = project.is_visible !== false;
    document.getElementById('project-image-url').value = project.image_url || '';

    if (project.image_url) {
      const preview = document.getElementById('project-image-preview');
      preview.querySelector('img').src = project.image_url;
      preview.classList.remove('hidden');
    }
  } else {
    title.textContent = 'Novo Projeto';
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.add('hidden');
}

function editProject(id) {
  const project = projectsList.find(p => p.id === id);
  if (project) openProjectModal(project);
}

async function confirmDeleteProject(id, title) {
  if (!confirm(`Tem certeza que deseja excluir o projeto "${title}"? Esta acao nao pode ser desfeita.`)) return;

  try {
    await deleteProject(id);
    showToast('Projeto excluido com sucesso!');
    loadProjects();
  } catch (err) {
    console.error('Error deleting project:', err);
    showToast('Erro ao excluir projeto.', 'error');
  }
}

// Image preview on file select
document.getElementById('project-image').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = document.getElementById('project-image-preview');
      preview.querySelector('img').src = ev.target.result;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
});

// Close modal on backdrop click
document.getElementById('project-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeProjectModal();
});

// Form submit
document.getElementById('project-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('project-save-btn');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    const id = document.getElementById('project-id').value;
    let imageUrl = document.getElementById('project-image-url').value;

    // Upload image if new file selected
    const imageFile = document.getElementById('project-image').files[0];
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile, 'projects');
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const techInput = document.getElementById('project-tech').value;
    const techStack = techInput ? techInput.split(',').map(t => t.trim()).filter(Boolean) : [];

    const projectData = {
      title: document.getElementById('project-title').value.trim(),
      description: document.getElementById('project-description').value.trim(),
      image_url: imageUrl || null,
      live_url: document.getElementById('project-live-url').value.trim() || null,
      repo_url: document.getElementById('project-repo-url').value.trim() || null,
      tech_stack: techStack,
      display_order: parseInt(document.getElementById('project-order').value) || 0,
      is_featured: document.getElementById('project-featured').checked,
      is_visible: document.getElementById('project-visible').checked
    };

    if (id) {
      await updateProject(id, projectData);
      showToast('Projeto atualizado com sucesso!');
    } else {
      await createProject(projectData);
      showToast('Projeto criado com sucesso!');
    }

    closeProjectModal();
    loadProjects();

  } catch (err) {
    console.error('Error saving project:', err);
    showToast('Erro ao salvar projeto.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Salvar';
  }
});
