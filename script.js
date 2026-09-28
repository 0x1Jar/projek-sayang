/**
 * Universe Of Love — Gargantua Black Hole Edition
 * Dedicated to: Halisa Nurul Zakia
 * Creator: Fajar Syahruddin
 * 
 * Powered by Three.js 3D Engine: Relativistic Gravitational Lensing,
 * Accretion Disk in "Warna Cinta" (Colors of Love), Keplerian Particle Flow,
 * Orbiting 3D Hearts, Dual-Mode Audio Synthesizer, Starlight Wish Transmitter,
 * and Biometric Love Frequency Scanner.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CONFIGURATION (Mudah Dikustomisasi)
  // ==========================================
  const CONFIG = {
    // Tanggal jadian / awal pertemuan (23 September 2026)
    startDate: new Date(2026, 8, 23, 0, 0, 0),
    startDateFormatted: '23 September 2026',
    
    // Nama Kekasih & Pencipta
    girlfriendName: 'Halisa Nurul Zakia',
    nickname: 'Halisa',
    author: 'Fajar Syahruddin',

    // Parameter Black Hole Gargantua
    blackHole: {
      eventHorizonRadius: 3.2,
      photonRingRadius: 3.34,
      diskInnerRadius: 3.45,
      diskOuterRadius: 20.0,
      lensOuterRadius: 9.2,
      equatorialParticles: window.innerWidth < 768 ? 14000 : 22000,
      lensingParticles: window.innerWidth < 768 ? 4000 : 8000,
      backgroundStars: window.innerWidth < 768 ? 3800 : 5400,
      diamondStars: window.innerWidth < 768 ? 120 : 220,
      stardustCount: window.innerWidth < 768 ? 140 : 240
    },
    
    // Warna tema cinta (Warna Cinta)
    colors: ['#ffffff', '#ff2a85', '#f43f5e', '#fb7185', '#be185d', '#a855f7', '#00f0ff']
  };

  const startDateTextElem = document.getElementById('start-date-text');
  if (startDateTextElem) {
    startDateTextElem.textContent = CONFIG.startDateFormatted;
  }

  // ==========================================
  // 2. SMOOTH SCROLL REVEAL OBSERVER
  // ==========================================
  const scrollElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  scrollElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 3. 3D TILT MICRO-INTERACTIONS
  // ==========================================
  const tiltElements = document.querySelectorAll('[data-tilt]');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ==========================================
  // 4. SOUND & CELESTIAL AUDIO FX ENGINE
  // ==========================================
  let audioContext = null;

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }

  function playCelestialChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.07 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 1.3);
      });
    } catch(e) {}
  }

  function playHeartbeatSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [0, 0.22].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(60, now + offset);
        osc.frequency.exponentialRampToValueAtTime(35, now + offset + 0.15);
        gain.gain.setValueAtTime(0.14, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } catch(e) {}
  }

  // ==========================================
  // 5. THREE.JS 3D GARGANTUA BLACK HOLE ENGINE
  // ==========================================
  let scene, camera, renderer;
  let blackHoleGroup, eventHorizonMesh, photonRingMesh, lensingRingMesh, accretionDiskMesh;
  let equatorialParticles, lensingParticles, bgStarPoints;
  let starShaderMaterial, diamondShaderMaterial, diamondStarsPoints, stardustPoints;
  let nextMeteorTime = 2.5;
  const heartGroup = [];
  const shootingStars = [];

  // Orbit controls variables
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotY = 0.18;
  let targetRotX = 0.20;
  let rotY = 0.18;
  let rotX = 0.20;
  let targetDistance = window.innerWidth < 768 ? 28 : 23;
  let currentDistance = targetDistance;

  // Raycaster for 3D interactions
  const raycaster = new THREE.Raycaster();
  const mousePointer = new THREE.Vector2();
  let dragDistance = 0;

  // Romantic quotes pool for Black Hole objects
  const romanticGalaxyQuotes = [
    { title: "Inti Gravitasi Cinta", quote: "Gravitasi terkuat di seluruh semesta adalah cintamu, Halisa. Begitu masuk ke orbitmu, hatiku tak pernah ingin pergi. 🪐💖" },
    { title: "Piringan Akresi Abadi", quote: "Di antara triliunan bintang yang tersedot waktu, perasaanku kepadamu adalah satu-satunya cahaya yang tak pernah padam. ✨" },
    { title: "Cincin Foton // Einstein Ring", quote: "Cahaya terindah di jagat raya bukanlah bintang kejora, melainkan senyuman tulus dari Halisa Nurul Zakia. 🌸" },
    { title: "Relativitas Rasa", quote: "Satu detik bersamamu terasa abadi, dan ribuan tahun tanpamu terasa begitu sepi. I wanna be yours, selamanya. 💍" },
    { title: "Amor De Mi Vida", quote: "Fajar & Halisa: Dua partikel kosmik yang ditarik oleh takdir cinta tanpa batas. 💫" },
    { title: "Singularitas Hati", quote: "Di titik terdalam semestaku, hanya ada satu nama yang terukir abadi: Halisa. 🤍" },
    { title: "23 September 2026", quote: "Hari di mana semestaku menemukan pusat orbitnya. Terima kasih telah hadir dan menjadi duniaku. ⏳" }
  ];

  function getRandomQuote() {
    return romanticGalaxyQuotes[Math.floor(Math.random() * romanticGalaxyQuotes.length)];
  }

  // Generate ultra-high resolution procedural accretion disk texture ("Warna Cinta")
  function createGargantuaAccretionTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const cx = 512, cy = 512;

    ctx.clearRect(0, 0, 1024, 1024);

    const innerR = 175;
    const outerR = 505;

    // 1. Concentric striated bands (Keplerian plasma density waves)
    for (let r = innerR; r < outerR; r += 1) {
      const norm = (r - innerR) / (outerR - innerR);
      let rCol, gCol, bCol, alpha;

      if (norm < 0.08) {
        // Innermost photon rim: Incandescent Blazing White & Pale Rose
        rCol = 255; gCol = 248; bCol = 252;
        alpha = 0.96;
      } else if (norm < 0.35) {
        // Inner hot flow: Electric Neon Pink
        const t = (norm - 0.08) / 0.27;
        rCol = 255;
        gCol = Math.floor(42 + (1 - t) * 140);
        bCol = Math.floor(133 + (1 - t) * 70);
        alpha = 0.88 - t * 0.16;
      } else if (norm < 0.72) {
        // Mid stream: Fiery Magenta & Rose Gold
        const t = (norm - 0.35) / 0.37;
        rCol = Math.floor(255 - t * 50);
        gCol = Math.floor(40 + t * 45);
        bCol = Math.floor(140 + t * 60);
        alpha = 0.72 - t * 0.35;
      } else {
        // Outer filaments: Deep Cosmic Violet fading softly to space
        const t = (norm - 0.72) / 0.28;
        rCol = Math.floor(190 * (1 - t));
        gCol = Math.floor(40 * (1 - t));
        bCol = Math.floor(230 * (1 - t));
        alpha = 0.37 * (1 - t);
      }

      // Add filament striated density noise
      const bandNoise = 0.72 + 0.28 * Math.sin(r * 0.45) * Math.cos(r * 0.18);
      ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${(alpha * bandNoise).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Add turbulent fibrous spiral streaks (as seen in Interstellar Gargantua)
    const streakCount = 260;
    for (let s = 0; s < streakCount; s++) {
      const angleStart = Math.random() * Math.PI * 2;
      const rStart = innerR + Math.random() * (outerR - innerR) * 0.88;
      const arcAngle = (0.25 + Math.random() * 0.45) * (Math.random() > 0.5 ? 1 : -1);

      ctx.strokeStyle = `rgba(255, ${Math.floor(60 + Math.random() * 120)}, ${Math.floor(140 + Math.random() * 95)}, ${0.16 + Math.random() * 0.26})`;
      ctx.lineWidth = 1.4 + Math.random() * 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy, rStart, angleStart, angleStart + arcAngle);
      ctx.stroke();
    }

    // 3. Relativistic Doppler beaming gradient (left side brighter)
    const dopplerGrad = ctx.createLinearGradient(0, 512, 1024, 512);
    dopplerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    dopplerGrad.addColorStop(0.45, 'rgba(255, 42, 133, 0.08)');
    dopplerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
    ctx.fillStyle = dopplerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  // Generate glowing star particle texture
  function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 240, 250, 0.9)');
    grad.addColorStop(0.5, 'rgba(255, 42, 133, 0.45)');
    grad.addColorStop(0.8, 'rgba(0, 240, 255, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  // Generate brilliant 4-point diamond cross-flare texture for twinkling hero stars
  function createDiamondSparkleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64, cy = 64;

    // 1. Central delicate starlight glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.12, 'rgba(255, 240, 252, 0.9)');
    grad.addColorStop(0.35, 'rgba(255, 42, 133, 0.35)');
    grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    // 2. Crisp horizontal flare spike
    const hGrad = ctx.createLinearGradient(0, cy, 128, cy);
    hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    hGrad.addColorStop(0.42, 'rgba(255, 250, 255, 0.35)');
    hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    hGrad.addColorStop(0.58, 'rgba(255, 250, 255, 0.35)');
    hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, cy - 1, 128, 2);

    // 3. Crisp vertical flare spike
    const vGrad = ctx.createLinearGradient(cx, 0, cx, 128);
    vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    vGrad.addColorStop(0.42, 'rgba(255, 250, 255, 0.35)');
    vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
    vGrad.addColorStop(0.58, 'rgba(255, 250, 255, 0.35)');
    vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = vGrad;
    ctx.fillRect(cx - 1, 0, 2, 128);

    return new THREE.CanvasTexture(canvas);
  }

  function initThreeBlackHole() {
    const container = document.getElementById('webgl-galaxy-container');
    if (!container) return;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.012);

    camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3.8, currentDistance);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Scene Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const accretionLight = new THREE.PointLight(0xff2a85, 4.2, 55);
    accretionLight.position.set(0, 0, 0);
    scene.add(accretionLight);

    const photonLight = new THREE.PointLight(0xffffff, 3.2, 35);
    photonLight.position.set(0, 0, 2);
    scene.add(photonLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2.0, 50);
    cyanLight.position.set(16, 8, 14);
    scene.add(cyanLight);

    const starTexture = createStarTexture();
    const diamondTexture = createDiamondSparkleTexture();
    const accretionTexture = createGargantuaAccretionTexture();

    // 4. Black Hole Group (Contains Gargantua Geometry with Cinematic Tilt)
    blackHoleGroup = new THREE.Group();
    blackHoleGroup.position.y = 1.5;
    // Iconic cinematic tilt as seen in reference image
    blackHoleGroup.rotation.z = -0.22; // ~12.5 degree diagonal tilt
    blackHoleGroup.rotation.x = 0.28;  // ~16 degree pitch angle
    scene.add(blackHoleGroup);

    // 5. Central Event Horizon (Pitch Black Sphere)
    const { eventHorizonRadius, photonRingRadius, diskInnerRadius, diskOuterRadius, lensOuterRadius } = CONFIG.blackHole;
    const eventHorizonGeo = new THREE.SphereGeometry(eventHorizonRadius, 64, 64);
    const eventHorizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    eventHorizonMesh = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
    eventHorizonMesh.userData = {
      type: 'eventHorizon',
      title: 'Singularitas Cinta // Halisa',
      quote: 'Gravitasi terkuat di seluruh semesta adalah cintamu, Halisa. Begitu masuk ke orbitmu, hatiku tak pernah ingin pergi.'
    };
    blackHoleGroup.add(eventHorizonMesh);

    // 6. Razor-Thin Photon Ring (Einstein Ring Hugging Event Horizon)
    const photonRingGeo = new THREE.RingGeometry(eventHorizonRadius + 0.01, photonRingRadius, 128);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });
    photonRingMesh = new THREE.Mesh(photonRingGeo, photonRingMat);
    blackHoleGroup.add(photonRingMesh);

    // Outer soft pink corona halo around the shadow
    const coronaGeo = new THREE.RingGeometry(photonRingRadius, photonRingRadius + 0.45, 128);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff2a85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    blackHoleGroup.add(coronaMesh);

    // 7. Gravitational Lensing Ring (The Vertical Loop Arch over and under)
    // The sphere at (0, 0, 0) naturally occludes the center of this ring!
    const lensGeo = new THREE.RingGeometry(eventHorizonRadius + 0.05, lensOuterRadius, 160);
    const lensMat = new THREE.MeshBasicMaterial({
      map: accretionTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    lensingRingMesh = new THREE.Mesh(lensGeo, lensMat);
    lensingRingMesh.position.z = -0.06; // Just slightly behind sphere center
    blackHoleGroup.add(lensingRingMesh);

    // 8. Equatorial Accretion Disk (Horizontal Plane cutting across front)
    const diskGeo = new THREE.RingGeometry(diskInnerRadius, diskOuterRadius, 180);
    const diskMat = new THREE.MeshBasicMaterial({
      map: accretionTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    accretionDiskMesh = new THREE.Mesh(diskGeo, diskMat);
    accretionDiskMesh.rotation.x = Math.PI / 2;
    blackHoleGroup.add(accretionDiskMesh);

    // 9. Volumetric Keplerian Particle Swarm (Accretion & Lensing Stardust)
    buildKeplerianParticles(starTexture);

    // 10. Orbiting 3D Extruded Love Hearts
    buildOrbitingLoveHearts();

    // 11. Deep Cosmic Starfield Background with Twinkling Shaders & Diamond Stars
    buildCosmicStarfield(starTexture, diamondTexture);

    // 12. Setup Controls
    setupGalaxyControls(container);

    // 13. Start Animation Loop
    animate();
  }

  // Build Keplerian particle flow in accretion disk and lensing arch
  function buildKeplerianParticles(starTexture) {
    const { equatorialParticles: eqCount, lensingParticles: lensCount, diskInnerRadius, diskOuterRadius, eventHorizonRadius, lensOuterRadius } = CONFIG.blackHole;

    // A. Equatorial Disk Particles
    const eqGeo = new THREE.BufferGeometry();
    const eqPositions = new Float32Array(eqCount * 3);
    const eqColors = new Float32Array(eqCount * 3);
    const eqData = [];

    const whiteCol = new THREE.Color('#ffffff');
    const pinkCol = new THREE.Color('#ff2a85');
    const roseCol = new THREE.Color('#fb7185');
    const purpleCol = new THREE.Color('#a855f7');
    const cyanCol = new THREE.Color('#00f0ff');

    for (let i = 0; i < eqCount; i++) {
      const i3 = i * 3;
      const r = diskInnerRadius + Math.pow(Math.random(), 1.8) * (diskOuterRadius - diskInnerRadius);
      const angle = Math.random() * Math.PI * 2;
      const ySpread = (Math.random() - 0.5) * (0.15 + (r / diskOuterRadius) * 0.65);

      eqPositions[i3] = Math.cos(angle) * r;
      eqPositions[i3 + 1] = ySpread;
      eqPositions[i3 + 2] = Math.sin(angle) * r;

      const speed = (0.24 / Math.pow(r, 1.35)) * (0.9 + Math.random() * 0.2);
      eqData.push({ r, angle, speed, y: ySpread });

      const norm = (r - diskInnerRadius) / (diskOuterRadius - diskInnerRadius);
      let c = whiteCol.clone();
      if (norm < 0.15) {
        c.lerp(pinkCol, norm / 0.15);
      } else if (norm < 0.55) {
        c = pinkCol.clone().lerp(roseCol, (norm - 0.15) / 0.4);
      } else {
        c = roseCol.clone().lerp(purpleCol, (norm - 0.55) / 0.45);
        if (Math.random() < 0.12) c.lerp(cyanCol, 0.6);
      }

      eqColors[i3] = c.r;
      eqColors[i3 + 1] = c.g;
      eqColors[i3 + 2] = c.b;
    }

    eqGeo.setAttribute('position', new THREE.BufferAttribute(eqPositions, 3));
    eqGeo.setAttribute('color', new THREE.BufferAttribute(eqColors, 3));

    const eqMat = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.22 : 0.18,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      opacity: 0.95
    });

    equatorialParticles = new THREE.Points(eqGeo, eqMat);
    equatorialParticles.userData = { particles: eqData };
    blackHoleGroup.add(equatorialParticles);

    // B. Gravitational Lensing Particles (Vertical Arch Flow)
    const lensGeo = new THREE.BufferGeometry();
    const lensPositions = new Float32Array(lensCount * 3);
    const lensColors = new Float32Array(lensCount * 3);
    const lensData = [];

    for (let i = 0; i < lensCount; i++) {
      const i3 = i * 3;
      const r = (eventHorizonRadius + 0.1) + Math.pow(Math.random(), 1.5) * (lensOuterRadius - eventHorizonRadius);
      const angle = Math.random() * Math.PI * 2;
      const zSpread = -0.06 + (Math.random() - 0.5) * 0.25;

      lensPositions[i3] = Math.cos(angle) * r;
      lensPositions[i3 + 1] = Math.sin(angle) * r;
      lensPositions[i3 + 2] = zSpread;

      const speed = (0.20 / Math.pow(r, 1.35)) * (0.85 + Math.random() * 0.3);
      lensData.push({ r, angle, speed, z: zSpread });

      const norm = (r - eventHorizonRadius) / (lensOuterRadius - eventHorizonRadius);
      let c = whiteCol.clone();
      if (norm < 0.2) {
        c.lerp(pinkCol, norm / 0.2);
      } else {
        c = pinkCol.clone().lerp(purpleCol, (norm - 0.2) / 0.8);
      }

      lensColors[i3] = c.r;
      lensColors[i3 + 1] = c.g;
      lensColors[i3 + 2] = c.b;
    }

    lensGeo.setAttribute('position', new THREE.BufferAttribute(lensPositions, 3));
    lensGeo.setAttribute('color', new THREE.BufferAttribute(lensColors, 3));

    const lensPartMat = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.20 : 0.16,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      opacity: 0.9
    });

    lensingParticles = new THREE.Points(lensGeo, lensPartMat);
    lensingParticles.userData = { particles: lensData };
    blackHoleGroup.add(lensingParticles);
  }

  // Build orbiting 3D love hearts inside the accretion disk
  function buildOrbitingLoveHearts() {
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    const heartColors = [0xff2a85, 0xff0066, 0x00f0ff, 0xa855f7, 0xff66b2, 0xffffff];

    for (let i = 0; i < 30; i++) {
      const col = heartColors[i % heartColors.length];
      const heartMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.65,
        roughness: 0.2,
        metalness: 0.8
      });

      const heartMesh = new THREE.Mesh(heartGeo, heartMat);
      const scale = 0.45 + Math.random() * 0.5;
      heartMesh.scale.set(scale, scale, scale);

      heartMesh.userData = {
        type: 'heart',
        radius: 4.8 + Math.random() * 14.0,
        angle: Math.random() * Math.PI * 2,
        ySpeed: 0.005 + Math.random() * 0.014,
        yOffset: (Math.random() - 0.5) * 1.8,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        quoteObj: getRandomQuote()
      };

      heartMesh.position.x = Math.cos(heartMesh.userData.angle) * heartMesh.userData.radius;
      heartMesh.position.z = Math.sin(heartMesh.userData.angle) * heartMesh.userData.radius;
      heartMesh.position.y = heartMesh.userData.yOffset;

      blackHoleGroup.add(heartMesh);
      heartGroup.push(heartMesh);
    }
  }

  // Build deep cosmic starfield with organic twinkling shaders, diamond stars, and floating stardust
  function buildCosmicStarfield(starTexture, diamondTexture) {
    const starCount = CONFIG.blackHole.backgroundStars;
    const diamondCount = CONFIG.blackHole.diamondStars;
    const stardustCount = CONFIG.blackHole.stardustCount;

    // A. 5,000+ Twinkling Cosmic Stars with GPU Shader
    const bgGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const speeds = new Float32Array(starCount);
    const phases = new Float32Array(starCount);
    const twinkleAmps = new Float32Array(starCount);

    const baseCols = [
      new THREE.Color('#ffffff'), // Pure brilliant white
      new THREE.Color('#ffffff'), // Extra white weight
      new THREE.Color('#ffe4e6'), // Soft starlight pink
      new THREE.Color('#ff6fa5'), // Neon rose
      new THREE.Color('#00f0ff'), // Starlight cyan
      new THREE.Color('#bae6fd'), // Ice blue
      new THREE.Color('#c084fc'), // Starlight lavender
      new THREE.Color('#fef08a')  // Warm starlight champagne
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Spherical distribution around cosmos
      const radius = 24 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const c = baseCols[Math.floor(Math.random() * baseCols.length)];
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i] = 0.8 + Math.random() * 1.1;
      speeds[i] = 1.8 + Math.random() * 4.4; // Radians per sec
      phases[i] = Math.random() * Math.PI * 2;
      twinkleAmps[i] = 0.50 + Math.random() * 0.45;
    }

    bgGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bgGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    bgGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    bgGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    bgGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    bgGeo.setAttribute('aTwinkleAmp', new THREE.BufferAttribute(twinkleAmps, 1));

    starShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: starTexture },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSize;
        attribute float aSpeed;
        attribute float aPhase;
        attribute float aTwinkleAmp;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;

          // Organic two-harmonic twinkle curve
          float s1 = sin(uTime * aSpeed + aPhase);
          float s2 = sin(uTime * (aSpeed * 1.63) + aPhase * 2.14);
          float combined = 0.5 + 0.32 * s1 + 0.18 * s2;

          // Crisp diamond peak so stars glitter sharply
          float peak = pow(clamp(combined, 0.0, 1.0), 2.5);
          vAlpha = 0.35 + 0.65 * peak;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float distScale = 180.0 / -mvPosition.z;
          gl_PointSize = clamp((aSize * (0.9 + 1.4 * peak)) * distScale * uPixelRatio, 2.2, 11.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, tex.a * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    bgStarPoints = new THREE.Points(bgGeo, starShaderMaterial);
    scene.add(bgStarPoints);

    // B. ~220 Hero Diamond Cross-Flare Sparkle Stars (4-pointed stellar glints)
    const diamondGeo = new THREE.BufferGeometry();
    const dPositions = new Float32Array(diamondCount * 3);
    const dColors = new Float32Array(diamondCount * 3);
    const dSizes = new Float32Array(diamondCount);
    const dSpeeds = new Float32Array(diamondCount);
    const dPhases = new Float32Array(diamondCount);
    const dTwinkleAmps = new Float32Array(diamondCount);

    const diamondPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#00f0ff'),
      new THREE.Color('#ff85b3'),
      new THREE.Color('#fef08a'),
      new THREE.Color('#e0aaff')
    ];

    for (let i = 0; i < diamondCount; i++) {
      const i3 = i * 3;
      const radius = 22 + Math.random() * 65;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      dPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      dPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dPositions[i3 + 2] = radius * Math.cos(phi);

      const c = diamondPalette[Math.floor(Math.random() * diamondPalette.length)];
      dColors[i3] = c.r;
      dColors[i3 + 1] = c.g;
      dColors[i3 + 2] = c.b;

      dSizes[i] = 1.2 + Math.random() * 1.3; // Calibrated cross flare size
      dSpeeds[i] = 1.0 + Math.random() * 2.5; // Majestic slow breathing glint
      dPhases[i] = Math.random() * Math.PI * 2;
      dTwinkleAmps[i] = 0.65 + Math.random() * 0.35;
    }

    diamondGeo.setAttribute('position', new THREE.BufferAttribute(dPositions, 3));
    diamondGeo.setAttribute('aColor', new THREE.BufferAttribute(dColors, 3));
    diamondGeo.setAttribute('aSize', new THREE.BufferAttribute(dSizes, 1));
    diamondGeo.setAttribute('aSpeed', new THREE.BufferAttribute(dSpeeds, 1));
    diamondGeo.setAttribute('aPhase', new THREE.BufferAttribute(dPhases, 1));
    diamondGeo.setAttribute('aTwinkleAmp', new THREE.BufferAttribute(dTwinkleAmps, 1));

    diamondShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: diamondTexture },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSize;
        attribute float aSpeed;
        attribute float aPhase;
        attribute float aTwinkleAmp;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;

          float s1 = sin(uTime * aSpeed + aPhase);
          float s2 = cos(uTime * (aSpeed * 0.72) + aPhase * 1.41);
          float combined = 0.5 + 0.35 * s1 + 0.15 * s2;
          float peak = pow(clamp(combined, 0.0, 1.0), 2.8);
          vAlpha = 0.40 + 0.60 * peak;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float distScale = 200.0 / -mvPosition.z;
          gl_PointSize = clamp((aSize * (0.9 + 1.5 * peak)) * distScale * uPixelRatio, 8.0, 30.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, tex.a * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    diamondStarsPoints = new THREE.Points(diamondGeo, diamondShaderMaterial);
    scene.add(diamondStarsPoints);

    // C. Floating Ambient Stardust (Motes drifting near camera & black hole)
    const stardustGeo = new THREE.BufferGeometry();
    const sPositions = new Float32Array(stardustCount * 3);
    const sColors = new Float32Array(stardustCount * 3);
    const stardustData = [];

    for (let i = 0; i < stardustCount; i++) {
      const i3 = i * 3;
      const radius = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const bx = radius * Math.sin(phi) * Math.cos(theta);
      const by = (radius * Math.sin(phi) * Math.sin(theta)) * 0.6 + 1.2;
      const bz = radius * Math.cos(phi);

      sPositions[i3] = bx;
      sPositions[i3 + 1] = by;
      sPositions[i3 + 2] = bz;

      const c = Math.random() > 0.4 ? new THREE.Color('#ff2a85') : new THREE.Color('#00f0ff');
      sColors[i3] = c.r;
      sColors[i3 + 1] = c.g;
      sColors[i3 + 2] = c.b;

      stardustData.push({
        baseX: bx,
        baseY: by,
        baseZ: bz,
        driftSpeedX: 0.15 + Math.random() * 0.35,
        driftSpeedY: 0.12 + Math.random() * 0.28,
        driftSpeedZ: 0.14 + Math.random() * 0.32,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        driftAmpX: 0.6 + Math.random() * 1.4,
        driftAmpY: 0.5 + Math.random() * 1.2,
        driftAmpZ: 0.6 + Math.random() * 1.4
      });
    }

    stardustGeo.setAttribute('position', new THREE.BufferAttribute(sPositions, 3));
    stardustGeo.setAttribute('color', new THREE.BufferAttribute(sColors, 3));

    const stardustMat = new THREE.PointsMaterial({
      size: 0.35,
      map: starTexture,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.70
    });

    stardustPoints = new THREE.Points(stardustGeo, stardustMat);
    stardustPoints.userData = { particles: stardustData };
    scene.add(stardustPoints);
  }

  // 3D Romantic Shooting Star / Meteor Engine
  function launchAmbientShootingStar(colorOverride = null) {
    if (!scene) return;
    const meteorGeo = new THREE.BufferGeometry();
    const trailLength = 28;
    const positions = new Float32Array(trailLength * 3);

    // Spawn high above in sky dome
    const startX = (Math.random() - 0.5) * 55;
    const startY = 16 + Math.random() * 14;
    const startZ = -12 + (Math.random() - 0.5) * 45;

    // Trajectory vector
    const speed = 0.95 + Math.random() * 0.5;
    const dirX = (Math.random() > 0.5 ? -1 : 1) * (0.65 + Math.random() * 0.4);
    const dirY = -(0.55 + Math.random() * 0.35);
    const dirZ = (Math.random() - 0.5) * 0.45;

    for (let i = 0; i < trailLength; i++) {
      positions[i * 3] = startX - (dirX * i * 0.38);
      positions[i * 3 + 1] = startY - (dirY * i * 0.38);
      positions[i * 3 + 2] = startZ - (dirZ * i * 0.38);
    }
    meteorGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const meteorColors = [0x00f0ff, 0xff2a85, 0xffffff, 0xfb7185, 0xa855f7, 0xfef08a];
    const chosenColor = colorOverride || meteorColors[Math.floor(Math.random() * meteorColors.length)];

    const meteorMat = new THREE.LineBasicMaterial({
      color: chosenColor,
      transparent: true,
      opacity: 0.96,
      blending: THREE.AdditiveBlending,
      linewidth: 2.2
    });

    const meteorLine = new THREE.Line(meteorGeo, meteorMat);
    meteorLine.userData = {
      vx: dirX * speed,
      vy: dirY * speed,
      vz: dirZ * speed,
      life: 1.0
    };
    scene.add(meteorLine);
    shootingStars.push(meteorLine);
  }

  // 3D Celebration Meteor Burst
  function launch3DCelebrationMeteor() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        launchAmbientShootingStar();
      }, i * 180);
    }
  }

  // Setup 360° Drag & Touch Controls
  function setupGalaxyControls(container) {
    function onPointerDown(e) {
      isDragging = true;
      dragDistance = 0;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      previousMousePosition = { x: clientX, y: clientY };
    }

    function onPointerMove(e) {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (isDragging && clientX !== undefined && clientY !== undefined) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;
        dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

        targetRotY += deltaX * 0.005;
        targetRotX += deltaY * 0.004;
        targetRotX = Math.max(-0.4, Math.min(1.1, targetRotX));

        previousMousePosition = { x: clientX, y: clientY };
      }
    }

    function onPointerUp(e) {
      if (dragDistance < 10) {
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        if (clientX !== undefined && clientY !== undefined) {
          handle3DObjectClick(clientX, clientY);
        }
      }
      isDragging = false;
    }

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });

    // Mouse wheel zoom
    window.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > 5) {
        targetDistance += e.deltaY * 0.015;
        targetDistance = Math.max(14, Math.min(42, targetDistance));
      }
    }, { passive: true });

    // Window resize
    window.addEventListener('resize', () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  // Handle Raycasting click on 3D objects
  function handle3DObjectClick(clientX, clientY) {
    if (!camera || !scene) return;
    mousePointer.x = (clientX / window.innerWidth) * 2 - 1;
    mousePointer.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePointer, camera);

    const interactiveTargets = [
      ...heartGroup,
      eventHorizonMesh,
      accretionDiskMesh,
      lensingRingMesh
    ];

    const intersects = raycaster.intersectObjects(interactiveTargets, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const data = hit.userData || {};

      playCelestialChime();
      playHeartbeatSound();
      burstOfLove(clientX, clientY, 22);

      const origScale = hit.scale.x;
      hit.scale.set(origScale * 1.3, origScale * 1.3, origScale * 1.3);
      setTimeout(() => {
        hit.scale.set(origScale, origScale, origScale);
      }, 400);

      const quoteObj = data.quoteObj || (data.title ? { title: data.title, quote: data.quote } : getRandomQuote());
      showGalaxyToast(quoteObj.title, quoteObj.quote);
    }
  }

  // Main 3D Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Smooth Camera Damping & Rotation
    if (!isDragging) {
      targetRotY += 0.001;
    }

    rotY += (targetRotY - rotY) * 0.05;
    rotX += (targetRotX - rotX) * 0.05;
    currentDistance += (targetDistance - currentDistance) * 0.05;

    camera.position.x = Math.sin(rotY) * Math.cos(rotX) * currentDistance;
    camera.position.y = Math.sin(rotX) * currentDistance + 3.0;
    camera.position.z = Math.cos(rotY) * Math.cos(rotX) * currentDistance;
    camera.lookAt(0, 1.5, 0);

    // 2. Rotate Accretion Disk & Lensing Textures
    if (accretionDiskMesh) {
      accretionDiskMesh.rotation.z += 0.003;
    }
    if (lensingRingMesh) {
      lensingRingMesh.rotation.z += 0.003;
    }

    // 3. Pulse Photon Ring
    if (photonRingMesh) {
      const pulse = 0.94 + 0.06 * Math.sin(elapsedTime * 4.5);
      photonRingMesh.material.opacity = pulse;
    }

    // 4. Update Keplerian Equatorial Particles
    if (equatorialParticles) {
      const pos = equatorialParticles.geometry.attributes.position.array;
      const pData = equatorialParticles.userData.particles;
      for (let i = 0; i < pData.length; i++) {
        const p = pData[i];
        p.angle += p.speed;
        const i3 = i * 3;
        pos[i3] = Math.cos(p.angle) * p.r;
        pos[i3 + 2] = Math.sin(p.angle) * p.r;
      }
      equatorialParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Update Keplerian Lensing Particles
    if (lensingParticles) {
      const pos = lensingParticles.geometry.attributes.position.array;
      const pData = lensingParticles.userData.particles;
      for (let i = 0; i < pData.length; i++) {
        const p = pData[i];
        p.angle += p.speed;
        const i3 = i * 3;
        pos[i3] = Math.cos(p.angle) * p.r;
        pos[i3 + 1] = Math.sin(p.angle) * p.r;
      }
      lensingParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 6. Orbit 3D Hearts in Accretion Disk
    heartGroup.forEach(heart => {
      heart.userData.angle += heart.userData.ySpeed;
      heart.position.x = Math.cos(heart.userData.angle) * heart.userData.radius;
      heart.position.z = Math.sin(heart.userData.angle) * heart.userData.radius;
      heart.position.y = heart.userData.yOffset + Math.sin(elapsedTime * 2.2 + heart.userData.angle) * 0.35;
      heart.rotation.x += heart.userData.rotSpeedX;
      heart.rotation.y += heart.userData.rotSpeedY;
    });

    // 7. Update Twinkling Cosmic Starfield Shaders & Drift
    if (starShaderMaterial) {
      starShaderMaterial.uniforms.uTime.value = elapsedTime;
    }
    if (diamondShaderMaterial) {
      diamondShaderMaterial.uniforms.uTime.value = elapsedTime;
    }
    if (bgStarPoints) {
      bgStarPoints.rotation.y = elapsedTime * 0.003;
    }
    if (diamondStarsPoints) {
      diamondStarsPoints.rotation.y = elapsedTime * 0.0022;
      diamondStarsPoints.rotation.x = Math.sin(elapsedTime * 0.04) * 0.04;
    }

    // 8. Update Floating Cosmic Stardust (Gentle drifting fireflies)
    if (stardustPoints && stardustPoints.userData.particles) {
      const pos = stardustPoints.geometry.attributes.position.array;
      const data = stardustPoints.userData.particles;
      for (let i = 0; i < data.length; i++) {
        const p = data[i];
        const i3 = i * 3;
        pos[i3] = p.baseX + Math.sin(elapsedTime * p.driftSpeedX + p.phaseX) * p.driftAmpX;
        pos[i3 + 1] = p.baseY + Math.cos(elapsedTime * p.driftSpeedY + p.phaseY) * p.driftAmpY;
        pos[i3 + 2] = p.baseZ + Math.sin(elapsedTime * p.driftSpeedZ + p.phaseZ) * p.driftAmpZ;
      }
      stardustPoints.geometry.attributes.position.needsUpdate = true;
    }

    // 9. Automatic Romantic Meteor Shower (Shooting stars every 3-6s)
    if (elapsedTime > nextMeteorTime) {
      launchAmbientShootingStar();
      nextMeteorTime = elapsedTime + 3.0 + Math.random() * 3.5;
    }

    // 10. Update Active Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      star.position.x += star.userData.vx;
      star.position.y += star.userData.vy;
      star.position.z += star.userData.vz;
      star.userData.life -= 0.018;
      star.material.opacity = Math.max(0, star.userData.life);
      if (star.userData.life <= 0) {
        scene.remove(star);
        star.geometry.dispose();
        star.material.dispose();
        shootingStars.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }

  // Safe Three.js initializer
  function tryInitBlackHole() {
    if (typeof THREE !== 'undefined') {
      initThreeBlackHole();
    } else {
      setTimeout(tryInitBlackHole, 100);
    }
  }

  tryInitBlackHole();

  function launchCelebrationMeteor() {
    launch3DCelebrationMeteor();
    launch3DCelebrationMeteor();
  }

  // ==========================================
  // 6. LIVE RELATIONSHIP ORBIT COUNTER
  // ==========================================
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMinutes = document.getElementById('count-minutes');
  const countSeconds = document.getElementById('count-seconds');

  function updateOrbitCounter() {
    const now = new Date();
    const diff = now - CONFIG.startDate;

    if (diff < 0) {
      if (countDays) countDays.textContent = '000';
      if (countHours) countHours.textContent = '00';
      if (countMinutes) countMinutes.textContent = '00';
      if (countSeconds) countSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (countDays) countDays.textContent = String(days).padStart(3, '0');
    if (countHours) countHours.textContent = String(hours).padStart(2, '0');
    if (countMinutes) countMinutes.textContent = String(minutes).padStart(2, '0');
    if (countSeconds) countSeconds.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateOrbitCounter, 1000);
  updateOrbitCounter();

  // ==========================================
  // 7. DUAL-MODE MUSIC & AMBIENT SYNTH ENGINE
  // ==========================================
  const audioElem = document.getElementById('romantic-audio');
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const audioEq = document.getElementById('audio-eq');
  const musicDisc = document.getElementById('music-disc');

  let isPlaying = false;
  let synthInterval = null;

  function playProceduralRomanticChords() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const chordNotes = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [146.83, 220.00, 261.63, 293.66], // Dm7
        [116.54, 174.61, 220.00, 261.63], // Bbmaj7
        [130.81, 196.00, 261.63, 293.66]  // Csus
      ];

      let chordIndex = 0;

      function triggerChord() {
        if (!isPlaying) return;
        const notes = chordNotes[chordIndex];
        const now = ctx.currentTime;

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);

          gain.gain.setValueAtTime(0, now + i * 0.12);
          gain.gain.linearRampToValueAtTime(0.08, now + i * 0.12 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 2);
        });

        chordIndex = (chordIndex + 1) % chordNotes.length;
      }

      triggerChord();
      synthInterval = setInterval(triggerChord, 3800);
    } catch(e) {}
  }

  function stopProceduralChords() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function setPlaybackState(playing) {
    isPlaying = playing;
    if (playing) {
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (audioEq) audioEq.classList.add('active');
      if (musicDisc) musicDisc.classList.add('spinning');
      if (toggleAudioBtn) {
        const label = toggleAudioBtn.querySelector('.audio-btn-label');
        if (label) label.textContent = 'Pause Atmosphere';
      }
    } else {
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (audioEq) audioEq.classList.remove('active');
      if (musicDisc) musicDisc.classList.remove('spinning');
      if (toggleAudioBtn) {
        const label = toggleAudioBtn.querySelector('.audio-btn-label');
        if (label) label.textContent = 'I Wanna Be Yours';
      }
    }
  }

  function toggleAudio() {
    if (isPlaying) {
      if (audioElem) audioElem.pause();
      stopProceduralChords();
      setPlaybackState(false);
    } else {
      if (audioElem && audioElem.src && !audioElem.error) {
        const playPromise = audioElem.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlaybackState(true);
            })
            .catch(() => {
              playProceduralRomanticChords();
              setPlaybackState(true);
            });
        } else {
          playProceduralRomanticChords();
          setPlaybackState(true);
        }
      } else {
        playProceduralRomanticChords();
        setPlaybackState(true);
      }
    }
  }

  if (toggleAudioBtn) toggleAudioBtn.addEventListener('click', toggleAudio);
  if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAudio);

  // ==========================================
  // 8. STARDUST & HEART BURST EFFECTS
  // ==========================================
  function spawnFloatingSparkle(x, y, char = '✨') {
    const el = document.createElement('span');
    el.className = 'floating-sparkle';
    el.textContent = char;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const randomTx = (Math.random() - 0.5) * 80;
    el.style.setProperty('--tx', `${randomTx}px`);
    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1800);
  }

  function burstOfLove(x, y, count = 12) {
    const symbols = ['💖', '✨', '🪐', '💫', '💕', '⭐'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const char = symbols[Math.floor(Math.random() * symbols.length)];
        const spreadX = x + (Math.random() - 0.5) * 60;
        const spreadY = y + (Math.random() - 0.5) * 60;
        spawnFloatingSparkle(spreadX, spreadY, char);
      }, i * 40);
    }
  }

  // ==========================================
  // 9. 3D TOAST MODAL POPUP
  // ==========================================
  const galaxyToast = document.getElementById('galaxy-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  const toastCloseBtn = document.getElementById('toast-close-btn');
  const toastActionBtn = document.getElementById('toast-action-btn');

  function showGalaxyToast(title, message) {
    if (!galaxyToast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;
    galaxyToast.classList.remove('hidden');
  }

  function hideGalaxyToast() {
    if (galaxyToast) galaxyToast.classList.add('hidden');
  }

  if (toastCloseBtn) toastCloseBtn.addEventListener('click', hideGalaxyToast);
  if (toastActionBtn) {
    toastActionBtn.addEventListener('click', () => {
      hideGalaxyToast();
      openLetter();
    });
  }
  if (galaxyToast) {
    galaxyToast.addEventListener('click', (e) => {
      if (e.target.classList.contains('toast-backdrop')) {
        hideGalaxyToast();
      }
    });
  }

  // ==========================================
  // 10. VIEW MODE SWITCHER & QUICK DOCK
  // ==========================================
  const btnModeGalaxy = document.getElementById('btn-mode-galaxy');
  const btnModeStory = document.getElementById('btn-mode-story');
  const storyWrapper = document.getElementById('story-sections-wrapper');
  const scrollToStoryBtn = document.getElementById('scroll-to-story-btn');

  function enterGalaxyMode() {
    document.body.classList.add('mode-galaxy-active');
    document.body.classList.remove('mode-story-active');
    if (btnModeGalaxy) btnModeGalaxy.classList.add('active');
    if (btnModeStory) btnModeStory.classList.remove('active');
    if (storyWrapper) storyWrapper.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    targetDistance = window.innerWidth < 768 ? 28 : 23;
    targetRotX = 0.20;
    playCelestialChime();
  }

  function enterStoryMode(targetSectionId = null) {
    document.body.classList.add('mode-story-active');
    document.body.classList.remove('mode-galaxy-active');
    if (btnModeStory) btnModeStory.classList.add('active');
    if (btnModeGalaxy) btnModeGalaxy.classList.remove('active');
    if (storyWrapper) storyWrapper.classList.remove('hidden');

    const targetEl = targetSectionId ? document.getElementById(targetSectionId) : document.getElementById('counter');
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
    playCelestialChime();
  }

  if (btnModeGalaxy) btnModeGalaxy.addEventListener('click', enterGalaxyMode);
  if (btnModeStory) btnModeStory.addEventListener('click', () => enterStoryMode('counter'));
  if (scrollToStoryBtn) scrollToStoryBtn.addEventListener('click', () => enterStoryMode('counter'));

  // Quick Dock Handlers
  const dockLetterBtn = document.getElementById('dock-letter-btn');
  const dockCounterBtn = document.getElementById('dock-counter-btn');
  const dockWishBtn = document.getElementById('dock-wish-btn');
  const dockScannerBtn = document.getElementById('dock-scanner-btn');

  if (dockLetterBtn) dockLetterBtn.addEventListener('click', openLetter);
  if (dockCounterBtn) dockCounterBtn.addEventListener('click', () => enterStoryMode('counter'));
  if (dockWishBtn) dockWishBtn.addEventListener('click', () => enterStoryMode('transmitter'));
  if (dockScannerBtn) dockScannerBtn.addEventListener('click', () => enterStoryMode('scanner'));

  // ==========================================
  // 11. INTERACTIVE INPUT-OUTPUT: STARLIGHT TRANSMITTER
  // ==========================================
  const moodChips = document.querySelectorAll('.mood-chip');
  const wishInput = document.getElementById('wish-input');
  const charCount = document.getElementById('char-count');
  const sendWishBtn = document.getElementById('send-wish-btn');
  const transmitterOutput = document.getElementById('transmitter-output');
  const outputResponseText = document.getElementById('output-response-text');
  const responseTimestamp = document.getElementById('response-timestamp');
  const vaultStream = document.getElementById('vault-stream');
  const clearVaultBtn = document.getElementById('clear-vault-btn');

  let selectedMood = 'kangen';
  let selectedMoodLabel = 'Kangen Berat';
  let selectedMoodEmoji = '🥺';

  moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
      moodChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedMood = chip.getAttribute('data-mood');
      selectedMoodEmoji = chip.getAttribute('data-emoji');
      selectedMoodLabel = chip.textContent.trim();
      spawnFloatingSparkle(chip.getBoundingClientRect().left + 20, chip.getBoundingClientRect().top, selectedMoodEmoji);
    });
  });

  if (wishInput && charCount) {
    wishInput.addEventListener('input', () => {
      charCount.textContent = `${wishInput.value.length} / 280`;
    });
  }

  const romanticResponses = {
    kangen: [
      "Sinyal rindumu langsung ditarik gravitasi hatiku, Halisa sayang! Setiap detik tanpamu rasanya sepi, tapi hatiku selalu memelukmu erat dari sini. I miss you more! 🥺💖",
      "Rasa kangenmu adalah gravitasi terkuat yang selalu menarikku kembali kepadamu. Jangan sedih yaa cantik, sebentar lagi kita ketemu! 💕🪐"
    ],
    bahagia: [
      "Melihatmu bahagia adalah pemandangan terindah di seluruh semesta ini! Semoga senyum manismu selalu bersinar seperti cincin foton paling terang yaa cintaku! 🥰✨",
      "Kebahagiaanmu adalah tujuan utamaku. Tetaplah tertawa ceria seperti ini, karena tawamu adalah pusat duniaku! 💖🌸"
    ],
    peluk: [
      "Mengirimkan pelukan kosmik paling hangat ke pelukan Halisa sekarang juga! Tarik napas dalam-dalam, pejamkan mata sejenak, dan rasakan kehadiranku di sampingmu 🤍🪐",
      "Kamu nggak pernah sendirian, sayang. Dalam suka maupun lelahmu, dekapanku selalu jadi tempat pulang ternyamanmu 🤍✨"
    ],
    jajan: [
      "Permintaan jajan disetujui semesta 100%! Siap-siap yaa sayang, es krim, boba, dan semua makanan kesukaanmu bakal segera meluncur ke hadapanmu! 🍦😋",
      "Mau jajan apa pun hari ini, katakan saja ratuku! Semua kelezatan di bumi ini siap kupesankan untukmu! 🍔🍰✨"
    ],
    curhat: [
      "Telinga dan hatiku selalu terbuka 24/7 khusus untuk Halisa. Ceritakan apa saja, aku akan selalu jadi pendengar setiamu dan rumah ternyamanmu 🌙💫",
      "Terima kasih sudah mau berbagi isi hatimu denganku. Setiap katamu sangat berarti bagiku, sayang 💖🪐"
    ]
  };

  function typeWriterEffect(element, text, speed = 25) {
    element.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  const VAULT_STORAGE_KEY = 'halisa_cosmic_wishes';

  function getStoredWishes() {
    try {
      const data = localStorage.getItem(VAULT_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch(e) {
      return [];
    }
  }

  function saveWishToVault(moodEmoji, moodLabel, messageText) {
    const wishes = getStoredWishes();
    const newEntry = {
      id: Date.now(),
      moodEmoji,
      moodLabel,
      messageText: messageText || '(Transmisi getaran rasa tanpa kata 💫)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    };
    wishes.unshift(newEntry);
    if (wishes.length > 15) wishes.pop();
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(wishes));
    } catch(e) {}
    renderVaultStream();
  }

  function renderVaultStream() {
    if (!vaultStream) return;
    const wishes = getStoredWishes();

    if (wishes.length === 0) {
      vaultStream.innerHTML = `
        <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 0.85rem;">
          Belum ada transmisi tersimpan. Jadilah yang pertama mengirimkan sinyal bintangmu! ✨
        </div>
      `;
      return;
    }

    vaultStream.innerHTML = wishes.map(w => `
      <div class="vault-item">
        <div class="vault-item-meta">
          <span class="vault-item-mood">${w.moodEmoji} ${w.moodLabel}</span>
          <span class="vault-item-time">${w.date}, ${w.timestamp}</span>
        </div>
        <p class="vault-item-text">${escapeHtml(w.messageText)}</p>
      </div>
    `).join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  if (clearVaultBtn) {
    clearVaultBtn.addEventListener('click', () => {
      if (confirm('Hapus seluruh catatan transmisi bintang di perangkat ini?')) {
        localStorage.removeItem(VAULT_STORAGE_KEY);
        renderVaultStream();
      }
    });
  }

  if (sendWishBtn) {
    sendWishBtn.addEventListener('click', () => {
      const userText = wishInput.value.trim();
      launchCelebrationMeteor();
      playCelestialChime();
      burstOfLove(window.innerWidth / 2, 300, 16);

      const pool = romanticResponses[selectedMood] || romanticResponses.kangen;
      const chosenReply = pool[Math.floor(Math.random() * pool.length)];

      if (transmitterOutput) transmitterOutput.classList.remove('hidden');
      if (responseTimestamp) responseTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (outputResponseText) typeWriterEffect(outputResponseText, chosenReply);

      saveWishToVault(selectedMoodEmoji, selectedMoodLabel, userText);

      wishInput.value = '';
      if (charCount) charCount.textContent = '0 / 280';
      if (transmitterOutput) transmitterOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  renderVaultStream();

  // ==========================================
  // 12. INTERACTIVE BIOMETRIC LOVE SCANNER (HOLD TO SCAN)
  // ==========================================
  const scannerBtn = document.getElementById('scanner-btn');
  const progressBar = document.getElementById('scanner-progress-bar');
  const scannerPercentage = document.getElementById('scanner-percentage');
  const scannerInstruction = document.getElementById('scanner-instruction');
  const scannerResult = document.getElementById('scanner-result');

  let scanHoldTimer = null;
  const SCAN_DURATION = 2000;
  const CIRCLE_CIRCUMFERENCE = 440;

  function startScan(e) {
    e.preventDefault();
    if (scannerResult && !scannerResult.classList.contains('hidden')) return;

    scannerBtn.classList.add('is-scanning');
    scannerInstruction.textContent = 'Memindai frekuensi cinta... Tahan!';
    scannerInstruction.style.color = 'var(--neon-pink)';

    const startTime = performance.now();

    function updateScan(currentTime) {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(1, elapsed / SCAN_DURATION);
      
      const offset = CIRCLE_CIRCUMFERENCE - (progressRatio * CIRCLE_CIRCUMFERENCE);
      if (progressBar) progressBar.style.strokeDashoffset = offset;

      const currentPercent = Math.floor(progressRatio * 1000);
      if (scannerPercentage) scannerPercentage.textContent = `${currentPercent}%`;

      if (progressRatio < 1) {
        scanHoldTimer = requestAnimationFrame(updateScan);
      } else {
        finishScan();
      }
    }

    scanHoldTimer = requestAnimationFrame(updateScan);
  }

  function cancelScan() {
    if (scannerResult && !scannerResult.classList.contains('hidden')) return;
    if (scanHoldTimer) {
      cancelAnimationFrame(scanHoldTimer);
      scanHoldTimer = null;
    }
    if (scannerBtn) scannerBtn.classList.remove('is-scanning');
    if (progressBar) progressBar.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;
    if (scannerPercentage) scannerPercentage.textContent = '0%';
    if (scannerInstruction) {
      scannerInstruction.textContent = 'Sentuh & tahan pemindai (Hold for 2s)';
      scannerInstruction.style.color = 'var(--text-secondary)';
    }
  }

  function finishScan() {
    cancelAnimationFrame(scanHoldTimer);
    if (scannerBtn) {
      scannerBtn.classList.remove('is-scanning');
      scannerBtn.style.pointerEvents = 'none';
    }
    if (scannerInstruction) {
      scannerInstruction.textContent = '✦ SINKRONISASI SELESAI ✦';
      scannerInstruction.style.color = 'var(--neon-cyan)';
    }
    if (scannerPercentage) scannerPercentage.textContent = '1000%';

    playCelestialChime();
    playHeartbeatSound();
    burstOfLove(window.innerWidth / 2, window.innerHeight / 2, 28);
    launchCelebrationMeteor();

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 150]);
    }

    if (scannerResult) {
      scannerResult.classList.remove('hidden');
      scannerResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (scannerBtn) {
    scannerBtn.addEventListener('mousedown', startScan);
    window.addEventListener('mouseup', cancelScan);

    scannerBtn.addEventListener('touchstart', startScan, { passive: false });
    window.addEventListener('touchend', cancelScan);
    window.addEventListener('touchcancel', cancelScan);
  }

  // ==========================================
  // 13. HOLOGRAPHIC LETTER MODAL
  // ==========================================
  const openLetterBtn = document.getElementById('open-letter-btn');
  const letterModal = document.getElementById('letter-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const kissBtn = document.getElementById('kiss-btn');

  function openLetter() {
    if (!letterModal) return;
    letterModal.classList.remove('hidden');
    burstOfLove(window.innerWidth / 2, window.innerHeight / 2, 16);
    playCelestialChime();
  }

  function closeLetter() {
    if (letterModal) letterModal.classList.add('hidden');
  }

  if (openLetterBtn) openLetterBtn.addEventListener('click', openLetter);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeLetter);
  
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        closeLetter();
      }
    });
  }

  if (kissBtn) {
    kissBtn.addEventListener('click', (e) => {
      burstOfLove(e.clientX, e.clientY, 24);
      playCelestialChime();
      kissBtn.innerHTML = '<span>Terkirim ke Hati Halisa! 💕✨</span>';
      setTimeout(() => {
        kissBtn.innerHTML = '<span>Kirim Peluk & Cium Virtual 💫</span>';
      }, 3000);
    });
  }

  // ==========================================
  // 14. PLAYFUL INTERACTIVE QUESTION SECTION
  // ==========================================
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const answerResponse = document.getElementById('answer-response');

  if (btnYes) {
    btnYes.addEventListener('click', (e) => {
      burstOfLove(e.clientX, e.clientY, 35);
      playCelestialChime();
      playHeartbeatSound();
      launchCelebrationMeteor();
      if (answerResponse) answerResponse.classList.remove('hidden');
      btnYes.style.transform = 'scale(1.08)';
      btnYes.innerHTML = '<span>Selamanya Milikmu! 💖✨</span>';
      if (btnNo) btnNo.style.display = 'none';

      if (!isPlaying) {
        toggleAudio();
      }

      if (answerResponse) answerResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (btnNo) {
    const cheekyPhrases = [
      'Yakin nih? 🥺',
      'Coba pikir lagi yaa... 🪐',
      'Gaada tombol ini wkwk 😜',
      'Tombol kirinya lebih cakep! ✨',
      'Eits, gabisa diklik! 😋'
    ];
    let phraseIdx = 0;

    function dodgeButton() {
      const maxOffset = 90;
      const randomX = (Math.random() - 0.5) * maxOffset * 2;
      const randomY = (Math.random() - 0.5) * 60;
      
      btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
      const textElem = btnNo.querySelector('.btn-text');
      if (textElem) {
        textElem.textContent = cheekyPhrases[phraseIdx % cheekyPhrases.length];
      }
      phraseIdx++;
    }

    btnNo.addEventListener('mouseenter', dodgeButton);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeButton();
    });
    btnNo.addEventListener('click', dodgeButton);
  }

  console.log(
    '%c✨ GARGANTUA OF LOVE // BLACK HOLE ✨\n%cDedicated specially for Halisa Nurul Zakia by Fajar Syahruddin.\nGravitasi terkuat di semesta ini adalah cintamu!',
    'color: #ff2a85; font-size: 16px; font-weight: bold;',
    'color: #00f0ff; font-size: 12px;'
  );

});
