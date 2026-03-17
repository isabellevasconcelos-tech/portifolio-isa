// =============================================
// Dashboard - Stats & Overview
// =============================================

async function loadDashboard() {
  const statsGrid = document.getElementById('stats-grid');

  try {
    // Fetch all counts in parallel
    const [projects, skills, unreadCount, posts] = await Promise.all([
      getProjects(),
      getSkills(),
      getUnreadCount(),
      getAllBlogPosts()
    ]);

    const totalProjects = projects.length;
    const totalSkills = skills.length;
    const publishedPosts = posts.filter(p => p.is_published).length;

    statsGrid.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Projetos</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">${totalProjects}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <i data-lucide="folder" class="w-6 h-6 text-blue-500"></i>
          </div>
        </div>
        <a href="projects.html" class="text-sm text-primary hover:text-primary-dark mt-3 inline-block">Ver todos &rarr;</a>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Skills</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">${totalSkills}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
            <i data-lucide="zap" class="w-6 h-6 text-yellow-500"></i>
          </div>
        </div>
        <a href="skills.html" class="text-sm text-primary hover:text-primary-dark mt-3 inline-block">Ver todas &rarr;</a>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Mensagens nao lidas</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">${unreadCount}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <i data-lucide="mail" class="w-6 h-6 text-red-500"></i>
          </div>
        </div>
        <a href="messages.html" class="text-sm text-primary hover:text-primary-dark mt-3 inline-block">Ver mensagens &rarr;</a>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Posts publicados</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">${publishedPosts}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <i data-lucide="file-text" class="w-6 h-6 text-green-500"></i>
          </div>
        </div>
        <a href="blog-posts.html" class="text-sm text-primary hover:text-primary-dark mt-3 inline-block">Ver posts &rarr;</a>
      </div>
    `;

    // Re-create Lucide icons for dynamically added elements
    lucide.createIcons();

  } catch (err) {
    console.error('Error loading dashboard:', err);
    statsGrid.innerHTML = `
      <div class="col-span-full bg-red-50 text-red-600 p-4 rounded-lg">
        Erro ao carregar estatisticas. Tente recarregar a pagina.
      </div>
    `;
  }
}
