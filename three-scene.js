/**
 * Cinematic 3D Universe Portfolio Engine
 * Built with Three.js, GSAP, Web Audio API, and Vanilla-Tilt
 * Author: Pradeep Sankar
 */

(function () {
  'use strict';

  // Global Audio Engine using native Web Audio API (zero external sound file dependencies)
  const SoundEngine = {
    ctx: null,
    enabled: false,
    droneOsc: null,
    droneGain: null,

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    toggle() {
      this.init();
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.startSpaceDrone();
        this.playChime();
      } else {
        this.stopSpaceDrone();
      }
      return this.enabled;
    },

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    },

    playWhoosh() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
      } catch (e) {}
    },

    playChime() {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.06, this.ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + i * 0.08);
          osc.stop(this.ctx.currentTime + i * 0.08 + 0.4);
        });
      } catch (e) {}
    },

    playExplosion() {
      if (!this.enabled || !this.ctx) return;
      try {
        // Noise burst for planetary click
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.35);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
      } catch (e) {}
    },

    startSpaceDrone() {
      if (!this.ctx || this.droneOsc) return;
      try {
        this.droneOsc = this.ctx.createOscillator();
        this.droneGain = this.ctx.createGain();
        this.droneOsc.type = 'sine';
        this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 sub-bass
        this.droneGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        this.droneOsc.connect(this.droneGain);
        this.droneGain.connect(this.ctx.destination);
        this.droneOsc.start();
      } catch (e) {}
    },

    stopSpaceDrone() {
      if (this.droneOsc) {
        try {
          this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            if (this.droneOsc) {
              this.droneOsc.stop();
              this.droneOsc.disconnect();
              this.droneOsc = null;
            }
          }, 500);
        } catch (e) {
          this.droneOsc = null;
        }
      }
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    initAudioControls();
    initEarthPortalLoader();
    initBackgroundUniverse();
    initHeroLaptop();
    initSkillsGalaxy();
    initCelestialChronometer();
    initAIAssistantAndSparks();
    init3DTilt();
  });

  /* ==========================================================================
     0. AUDIO CONTROLS & USER INTERACTION
     ========================================================================== */
  function initAudioControls() {
    const btn = document.getElementById('btn-audio-toggle');
    const iconOn = document.getElementById('audio-icon-on');
    const iconOff = document.getElementById('audio-icon-off');
    const text = document.getElementById('audio-text');

    if (!btn) return;

    btn.addEventListener('click', () => {
      const active = SoundEngine.toggle();
      if (active) {
        btn.classList.add('active');
        if (iconOn) iconOn.style.display = 'block';
        if (iconOff) iconOff.style.display = 'none';
        if (text) text.textContent = 'SFX: ON';
      } else {
        btn.classList.remove('active');
        if (iconOn) iconOn.style.display = 'none';
        if (iconOff) iconOff.style.display = 'block';
        if (text) text.textContent = 'SFX: OFF';
      }
    });

    // Hook subtle UI clicks to all buttons & navigation links
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => SoundEngine.playClick());
    });
  }

  /* ==========================================================================
     1. 3D EARTH PORTAL LOADING SCREEN (0% -> 100% with Camera Warp Zoom)
     ========================================================================== */
  function initEarthPortalLoader() {
    const canvas = document.getElementById('earth-loader-canvas');
    const loaderScreen = document.getElementById('loader-screen');
    const percentNum = document.getElementById('loader-percent-num');
    const barFill = document.getElementById('loader-bar-fill');
    const statusMsg = document.getElementById('loader-status-msg');

    if (!canvas || !loaderScreen) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(280, 280);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // A. 3D Rotating Earth Sphere (Wireframe & Continents Glow)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Inner wireframe sphere
    const earthGeo = new THREE.SphereGeometry(1.05, 28, 28);
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Glowing atmospheric rim shell
    const atmoGeo = new THREE.SphereGeometry(1.22, 28, 28);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmoMesh);

    // B. Converging Particle Vortex (Flying inwards towards Earth core)
    const vortexCount = 800;
    const vortexGeo = new THREE.BufferGeometry();
    const vortexPos = new Float32Array(vortexCount * 3);
    const vortexVel = [];

    for (let i = 0; i < vortexCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.6 + Math.random() * 2.8;
      vortexPos[i3] = Math.cos(angle) * dist;
      vortexPos[i3 + 1] = (Math.random() - 0.5) * 2.2;
      vortexPos[i3 + 2] = Math.sin(angle) * dist;
      vortexVel.push({
        dist: dist,
        angle: angle,
        speed: 0.02 + Math.random() * 0.03,
        spiral: 0.04 + Math.random() * 0.04
      });
    }
    vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPos, 3));

    const vortexMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const vortexPoints = new THREE.Points(vortexGeo, vortexMat);
    earthGroup.add(vortexPoints);

    // Animation & Progress Counting
    let progress = 0;
    const duration = 2400; // 2.4s cinematic loading
    const startTime = performance.now();

    const telemetrySteps = [
      { threshold: 25, text: 'Synchronizing Earth Coordinates...' },
      { threshold: 50, text: 'Calibrating Quantum Shaders & AI Core...' },
      { threshold: 75, text: 'Opening Temporal Universe Portal...' },
      { threshold: 95, text: 'Approaching Warp Velocity...' },
      { threshold: 100, text: 'Portal Open! Entering Universe...' }
    ];

    let portalZooming = false;

    function renderLoader(time) {
      requestAnimationFrame(renderLoader);

      earthGroup.rotation.y += 0.015;
      earthGroup.rotation.x = Math.sin(time * 0.001) * 0.15;
      atmoMesh.rotation.y -= 0.008;

      // Spiral vortex particles inwards
      const positions = vortexGeo.attributes.position.array;
      for (let i = 0; i < vortexCount; i++) {
        const p = vortexVel[i];
        p.dist -= p.speed * 0.2;
        p.angle += p.spiral;
        if (p.dist < 0.6) p.dist = 3.8; // recycle outward

        const i3 = i * 3;
        positions[i3] = Math.cos(p.angle) * p.dist;
        positions[i3 + 2] = Math.sin(p.angle) * p.dist;
      }
      vortexGeo.attributes.position.needsUpdate = true;

      // Update 0% to 100%
      if (!portalZooming) {
        const elapsed = time - startTime;
        const rawProg = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - rawProg, 2.5);
        progress = Math.min(100, Math.floor(ease * 100));

        if (percentNum) percentNum.textContent = `${progress}%`;
        if (barFill) barFill.style.width = `${progress}%`;

        const cur = telemetrySteps.find(s => progress <= s.threshold);
        if (cur && statusMsg) statusMsg.textContent = cur.text;

        if (rawProg >= 1 && !portalZooming) {
          portalZooming = true;
          triggerPortalWarp();
        }
      }

      renderer.render(scene, camera);
    }
    requestAnimationFrame(renderLoader);

    function triggerPortalWarp() {
      SoundEngine.playWhoosh();
      SoundEngine.playChime();

      if (window.gsap) {
        // Warp Camera Zoom: Fly through the Earth portal!
        gsap.to(camera.position, {
          z: -1.5,
          duration: 0.9,
          ease: 'power3.in',
          onComplete: () => {
            loaderScreen.classList.add('loader-hidden');
            // Reveal Hero Elements with cinematic zoom
            gsap.from('.hero-content', { y: 40, opacity: 0, scale: 0.95, duration: 1.2, ease: 'power3.out' });
            gsap.from('.hero-3d-showcase', { scale: 0.85, opacity: 0, duration: 1.4, ease: 'back.out(1.5)', delay: 0.2 });
            setTimeout(() => {
              loaderScreen.style.display = 'none';
            }, 950);
          }
        });
      } else {
        loaderScreen.classList.add('loader-hidden');
        setTimeout(() => { loaderScreen.style.display = 'none'; }, 900);
      }
    }
  }

  /* ==========================================================================
     2. BACKGROUND UNIVERSE (Starfield + Moving Stars + Energy Grid Floor + Parallax)
     ========================================================================== */
  function initBackgroundUniverse() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // A. 2,600 Starfield Particles
    const starCount = 2600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0x06b6d4),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xf43f5e),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPos[i3] = (Math.random() - 0.5) * 45;
      starPos[i3 + 1] = (Math.random() - 0.5) * 45;
      starPos[i3 + 2] = (Math.random() - 0.5) * 45;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i3] = col.r;
      starColors[i3 + 1] = col.g;
      starColors[i3 + 2] = col.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // B. Glowing Cyber Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x06b6d4, 0x1e1b4b);
    gridHelper.position.y = -6;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.22;
    scene.add(gridHelper);

    // C. Floating Hologram Celestial Sphere (Hero backdrop)
    const globeGroup = new THREE.Group();
    globeGroup.position.set(4.2, 1.2, -2.5);

    const outerGeo = new THREE.IcosahedronGeometry(2.4, 3);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    globeGroup.add(new THREE.Mesh(outerGeo, outerMat));

    const orbitRingGeo = new THREE.RingGeometry(3.2, 3.26, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    globeGroup.add(orbitRing);

    scene.add(globeGroup);

    // Mouse Parallax & Scroll Navigation
    let targetMouseX = 0, targetMouseY = 0;
    let curMouseX = 0, curMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    let clock = new THREE.Clock();
    function animateUniverse() {
      requestAnimationFrame(animateUniverse);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow parallax
      curMouseX += (targetMouseX - curMouseX) * 0.05;
      curMouseY += (targetMouseY - curMouseY) * 0.05;

      // Scroll-bound camera depth
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight || 1);

      camera.position.x = curMouseX * 0.8;
      camera.position.y = curMouseY * 0.6 - scrollProgress * 3;
      camera.position.z = 8 - Math.sin(scrollProgress * Math.PI) * 1.5;
      camera.lookAt(0, -scrollProgress * 2, 0);

      // Star drift
      starField.rotation.y = elapsed * 0.018;
      starField.rotation.x = elapsed * 0.008;

      // Grid floor forward glide animation
      gridHelper.position.z = (elapsed * 1.5) % (60 / 40);

      // Globe rotation
      globeGroup.rotation.y = elapsed * 0.12;
      globeGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.15;

      renderer.render(scene, camera);
    }
    animateUniverse();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ==========================================================================
     3. 3D HERO LAPTOP (Welcome Recruiter!)
     ========================================================================== */
  function initHeroLaptop() {
    const container = document.getElementById('hero-laptop-container');
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 250;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.25, 3.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const laptop = new THREE.Group();
    scene.add(laptop);

    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.25 });
    const darkAccent = new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9, roughness: 0.3 });

    // Body Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.07, 1.6), chassisMat);
    laptop.add(base);

    // Keyboard & Trackpad
    const kb = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.02, 0.9), darkAccent);
    kb.position.set(0, 0.04, -0.15);
    laptop.add(kb);

    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.015, 0.45), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 }));
    pad.position.set(0, 0.04, 0.5);
    laptop.add(pad);

    // Display Lid
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.04, -0.8);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.45, 0.05), chassisMat);
    lid.position.set(0, 0.725, 0);
    lidGroup.add(lid);

    // Screen Texture
    const cvs = document.createElement('canvas');
    cvs.width = 1024;
    cvs.height = 640;
    const ctx = cvs.getContext('2d');
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 1024, 50);

    // Window dots
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(35, 25, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(65, 25, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(95, 25, 8, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('PradeepPortfolio.java', 130, 32);

    ctx.font = '22px monospace';
    ctx.fillStyle = '#f43f5e'; ctx.fillText('public class ', 60, 110);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('WelcomeRecruiter {', 230, 110);
    ctx.fillStyle = '#818cf8'; ctx.fillText('  public static void main(String[] args) {', 60, 160);
    ctx.fillStyle = '#94a3b8'; ctx.fillText('    System.out.println(', 60, 210);
    ctx.fillStyle = '#34d399'; ctx.fillText('"Welcome Recruiter! 🚀"', 320, 210);
    ctx.fillStyle = '#94a3b8'; ctx.fillText(');', 650, 210);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('    launchQuantumUniverse();', 60, 260);
    ctx.fillStyle = '#818cf8'; ctx.fillText('  }', 60, 310);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('}', 60, 360);

    // Terminal
    ctx.fillStyle = '#030712'; ctx.fillRect(40, 430, 944, 160);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'; ctx.lineWidth = 2; ctx.strokeRect(40, 430, 944, 160);
    ctx.fillStyle = '#06b6d4'; ctx.font = 'bold 20px monospace';
    ctx.fillText('TERMINAL OUTPUT:', 65, 475);
    ctx.fillStyle = '#4ade80'; ctx.fillText('> Welcome Recruiter!', 65, 515);
    ctx.fillStyle = '#94a3b8'; ctx.fillText('> System Core 100% Ready & Matched.', 65, 555);

    const screenTexture = new THREE.CanvasTexture(cvs);
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.26), new THREE.MeshBasicMaterial({ map: screenTexture }));
    screenMesh.position.set(0, 0.725, 0.033);
    lidGroup.add(screenMesh);
    lidGroup.rotation.x = THREE.MathUtils.degToRad(-20);
    laptop.add(lidGroup);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pointLight = new THREE.PointLight(0x06b6d4, 1.6, 6);
    pointLight.position.set(0, 1, 0.6);
    laptop.add(pointLight);

    laptop.position.set(0, -0.3, 0);
    laptop.rotation.set(0.25, -0.45, 0);

    // Interactive Drag
    let isDragging = false;
    let prevX = 0, prevY = 0;
    container.addEventListener('mousedown', (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      laptop.rotation.y += (e.clientX - prevX) * 0.01;
      laptop.rotation.x = Math.max(-0.2, Math.min(0.6, laptop.rotation.x + (e.clientY - prevY) * 0.01));
      prevX = e.clientX; prevY = e.clientY;
    });

    let lClock = new THREE.Clock();
    function animateLaptop() {
      requestAnimationFrame(animateLaptop);
      const elapsed = lClock.getElapsedTime();
      if (!isDragging) laptop.rotation.y += 0.007;
      laptop.position.y = -0.3 + Math.sin(elapsed * 1.8) * 0.08;
      renderer.render(scene, camera);
    }
    animateLaptop();

    new ResizeObserver(() => {
      const nw = container.clientWidth || 360;
      const nh = container.clientHeight || 250;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }).observe(container);
  }

  /* ==========================================================================
     4. SKILLS GALAXY (Planetary Orbits & Particle Burst on Click)
     ========================================================================== */
  function initSkillsGalaxy() {
    const container = document.getElementById('skills-3d-canvas-container');
    if (!container) return;

    const w = container.clientWidth || 600;
    const h = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Central Sun / Star
    const sunGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    // Sun Glow Halo
    const sunHaloGeo = new THREE.SphereGeometry(0.95, 32, 32);
    const sunHaloMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.25, wireframe: true });
    scene.add(new THREE.Mesh(sunHaloGeo, sunHaloMat));

    // Planet Definitions
    const planetsData = [
      { name: 'Java', color: 0xef4444, radius: 1.8, speed: 0.8, size: 0.38, percent: '90%', tag: 'Core Backend / OOP' },
      { name: 'React', color: 0x06b6d4, radius: 2.5, speed: 0.65, size: 0.42, percent: '92%', tag: 'Frontend SPA' },
      { name: 'Node.js', color: 0x22c55e, radius: 3.2, speed: 0.5, size: 0.39, percent: '88%', tag: 'REST & APIs' },
      { name: 'Supabase', color: 0x10b981, radius: 3.9, speed: 0.42, size: 0.36, percent: '86%', tag: 'PostgreSQL Realtime' },
      { name: 'HTML5', color: 0xf97316, radius: 4.6, speed: 0.35, size: 0.34, percent: '95%', tag: 'Semantic Web' },
      { name: 'CSS3', color: 0x38bdf8, radius: 5.2, speed: 0.28, size: 0.35, percent: '94%', tag: 'Glowmorphic / UI' }
    ];

    const planetMeshes = [];
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Create planetary bodies & orbit paths
    planetsData.forEach((p, idx) => {
      // Orbit Ring
      const orbitGeo = new THREE.RingGeometry(p.radius - 0.02, p.radius + 0.02, 64);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: p.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
      });
      const ring = new THREE.Mesh(orbitGeo, orbitMat);
      ring.rotation.x = Math.PI / 2;
      galaxyGroup.add(ring);

      // Planet Sphere
      const pGeo = new THREE.SphereGeometry(p.size, 24, 24);
      const pMat = new THREE.MeshStandardMaterial({
        color: p.color,
        metalness: 0.3,
        roughness: 0.4,
        emissive: p.color,
        emissiveIntensity: 0.3
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.userData = {
        name: p.name,
        color: p.color,
        radius: p.radius,
        speed: p.speed,
        baseSize: p.size,
        percent: p.percent,
        tag: p.tag,
        angle: (idx / planetsData.length) * Math.PI * 2
      };

      galaxyGroup.add(mesh);
      planetMeshes.push(mesh);
    });

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sunLight = new THREE.PointLight(0xffffff, 2, 20);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Particle Explosion Pool
    const burstParticles = [];
    const burstGeo = new THREE.BufferGeometry();
    const burstCount = 120;
    const burstPos = new Float32Array(burstCount * 3);
    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPos, 3));
    const burstMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x06b6d4,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const burstSystem = new THREE.Points(burstGeo, burstMat);
    scene.add(burstSystem);

    function triggerParticleBurst(centerPos, colorHex) {
      SoundEngine.playExplosion();
      burstMat.color.setHex(colorHex);
      burstMat.opacity = 1.0;

      burstParticles.length = 0;
      for (let i = 0; i < burstCount; i++) {
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        );
        burstParticles.push({
          pos: centerPos.clone(),
          vel: vel,
          life: 1.0
        });
      }

      if (window.gsap) {
        gsap.to(burstMat, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    }

    // Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const hudTooltip = document.getElementById('skill-3d-tooltip');
    let hoveredPlanet = null;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      if (hudTooltip && hoveredPlanet) {
        hudTooltip.style.left = `${e.clientX - rect.left + 15}px`;
        hudTooltip.style.top = `${e.clientY - rect.top - 20}px`;
      }
    });

    container.addEventListener('mouseleave', () => {
      mouse.x = -999; mouse.y = -999;
      if (hoveredPlanet) resetPlanet(hoveredPlanet);
      hoveredPlanet = null;
      if (hudTooltip) hudTooltip.style.opacity = '0';
    });

    // Click on Planet -> Particle Explosion Shockwave!
    container.addEventListener('click', () => {
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      if (hits.length > 0) {
        const hit = hits[0].object;
        triggerParticleBurst(hit.position, hit.userData.color);

        if (window.gsap) {
          gsap.fromTo(hit.scale, { x: 1.8, y: 1.8, z: 1.8 }, { x: 1.35, y: 1.35, z: 1.35, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
        }
      }
    });

    function hoverPlanet(mesh) {
      SoundEngine.playClick();
      if (window.gsap) {
        gsap.to(mesh.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(mesh.material, { emissiveIntensity: 0.8, duration: 0.3 });
      }
      if (hudTooltip) {
        hudTooltip.innerHTML = `
          <div style="font-weight: 800; font-size: 15px; color: #fff;">${mesh.userData.name}</div>
          <div style="font-size: 12px; color: #38bdf8; font-weight: 700; margin-top: 2px;">Proficiency: ${mesh.userData.percent}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 3px;">${mesh.userData.tag}</div>
          <div style="font-size: 10px; color: #facc15; margin-top: 4px; font-weight: 600;">⚡ Click to trigger particle shockwave</div>
        `;
        hudTooltip.style.opacity = '1';
      }
    }

    function resetPlanet(mesh) {
      if (window.gsap) {
        gsap.to(mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.3 });
        gsap.to(mesh.material, { emissiveIntensity: 0.3, duration: 0.3 });
      }
    }

    let gClock = new THREE.Clock();
    function animateGalaxy() {
      requestAnimationFrame(animateGalaxy);
      const delta = gClock.getDelta();
      const elapsed = gClock.getElapsedTime();

      // Sun pulse
      sunHaloMat.opacity = 0.2 + Math.sin(elapsed * 3) * 0.08;

      // Orbit Planets
      planetMeshes.forEach(mesh => {
        mesh.userData.angle += delta * mesh.userData.speed * 0.4;
        mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
        mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;
        mesh.rotation.y += 0.02;
      });

      // Update Particle Burst
      if (burstParticles.length > 0) {
        const pArr = burstGeo.attributes.position.array;
        burstParticles.forEach((p, idx) => {
          p.pos.addScaledVector(p.vel, delta);
          pArr[idx * 3] = p.pos.x;
          pArr[idx * 3 + 1] = p.pos.y;
          pArr[idx * 3 + 2] = p.pos.z;
        });
        burstGeo.attributes.position.needsUpdate = true;
      }

      // Raycast check
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      if (hits.length > 0) {
        const target = hits[0].object;
        if (hoveredPlanet !== target) {
          if (hoveredPlanet) resetPlanet(hoveredPlanet);
          hoveredPlanet = target;
          hoverPlanet(hoveredPlanet);
        }
      } else {
        if (hoveredPlanet) {
          resetPlanet(hoveredPlanet);
          hoveredPlanet = null;
          if (hudTooltip) hudTooltip.style.opacity = '0';
        }
      }

      renderer.render(scene, camera);
    }
    animateGalaxy();

    new ResizeObserver(() => {
      const nw = container.clientWidth || 600;
      const nh = container.clientHeight || 380;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }).observe(container);
  }

  /* ==========================================================================
     5. CAREER CHRONOMETER (Giant Golden Clock & Rotating Gears Timeline)
     ========================================================================== */
  function initCelestialChronometer() {
    const container = document.getElementById('chronometer-3d-canvas-container');
    if (!container) return;

    const w = container.clientWidth || 400;
    const h = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const clockGroup = new THREE.Group();
    scene.add(clockGroup);

    // Gold & Brass Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.25
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.3
    });

    // Helper: Create a 3D Gear Mesh with Teeth
    function createGearMesh(radius, teethCount, thickness, mat) {
      const gearGroup = new THREE.Group();
      // Center ring
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thickness, 32), mat);
      hub.rotation.x = Math.PI / 2;
      gearGroup.add(hub);

      // Cogs / Teeth
      for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.22, thickness * 1.05, radius * 0.25), mat);
        tooth.position.set(Math.cos(angle) * (radius * 1.05), Math.sin(angle) * (radius * 1.05), 0);
        tooth.rotation.z = angle;
        gearGroup.add(tooth);
      }
      return gearGroup;
    }

    // 1. Giant Main Clock Gear (Clockwise)
    const mainGear = createGearMesh(1.6, 24, 0.12, goldMat);
    clockGroup.add(mainGear);

    // 2. Interlocking Secondary Pinion Gear (Counter-Clockwise)
    const pinionGear = createGearMesh(0.75, 12, 0.14, brassMat);
    pinionGear.position.set(1.95, 1.2, -0.15);
    clockGroup.add(pinionGear);

    // 3. Clock Hands (Hour & Minute Hands)
    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.04), goldMat);
    hourHand.position.set(0, 0.4, 0.1);
    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.35, 0.04), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
    minuteHand.position.set(0, 0.6, 0.14);

    const handsPivot = new THREE.Group();
    handsPivot.add(hourHand);
    handsPivot.add(minuteHand);
    clockGroup.add(handsPivot);

    // 4. Outer Dial Orbit with Roman / Epoch Numeral Rings
    const dialRing = new THREE.Mesh(
      new THREE.RingGeometry(2.1, 2.22, 48),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.4 })
    );
    clockGroup.add(dialRing);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const pointLight = new THREE.PointLight(0xfacc15, 2, 12);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    let scrollSpeedMult = 1;
    window.addEventListener('scroll', () => {
      scrollSpeedMult = 3.5;
      clearTimeout(window._scrollTimeout);
      window._scrollTimeout = setTimeout(() => { scrollSpeedMult = 1; }, 200);
    });

    let cClock = new THREE.Clock();
    function animateChronometer() {
      requestAnimationFrame(animateChronometer);
      const delta = cClock.getDelta();

      // Rotate Gears
      mainGear.rotation.z -= delta * 0.4 * scrollSpeedMult;
      pinionGear.rotation.z += delta * 0.8 * scrollSpeedMult;
      handsPivot.rotation.z -= delta * 0.9 * scrollSpeedMult;

      // Subtle 3D tilt
      clockGroup.rotation.y = Math.sin(cClock.getElapsedTime() * 0.8) * 0.15;
      clockGroup.rotation.x = 0.1 + Math.cos(cClock.getElapsedTime() * 0.6) * 0.08;

      renderer.render(scene, camera);
    }
    animateChronometer();

    new ResizeObserver(() => {
      const nw = container.clientWidth || 400;
      const nh = container.clientHeight || 380;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }).observe(container);
  }

  /* ==========================================================================
     6. AI ASSISTANT ORB & CURSOR PARTICLES TRAIL
     ========================================================================== */
  function initAIAssistantAndSparks() {
    const orb = document.getElementById('ai-assistant-orb');
    const canvas = document.getElementById('cursor-trail-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let orbX = mouseX, orbY = mouseY;

    const sparks = [];

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn 2 spark particles on cursor move
      sparks.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: Math.random() * 3 + 1.5,
        alpha: 1.0,
        color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6'
      });
    });

    function loopSparks() {
      requestAnimationFrame(loopSparks);

      // Smooth lerp for AI Assistant Orb
      orbX += (mouseX - orbX) * 0.12;
      orbY += (mouseY - orbY) * 0.12;
      if (orb) {
        orb.style.left = `${orbX}px`;
        orb.style.top = `${orbY}px`;
      }

      // Draw Cursor Sparks
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.025;
        s.size *= 0.96;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    loopSparks();
  }

  /* ==========================================================================
     7. 3D TILT INTEGRATION (Avatar & Project Cards)
     ========================================================================== */
  function init3DTilt() {
    if (typeof VanillaTilt === 'undefined') return;

    VanillaTilt.init(document.querySelectorAll('.avatar-card-3d'), {
      max: 20,
      speed: 400,
      glare: true,
      'max-glare': 0.45,
      scale: 1.04,
      perspective: 1000
    });

    const initCards = () => {
      const cards = document.querySelectorAll('.project-card:not([data-tilt-active])');
      if (cards.length > 0) {
        VanillaTilt.init(cards, {
          max: 12,
          speed: 350,
          glare: true,
          'max-glare': 0.35,
          scale: 1.02,
          perspective: 1200
        });
        cards.forEach(c => c.setAttribute('data-tilt-active', 'true'));
      }
    };
    initCards();

    const observer = new MutationObserver(initCards);
    const pList = document.getElementById('projects-list');
    if (pList) observer.observe(pList, { childList: true });
  }

  window.refresh3DTilt = function () {
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll('.project-card'), {
        max: 12,
        speed: 350,
        glare: true,
        'max-glare': 0.35,
        scale: 1.02,
        perspective: 1200
      });
    }
  };
})();
