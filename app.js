const CONFIG = window.CONFIG;
// Local Fallback Portfolio Data (Seed)
const defaultPortfolio = {
  name: "Pradeep Sankar",
  title: "Full Stack Developer & UI/UX Designer",
  bio: "I build high-performance, visually stunning web applications with modern design systems and robust backend integrations.",
  avatar_url: "https://i.ibb.co/208gPZKB/IMG-20260528-204530-630.png",
  skills: ["JavaScript", "HTML5 & CSS3", "React", "Node.js", "Supabase", "UI/UX Design"],
  projects: [
    {
      title: "Aesthetic E-Commerce",
      description: "A glassmorphism-themed online store with real-time checkout.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
      tags: ["React", "Supabase", "CSS Modules"],
      link: "#"
    },
    {
      title: "Crypto Dashboard",
      description: "Real-time cryptocurrency analytics tool featuring high-end charts.",
      image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&auto=format&fit=crop",
      tags: ["Vanilla JS", "Chart.js", "API"],
      link: "#"
    }
  ],
  experience: [
    {
      role: "Lead Frontend Developer",
      company: "DesignSphere Studio",
      period: "2024 - Present",
      description: "Architected premium web applications using modern styling systems and oversaw frontend design QA."
    },
    {
      role: "Full Stack Engineer",
      company: "CloudSoft Solutions",
      period: "2022 - 2024",
      description: "Integrated database systems, implemented serverless functions, and crafted responsive user interfaces."
    }
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "pradeepsankar62@gmail.com",
    phone: "7904203805"
  }
};
let portfolioData = { ...defaultPortfolio };
let secretKey = localStorage.getItem('admin_secret') || '';
let supabaseAnonClient = null;
// DOM Elements
const elements = {
  // View elements
  heroName: document.getElementById('hero-name'),
  heroTitle: document.getElementById('hero-title-text'),
  heroBio: document.getElementById('hero-bio-text'),
  heroAvatar: document.getElementById('hero-avatar'),
  aboutBio: document.getElementById('about-bio-text'),
  skillsList: document.getElementById('skills-list'),
  projectsList: document.getElementById('projects-list'),
  experienceList: document.getElementById('experience-list'),
  socialGithub: document.getElementById('social-github'),
  socialLinkedin: document.getElementById('social-linkedin'),
  socialTwitter: document.getElementById('social-twitter'),
  socialEmail: document.getElementById('social-email'),
  contactPhone: document.getElementById('contact-phone'),
  contactEmail: document.getElementById('contact-email'),
  
  // Navigation
  navLinks: document.querySelectorAll('.nav-links a'),
  logo: document.getElementById('nav-logo'),
  
  // Admin Drawer
  btnAdminToggle: document.getElementById('btn-admin-toggle'),
  adminBadge: document.getElementById('admin-badge'),
  adminDrawer: document.getElementById('admin-drawer'),
  btnDrawerClose: document.getElementById('btn-drawer-close'),
  authPanel: document.getElementById('auth-panel'),
  editorPanel: document.getElementById('editor-panel'),
  adminSecretInput: document.getElementById('admin-secret-input'),
  btnAuthSubmit: document.getElementById('btn-auth-submit'),
  btnAdminLogout: document.getElementById('btn-admin-logout'),
  btnSaveAll: document.getElementById('btn-save-all'),
  
  // Profile Editor Inputs
  editName: document.getElementById('edit-name'),
  editTitle: document.getElementById('edit-title'),
  editAvatar: document.getElementById('edit-avatar'),
  editBio: document.getElementById('edit-bio'),
  editGithub: document.getElementById('edit-github'),
  editLinkedin: document.getElementById('edit-linkedin'),
  editTwitter: document.getElementById('edit-twitter'),
  editEmail: document.getElementById('edit-email'),
  editPhone: document.getElementById('edit-phone'),
  
  // List Editor containers
  adminSkillsList: document.getElementById('admin-skills-list'),
  adminProjectsList: document.getElementById('admin-projects-list'),
  adminExperienceList: document.getElementById('admin-experience-list'),
  
  // Add item buttons
  btnAddSkill: document.getElementById('btn-add-skill'),
  btnAddProject: document.getElementById('btn-add-project'),
  btnAddExperience: document.getElementById('btn-add-experience'),
  
  // Modals
  projectModal: document.getElementById('project-modal'),
  modalProjIndex: document.getElementById('modal-project-index'),
  modalProjTitle: document.getElementById('modal-project-title'),
  modalProjDesc: document.getElementById('modal-project-desc'),
  modalProjImage: document.getElementById('modal-project-image'),
  modalProjTags: document.getElementById('modal-project-tags'),
  modalProjLink: document.getElementById('modal-project-link'),
  btnModalProjCancel: document.getElementById('btn-modal-project-cancel'),
  btnModalProjSave: document.getElementById('btn-modal-project-save'),
  
  experienceModal: document.getElementById('experience-modal'),
  modalExpIndex: document.getElementById('modal-experience-index'),
  modalExpRole: document.getElementById('modal-experience-role'),
  modalExpCompany: document.getElementById('modal-experience-company'),
  modalExpPeriod: document.getElementById('modal-experience-period'),
  modalExpDesc: document.getElementById('modal-experience-desc'),
  btnModalExpCancel: document.getElementById('btn-modal-experience-cancel'),
  btnModalExpSave: document.getElementById('btn-modal-experience-save'),
};
document.addEventListener('DOMContentLoaded', () => {
  setupInteractiveGlow();
  setupNavScroll();
  initSupabase();
  setupAdminEvents();
  setupScrollReveal();
});
// 1. Mouse Glow Effect (Glowmorphism UX)
function setupInteractiveGlow() {
  const glow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  
  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}
// 1.1 Scroll Reveal Observer (UX Animation)
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.05 });
  
  // Apply scroll reveal class and observe individual cards and items only
  setTimeout(() => {
    document.querySelectorAll('.project-card, .timeline-item').forEach(el => {
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });
  }, 100);
}
// 2. Navigation Highlighting & Auto scroll
function setupNavScroll() {
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    elements.navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href').slice(1) === current) {
        a.classList.add('active');
      }
    });
  });
  
  elements.logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
// 3. Supabase Database Integrations
async function initSupabase() {
  try {
    // Initialise Supabase Anon Client
    if (window.supabase) {
      supabaseAnonClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
      await fetchPortfolioData();
    } else {
      console.warn("Supabase SDK script not loaded. Running in offline/fallback mode.");
      renderPortfolio();
    }
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
    renderPortfolio();
  }
}
async function fetchPortfolioData() {
  if (!supabaseAnonClient) return;
  
  try {
    const { data, error } = await supabaseAnonClient
      .from('portfolio')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (error) {
      // 404/PGRST205 indicates table does not exist or empty row.
      console.warn("Supabase fetch returned error (database may not be set up yet):", error.message);
      portfolioData = { ...defaultPortfolio };
    } else if (data) {
      portfolioData = data;
      console.log("Successfully fetched portfolio data from Supabase backend.");
    }
  } catch (err) {
    console.error("Error reading database:", err);
    portfolioData = { ...defaultPortfolio };
  } finally {
    renderPortfolio();
  }
}
// 4. Render UI Elements Dynamically
function renderPortfolio() {
  // Main Texts
  elements.heroName.textContent = portfolioData.name || 'Pradeep Sankar';
  elements.heroTitle.textContent = portfolioData.title || '';
  elements.heroBio.textContent = portfolioData.bio || '';
  elements.aboutBio.textContent = portfolioData.bio || '';
  
  // Avatar
  if (portfolioData.avatar_url) {
    elements.heroAvatar.src = portfolioData.avatar_url;
  }
  
  // Render Skills
  elements.skillsList.innerHTML = '';
  const skills = Array.isArray(portfolioData.skills) ? portfolioData.skills : [];
  skills.forEach(skill => {
    const tag = document.createElement('div');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    elements.skillsList.appendChild(tag);
  });
  
  // Render Projects
  elements.projectsList.innerHTML = '';
  const projects = Array.isArray(portfolioData.projects) ? portfolioData.projects : [];
  if (projects.length === 0) {
    elements.projectsList.innerHTML = `
      <div class="project-card glass-panel" style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p style="color: var(--text-secondary);">No projects uploaded yet. Open Admin Mode to add your projects!</p>
      </div>`;
  } else {
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card glass-panel';
      
      const img = project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop';
      const tagsHtml = (project.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('');
      const linkHtml = project.link && project.link !== '#' ? 
        `<a href="${project.link}" target="_blank" class="project-link">Launch Project &rarr;</a>` : 
        `<span style="color: var(--text-muted); font-size: 13px;">Personal Concept</span>`;
      card.innerHTML = `
        <div class="project-img-wrapper">
          <img src="${img}" alt="${project.title}" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop'">
          <div class="project-overlay"></div>
        </div>
        <div class="project-info">
          <div class="project-tags">${tagsHtml}</div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.description}</p>
          ${linkHtml}
        </div>
      `;
      elements.projectsList.appendChild(card);
    });
  }
  
  // Render Experience Timeline
  elements.experienceList.innerHTML = '';
  const experiences = Array.isArray(portfolioData.experience) ? portfolioData.experience : [];
  if (experiences.length === 0) {
    elements.experienceList.innerHTML = `
      <div class="timeline-item glass-panel" style="text-align: center;">
        <p style="color: var(--text-secondary);">Timeline empty. Edit experience via the dashboard!</p>
      </div>`;
  } else {
    experiences.forEach(exp => {
      const item = document.createElement('div');
      item.className = 'timeline-item glass-panel';
      item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${exp.role}</h3>
            <span class="timeline-company">${exp.company}</span>
          </div>
          <span class="timeline-period">${exp.period}</span>
        </div>
        <p class="timeline-desc">${exp.description}</p>
      `;
      elements.experienceList.appendChild(item);
    });
  }
  // Social Links & Contact Details
  const socials = portfolioData.socials || {};
  
  // Fall back to defaults if DB value is empty or dummy placeholder
  const email = (socials.email && socials.email !== 'pradeep@example.com' && socials.email !== 'example@example.com') 
    ? socials.email 
    : 'pradeepsankar62@gmail.com';
    
  const phone = (socials.phone && socials.phone.trim() !== '') 
    ? socials.phone 
    : '7904203805';
  elements.socialGithub.href = socials.github || '#';
  elements.socialLinkedin.href = socials.linkedin || '#';
  elements.socialTwitter.href = socials.twitter || '#';
  elements.socialEmail.href = `mailto:${email}`;
  
  // Contact Details Section
  if (elements.contactPhone) {
    elements.contactPhone.href = `tel:${phone}`;
    elements.contactPhone.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; color: var(--primary-glow);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> +91 ${phone}`;
  }
  if (elements.contactEmail) {
    elements.contactEmail.href = `mailto:${email}`;
    elements.contactEmail.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; color: var(--secondary-glow);"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> ${email}`;
  }
  
  // Re-run scroll-reveal on dynamically rendered items
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.05 });
    
    document.querySelectorAll('.project-card, .timeline-item').forEach(el => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
      observer.observe(el);
    });
  }, 100);
}
// 5. Admin Panel Event Handlers
function setupAdminEvents() {
  // Drawer Open / Close
  elements.btnAdminToggle.addEventListener('click', () => {
    elements.adminDrawer.classList.toggle('open');
    if (elements.adminDrawer.classList.contains('open')) {
      if (secretKey) {
        showEditorScreen();
      } else {
        showAuthScreen();
      }
    }
  });
  elements.btnDrawerClose.addEventListener('click', () => {
    elements.adminDrawer.classList.remove('open');
  });
  // Authorization Submission
  elements.btnAuthSubmit.addEventListener('click', () => {
    const password = elements.adminSecretInput.value.trim();
    if (!password) {
      alert("Please enter the Admin Password.");
      return;
    }
    
    testAdminPassword(password);
  });
  
  // Password Visibility Toggle (Eye Button)
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  if (btnTogglePassword) {
    btnTogglePassword.addEventListener('click', () => {
      const type = elements.adminSecretInput.type === 'password' ? 'text' : 'password';
      elements.adminSecretInput.type = type;
      
      const eyeIcon = document.getElementById('eye-icon');
      if (type === 'text') {
        // Eye closed SVG
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
      } else {
        // Eye open SVG
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        `;
      }
    });
  }
  // Logout / Lock
  elements.btnAdminLogout.addEventListener('click', () => {
    secretKey = '';
    localStorage.removeItem('admin_secret');
    document.body.classList.remove('admin-mode');
    showAuthScreen();
  });
  // Save Everything to Database
  elements.btnSaveAll.addEventListener('click', saveAllToBackend);
  // Sub-items adding
  elements.btnAddSkill.addEventListener('click', addSkillTag);
  elements.btnAddProject.addEventListener('click', () => openProjectModal(-1));
  elements.btnAddExperience.addEventListener('click', () => openExperienceModal(-1));
  // Modal cancellations
  elements.btnModalProjCancel.addEventListener('click', () => elements.projectModal.classList.remove('open'));
  elements.btnModalExpCancel.addEventListener('click', () => elements.experienceModal.classList.remove('open'));
  // Modal saves
  elements.btnModalProjSave.addEventListener('click', saveProjectModal);
  elements.btnModalExpSave.addEventListener('click', saveExperienceModal);
}
// Check password validity locally
function testAdminPassword(password) {
  if (password !== 'pradeep@2007') {
    alert("Incorrect Admin Password. Please try again.");
    return;
  }
  
  secretKey = 'authorized';
  localStorage.setItem('admin_secret', secretKey);
  showEditorScreen();
}
function showAuthScreen() {
  elements.authPanel.style.display = 'flex';
  elements.editorPanel.style.display = 'none';
  elements.btnAdminLogout.style.display = 'none';
  elements.btnSaveAll.style.display = 'none';
  document.body.classList.remove('admin-mode');
  elements.adminBadge.style.display = 'none';
}
function showEditorScreen() {
  elements.authPanel.style.display = 'none';
  elements.editorPanel.style.display = 'flex';
  elements.btnAdminLogout.style.display = 'inline-flex';
  elements.btnSaveAll.style.display = 'inline-flex';
  document.body.classList.add('admin-mode');
  elements.adminBadge.style.display = 'inline-block';
  
  populateAdminInputs();
}
// Prefill form controls with current data
function populateAdminInputs() {
  elements.editName.value = portfolioData.name || '';
  elements.editTitle.value = portfolioData.title || '';
  elements.editAvatar.value = portfolioData.avatar_url || '';
  elements.editBio.value = portfolioData.bio || '';
  
  const socials = portfolioData.socials || {};
  elements.editGithub.value = socials.github || '';
  elements.editLinkedin.value = socials.linkedin || '';
  elements.editTwitter.value = socials.twitter || '';
  
  const email = (socials.email && socials.email !== 'pradeep@example.com' && socials.email !== 'example@example.com') 
    ? socials.email 
    : 'pradeepsankar62@gmail.com';
    
  const phone = (socials.phone && socials.phone.trim() !== '') 
    ? socials.phone 
    : '7904203805';
    
  elements.editEmail.value = email;
  elements.editPhone.value = phone;
  
  renderAdminSkills();
  renderAdminProjects();
  renderAdminExperience();
}
// Admin list renderers
function renderAdminSkills() {
  elements.adminSkillsList.innerHTML = '';
  const skills = Array.isArray(portfolioData.skills) ? portfolioData.skills : [];
  skills.forEach((skill, idx) => {
    const item = document.createElement('div');
    item.className = 'list-editor-item';
    item.innerHTML = `
      <span class="list-editor-item-title">${skill}</span>
      <div class="list-editor-item-actions">
        <button class="btn-icon btn-icon-delete" data-index="${idx}">&times;</button>
      </div>
    `;
    item.querySelector('.btn-icon-delete').addEventListener('click', () => {
      portfolioData.skills.splice(idx, 1);
      renderAdminSkills();
    });
    elements.adminSkillsList.appendChild(item);
  });
}
function renderAdminProjects() {
  elements.adminProjectsList.innerHTML = '';
  const projects = Array.isArray(portfolioData.projects) ? portfolioData.projects : [];
  projects.forEach((proj, idx) => {
    const item = document.createElement('div');
    item.className = 'list-editor-item';
    item.innerHTML = `
      <span class="list-editor-item-title">${proj.title}</span>
      <div class="list-editor-item-actions">
        <button class="btn-icon btn-icon-edit" data-index="${idx}">✏️</button>
        <button class="btn-icon btn-icon-delete" data-index="${idx}">&times;</button>
      </div>
    `;
    item.querySelector('.btn-icon-edit').addEventListener('click', () => openProjectModal(idx));
    item.querySelector('.btn-icon-delete').addEventListener('click', () => {
      portfolioData.projects.splice(idx, 1);
      renderAdminProjects();
    });
    elements.adminProjectsList.appendChild(item);
  });
}
function renderAdminExperience() {
  elements.adminExperienceList.innerHTML = '';
  const experiences = Array.isArray(portfolioData.experience) ? portfolioData.experience : [];
  experiences.forEach((exp, idx) => {
    const item = document.createElement('div');
    item.className = 'list-editor-item';
    item.innerHTML = `
      <span class="list-editor-item-title">${exp.role} @ ${exp.company}</span>
      <div class="list-editor-item-actions">
        <button class="btn-icon btn-icon-edit" data-index="${idx}">✏️</button>
        <button class="btn-icon btn-icon-delete" data-index="${idx}">&times;</button>
      </div>
    `;
    item.querySelector('.btn-icon-edit').addEventListener('click', () => openExperienceModal(idx));
    item.querySelector('.btn-icon-delete').addEventListener('click', () => {
      portfolioData.experience.splice(idx, 1);
      renderAdminExperience();
    });
    elements.adminExperienceList.appendChild(item);
  });
}
// Add/Delete Skill
function addSkillTag() {
  const skill = prompt("Enter a new skill (e.g. TypeScript, GraphQL):");
  if (skill && skill.trim()) {
    if (!Array.isArray(portfolioData.skills)) portfolioData.skills = [];
    portfolioData.skills.push(skill.trim());
    renderAdminSkills();
  }
}
// Project Modal Logic
function openProjectModal(index) {
  elements.modalProjIndex.value = index;
  if (index >= 0) {
    const project = portfolioData.projects[index];
    elements.modalProjTitle.value = project.title || '';
    elements.modalProjDesc.value = project.description || '';
    elements.modalProjImage.value = project.image || '';
    elements.modalProjTags.value = (project.tags || []).join(', ');
    elements.modalProjLink.value = project.link || '';
  } else {
    elements.modalProjTitle.value = '';
    elements.modalProjDesc.value = '';
    elements.modalProjImage.value = '';
    elements.modalProjTags.value = '';
    elements.modalProjLink.value = '';
  }
  elements.projectModal.classList.add('open');
}
function saveProjectModal() {
  const index = parseInt(elements.modalProjIndex.value);
  const title = elements.modalProjTitle.value.trim();
  const description = elements.modalProjDesc.value.trim();
  const image = elements.modalProjImage.value.trim();
  const tags = elements.modalProjTags.value.split(',').map(t => t.trim()).filter(t => t);
  const link = elements.modalProjLink.value.trim();
  
  if (!title) {
    alert("Project title is required!");
    return;
  }
  
  const projectObj = { title, description, image, tags, link };
  
  if (!Array.isArray(portfolioData.projects)) portfolioData.projects = [];
  
  if (index >= 0) {
    portfolioData.projects[index] = projectObj;
  } else {
    portfolioData.projects.push(projectObj);
  }
  
  renderAdminProjects();
  elements.projectModal.classList.remove('open');
}
// Experience Modal Logic
function openExperienceModal(index) {
  elements.modalExpIndex.value = index;
  if (index >= 0) {
    const exp = portfolioData.experience[index];
    elements.modalExpRole.value = exp.role || '';
    elements.modalExpCompany.value = exp.company || '';
    elements.modalExpPeriod.value = exp.period || '';
    elements.modalExpDesc.value = exp.description || '';
  } else {
    elements.modalExpRole.value = '';
    elements.modalExpCompany.value = '';
    elements.modalExpPeriod.value = '';
    elements.modalExpDesc.value = '';
  }
  elements.experienceModal.classList.add('open');
}
function saveExperienceModal() {
  const index = parseInt(elements.modalExpIndex.value);
  const role = elements.modalExpRole.value.trim();
  const company = elements.modalExpCompany.value.trim();
  const period = elements.modalExpPeriod.value.trim();
  const description = elements.modalExpDesc.value.trim();
  
  if (!role || !company) {
    alert("Role and Company are required!");
    return;
  }
  
  const expObj = { role, company, period, description };
  
  if (!Array.isArray(portfolioData.experience)) portfolioData.experience = [];
  
  if (index >= 0) {
    portfolioData.experience[index] = expObj;
  } else {
    portfolioData.experience.push(expObj);
  }
  
  renderAdminExperience();
  elements.experienceModal.classList.remove('open');
}
// 6. Push Changes to Supabase
async function saveAllToBackend() {
  try {
    if (!secretKey) {
      alert("Not authorized. Please recheck your access.");
      return;
    }
    
    elements.btnSaveAll.disabled = true;
    elements.btnSaveAll.textContent = 'Saving...';
    
    // Assemble portfolio updates
    const updatedData = {
      id: 1,
      name: elements.editName.value.trim() || 'Pradeep Sankar',
      title: elements.editTitle.value.trim(),
      avatar_url: elements.editAvatar.value.trim(),
      bio: elements.editBio.value.trim(),
      skills: portfolioData.skills,
      projects: portfolioData.projects,
      experience: portfolioData.experience,
      socials: {
        github: elements.editGithub.value.trim(),
        linkedin: elements.editLinkedin.value.trim(),
        twitter: elements.editTwitter.value.trim(),
        email: elements.editEmail.value.trim(),
        phone: elements.editPhone.value.trim()
      },
      updated_at: new Date().toISOString()
    };
    
    // Update using the public anon client to bypass browser service role key blocks (forbidden on client side)
    const { data, error } = await supabaseAnonClient
      .from('portfolio')
      .update(updatedData)
      .eq('id', 1);
      
    if (error) {
      if (error.code === 'PGRST205') {
        throw new Error("Table 'portfolio' not found in database. Please run the SQL setup script in your dashboard SQL Editor first.");
      }
      throw error;
    }
    
    // Update local state and trigger UI sync
    portfolioData = updatedData;
    renderPortfolio();
    
    alert("Portfolio changes successfully saved to Supabase backend!");
    elements.adminDrawer.classList.remove('open');
    
  } catch (err) {
    console.error("Save failed:", err);
    alert("Failed to save changes: " + err.message);
  } finally {
    elements.btnSaveAll.disabled = false;
    elements.btnSaveAll.textContent = 'Save Backend';
  }
}
