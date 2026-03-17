// =============================================
// Skills CRUD - Admin
// =============================================

let skillsList = [];

async function loadSkills() {
  const loadingEl = document.getElementById('skills-loading');
  const tableEl = document.getElementById('skills-table');
  const emptyEl = document.getElementById('skills-empty');
  const tbody = document.getElementById('skills-tbody');

  try {
    skillsList = await getSkills();

    loadingEl.classList.add('hidden');

    if (skillsList.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }

    tableEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');

    tbody.innerHTML = skillsList.map(skill => `
      <tr class="hover:bg-gray-50 transition-colors ${!skill.is_visible ? 'opacity-50' : ''}">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <i data-lucide="${skill.icon || 'code'}" class="w-4 h-4 text-primary"></i>
            </div>
            <span class="font-medium text-gray-800">${sanitizeHTML(skill.name)}</span>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">${sanitizeHTML(skill.category)}</span>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-2">
            <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width: ${skill.proficiency}%"></div>
            </div>
            <span class="text-sm text-gray-500">${skill.proficiency}%</span>
          </div>
        </td>
        <td class="px-6 py-4 text-center">
          ${skill.is_visible
            ? '<span class="text-green-500"><i data-lucide="eye" class="w-4 h-4 inline"></i></span>'
            : '<span class="text-gray-300"><i data-lucide="eye-off" class="w-4 h-4 inline"></i></span>'
          }
        </td>
        <td class="px-6 py-4 text-center text-sm text-gray-500">${skill.display_order}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="editSkill('${skill.id}')" class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Editar">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="confirmDeleteSkill('${skill.id}', '${sanitizeHTML(skill.name)}')" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    lucide.createIcons();

  } catch (err) {
    console.error('Error loading skills:', err);
    loadingEl.innerHTML = `
      <div class="bg-red-50 text-red-600 p-4 rounded-lg">
        Erro ao carregar skills. Tente recarregar a pagina.
      </div>
    `;
  }
}

function openSkillModal(skill = null) {
  const modal = document.getElementById('skill-modal');
  const title = document.getElementById('skill-modal-title');
  const form = document.getElementById('skill-form');

  form.reset();
  document.getElementById('skill-id').value = '';
  document.getElementById('skill-proficiency').value = 50;
  document.getElementById('proficiency-value').textContent = '50';
  document.getElementById('skill-visible').checked = true;

  if (skill) {
    title.textContent = 'Editar Skill';
    document.getElementById('skill-id').value = skill.id;
    document.getElementById('skill-name').value = skill.name || '';
    document.getElementById('skill-category').value = skill.category || '';
    document.getElementById('skill-icon').value = skill.icon || '';
    document.getElementById('skill-proficiency').value = skill.proficiency || 0;
    document.getElementById('proficiency-value').textContent = skill.proficiency || 0;
    document.getElementById('skill-order').value = skill.display_order || 0;
    document.getElementById('skill-visible').checked = skill.is_visible !== false;
  } else {
    title.textContent = 'Nova Skill';
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeSkillModal() {
  document.getElementById('skill-modal').classList.add('hidden');
}

function editSkill(id) {
  const skill = skillsList.find(s => s.id === id);
  if (skill) openSkillModal(skill);
}

async function confirmDeleteSkill(id, name) {
  if (!confirm(`Tem certeza que deseja excluir a skill "${name}"? Esta acao nao pode ser desfeita.`)) return;

  try {
    await deleteSkill(id);
    showToast('Skill excluida com sucesso!');
    loadSkills();
  } catch (err) {
    console.error('Error deleting skill:', err);
    showToast('Erro ao excluir skill.', 'error');
  }
}

// Proficiency range slider live update
document.getElementById('skill-proficiency').addEventListener('input', (e) => {
  document.getElementById('proficiency-value').textContent = e.target.value;
});

// Close modal on backdrop click
document.getElementById('skill-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeSkillModal();
});

// Form submit
document.getElementById('skill-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('skill-save-btn');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  try {
    const id = document.getElementById('skill-id').value;

    const skillData = {
      name: document.getElementById('skill-name').value.trim(),
      category: document.getElementById('skill-category').value.trim(),
      icon: document.getElementById('skill-icon').value.trim() || null,
      proficiency: parseInt(document.getElementById('skill-proficiency').value) || 0,
      display_order: parseInt(document.getElementById('skill-order').value) || 0,
      is_visible: document.getElementById('skill-visible').checked
    };

    if (id) {
      await updateSkill(id, skillData);
      showToast('Skill atualizada com sucesso!');
    } else {
      await createSkill(skillData);
      showToast('Skill criada com sucesso!');
    }

    closeSkillModal();
    loadSkills();

  } catch (err) {
    console.error('Error saving skill:', err);
    showToast('Erro ao salvar skill.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Salvar';
  }
});
