// =============================================
// Home Page - Rendering Logic
// Theme: Medieval Dark + Gold
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initHome();
  initMobileMenu();
  initBackToTop();
  initScrollAnimations();
  initContactForm();
});

async function initHome() {
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
  lucide.createIcons();
}

// ---- Stars Background ----
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = [];
  const count = 120;

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now() * 0.001;

    stars.forEach(star => {
      const twinkle = Math.sin(time * star.speed + star.phase) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${star.opacity * twinkle})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();

  // Resize stars on scroll height change
  const observer = new MutationObserver(resize);
  observer.observe(document.body, { childList: true, subtree: true });
}

// ---- Hero ----
function renderHero(profile) {
  const container = document.getElementById('hero-content');
  if (!container) return;

  const photoHTML = profile.photo_url
    ? `<img src="${sanitizeHTML(profile.photo_url)}" alt="${sanitizeHTML(profile.full_name)}"
         class="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-2 border-gold/40 gold-glow-box">`
    : `<div class="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-dark to-night flex items-center justify-center text-gold text-6xl font-heading font-bold border-2 border-gold/40 gold-glow-box">
         ${profile.full_name.charAt(0)}
       </div>`;

  const socialHTML = (profile.social_links || []).map(link => `
    <a href="${sanitizeHTML(link.url)}" target="_blank" rel="noopener noreferrer"
       class="social-link text-soft/50 hover:text-gold">
      <i data-lucide="${sanitizeHTML(link.icon)}" class="w-5 h-5"></i>
    </a>
  `).join('');

  container.innerHTML = `
    <div class="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
    <div class="flex-shrink-0 order-first md:order-last relative">
      ${photoHTML}
    </div>
    <div class="text-center md:text-left flex-1 relative">
      <p class="text-gold/70 font-body text-sm tracking-widest uppercase mb-3">Portfolio</p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-soft mb-3 gold-glow">
        ${sanitizeHTML(profile.full_name)}
      </h1>
      <p class="text-xl md:text-2xl text-gold font-heading font-normal mb-3">${sanitizeHTML(profile.title)}</p>
      ${profile.subtitle ? `<p class="text-soft/50 italic mb-6 text-lg">"${sanitizeHTML(profile.subtitle)}"</p>` : ''}
      <div class="flex items-center gap-4 justify-center md:justify-start mb-6">
        <a href="#contact" class="bg-gold hover:bg-gold-light text-dark px-6 py-2.5 rounded-lg font-bold transition-colors">
          Fale Comigo
        </a>
        ${profile.resume_url ? `
          <a href="${sanitizeHTML(profile.resume_url)}" target="_blank" class="border border-gold/50 text-gold hover:bg-gold hover:text-dark px-6 py-2.5 rounded-lg font-medium transition-colors">
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
      ${profile.bio ? `<p class="text-lg text-soft/80 mb-4 font-light">${sanitizeHTML(profile.bio)}</p>` : ''}
      ${profile.description ? `<p class="text-soft/50 leading-relaxed">${sanitizeHTML(profile.description)}</p>` : ''}
    </div>
  `;
}

// ---- Projects ----
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  if (!projects || projects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 text-soft/30">
        <i data-lucide="folder-open" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
        <p class="font-heading">Projetos em breve...</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = projects.map(project => `
    <div class="project-card bg-night rounded-xl overflow-hidden fade-in">
      <div class="overflow-hidden h-48">
        ${project.image_url
          ? `<img src="${sanitizeHTML(project.image_url)}" alt="${sanitizeHTML(project.title)}" class="w-full h-full object-cover">`
          : `<div class="w-full h-full bg-gradient-to-br from-dark to-night flex items-center justify-center">
               <i data-lucide="code-2" class="w-12 h-12 text-gold/20"></i>
             </div>`
        }
      </div>
      <div class="p-5">
        <h3 class="font-heading font-bold text-lg mb-2 text-soft">${sanitizeHTML(project.title)}</h3>
        <p class="text-soft/50 text-sm mb-3 line-clamp-2">${sanitizeHTML(project.description)}</p>
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${(project.tech_stack || []).map(tech =>
            `<span class="badge">${sanitizeHTML(tech)}</span>`
          ).join('')}
        </div>
        <div class="flex gap-3">
          ${project.live_url ? `
            <a href="${sanitizeHTML(project.live_url)}" target="_blank" rel="noopener noreferrer"
               class="text-sm text-gold hover:text-gold-light flex items-center gap-1 transition-colors">
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Demo
            </a>
          ` : ''}
          ${project.repo_url ? `
            <a href="${sanitizeHTML(project.repo_url)}" target="_blank" rel="noopener noreferrer"
               class="text-sm text-soft/40 hover:text-soft flex items-center gap-1 transition-colors">
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
      <div class="text-center py-12 text-soft/30">
        <i data-lucide="sparkles" class="w-12 h-12 mx-auto mb-3 opacity-50"></i>
        <p class="font-heading">Habilidades em breve...</p>
      </div>
    `;
    return;
  }

  const grouped = groupSkillsByCategory(skills);

  container.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <div class="mb-8">
      <h3 class="text-lg font-heading font-bold text-gold/80 mb-4">${sanitizeHTML(category)}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${items.map(skill => `
          <div class="bg-dark/50 border border-gold/10 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                ${skill.icon ? `<i class="${sanitizeHTML(skill.icon)} text-gold text-lg"></i>` : ''}
                <span class="font-medium text-sm text-soft/80">${sanitizeHTML(skill.name)}</span>
              </div>
              <span class="text-xs text-gold/60">${skill.proficiency}%</span>
            </div>
            <div class="w-full bg-dark rounded-full h-2">
              <div class="skill-bar-fill bg-gradient-to-r from-gold-dark to-gold rounded-full h-2"
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
       class="social-link text-soft/40 hover:text-gold transition-colors">
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
    btn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-dark"></div> Enviando...';

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
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.classList.add('animated');
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  const bodyObserver = new MutationObserver(() => {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}
