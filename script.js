/**
 * Universe Of Love — Modern Neon Minimalism & 3D Interactive Galaxy
 * Dedicated to: Halisa Nurul Zakia
 * Creator: Fajar Syahruddin
 * 
 * Powered by Three.js 3D Engine, Cosmic Accretion Vortex, Orbiting 3D Hearts & Text Sprites,
 * Dual-Mode Audio Synthesizer, Starlight Wish Transmitter, and Biometric Scanner.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CONFIGURATION (Mudah Dikustomisasi)
  // ==========================================
  const CONFIG = {
    // Tanggal jadian / awal pertemuan (Format: YYYY, MM - 1, DD)
    // 14 Februari 2024
    startDate: new Date(2024, 1, 14, 0, 0, 0),
    startDateFormatted: '14 Februari 2024',
    
    // Nama Kekasih & Pencipta
    girlfriendName: 'Halisa Nurul Zakia',
    nickname: 'Halisa',
    author: 'Fajar Syahruddin',

    // Parameter Galaksi 3D
    galaxy: {
      starCount: window.innerWidth < 768 ? 16000 : 26000,
      arms: 4,
      radius: 22,
      spin: 0.85,
      randomness: 0.45,
      power: 3,
      topHeartParticles: window.innerWidth < 768 ? 2200 : 3600
    },
    
    // Warna tema neon
    colors: ['#00f0ff', '#ff2a85', '#a855f7', '#ffffff', '#ffd1dc']
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
        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } catch(e) {}
  }

  // ==========================================
  // 5. THREE.JS 3D ROTATING GALAXY ENGINE
  // ==========================================
  let scene, camera, renderer;
  let galaxyPoints, topHeartGroup, coreMesh, accretionRing;
  const heartGroup = [];
  const textSprites = [];
  const stickerSprites = [];
  const shootingStars = [];

  // Orbit controls variables
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotY = 0;
  let targetRotX = 0.35;
  let rotY = 0;
  let rotX = 0.35;
  let targetDistance = window.innerWidth < 768 ? 28 : 22;
  let currentDistance = targetDistance;
  let isGalaxyInteractive = true;

  // Raycaster for 3D interactions
  const raycaster = new THREE.Raycaster();
  const mousePointer = new THREE.Vector2();
  let dragDistance = 0;

  // Romantic quotes pool for 3D objects
  const romanticGalaxyQuotes = [
    { title: "Pusat Semestaku", quote: "Di antara triliunan bintang di jagat raya, gravitasi hatiku cuma tertuju padamu, Halisa Nurul Zakia. ✨💖" },
    { title: "I Wanna Be Yours", quote: "Aku ingin selalu jadi tempatmu bersandar, di setiap detik, menit, dan tahun perjalanan kita. 🪐" },
    { title: "Bintang Kejora", quote: "Senyum manismu adalah cahaya terindah yang selalu menerangi malam-malamku. Tetaplah bersinar cantikku! 🌸" },
    { title: "Orbit Abadi", quote: "Fajar & Halisa: Dua jiwa yang disatukan semesta dalam satu frekuensi cinta yang tak pernah padam. 💫" },
    { title: "Amor De Mi Vida", quote: "Mencintaimu adalah hal paling mudah, paling indah, dan paling membahagiakan dalam hidupku. 💕" },
    { title: "Takdir Terindah", quote: "Pertemuan kita bukanlah suatu kebetulan, melainkan takdir terindah yang dituliskan bintang-bintang. 🕊️" },
    { title: "Selamanya Bersamamu", quote: "Jika aku harus memilih lagi di ribuan kehidupan yang lain, aku akan tetap memilihmu, Halisa. 💍" },
    { title: "Detak Jantung Kosmik", quote: "Setiap detak jantungku berbisik lembut menyebut namamu: Halisa, Halisa, Halisa. 💖" }
  ];

  function getRandomQuote() {
    return romanticGalaxyQuotes[Math.floor(Math.random() * romanticGalaxyQuotes.length)];
  }

  // Generate a sharp circular star texture with radial glow
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

  // Generate floating 3D canvas text sprite
  function createFloatingTextSprite(text, color = '#ff2a85', subtitle = '✦ FAJAR & HALISA ✦') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Glass pill background
    ctx.fillStyle = 'rgba(12, 18, 36, 0.75)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    
    // Draw rounded rect
    const r = 36;
    ctx.beginPath();
    ctx.moveTo(r, 8);
    ctx.lineTo(512 - r, 8);
    ctx.quadraticCurveTo(512, 8, 512, 8 + r);
    ctx.lineTo(512, 128 - 8 - r);
    ctx.quadraticCurveTo(512, 128 - 8, 512 - r, 128 - 8);
    ctx.lineTo(r, 128 - 8);
    ctx.quadraticCurveTo(0, 128 - 8, 0, 128 - 8 - r);
    ctx.lineTo(0, 8 + r);
    ctx.quadraticCurveTo(0, 8, r, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text Subtitle
    ctx.font = 'bold 18px "Outfit", sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'center';
    ctx.fillText(subtitle, 256, 42);

    // Main Text
    ctx.font = 'bold 36px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillText(text, 256, 88);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(4.2, 1.05, 1);
    return sprite;
  }

  // Generate emoji/sticker sprite
  function createEmojiSprite(emoji, size = 1.4) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Radial soft glow behind sticker
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, 'rgba(255, 42, 133, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 68);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(size, size, 1);
    return sprite;
  }

  function initThreeGalaxy() {
    const container = document.getElementById('webgl-galaxy-container');
    if (!container || typeof THREE === 'undefined') return;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.015);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 14, currentDistance);
    camera.lookAt(0, 2, 0);

    // 2. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Scene Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xff2a85, 3.5, 45);
    coreLight.position.set(0, 2, 0);
    scene.add(coreLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2.5, 50);
    cyanLight.position.set(12, 6, 12);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2.5, 50);
    purpleLight.position.set(-12, -4, -12);
    scene.add(purpleLight);

    const starTexture = createStarTexture();

    // 4. Spiral Galaxy Accretion Disk (26,000+ points)
    const { starCount, arms, radius, spin, randomness, power } = CONFIG.galaxy;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorInside = new THREE.Color('#ffffff');
    const colorMid = new THREE.Color('#ff2a85');
    const colorOuter = new THREE.Color('#a855f7');
    const colorEdge = new THREE.Color('#00f0ff');

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Distance from center with higher density near core
      const r = Math.pow(Math.random(), 1.6) * radius + 1.2;
      const spinAngle = r * spin * 0.28;
      const branchAngle = ((i % arms) / arms) * Math.PI * 2;

      // Exponential random scattering
      const randomX = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * (r * 0.35);
      const randomZ = Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

      // Radial color blending
      const normR = r / radius;
      let mixedColor = colorInside.clone();
      if (normR < 0.25) {
        mixedColor.lerp(colorMid, normR / 0.25);
      } else if (normR < 0.65) {
        mixedColor = colorMid.clone().lerp(colorOuter, (normR - 0.25) / 0.4);
      } else {
        mixedColor = colorOuter.clone().lerp(colorEdge, (normR - 0.65) / 0.35);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.18 : 0.16,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.95
    });

    galaxyPoints = new THREE.Points(geometry, material);
    scene.add(galaxyPoints);

    // 5. Black Hole Event Horizon Core & Glowing Accretion Ring
    const blackHoleGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    coreMesh = new THREE.Mesh(blackHoleGeo, blackHoleMat);
    coreMesh.userData = {
      type: 'core',
      title: 'Pusat Gravitasi Cinta',
      quote: 'Di pusat galaksi ini, gravitasimu menarik seluruh rasa cintaku tanpa ada jalan keluar.'
    };
    scene.add(coreMesh);

    // Glowing core ring
    const ringGeo = new THREE.RingGeometry(1.3, 2.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    accretionRing = new THREE.Mesh(ringGeo, ringMat);
    accretionRing.rotation.x = Math.PI / 2.2;
    scene.add(accretionRing);

    // 6. TOP GIANT PARTICLE HEART (Matching the user screenshot!)
    buildTopParticleHeart(starTexture);

    // 7. ORBITING 3D HEARTS (Matching the exact code snippet in screenshot)
    buildOrbiting3DHearts();

    // 8. ORBITING 3D TEXT SPRITES & STICKERS
    buildOrbitingTextAndStickers();

    // 9. Input & Orbit Control Event Listeners
    setupGalaxyControls(container);

    // 10. Start Animation Loop
    animate();
  }

  // Construct the magnificent glowing pink particle heart floating atop the accretion vortex
  function buildTopParticleHeart(starTexture) {
    topHeartGroup = new THREE.Group();
    topHeartGroup.position.set(0, 7.8, 0);

    const count = CONFIG.galaxy.topHeartParticles;
    const heartGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const pinkColor = new THREE.Color('#ff2a85');
    const whiteColor = new THREE.Color('#ffffff');
    const roseColor = new THREE.Color('#ffd1dc');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Parametric 3D Heart Distribution
      const t = Math.PI * 2 * Math.random();
      const u = Math.PI * (Math.random() - 0.5);

      // Heart parametric equation
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const hz = (Math.random() - 0.5) * 6 * Math.cos(u);

      const scaleFactor = 0.17;
      const jitter = (Math.random() - 0.5) * 0.15;

      positions[i3] = hx * scaleFactor + jitter;
      positions[i3 + 1] = hy * scaleFactor + jitter;
      positions[i3 + 2] = hz * scaleFactor + jitter;

      // Color variation
      const colRand = Math.random();
      let c = pinkColor;
      if (colRand > 0.8) c = whiteColor;
      else if (colRand > 0.5) c = roseColor;

      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    heartGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    heartGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const heartMat = new THREE.PointsMaterial({
      size: 0.22,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      opacity: 0.95
    });

    const heartParticles = new THREE.Points(heartGeo, heartMat);
    topHeartGroup.add(heartParticles);

    // Ethereal vertical light stream connecting core to heart
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.4, 7.5, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xff2a85,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = -3.75;
    topHeartGroup.add(beam);

    topHeartGroup.userData = {
      type: 'topHeart',
      title: 'Detak Jantung Galaksi // Halisa',
      quote: 'Di puncak semesta ini berdenyut satu nama yang selalu kupuja: Halisa Nurul Zakia.'
    };

    scene.add(topHeartGroup);
  }

  // Build orbiting 3D extruded hearts matching the screenshot code
  function buildOrbiting3DHearts() {
    // 3D Heart Shape
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
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    const heartColors = [0xff2a85, 0xff0066, 0x00f0ff, 0xa855f7, 0xff66b2, 0xffffff];

    // Create 36 Orbiting Hearts
    for (let i = 0; i < 36; i++) {
      const col = heartColors[i % heartColors.length];
      const heartMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.75
      });

      const heartMesh = new THREE.Mesh(heartGeo, heartMat);
      const scale = 0.45 + Math.random() * 0.55;
      heartMesh.scale.set(scale, scale, scale);

      // Exact userData logic from the screenshot
      heartMesh.userData = {
        type: 'heart',
        radius: 4.5 + Math.random() * 16.5,
        angle: Math.random() * Math.PI * 2,
        ySpeed: 0.005 + Math.random() * 0.012,
        yOffset: (Math.random() - 0.5) * 5.5,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        quoteObj: getRandomQuote()
      };

      heartMesh.position.x = Math.cos(heartMesh.userData.angle) * heartMesh.userData.radius;
      heartMesh.position.z = Math.sin(heartMesh.userData.angle) * heartMesh.userData.radius;
      heartMesh.position.y = heartMesh.userData.yOffset;

      scene.add(heartMesh);
      heartGroup.push(heartMesh);
    }
  }

  // Build concentric orbiting 3D text sprites & cute couple stickers
  function buildOrbitingTextAndStickers() {
    const textBadgesData = [
      { text: "HALISA NURUL ZAKIA 💖", color: "#ff2a85", radius: 7.5, speed: 0.007, y: 1.2 },
      { text: "FAJAR & HALISA ✨", color: "#00f0ff", radius: 10.5, speed: 0.006, y: -0.8 },
      { text: "I WANNA BE YOURS 🪐", color: "#a855f7", radius: 13.5, speed: 0.005, y: 1.8 },
      { text: "SEMESTA TERINDAHKU 💫", color: "#ff2a85", radius: 16.5, speed: 0.004, y: -1.2 },
      { text: "AMOR DE MI VIDA 🌸", color: "#ffd1dc", radius: 19.5, speed: 0.0035, y: 1.5 },
      { text: "CINTA SEJATIKU 💕", color: "#00f0ff", radius: 22.5, speed: 0.003, y: -1.6 },
      { text: "14 FEBRUARI 2024 ⏳", color: "#ffffff", radius: 12.0, speed: -0.0055, y: 2.5 },
      { text: "MY INFINITE LOVE 🌌", color: "#ff2a85", radius: 15.0, speed: -0.0045, y: -2.2 }
    ];

    textBadgesData.forEach((data, idx) => {
      const sprite = createFloatingTextSprite(data.text, data.color);
      sprite.userData = {
        type: 'textBadge',
        radius: data.radius,
        angle: (idx / textBadgesData.length) * Math.PI * 2,
        ySpeed: data.speed,
        yOffset: data.y,
        title: data.text,
        quoteObj: getRandomQuote()
      };
      sprite.position.x = Math.cos(sprite.userData.angle) * sprite.userData.radius;
      sprite.position.z = Math.sin(sprite.userData.angle) * sprite.userData.radius;
      sprite.position.y = sprite.userData.yOffset;
      scene.add(sprite);
      textSprites.push(sprite);
    });

    // Orbiting cute emojis/stickers
    const stickerList = ['👩‍❤️‍👨', '🪐', '💌', '✨', '🎀', '💖', '🌙', '🐱', '🧸'];
    stickerList.forEach((emoji, idx) => {
      const sticker = createEmojiSprite(emoji, 1.35);
      sticker.userData = {
        type: 'sticker',
        radius: 6 + Math.random() * 15,
        angle: (idx / stickerList.length) * Math.PI * 2 + Math.random(),
        ySpeed: 0.008 + Math.random() * 0.01,
        yOffset: (Math.random() - 0.5) * 4.5,
        title: `Stiker Manis: ${emoji}`,
        quoteObj: getRandomQuote()
      };
      sticker.position.x = Math.cos(sticker.userData.angle) * sticker.userData.radius;
      sticker.position.z = Math.sin(sticker.userData.angle) * sticker.userData.radius;
      sticker.position.y = sticker.userData.yOffset;
      scene.add(sticker);
      stickerSprites.push(sticker);
    });
  }

  // 3D Shooting Star / Celebration Meteor in Three.js
  function launch3DCelebrationMeteor() {
    if (!scene) return;
    const meteorGeo = new THREE.BufferGeometry();
    const trailLength = 20;
    const positions = new Float32Array(trailLength * 3);
    const startX = (Math.random() - 0.5) * 35;
    const startY = 16 + Math.random() * 8;
    const startZ = (Math.random() - 0.5) * 35;

    for (let i = 0; i < trailLength; i++) {
      positions[i * 3] = startX - i * 0.4;
      positions[i * 3 + 1] = startY - i * 0.25;
      positions[i * 3 + 2] = startZ - i * 0.4;
    }
    meteorGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const meteorMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      linewidth: 2
    });

    const meteorLine = new THREE.Line(meteorGeo, meteorMat);
    meteorLine.userData = {
      vx: (Math.random() - 0.5) * 0.6 - 0.8,
      vy: -0.6 - Math.random() * 0.4,
      vz: (Math.random() - 0.5) * 0.6 - 0.8,
      life: 1.0
    };
    scene.add(meteorLine);
    shootingStars.push(meteorLine);
  }

  // Setup 360° Drag & Touch Controls
  function setupGalaxyControls(container) {
    let startPointer = { x: 0, y: 0 };

    function onPointerDown(e) {
      isDragging = true;
      dragDistance = 0;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      startPointer = { x: clientX, y: clientY };
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
        // Clamp vertical viewing angle to keep orientation beautiful
        targetRotX = Math.max(-0.4, Math.min(1.2, targetRotX));

        previousMousePosition = { x: clientX, y: clientY };
      }
    }

    function onPointerUp(e) {
      if (dragDistance < 10) {
        // Registered as a click! Check Raycaster intersection
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        if (clientX !== undefined && clientY !== undefined) {
          handle3DObjectClick(clientX, clientY);
        }
      }
      isDragging = false;
    }

    // Window-level events ensure dragging remains smooth across cards
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
        targetDistance = Math.max(12, Math.min(42, targetDistance));
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
      ...textSprites,
      ...stickerSprites,
      coreMesh
    ];

    if (topHeartGroup) {
      interactiveTargets.push(...topHeartGroup.children);
    }

    const intersects = raycaster.intersectObjects(interactiveTargets, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      let targetObj = hit;
      if (hit.parent && hit.parent.userData && hit.parent.userData.type) {
        targetObj = hit.parent;
      }

      const data = targetObj.userData;
      playCelestialChime();
      playHeartbeatSound();
      burstOfLove(clientX, clientY, 20);

      // Bounce scale effect
      const origScale = targetObj.scale.x;
      targetObj.scale.set(origScale * 1.35, origScale * 1.35, origScale * 1.35);
      setTimeout(() => {
        targetObj.scale.set(origScale, origScale, origScale);
      }, 400);

      // Show Galaxy Toast Modal with personal romantic quote
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
      targetRotY += 0.0012; // Continuous gentle orbit
    }

    rotY += (targetRotY - rotY) * 0.05;
    rotX += (targetRotX - rotX) * 0.05;
    currentDistance += (targetDistance - currentDistance) * 0.05;

    camera.position.x = Math.sin(rotY) * Math.cos(rotX) * currentDistance;
    camera.position.y = Math.sin(rotX) * currentDistance + 2.5;
    camera.position.z = Math.cos(rotY) * Math.cos(rotX) * currentDistance;
    camera.lookAt(0, 2, 0);

    // 2. Rotate Spiral Galaxy Particles
    if (galaxyPoints) {
      galaxyPoints.rotation.y = elapsedTime * 0.035;
    }

    // 3. Pulse Top Heart (Rhythmic Heartbeat Formula)
    if (topHeartGroup) {
      const beat = 1 + 0.07 * Math.pow(Math.sin(elapsedTime * 3.2), 4) + 0.03 * Math.sin(elapsedTime * 6.4);
      topHeartGroup.scale.set(beat, beat, beat);
      topHeartGroup.rotation.y = elapsedTime * 0.05;
    }

    // 4. Accretion Ring shimmer
    if (accretionRing) {
      accretionRing.rotation.z = -elapsedTime * 0.12;
      accretionRing.material.opacity = 0.75 + 0.2 * Math.sin(elapsedTime * 4);
    }

    // 5. Orbit 3D Hearts (Exact code logic from user screenshot)
    heartGroup.forEach(heart => {
      heart.userData.angle += heart.userData.ySpeed;
      heart.position.x = Math.cos(heart.userData.angle) * heart.userData.radius;
      heart.position.z = Math.sin(heart.userData.angle) * heart.userData.radius;
      heart.position.y = heart.userData.yOffset + Math.sin(elapsedTime * 2.2 + heart.userData.angle) * 0.4;
      heart.rotation.x += heart.userData.rotSpeedX;
      heart.rotation.y += heart.userData.rotSpeedY;
    });

    // 6. Orbit Text Badges & Stickers
    textSprites.forEach(sprite => {
      sprite.userData.angle += sprite.userData.ySpeed;
      sprite.position.x = Math.cos(sprite.userData.angle) * sprite.userData.radius;
      sprite.position.z = Math.sin(sprite.userData.angle) * sprite.userData.radius;
      sprite.position.y = sprite.userData.yOffset + Math.sin(elapsedTime * 1.5 + sprite.userData.angle) * 0.3;
    });

    stickerSprites.forEach(sticker => {
      sticker.userData.angle += sticker.userData.ySpeed;
      sticker.position.x = Math.cos(sticker.userData.angle) * sticker.userData.radius;
      sticker.position.z = Math.sin(sticker.userData.angle) * sticker.userData.radius;
      sticker.position.y = sticker.userData.yOffset + Math.sin(elapsedTime * 2 + sticker.userData.angle) * 0.35;
    });

    // 7. Update Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const star = shootingStars[i];
      star.position.x += star.userData.vx;
      star.position.y += star.userData.vy;
      star.position.z += star.userData.vz;
      star.userData.life -= 0.02;
      star.material.opacity = star.userData.life;
      if (star.userData.life <= 0) {
        scene.remove(star);
        shootingStars.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }

  // Initialize 3D Three.js Galaxy
  initThreeGalaxy();

  // Export shooting meteor trigger for celebration actions
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
      if (audioElem) {
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

  if (btnModeGalaxy) {
    btnModeGalaxy.addEventListener('click', () => {
      btnModeGalaxy.classList.add('active');
      if (btnModeStory) btnModeStory.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      targetDistance = window.innerWidth < 768 ? 24 : 18;
      targetRotX = 0.45;
      playCelestialChime();
    });
  }

  if (btnModeStory) {
    btnModeStory.addEventListener('click', () => {
      btnModeStory.classList.add('active');
      if (btnModeGalaxy) btnModeGalaxy.classList.remove('active');
      const counterSection = document.getElementById('counter');
      if (counterSection) {
        counterSection.scrollIntoView({ behavior: 'smooth' });
      }
      playCelestialChime();
    });
  }

  // Quick Dock Handlers
  const dockLetterBtn = document.getElementById('dock-letter-btn');
  const dockCounterBtn = document.getElementById('dock-counter-btn');
  const dockWishBtn = document.getElementById('dock-wish-btn');
  const dockScannerBtn = document.getElementById('dock-scanner-btn');

  if (dockLetterBtn) dockLetterBtn.addEventListener('click', openLetter);
  if (dockCounterBtn) {
    dockCounterBtn.addEventListener('click', () => {
      const el = document.getElementById('counter');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (dockWishBtn) {
    dockWishBtn.addEventListener('click', () => {
      const el = document.getElementById('transmitter');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (dockScannerBtn) {
    dockScannerBtn.addEventListener('click', () => {
      const el = document.getElementById('scanner');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

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
      "Sinyal rindumu langsung tembus ke orbit hatiku, Halisa sayang! Setiap detik tanpamu rasanya sepi, tapi yakinlah hatiku selalu memelukmu erat dari sini. I miss you more! 🥺💖",
      "Rasa kangenmu adalah gravitasi terkuat yang selalu menarikku kembali kepadamu. Jangan sedih yaa cantik, sebentar lagi kita ketemu! 💕🪐"
    ],
    bahagia: [
      "Melihatmu bahagia adalah pemandangan terindah di seluruh galaksi ini! Semoga senyum manismu selalu bersinar seperti bintang paling terang yaa cintaku! 🥰✨",
      "Kebahagiaanmu adalah tujuan utamaku. Tetaplah tertawa ceria seperti ini, karena tawamu adalah duniaku! 💖🌸"
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
    '%c✨ 3D GALAXY UNIVERSE OF LOVE ✨\n%cDedicated specially for Halisa Nurul Zakia by Fajar Syahruddin.\nMay our love orbit together for all eternity!',
    'color: #ff2a85; font-size: 16px; font-weight: bold;',
    'color: #00f0ff; font-size: 12px;'
  );

});
