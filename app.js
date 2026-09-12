/**
 * Developer Workstation Portfolio Engine
 * Client Architecture, 3D Coverflow, Admin Workstation CMS & Supabase Cloud Sync
 * Author: Pradeep Sankar
 */

(function () {
  'use strict';

  const CONFIG = window.CONFIG || {};

  // Curated Fallback Projects (Real engineering data - renders instantly)
  const curatedProjects = [
    {
      title: "Alpaca AI Trading Agent",
      description: "Automated algorithmic trading system leveraging Alpaca API, real-time market data streaming via WebSockets, and risk-management execution models.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
      tags: ["Node.js", "Express", "Alpaca API", "WebSockets"],
      demo: "https://github.com/pradeepsankar77/alpaca-ai-trading-agent",
      repo: "https://github.com/pradeepsankar77/alpaca-ai-trading-agent"
    },
    {
      title: "AgriLink Smart Cloud Platform",
      description: "Agricultural technology cloud platform featuring IoT sensor synchronization, market pricing analytics, and real-time farmer community exchange.",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop",
      tags: ["React", "Supabase", "PostgreSQL", "Tailwind"],
      demo: "https://github.com/pradeepsankar77/Agrilink",
      repo: "https://github.com/pradeepsankar77/Agrilink"
    },
    {
      title: "Cinematic 3D Developer Workstation",
      description: "Interactive glassmorphic developer portfolio with real 3D perspective depth, WebGL shaders, Three.js viewports, and restrained micro-motion.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
      tags: ["Three.js", "WebGL", "CSS 3D", "Vanilla JS"],
      demo: "https://pradeepsankar77.github.io/pradeep-portfolio/",
      repo: "https://github.com/pradeepsankar77/pradeep-portfolio"
    },
    {
      title: "Enterprise Auth & Data Sync Gateway",
      description: "Scalable backend microservice implementing Row-Level Security, JWT authentication, and bi-directional realtime PostgreSQL subscriptions.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
      tags: ["Node.js", "PostgreSQL", "Supabase", "REST API"],
      demo: "https://github.com/pradeepsankar77",
      repo: "https://github.com/pradeepsankar77"
    }
  ];

  const curatedExperience = [
    {
      role: "Full Stack Software Engineer",
      company: "Independent Projects & Workstation",
      period: "2024 — Present",
      description: "Architected automated trading microservices with Alpaca API, agricultural IoT data pipelines with AgriLink, and 3D WebGL web applications with React, Supabase, and Node.js."
    },
    {
      role: "Frontend & Web Systems Developer",
      company: "Engineering Academia & Innovation Labs",
      period: "2022 — 2024",
      description: "Engineered responsive full stack applications, structured PostgreSQL schemas with Row-Level Security, and crafted accessible user interfaces with glassmorphic design systems."
    }
  ];

  const defaultSkills = [
    { name: "React", level: "SPA Architecture", color: "cyan" },
    { name: "Node.js", level: "API Services", color: "green" },
    { name: "Supabase", level: "PostgreSQL / Auth", color: "green" },
    { name: "JavaScript ES6+", level: "Core Logic", color: "blue" },
    { name: "HTML5 & CSS3", level: "Semantic UI", color: "cyan" },
    { name: "Three.js", level: "WebGL Viewports", color: "blue" },
    { name: "Glassmorphism", level: "Design Language", color: "cyan" },
    { name: "RESTful APIs", level: "System Design", color: "green" }
  ];

  // Primary State
  let portfolioData = {
    name: "Pradeep Sankar",
    title: "Full Stack & 3D Creative Engineer",
    bio: "I craft high-performance web applications, scalable backend systems, and interactive interfaces with modern glassmorphism, responsive systems, and real-time data sync.",
    avatar_url: "IMG_20260528_204530_630.png",
    skills: [...defaultSkills],
    projects: [...curatedProjects],
    experience: [...curatedExperience],
    socials: {
      github: "https://github.com/pradeepsankar77",
      linkedin: "https://linkedin.com",
      email: "pradeepsankar62@gmail.com",
      phone: "+91 7904203805"
    }
  };

  // Load any previously cached edits immediately
  try {
    const cached = localStorage.getItem('portfolio_data_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      portfolioData = { ...portfolioData, ...parsed };
      if (parsed.socials) portfolioData.socials = { ...portfolioData.socials, ...parsed.socials };
    }
  } catch (e) {
    console.warn('Could not parse local cache', e);
  }

  let currentCoverIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Initialize on DOM Ready
  window.addEventListener('DOMContentLoaded', () => {
    initFastLoader();
    renderAllData();
    initParallaxBackground();
    initCoverflowSlider();
    initTerminalAnimation();
    initVanillaTilt();
    initScrollReveal();
    initAdminWorkstation();
    hydrateFromSupabase(); // Non-blocking background hydration
  });

  /* ==========================================================================
     1. MINIMALIST LOADING SCREEN (WITH RUNNING AVATAR: 0% TO 100%)
     ========================================================================== */
  function initFastLoader() {
    const loaderScreen = document.getElementById('loader-screen');
    const progressBar = document.getElementById('loader-progress-bar');
    const percentNum = document.getElementById('loader-percent-num');
    const statusText = document.getElementById('loader-status-text');
    const loaderRunner = document.getElementById('loader-runner');
    const speechBubble = document.getElementById('loader-speech-bubble');

    if (!loaderScreen) return;

    const statuses = [
      { p: 20, t: "booting core engine", speech: "Booting..." },
      { p: 45, t: "loading visual systems", speech: "Running fast! 🏃" },
      { p: 75, t: "mounting 3D workstation", speech: "Almost there..." },
      { p: 95, t: "syncing state cache", speech: "Sprinting to 100%!" },
      { p: 100, t: "ready", speech: "Ready! 🚀" }
    ];

    const startTime = performance.now();
    const duration = 1200; // 1.2s smooth running animation from 0% to 100%

    function step(time) {
      const elapsed = time - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));

      if (progressBar) progressBar.style.width = `${progress}%`;
      if (percentNum) percentNum.textContent = `${String(progress).padStart(2, '0')}%`;

      // Move avatar runner smoothly across track
      if (loaderRunner) {
        loaderRunner.style.left = `${progress}%`;
      }

      const currentStatus = statuses.find(s => progress <= s.p) || statuses[statuses.length - 1];
      if (statusText) statusText.textContent = currentStatus.t;
      if (speechBubble) speechBubble.textContent = currentStatus.speech;

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          loaderScreen.classList.add('fade-out');
          setTimeout(() => {
            loaderScreen.style.display = 'none';
          }, 500);
        }, 160);
      }
    }

    requestAnimationFrame(step);
  }

  /* ==========================================================================
     2. DATA RENDERING (Instantly populates UI, binds all dynamic fields)
     ========================================================================== */
  function renderAllData() {
    // Brand and Titles
    const navBrand = document.getElementById('nav-brand-name');
    if (navBrand && portfolioData.name) navBrand.textContent = portfolioData.name;

    const footerBrand = document.getElementById('footer-brand-name');
    if (footerBrand && portfolioData.name) footerBrand.textContent = portfolioData.name;

    const heroTitle = document.getElementById('hero-title-text');
    if (heroTitle && portfolioData.title) heroTitle.textContent = portfolioData.title;

    // Avatar Image - Sync across hero, loader, and background parallax layers
    const heroAvatar = document.getElementById('hero-avatar');
    if (heroAvatar && portfolioData.avatar_url) {
      heroAvatar.src = portfolioData.avatar_url;
      if (portfolioData.name) heroAvatar.alt = portfolioData.name;
    }

    const loaderAvatar = document.getElementById('loader-avatar-img');
    if (loaderAvatar && portfolioData.avatar_url) {
      loaderAvatar.src = portfolioData.avatar_url;
    }

    const bgAvatarImgs = document.querySelectorAll('.bg-avatar-img, .watermark-img');
    bgAvatarImgs.forEach(img => {
      if (portfolioData.avatar_url) img.src = portfolioData.avatar_url;
    });

    // Bio / Description
    const heroBio = document.getElementById('hero-bio-text');
    if (heroBio && portfolioData.bio) heroBio.textContent = portfolioData.bio;

    const aboutBio = document.getElementById('about-bio-text');
    if (aboutBio && portfolioData.bio) aboutBio.textContent = portfolioData.bio;

    // Contact & Social Coordinates
    const email = (portfolioData.socials && portfolioData.socials.email) || portfolioData.email || 'pradeepsankar62@gmail.com';
    const phone = (portfolioData.socials && portfolioData.socials.phone) || portfolioData.phone || '+91 7904203805';
    const github = (portfolioData.socials && portfolioData.socials.github) || portfolioData.github || 'https://github.com/pradeepsankar77';
    const linkedin = (portfolioData.socials && portfolioData.socials.linkedin) || portfolioData.linkedin || 'https://linkedin.com';

    const heroContactBtn = document.getElementById('hero-cta-contact');
    if (heroContactBtn) heroContactBtn.href = `mailto:${email}`;

    const socialGithub = document.getElementById('social-github');
    if (socialGithub) socialGithub.href = github;

    const socialLinkedin = document.getElementById('social-linkedin');
    if (socialLinkedin) socialLinkedin.href = linkedin;

    const socialEmail = document.getElementById('social-email');
    if (socialEmail) socialEmail.href = `mailto:${email}`;

    const socialPhone = document.getElementById('social-phone');
    if (socialPhone) {
      socialPhone.href = `tel:${phone.replace(/\s+/g, '')}`;
      const phoneSpan = socialPhone.querySelector('span');
      if (phoneSpan) phoneSpan.textContent = phone;
    }

    const contactEmailLink = document.getElementById('contact-email-link');
    if (contactEmailLink) {
      contactEmailLink.href = `mailto:${email}`;
      const emailVal = contactEmailLink.querySelector('.btn-meta-val');
      if (emailVal) emailVal.textContent = email;
    }

    const contactPhoneLink = document.getElementById('contact-phone-link');
    if (contactPhoneLink) {
      contactPhoneLink.href = `tel:${phone.replace(/\s+/g, '')}`;
      const phoneVal = contactPhoneLink.querySelector('.btn-meta-val');
      if (phoneVal) phoneVal.textContent = phone;
    }

    // Complex lists
    renderProjectsCoverflow();
    renderSkillsList();
    renderExperienceTimeline();
  }

  function renderSkillsList() {
    const list = document.getElementById('skills-list');
    if (!list) return;

    const skills = portfolioData.skills && portfolioData.skills.length > 0
      ? portfolioData.skills
      : defaultSkills;

    list.innerHTML = '';
    const colors = ['cyan', 'green', 'blue'];

    skills.forEach((skill, idx) => {
      const name = typeof skill === 'string' ? skill : (skill.name || '');
      const level = typeof skill === 'object' && skill.level ? skill.level : 'Production Competency';
      const color = (typeof skill === 'object' && skill.color) ? skill.color : colors[idx % colors.length];

      const chip = document.createElement('div');
      chip.className = 'glass-skill-chip';
      chip.setAttribute('data-tilt', '');
      chip.setAttribute('data-tilt-max', '14');
      chip.innerHTML = `
        <span class="chip-accent ${color}"></span>
        <span class="chip-name">${escapeHtml(name)}</span>
        <span class="chip-level">${escapeHtml(level)}</span>
      `;
      list.appendChild(chip);
    });

    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(list.querySelectorAll('.glass-skill-chip'), {
        max: 14,
        speed: 350,
        perspective: 1200
      });
    }
  }

  function renderProjectsCoverflow() {
    const track = document.getElementById('projects-list');
    const dotsContainer = document.getElementById('coverflow-dots');
    if (!track) return;

    const projects = portfolioData.projects && portfolioData.projects.length > 0 
      ? portfolioData.projects 
      : curatedProjects;

    track.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    projects.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'coverflow-card glass-surface';
      card.setAttribute('data-index', idx);

      const tags = Array.isArray(proj.tags) ? proj.tags : (typeof proj.tags === 'string' ? proj.tags.split(',').map(t => t.trim()) : []);
      const tagsHtml = tags.map(tag => `<span class="card-tag">${escapeHtml(tag)}</span>`).join('');
      const demoLink = proj.demo || proj.link || '#';
      const repoLink = proj.repo || 'https://github.com/pradeepsankar77';

      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${escapeHtml(proj.image || '')}" alt="${escapeHtml(proj.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop'">
          <div class="card-img-overlay"></div>
        </div>
        <div class="card-content">
          <div class="card-tags">${tagsHtml}</div>
          <h3 class="card-title">${escapeHtml(proj.title)}</h3>
          <p class="card-desc">${escapeHtml(proj.description || '')}</p>
          <div class="card-actions">
            <a href="${escapeHtml(demoLink)}" target="_blank" rel="noopener" class="card-btn primary">
              <span>Launch Demo</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
            <a href="${escapeHtml(repoLink)}" target="_blank" rel="noopener" class="card-btn secondary">
              <span>Code</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (idx !== currentCoverIndex) {
          goToSlide(idx);
        }
      });

      track.appendChild(card);

      if (dotsContainer) {
        const dot = document.createElement('div');
        dot.className = `coverflow-dot ${idx === currentCoverIndex ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      }
    });

    updateCoverflowClasses();
  }

  function renderExperienceTimeline() {
    const list = document.getElementById('experience-list');
    if (!list) return;

    const items = portfolioData.experience && portfolioData.experience.length > 0 
      ? portfolioData.experience 
      : curatedExperience;

    list.innerHTML = '';
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'timeline-item glass-surface';
      el.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-header">
          <div>
            <span class="timeline-role">${escapeHtml(item.role)}</span>
            <span class="timeline-company">${escapeHtml(item.company)}</span>
          </div>
          <span class="timeline-period">${escapeHtml(item.period)}</span>
        </div>
        <p class="timeline-desc">${escapeHtml(item.description)}</p>
      `;
      list.appendChild(el);
    });
  }

  /* ==========================================================================
     PARALLAX 3D BACKGROUND AVATAR INTERACTION
     ========================================================================== */
  function initParallaxBackground() {
    const orb1 = document.getElementById('bg-parallax-avatar-1');
    const orb2 = document.getElementById('bg-parallax-avatar-2');
    const watermark = document.getElementById('bg-parallax-watermark');

    if (!orb1 && !orb2 && !watermark) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentScrollY = window.pageYOffset || 0;
    let ticking = false;

    function updateParallax() {
      // 1. Vertical scroll parallax & 3D tilt
      if (orb1) {
        const y1 = currentScrollY * 0.16 + (mouseY * 0.025);
        const x1 = mouseX * 0.02;
        const rot1 = Math.sin(currentScrollY * 0.002) * 4;
        orb1.style.transform = `translate3d(${x1}px, ${y1}px, 0) rotate(${rot1}deg)`;
      }

      if (orb2) {
        const y2 = (currentScrollY * -0.1) - (mouseY * 0.018);
        const x2 = -mouseX * 0.018;
        const rot2 = Math.cos(currentScrollY * 0.002) * -3;
        orb2.style.transform = `translate3d(${x2}px, ${y2}px, 0) rotate(${rot2}deg)`;
      }

      if (watermark) {
        const yW = currentScrollY * 0.07;
        const scaleW = 1 + Math.min(0.18, currentScrollY * 0.0001);
        watermark.style.transform = `translate(-50%, ${yW}px) scale(${scaleW})`;
      }

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', () => {
      currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      requestTick();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = e.clientX - halfW;
      mouseY = e.clientY - halfH;
      requestTick();
    }, { passive: true });

    updateParallax();
  }

  /* ==========================================================================
     3. 3D COVERFLOW PROJECT SLIDER LOGIC
     ========================================================================== */
  function initCoverflowSlider() {
    const btnPrev = document.getElementById('btn-coverflow-prev');
    const btnNext = document.getElementById('btn-coverflow-next');
    const wrapper = document.getElementById('coverflow-wrapper');

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        const count = getProjectsCount();
        if (count > 0) goToSlide((currentCoverIndex - 1 + count) % count);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const count = getProjectsCount();
        if (count > 0) goToSlide((currentCoverIndex + 1) % count);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const count = getProjectsCount();
        if (count > 0) goToSlide((currentCoverIndex - 1 + count) % count);
      } else if (e.key === 'ArrowRight') {
        const count = getProjectsCount();
        if (count > 0) goToSlide((currentCoverIndex + 1) % count);
      }
    });

    if (wrapper) {
      wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }
  }

  function handleSwipe() {
    const threshold = 40;
    const count = getProjectsCount();
    if (count <= 0) return;
    if (touchEndX < touchStartX - threshold) {
      goToSlide((currentCoverIndex + 1) % count);
    } else if (touchEndX > touchStartX + threshold) {
      goToSlide((currentCoverIndex - 1 + count) % count);
    }
  }

  function getProjectsCount() {
    return (portfolioData.projects && portfolioData.projects.length) || curatedProjects.length;
  }

  function goToSlide(idx) {
    const count = getProjectsCount();
    if (count === 0) return;
    currentCoverIndex = Math.max(0, Math.min(idx, count - 1));
    updateCoverflowClasses();
  }

  function updateCoverflowClasses() {
    const cards = document.querySelectorAll('.coverflow-card');
    const dots = document.querySelectorAll('.coverflow-dot');
    const total = cards.length;
    if (total === 0) return;

    cards.forEach((card, idx) => {
      card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

      const diff = idx - currentCoverIndex;

      if (diff === 0) {
        card.classList.add('active');
      } else if (diff === -1 || (diff === total - 1 && total > 2)) {
        card.classList.add('prev');
      } else if (diff === 1 || (diff === -(total - 1) && total > 2)) {
        card.classList.add('next');
      } else if (diff < -1) {
        card.classList.add('far-prev');
      } else if (diff > 1) {
        card.classList.add('far-next');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentCoverIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     4. ANIMATED DEVELOPER TERMINAL CARD
     ========================================================================== */
  function initTerminalAnimation() {
    // Retain clean terminal layout with responsive state
  }

  /* ==========================================================================
     5. VANILLA TILT & 3D RESTRAINT
     ========================================================================== */
  function initVanillaTilt() {
    if (typeof VanillaTilt === 'undefined') return;

    VanillaTilt.init(document.querySelectorAll('.cinematic-photo-wrapper'), {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.25,
      perspective: 1000
    });

    VanillaTilt.init(document.querySelectorAll('.terminal-card'), {
      max: 8,
      speed: 400,
      perspective: 1000
    });

    VanillaTilt.init(document.querySelectorAll('.focus-card, .glass-skill-chip, .contact-card'), {
      max: 8,
      speed: 350,
      perspective: 1200
    });
  }

  /* ==========================================================================
     6. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(s => {
      s.classList.add('scroll-reveal');
      observer.observe(s);
    });
  }

  /* ==========================================================================
     7. ASYNCHRONOUS SUPABASE HYDRATION (GRACEFUL FALLBACK)
     ========================================================================== */
  async function hydrateFromSupabase() {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY || typeof supabase === 'undefined') {
      return;
    }

    try {
      const client = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      const { data, error } = await client.from('portfolio_data').select('*').single();

      if (!error && data) {
        if (data.name) portfolioData.name = data.name;
        if (data.title) portfolioData.title = data.title;
        if (data.bio) portfolioData.bio = data.bio;
        if (data.avatar_url) portfolioData.avatar_url = data.avatar_url;

        if (Array.isArray(data.skills) && data.skills.length > 0) {
          portfolioData.skills = data.skills;
        }
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          portfolioData.projects = data.projects;
        }
        if (Array.isArray(data.experience) && data.experience.length > 0) {
          portfolioData.experience = data.experience;
        }
        if (data.socials && typeof data.socials === 'object') {
          portfolioData.socials = { ...portfolioData.socials, ...data.socials };
        }

        // Cache cloud state locally
        localStorage.setItem('portfolio_data_cache', JSON.stringify(portfolioData));
        renderAllData();

        // Update admin inputs if open
        const editorPanel = document.getElementById('editor-panel');
        if (editorPanel && editorPanel.style.display !== 'none') {
          populateAdminForm();
        }

        const dot = document.getElementById('db-status-dot');
        const statusText = document.getElementById('db-status-text');
        if (dot) {
          dot.className = 'status-dot-active';
        }
        if (statusText) statusText.textContent = 'Supabase Synced';
      }
    } catch (err) {
      console.log('Workstation data active (offline or uninitialized table).');
    }
  }

  /* ==========================================================================
     8. ADMIN WORKSTATION CMS CONTROLLER (Full CRUD & Cloud Sync)
     ========================================================================== */
  function initAdminWorkstation() {
    const adminDrawer = document.getElementById('admin-drawer');
    const btnClose = document.getElementById('btn-drawer-close');
    const btnLock = document.getElementById('btn-admin-lock');
    const btnAuth = document.getElementById('btn-auth-submit');
    const secretInput = document.getElementById('admin-secret-input');
    const authPanel = document.getElementById('auth-panel');
    const editorPanel = document.getElementById('editor-panel');
    const btnTogglePassword = document.getElementById('btn-toggle-password');
    const navAdminBtn = document.getElementById('nav-admin-btn');
    const footerAdminLink = document.getElementById('footer-admin-link');

    const ADMIN_PASSCODE = 'pradeep@2007';

    // Direct click listeners for Admin buttons
    if (navAdminBtn) {
      navAdminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#admin';
        if (adminDrawer) adminDrawer.style.display = 'flex';
        checkAdminState();
      });
    }

    if (footerAdminLink) {
      footerAdminLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#admin';
        if (adminDrawer) adminDrawer.style.display = 'flex';
        checkAdminState();
      });
    }

    // Routing & Display Handler
    function checkAdminState() {
      const isAuth = localStorage.getItem('admin_authorized') === 'true' && localStorage.getItem('admin_passcode') === ADMIN_PASSCODE;
      if (isAuth) {
        if (authPanel) authPanel.style.display = 'none';
        if (editorPanel) editorPanel.style.display = 'flex';
        if (btnLock) btnLock.style.display = 'inline-flex';
        populateAdminForm();
      } else {
        if (authPanel) authPanel.style.display = 'block';
        if (editorPanel) editorPanel.style.display = 'none';
        if (btnLock) btnLock.style.display = 'none';
      }
    }

    function checkAdminHash() {
      if (window.location.hash === '#admin') {
        if (adminDrawer) adminDrawer.style.display = 'flex';
        checkAdminState();
      } else {
        if (adminDrawer) adminDrawer.style.display = 'none';
      }
    }

    window.addEventListener('hashchange', checkAdminHash);
    checkAdminHash();

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        window.location.hash = '';
      });
    }

    if (btnLock) {
      btnLock.addEventListener('click', () => {
        localStorage.removeItem('admin_authorized');
        localStorage.removeItem('admin_passcode');
        if (editorPanel) editorPanel.style.display = 'none';
        if (authPanel) authPanel.style.display = 'block';
        if (btnLock) btnLock.style.display = 'none';
        if (secretInput) {
          secretInput.value = '';
          secretInput.focus();
        }
        alert('🔒 Admin workstation locked.');
      });
    }

    if (btnTogglePassword && secretInput) {
      btnTogglePassword.addEventListener('click', () => {
        secretInput.type = secretInput.type === 'password' ? 'text' : 'password';
      });
    }

    if (btnAuth && secretInput) {
      const unlockHandler = () => {
        const entered = secretInput.value.trim();
        const authErr = document.getElementById('auth-error-msg');
        
        if (entered === ADMIN_PASSCODE) {
          if (authErr) authErr.style.display = 'none';
          localStorage.setItem('admin_authorized', 'true');
          localStorage.setItem('admin_passcode', ADMIN_PASSCODE);
          if (authPanel) authPanel.style.display = 'none';
          if (editorPanel) editorPanel.style.display = 'flex';
          if (btnLock) btnLock.style.display = 'inline-flex';
          populateAdminForm();
          showAdminNotice('🎉 Admin workstation unlocked. You can now edit and sync any section.', 'success');
        } else {
          if (authErr) {
            authErr.style.display = 'block';
            setTimeout(() => {
              authErr.style.display = 'none';
            }, 5000);
          } else {
            alert('Access Denied: Incorrect password.');
          }
          secretInput.value = '';
          secretInput.focus();
        }
      };

      btnAuth.addEventListener('click', unlockHandler);
      secretInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') unlockHandler();
      });
    }

    // Bind Admin Interactive Controls
    bindProfileAvatarControls();
    bindProjectsAdminControls();
    bindSkillsAdminControls();
    bindExperienceAdminControls();
    bindSqlCopyButton();
    bindGlobalSaveButtons();
  }

  // Populate Admin Inputs from State
  function populateAdminForm() {
    const editName = document.getElementById('edit-name');
    const editTitle = document.getElementById('edit-title');
    const editAvatar = document.getElementById('edit-avatar');
    const editAvatarPreview = document.getElementById('edit-avatar-preview');
    const editBio = document.getElementById('edit-bio');
    const editEmail = document.getElementById('edit-email');
    const editPhone = document.getElementById('edit-phone');
    const editGithub = document.getElementById('edit-github');
    const editLinkedin = document.getElementById('edit-linkedin');

    if (editName) editName.value = portfolioData.name || '';
    if (editTitle) editTitle.value = portfolioData.title || '';
    if (editAvatar) editAvatar.value = portfolioData.avatar_url || '';
    if (editAvatarPreview) editAvatarPreview.src = portfolioData.avatar_url || 'IMG_20260528_204530_630.png';
    if (editBio) editBio.value = portfolioData.bio || '';

    const socials = portfolioData.socials || {};
    if (editEmail) editEmail.value = socials.email || portfolioData.email || '';
    if (editPhone) editPhone.value = socials.phone || portfolioData.phone || '';
    if (editGithub) editGithub.value = socials.github || portfolioData.github || '';
    if (editLinkedin) editLinkedin.value = socials.linkedin || portfolioData.linkedin || '';

    renderAdminProjectsList();
    renderAdminSkillsList();
    renderAdminExperienceList();
  }

  // 1. Profile & Avatar Controls (Supports URL & Local File Upload via Base64)
  function bindProfileAvatarControls() {
    const editAvatar = document.getElementById('edit-avatar');
    const fileUpload = document.getElementById('avatar-file-upload');
    const preview = document.getElementById('edit-avatar-preview');

    if (editAvatar && preview) {
      editAvatar.addEventListener('input', () => {
        const val = editAvatar.value.trim();
        if (val) preview.src = val;
      });
    }

    if (fileUpload && editAvatar && preview) {
      fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (< 2MB recommended for database JSON)
        if (file.size > 2.5 * 1024 * 1024) {
          alert('Image size is large. For fast performance, please select an image under 2MB.');
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          const base64Url = event.target.result;
          editAvatar.value = base64Url;
          preview.src = base64Url;
          showAdminNotice('Photo uploaded! Click "Save to Supabase" to apply changes.', 'success');
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // 2. Projects Admin Management (Add, Edit, Delete)
  function bindProjectsAdminControls() {
    const btnToggleAdd = document.getElementById('btn-toggle-add-project');
    const formContainer = document.getElementById('project-form-container');
    const formTitle = document.getElementById('project-form-title');
    const formIndex = document.getElementById('project-form-index');
    const btnCancel = document.getElementById('btn-cancel-project-entry');
    const btnSave = document.getElementById('btn-save-project-entry');

    const inputTitle = document.getElementById('proj-input-title');
    const inputDesc = document.getElementById('proj-input-desc');
    const inputImage = document.getElementById('proj-input-image');
    const inputTags = document.getElementById('proj-input-tags');
    const inputDemo = document.getElementById('proj-input-demo');
    const inputRepo = document.getElementById('proj-input-repo');

    if (btnToggleAdd && formContainer) {
      btnToggleAdd.addEventListener('click', () => {
        const isHidden = formContainer.style.display === 'none';
        formContainer.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          formTitle.textContent = 'New Project Entry';
          formIndex.value = '-1';
          if (inputTitle) inputTitle.value = '';
          if (inputDesc) inputDesc.value = '';
          if (inputImage) inputImage.value = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop';
          if (inputTags) inputTags.value = 'React, Node.js';
          if (inputDemo) inputDemo.value = '';
          if (inputRepo) inputRepo.value = '';
          if (inputTitle) inputTitle.focus();
        }
      });
    }

    if (btnCancel && formContainer) {
      btnCancel.addEventListener('click', () => {
        formContainer.style.display = 'none';
      });
    }

    if (btnSave && formContainer) {
      btnSave.addEventListener('click', () => {
        const title = inputTitle ? inputTitle.value.trim() : '';
        if (!title) {
          alert('Project title is required.');
          return;
        }

        const tagsRaw = inputTags ? inputTags.value.trim() : '';
        const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

        const projectItem = {
          title,
          description: inputDesc ? inputDesc.value.trim() : '',
          image: inputImage && inputImage.value.trim() ? inputImage.value.trim() : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
          tags: tags.length > 0 ? tags : ['Web Development'],
          demo: inputDemo ? inputDemo.value.trim() : '#',
          repo: inputRepo ? inputRepo.value.trim() : 'https://github.com/pradeepsankar77'
        };

        const editIdx = parseInt(formIndex.value, 10);
        if (editIdx >= 0 && editIdx < portfolioData.projects.length) {
          portfolioData.projects[editIdx] = projectItem;
          showAdminNotice(`Updated project: "${title}"`, 'success');
        } else {
          portfolioData.projects.unshift(projectItem);
          showAdminNotice(`Added project: "${title}"`, 'success');
        }

        formContainer.style.display = 'none';
        renderAdminProjectsList();
        renderProjectsCoverflow();
      });
    }
  }

  function renderAdminProjectsList() {
    const list = document.getElementById('admin-projects-list');
    if (!list) return;

    list.innerHTML = '';
    const projects = portfolioData.projects || [];

    if (projects.length === 0) {
      list.innerHTML = '<div style="font-size: 12px; color: var(--muted); padding: 8px;">No projects added yet.</div>';
      return;
    }

    projects.forEach((proj, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-info">
          <span class="admin-item-title">${escapeHtml(proj.title)}</span>
          <span class="admin-item-meta">${Array.isArray(proj.tags) ? escapeHtml(proj.tags.join(', ')) : ''}</span>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-mini btn-edit-proj" data-index="${idx}">Edit</button>
          <button type="button" class="btn-mini danger btn-del-proj" data-index="${idx}">Delete</button>
        </div>
      `;

      // Edit Project
      row.querySelector('.btn-edit-proj').addEventListener('click', () => {
        const formContainer = document.getElementById('project-form-container');
        const formTitle = document.getElementById('project-form-title');
        const formIndex = document.getElementById('project-form-index');
        const inputTitle = document.getElementById('proj-input-title');
        const inputDesc = document.getElementById('proj-input-desc');
        const inputImage = document.getElementById('proj-input-image');
        const inputTags = document.getElementById('proj-input-tags');
        const inputDemo = document.getElementById('proj-input-demo');
        const inputRepo = document.getElementById('proj-input-repo');

        formIndex.value = idx;
        formTitle.textContent = `Edit Project: ${proj.title}`;
        if (inputTitle) inputTitle.value = proj.title || '';
        if (inputDesc) inputDesc.value = proj.description || '';
        if (inputImage) inputImage.value = proj.image || '';
        if (inputTags) inputTags.value = Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.tags || '');
        if (inputDemo) inputDemo.value = proj.demo || '';
        if (inputRepo) inputRepo.value = proj.repo || '';

        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      // Delete Project
      row.querySelector('.btn-del-proj').addEventListener('click', () => {
        if (confirm(`Delete project "${proj.title}"?`)) {
          portfolioData.projects.splice(idx, 1);
          renderAdminProjectsList();
          renderProjectsCoverflow();
          showAdminNotice(`Deleted project "${proj.title}".`, 'success');
        }
      });

      list.appendChild(row);
    });
  }

  // 3. Skills Admin Management (Pills with Delete & Add)
  function bindSkillsAdminControls() {
    const inputSkill = document.getElementById('input-new-skill');
    const btnAddSkill = document.getElementById('btn-add-skill-item');

    const addSkillAction = () => {
      const val = inputSkill ? inputSkill.value.trim() : '';
      if (!val) return;

      const colors = ['cyan', 'green', 'blue'];
      const color = colors[portfolioData.skills.length % colors.length];

      portfolioData.skills.push({
        name: val,
        level: "Technical Competency",
        color: color
      });

      inputSkill.value = '';
      renderAdminSkillsList();
      renderSkillsList();
      showAdminNotice(`Added skill: "${val}"`, 'success');
    };

    if (btnAddSkill) btnAddSkill.addEventListener('click', addSkillAction);
    if (inputSkill) {
      inputSkill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addSkillAction();
        }
      });
    }
  }

  function renderAdminSkillsList() {
    const container = document.getElementById('admin-skills-container');
    if (!container) return;

    container.innerHTML = '';
    const skills = portfolioData.skills || [];

    skills.forEach((skill, idx) => {
      const name = typeof skill === 'string' ? skill : (skill.name || '');
      const pill = document.createElement('span');
      pill.className = 'admin-skill-pill';
      pill.innerHTML = `
        <span>${escapeHtml(name)}</span>
        <button type="button" class="pill-remove-btn" title="Remove">&times;</button>
      `;

      pill.querySelector('.pill-remove-btn').addEventListener('click', () => {
        portfolioData.skills.splice(idx, 1);
        renderAdminSkillsList();
        renderSkillsList();
        showAdminNotice(`Removed skill "${name}".`, 'success');
      });

      container.appendChild(pill);
    });
  }

  // 4. Experience Admin Management (Add, Delete)
  function bindExperienceAdminControls() {
    const btnToggle = document.getElementById('btn-toggle-add-exp');
    const container = document.getElementById('exp-form-container');
    const btnCancel = document.getElementById('btn-cancel-exp-entry');
    const btnSave = document.getElementById('btn-save-exp-entry');

    const inputRole = document.getElementById('exp-input-role');
    const inputCompany = document.getElementById('exp-input-company');
    const inputPeriod = document.getElementById('exp-input-period');
    const inputDesc = document.getElementById('exp-input-desc');

    if (btnToggle && container) {
      btnToggle.addEventListener('click', () => {
        const isHidden = container.style.display === 'none';
        container.style.display = isHidden ? 'block' : 'none';
        if (isHidden && inputRole) inputRole.focus();
      });
    }

    if (btnCancel && container) {
      btnCancel.addEventListener('click', () => {
        container.style.display = 'none';
      });
    }

    if (btnSave && container) {
      btnSave.addEventListener('click', () => {
        const role = inputRole ? inputRole.value.trim() : '';
        const company = inputCompany ? inputCompany.value.trim() : '';
        const period = inputPeriod ? inputPeriod.value.trim() : '';
        const desc = inputDesc ? inputDesc.value.trim() : '';

        if (!role || !company) {
          alert('Role and Company are required.');
          return;
        }

        portfolioData.experience.unshift({
          role,
          company,
          period: period || 'Present',
          description: desc
        });

        if (inputRole) inputRole.value = '';
        if (inputCompany) inputCompany.value = '';
        if (inputPeriod) inputPeriod.value = '';
        if (inputDesc) inputDesc.value = '';

        container.style.display = 'none';
        renderAdminExperienceList();
        renderExperienceTimeline();
        showAdminNotice(`Added experience milestone: "${role}"`, 'success');
      });
    }
  }

  function renderAdminExperienceList() {
    const list = document.getElementById('admin-experience-list');
    if (!list) return;

    list.innerHTML = '';
    const items = portfolioData.experience || [];

    if (items.length === 0) {
      list.innerHTML = '<div style="font-size: 12px; color: var(--muted); padding: 8px;">No experience entries.</div>';
      return;
    }

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'admin-item-row';
      row.innerHTML = `
        <div class="admin-item-info">
          <span class="admin-item-title">${escapeHtml(item.role)}</span>
          <span class="admin-item-meta">${escapeHtml(item.company)} &bull; ${escapeHtml(item.period)}</span>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-mini danger btn-del-exp" data-index="${idx}">Delete</button>
        </div>
      `;

      row.querySelector('.btn-del-exp').addEventListener('click', () => {
        if (confirm(`Delete milestone "${item.role} at ${item.company}"?`)) {
          portfolioData.experience.splice(idx, 1);
          renderAdminExperienceList();
          renderExperienceTimeline();
          showAdminNotice(`Deleted experience milestone.`, 'success');
        }
      });

      list.appendChild(row);
    });
  }

  // 5. Database SQL Setup Assistant (1-Click Copy)
  function bindSqlCopyButton() {
    const btnCopy = document.getElementById('btn-copy-sql');
    if (!btnCopy) return;

    const sqlScript = `-- Supabase Schema for Pradeep Sankar's Portfolio
-- Project: mvslanzuxigqrzsycmfw
CREATE TABLE IF NOT EXISTS public.portfolio_data (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Pradeep Sankar',
  title TEXT DEFAULT 'Full Stack & 3D Creative Engineer',
  bio TEXT DEFAULT 'I craft high-performance web applications, scalable backend systems, and interactive interfaces with modern glassmorphism, responsive systems, and real-time data sync.',
  avatar_url TEXT DEFAULT 'IMG_20260528_204530_630.png',
  skills JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  socials JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.portfolio_data (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select policy" ON public.portfolio_data;
CREATE POLICY "Public select policy" ON public.portfolio_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert policy" ON public.portfolio_data;
CREATE POLICY "Public insert policy" ON public.portfolio_data FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update policy" ON public.portfolio_data;
CREATE POLICY "Public update policy" ON public.portfolio_data FOR UPDATE USING (true) WITH CHECK (true);
`;

    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(sqlScript).then(() => {
        const origText = btnCopy.innerHTML;
        btnCopy.innerHTML = '✅ SQL Copied to Clipboard!';
        showAdminNotice('SQL setup script copied! Paste it in your Supabase SQL Editor and click Run.', 'success');
        setTimeout(() => {
          btnCopy.innerHTML = origText;
        }, 3000);
      }).catch(() => {
        alert('Could not copy automatically. Please open supabase_schema.sql in your workspace.');
      });
    });
  }

  // 6. Global Save Button (Saves all inputs to local cache and Supabase cloud)
  function bindGlobalSaveButtons() {
    const saveTop = document.getElementById('btn-global-save');
    const saveBottom = document.getElementById('btn-global-save-bottom');

    const executeGlobalSave = async () => {
      // 1. Gather all inputs
      const editName = document.getElementById('edit-name');
      const editTitle = document.getElementById('edit-title');
      const editAvatar = document.getElementById('edit-avatar');
      const editBio = document.getElementById('edit-bio');
      const editEmail = document.getElementById('edit-email');
      const editPhone = document.getElementById('edit-phone');
      const editGithub = document.getElementById('edit-github');
      const editLinkedin = document.getElementById('edit-linkedin');

      if (editName && editName.value.trim()) portfolioData.name = editName.value.trim();
      if (editTitle && editTitle.value.trim()) portfolioData.title = editTitle.value.trim();
      if (editAvatar && editAvatar.value.trim()) portfolioData.avatar_url = editAvatar.value.trim();
      if (editBio && editBio.value.trim()) portfolioData.bio = editBio.value.trim();

      portfolioData.socials = {
        email: editEmail ? editEmail.value.trim() : (portfolioData.socials.email || ''),
        phone: editPhone ? editPhone.value.trim() : (portfolioData.socials.phone || ''),
        github: editGithub ? editGithub.value.trim() : (portfolioData.socials.github || ''),
        linkedin: editLinkedin ? editLinkedin.value.trim() : (portfolioData.socials.linkedin || '')
      };

      // 2. Persist instantly in local storage cache
      localStorage.setItem('portfolio_data_cache', JSON.stringify(portfolioData));

      // 3. Update public DOM immediately
      renderAllData();

      // 4. Push to Supabase Cloud
      const dot = document.getElementById('db-status-dot');
      const statusText = document.getElementById('db-status-text');

      if (statusText) statusText.textContent = 'Saving to Supabase...';

      if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY || typeof supabase === 'undefined') {
        showAdminNotice('Saved locally! Supabase configuration is pending.', 'success');
        if (statusText) statusText.textContent = 'Saved Locally';
        return;
      }

      try {
        const client = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        
        const payload = {
          id: 1,
          name: portfolioData.name,
          title: portfolioData.title,
          bio: portfolioData.bio,
          avatar_url: portfolioData.avatar_url,
          skills: portfolioData.skills,
          projects: portfolioData.projects,
          experience: portfolioData.experience,
          socials: portfolioData.socials,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await client
          .from('portfolio_data')
          .upsert(payload);

        if (error) {
          console.warn('Supabase sync notice:', error.message);
          if (dot) dot.className = 'status-dot-warning';
          if (statusText) statusText.textContent = 'Saved Locally (Cloud Pending)';
          showAdminNotice(`Changes saved locally! Cloud sync pending: ${error.message}. If table isn't created yet, copy the SQL script below and run it in your Supabase SQL Editor.`, 'error');
        } else {
          if (dot) dot.className = 'status-dot-active';
          if (statusText) statusText.textContent = 'Synced to Supabase Cloud';
          showAdminNotice('🎉 Success! All portfolio data saved locally and synced to Supabase database.', 'success');
        }
      } catch (err) {
        console.error('Supabase error:', err);
        if (dot) dot.className = 'status-dot-warning';
        if (statusText) statusText.textContent = 'Saved Locally';
        showAdminNotice('Saved locally! Cloud sync error: ' + err.message, 'error');
      }
    };

    if (saveTop) saveTop.addEventListener('click', executeGlobalSave);
    if (saveBottom) saveBottom.addEventListener('click', executeGlobalSave);
  }

  // Admin Notification Banner
  function showAdminNotice(msg, type) {
    const alertBox = document.getElementById('admin-alert-msg');
    if (!alertBox) return;

    alertBox.className = `admin-alert ${type}`;
    alertBox.textContent = msg;
    alertBox.style.display = 'block';

    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 6000);
  }

  // HTML Entity Escaping
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
