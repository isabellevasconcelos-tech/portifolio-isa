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

    // Set Enchanted Brush link from profile.site_url
    const brushLink = document.getElementById('enchanted-brush-link');
    if (brushLink && profile.site_url) {
      brushLink.href = profile.site_url;
      brushLink.target = '_blank';
      brushLink.rel = 'noopener noreferrer';
    }
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

  // Stars (small twinkling dots)
  const stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.15 + 0.05,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Sparkles (bigger, brighter, rarer)
  const sparkles = [];
  for (let i = 0; i < 25; i++) {
    sparkles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.15 + 0.05,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Glow orbs (large, very subtle)
  const glows = [];
  for (let i = 0; i < 5; i++) {
    glows.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 80 + 40,
      speed: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now() * 0.001;

    // Draw glow orbs (very subtle, 10-15% opacity)
    glows.forEach(glow => {
      const pulse = Math.sin(time * glow.speed + glow.phase) * 0.5 + 0.5;
      const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.size);
      gradient.addColorStop(0, `rgba(212, 175, 55, ${glow.opacity * pulse})`);
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, glow.size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    // Draw stars
    stars.forEach(star => {
      const twinkle = Math.sin(time * star.speed + star.phase) * 0.4 + 0.6;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${star.opacity * twinkle})`;
      ctx.fill();
    });

    // Draw sparkles (4-point star shape)
    sparkles.forEach(sp => {
      const twinkle = Math.sin(time * sp.speed * 2 + sp.phase) * 0.5 + 0.5;
      const alpha = sp.opacity * twinkle;
      const s = sp.size;
      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0.5, 0, 0, s);
      ctx.quadraticCurveTo(-0.5, 0, 0, -s);
      ctx.fill();
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(-s, 0);
      ctx.quadraticCurveTo(0, 0.5, s, 0);
      ctx.quadraticCurveTo(0, -0.5, -s, 0);
      ctx.fill();
      // Center glow
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.8);
      g.addColorStop(0, `rgba(212, 175, 55, ${alpha * 0.4})`);
      g.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
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

  const photoSrc = 'https://hduglfjxmumvygnwjikw.supabase.co/storage/v1/object/public/portifolio/BXNU6906.JPG';
  const photoHTML = `<img src="${photoSrc}" alt="${sanitizeHTML(profile.full_name)}"
       class="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-2 border-gold/40 gold-glow-box hero-photo-float">`;

  const socialHTML = (profile.social_links || []).map(link => `
    <a href="${sanitizeHTML(link.url)}" target="_blank" rel="noopener noreferrer"
       class="social-link text-soft/50 hover:text-gold">
      <i data-lucide="${sanitizeHTML(link.icon)}" class="w-5 h-5"></i>
    </a>
  `).join('');

  container.innerHTML = `
    <div class="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
    <div class="flex-shrink-0 order-first md:order-last relative hero-photo">
      ${photoHTML}
    </div>
    <div class="text-center md:text-left flex-1 relative">
      <!-- Ghost name behind (blurred gold duplicate) -->
      <div class="hidden md:block absolute -top-4 -left-2 pointer-events-none select-none" aria-hidden="true">
        <span class="text-5xl lg:text-7xl font-heading font-bold text-gold/10 blur-sm">${sanitizeHTML(profile.full_name)}</span>
      </div>
      <p class="text-gold/70 font-body text-sm tracking-widest uppercase mb-3 hero-subtitle relative">Portfolio</p>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-soft mb-3 gold-glow hero-name relative">
        ${sanitizeHTML(profile.full_name)}
      </h1>
      <p class="text-xl md:text-2xl text-gold font-heading font-normal mb-3 hero-subtitle">${sanitizeHTML(profile.title)}</p>
      ${profile.subtitle ? `<p class="text-soft/50 italic mb-6 text-lg hero-quote">"${sanitizeHTML(profile.subtitle)}"</p>` : ''}
      <div class="flex items-center gap-4 justify-center md:justify-start mb-6 hero-cta">
        <a href="#contact" class="bg-gold hover:bg-gold-light text-dark px-6 py-2.5 rounded-lg font-bold transition-colors">
          Fale Comigo
        </a>
        ${profile.resume_url ? `
          <a href="${sanitizeHTML(profile.resume_url)}" target="_blank" class="border border-gold/50 text-gold hover:bg-gold hover:text-dark px-6 py-2.5 rounded-lg font-medium transition-colors">
            Currículo
          </a>
        ` : ''}
      </div>
      <div class="flex items-center gap-3 justify-center md:justify-start hero-social">
        ${socialHTML}
      </div>
    </div>
  `;
}

// ---- About ----
function renderAbout(profile) {
  const container = document.getElementById('about-content');
  if (!container) return;

  const aboutPhotoSrc = 'https://hduglfjxmumvygnwjikw.supabase.co/storage/v1/object/public/portifolio/BXNU6906.JPG';
  const aboutPhotoHTML = `<img src="${aboutPhotoSrc}" alt="${sanitizeHTML(profile.full_name)}"
       class="w-64 h-72 md:w-80 md:h-96 object-cover rounded-2xl border border-gold/30 gold-glow-box">`;

  container.innerHTML = `
    <div class="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
      <div class="flex-1 text-center md:text-left order-2 md:order-1 anim-surgir">
        <div class="flex items-center gap-2 justify-center md:justify-start mb-4">
          <span class="text-gold text-lg">&#10024;</span>
          <h3 class="text-gold font-heading text-lg font-semibold">Sobre mim</h3>
        </div>
        ${profile.bio ? `<p class="text-soft/80 leading-relaxed mb-4">${sanitizeHTML(profile.bio)}</p>` : ''}
        ${profile.description ? `<p class="text-soft/50 leading-relaxed">${sanitizeHTML(profile.description)}</p>` : ''}
      </div>
      <div class="flex-shrink-0 order-1 md:order-2 anim-slide-right">
        ${aboutPhotoHTML}
      </div>
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

  const defaultSkills = [
    // Habilidades Criativas (Essenciais)
    { name: 'Design Gráfico', category: '🎨 Habilidades Criativas (Essenciais)', proficiency: 95 },
    { name: 'Ilustração Digital', category: '🎨 Habilidades Criativas (Essenciais)', proficiency: 90 },
    { name: 'Criação de Identidade Visual', category: '🎨 Habilidades Criativas (Essenciais)', proficiency: 90 },
    { name: 'Direção Criativa', category: '🎨 Habilidades Criativas (Essenciais)', proficiency: 85 },
    { name: 'Edição de Imagens', category: '🎨 Habilidades Criativas (Essenciais)', proficiency: 90 },
    { name: 'Storytelling Visual', category: '🎨 Habilidades Criativas (Essenciais)', proficiency: 85 },
    // Habilidades Digitais / Tech
    { name: 'Desenvolvimento de Aplicativos', category: '💻 Habilidades Digitais / Tech', proficiency: 75 },
    { name: 'UI/UX Design', category: '💻 Habilidades Digitais / Tech', proficiency: 90 },
    { name: 'Prototipagem de Telas', category: '💻 Habilidades Digitais / Tech', proficiency: 85 },
    { name: 'Noções de Programação', category: '💻 Habilidades Digitais / Tech', proficiency: 65 },
    // Habilidades Pessoais
    { name: 'Criatividade', category: '🧠 Habilidades Pessoais', proficiency: 95 },
    { name: 'Pensamento Inovador', category: '🧠 Habilidades Pessoais', proficiency: 90 },
    { name: 'Organização', category: '🧠 Habilidades Pessoais', proficiency: 85 },
    { name: 'Proatividade', category: '🧠 Habilidades Pessoais', proficiency: 90 },
    { name: 'Comunicação', category: '🧠 Habilidades Pessoais', proficiency: 85 },
    { name: 'Resolução de Problemas', category: '🧠 Habilidades Pessoais', proficiency: 85 },
  ];

  const skillsData = (skills && skills.length > 0) ? skills : defaultSkills;
  const grouped = groupSkillsByCategory(skillsData);

  container.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <div class="mb-8">
      <h3 class="text-lg font-heading font-bold text-gold/80 mb-4">${sanitizeHTML(category)}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${items.map(skill => `
          <div class="bg-dark/50 border border-gold/10 rounded-lg p-4 flex items-center gap-2">
            ${skill.icon ? `<i class="${sanitizeHTML(skill.icon)} text-gold text-lg"></i>` : ''}
            <span class="font-medium text-sm text-soft/80">${sanitizeHTML(skill.name)}</span>
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
      const name = form.sender_name.value.trim();
      const email = form.sender_email.value.trim();
      const subject = form.subject.value.trim();
      const msg = form.message.value.trim();

      await sendMessage({ sender_name: name, sender_email: email, subject, message: msg });

      const whatsappMsg = `Olá! Sou *${name}* (${email}).%0A%0A*Assunto:* ${subject}%0A%0A${msg}`;
      window.open(`https://wa.me/5551993777539?text=${encodeURIComponent(whatsappMsg)}`, '_blank');

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
  const animSelectors = [
    '.fade-in',
    '.anim-surgir',
    '.anim-slide-right',
    '.anim-slide-left',
    '.anim-slide-up',
    '.anim-desvanecer',
    '.anim-cta-slow',
    '.anim-btn-slide',
    '.process-step',
    '.stagger-children'
  ];
  const selectorString = animSelectors.join(',');

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

  document.querySelectorAll(selectorString).forEach(el => observer.observe(el));

  const bodyObserver = new MutationObserver(() => {
    document.querySelectorAll(selectorString).forEach(el => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
}
