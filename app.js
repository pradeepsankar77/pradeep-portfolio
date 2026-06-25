const CONFIG = window.CONFIG;
// Local Fallback Portfolio Data (Seed)
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "pradeepsankar62@gmail.com",
    phone: "7904203805"
  },
  certificates: []
    phone: "7904203805",
    certificates: []
  }
};
let portfolioData = { ...defaultPortfolio };
  // Render Certificates
  if (elements.certificatesList) {
    elements.certificatesList.innerHTML = '';
    const certificates = Array.isArray(portfolioData.certificates) ? portfolioData.certificates : [];
    const certificates = (portfolioData.socials && Array.isArray(portfolioData.socials.certificates)) 
      ? portfolioData.socials.certificates 
      : [];
    
    if (certificates.length === 0) {
      elements.certificatesList.innerHTML = `
      skills: portfolioData.skills,
      projects: portfolioData.projects,
      experience: portfolioData.experience,
      certificates: portfolioData.certificates || [],
      socials: {
        github: elements.editGithub.value.trim(),
        linkedin: elements.editLinkedin.value.trim(),
        twitter: elements.editTwitter.value.trim(),
        email: elements.editEmail.value.trim(),
        phone: elements.editPhone.value.trim()
        phone: elements.editPhone.value.trim(),
        certificates: (portfolioData.socials && portfolioData.socials.certificates) || []
      },
      updated_at: new Date().toISOString()
    };
      
    const publicUrl = urlData.publicUrl;
    
    // 4. Save metadata to portfolio table row
    if (!Array.isArray(portfolioData.certificates)) {
      portfolioData.certificates = [];
    // 4. Save metadata to portfolio table row (using socials JSONB column)
    if (!portfolioData.socials) {
      portfolioData.socials = {};
    }
    if (!Array.isArray(portfolioData.socials.certificates)) {
      portfolioData.socials.certificates = [];
    }
    
    portfolioData.certificates.push({
    portfolioData.socials.certificates.push({
      name: file.name,
      url: publicUrl,
      uploaded_at: new Date().toISOString()
    });
    
    elements.uploadStatus.textContent = 'Saving to database...';
    const { error: saveError } = await supabaseAnonClient
      .from('portfolio')
      .update({ certificates: portfolioData.certificates })
      .update({ socials: portfolioData.socials })
      .eq('id', 1);
      
    if (saveError) throw saveError;
  if (!confirm('Are you sure you want to delete this certificate?')) return;
  
  try {
    portfolioData.certificates.splice(idx, 1);
    if (portfolioData.socials && Array.isArray(portfolioData.socials.certificates)) {
      portfolioData.socials.certificates.splice(idx, 1);
    }
    
    const { error } = await supabaseAnonClient
      .from('portfolio')
      .update({ certificates: portfolioData.certificates })
      .update({ socials: portfolioData.socials })
      .eq('id', 1);
      
    if (error) throw error;
