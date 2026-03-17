// =============================================
// Home Page - Rendering Logic
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initHome();
  initMobileMenu();
  initBackToTop();
  initScrollAnimations();
  initContactForm();
});

async function initHome() {
  // Load all sections in parallel
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills()
  ]);

  if (profile) {
    renderHero(profile);
    renderAbout(profile);
    renderFooterSocial(profile.social_links);
  }

  renderProjects(projects);
  renderSkills(skills);

  // Initialize Lucide icons after content is rendered
  lucide.createIcons();
}

// ---- Hero ----
function renderHero(profile) {
  const container = document.getElementById('hero-content');
  if (!container) return;

  const photoHTML = profile.photo_url
    ? `<img src="${sanitizeHTML(profile.photo_url)}" alt="${sanitizeHTML(profile.full_name)}"
         class="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-xl border-4 border-white">`
    : `<div class="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-6xl font-heading font-bold shadow-xl">
         ${profile.full_name.charAt(0)}
       </div>`;

  const socialHTML = (profile.social_links || []).map(link => `
    <a href="${sanitizeHTML(link.url)}" target="_blank" rel="noopener noreferrer"
       class="social-link text-gray-500 hover:text-primary">
      <i data-lucide="${sanitizeHTML(link.icon)}" class="w-5 h-5"></i>
    </a>
  `).join('');

  container.innerHTML = `
    <div class="flex-shrink-0 order-first md:order-last">
      ${photoHTML}
    </div>
    <div class="text-center md:text-left flex-1">
      <p class="text-primary font-medium mb-2">Ola, eu sou</p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-3">
        ${sanitizeHTML(profile.full_name)}
      </h1>
      <p class="text-xl md:text-2xl text-gray-500 mb-2">${sanitizeHTML(profile.title)}</p>
      ${profile.subtitle ? `<p class="text-gray-400 mb-6">${sanitizeHTML(profile.subtitle)}</p>` : ''}
      <div class="flex items-center gap-4 justify-center md:justify-start mb-6">
        <a href="#contact" class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          Fale Comigo
        </a>
        ${profile.resume_url ? `
          <a href="${sanitizeHTML(profile.resume_url)}" target="_blank" class="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Curriculo
          </a>
        ` : ''}
      </div>
      <div class="flex items-center gap-3 justify-center md:justify-start">
        ${socialHTML}
      </div>
    </div>
  `;
}

// ---- About ----
function renderAbout(profile) {
  const container = document.getElementById('about-content');
  if (!container) return;

  container.innerHTML = `
    <div class="max-w-3xl mx-auto text-center">
      ${profile.bio ? `<p class="text-lg text-gray-600 mb-4">${sanitizeHTML(profile.bio)}</p>` : ''}
      ${profile.description ? `<p class="text-gray-500 leading-relaxed">${sanitizeHTML(profile.description)}</p>` : ''}
    </div>
  `;
}

// ---- Projects ----
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (!projects || projects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 text-gray-400">
        <i data-lucide="folder-open" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
        <p>Projetos em breve...</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects.map(project => `
    <div class="project-card bg-white rounded-xl shadow-md overflow-hidden fade-in">
      <div class="overflow-hidden h-48">
        ${project.image_url
          ? `<img src="${sanitizeHTML(project.image_url)}" alt="${sanitizeHTML(project.title)}" class="w-full h-full object-cover">`
          : `<div class="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
               <i data-lucide="code-2" class="w-12 h-12 text-primary/40"></i>
             </div>`
        }
      </div>
      <div class="p-5">
        <h3 class="font-heading font-bold text-lg mb-2">${sanitizeHTML(project.title)}</h3>
        <p class="text-gray-500 text-sm mb-3 line-clamp-2">${sanitizeHTML(project.description)}</p>
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${(project.tech_stack || []).map(tech =>
            `<span class="badge">${sanitizeHTML(tech)}</span>`
          ).join('')}
        </div>
        <div class="flex gap-3">
          ${project.live_url ? `
            <a href="${sanitizeHTML(project.live_url)}" target="_blank" rel="noopener noreferrer"
               class="text-sm text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Demo
            </a>
          ` : ''}
          ${project.repo_url ? `
            <a href="${sanitizeHTML(project.repo_url)}" target="_blank" rel="noopener noreferrer"
               class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors">
              <i data-lucide="github" class="w-3.5 h-3.5"></i> Codigo
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ---- Skills ----
function renderSkills(skills) {
  const container = document.getElementById('skills-content');
  if (!container) return;

  if (!skills || skills.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-gray-400">
        <i data-lucide="sparkles" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
        <p>Habilidades em breve...</p>
      </div>
    `;
    return;
  }

  const grouped = groupSkillsByCategory(skills);

  container.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <div class="mb-8">
      <h3 class="text-lg font-heading font-bold text-gray-700 mb-4">${sanitizeHTML(category)}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${items.map(skill => `
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                ${skill.icon ? `<i class="${sanitizeHTML(skill.icon)} text-primary text-lg"></i>` : ''}
                <span class="font-medium text-sm">${sanitizeHTML(skill.name)}</span>
              </div>
              <span class="text-xs text-gray-400">${skill.proficiency}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="skill-bar-fill bg-gradient-to-r from-primary to-accent rounded-full h-2"
                   style="--proficiency: ${skill.proficiency}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ---- Footer Social ----
function renderFooterSocial(socialLinks) {
  const container = document.getElementById('footer-social');
  if (!container || !socialLinks) return;

  container.innerHTML = socialLinks.map(link => `
    <a href="${sanitizeHTML(link.url)}" target="_blank" rel="noopener noreferrer"
       class="social-link text-gray-500 hover:text-white transition-colors">
      <i data-lucide="${sanitizeHTML(link.icon)}" class="w-5 h-5"></i>
    </a>
  `).join('');
}

// ---- Contact Form ----
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Enviando...';

    try {
      await sendMessage({
        sender_name: form.sender_name.value.trim(),
        sender_email: form.sender_email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim()
      });
      showToast('Mensagem enviada com sucesso!', 'success');
      form.reset();
    } catch (err) {
      showToast('Erro ao enviar mensagem. Tente novamente.', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
}

// ---- Mobile Menu ----
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.add('hidden'));
  });
}

// ---- Back to Top ----
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate skill bars
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.classList.add('animated');
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Re-observe dynamically added elements
  const bodyObserver = new MutationObserver(() => {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}
