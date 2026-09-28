/**
 * Universe Of Love — Modern Neon Minimalism
 * Dedicated to: Halisa Nurul Zakia
 * Core Interactive Scripts, Cosmic Canvas Engine & Input-Output Mechanics
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CONFIGURATION (Mudah Dikustomisasi)
  // ==========================================
  const CONFIG = {
    // Tanggal jadian / awal pertemuan (Format: YYYY, MM - 1, DD)
    // Contoh: 14 Februari 2024 => new Date(2024, 1, 14, 0, 0, 0)
    startDate: new Date(2024, 1, 14, 0, 0, 0),
    startDateFormatted: '14 Februari 2024',
    
    // Nama Panggilan Pacar
    girlfriendName: 'Halisa Nurul Zakia',
    nickname: 'Halisa',

    // Jumlah partikel bintang di kanvas
    starCount: window.innerWidth < 768 ? 160 : 280,
    
    // Warna tema neon
    colors: ['#00f0ff', '#ff2a85', '#a855f7', '#ffffff', '#ffd1dc']
  };

  const startDateTextElem = document.getElementById('start-date-text');
  if (startDateTextElem) {
    startDateTextElem.textContent = CONFIG.startDateFormatted;
  }

  // ==========================================
  // 2. SMOOTH SCROLL REVEAL ANIMATIONS
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
      
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // ==========================================
  // 4. INTERACTIVE COSMIC CANVAS ENGINE
  // ==========================================
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let meteors = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.4;
      this.baseAlpha = Math.random() * 0.7 + 0.3;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      this.alpha += this.twinkleSpeed;
      if (this.alpha > 1 || this.alpha < 0.2) {
        this.twinkleSpeed = -this.twinkleSpeed;
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 0.6;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));
      ctx.shadowBlur = this.size > 1.2 ? 10 : 0;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  class Meteor {
    constructor(customAngle = null) {
      this.reset(customAngle);
    }

    reset(customAngle = null) {
      this.x = Math.random() * width + 200;
      this.y = Math.random() * (height / 2) - 100;
      this.length = Math.random() * 80 + 60;
      this.speed = Math.random() * 9 + 7;
      this.angle = customAngle !== null ? customAngle : Math.PI / 4;
      this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff2a85';
      this.active = true;
      this.alpha = 1;
    }

    update() {
      this.x -= this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
      this.alpha -= 0.015;

      if (this.alpha <= 0 || this.x < -100 || this.y > height + 100) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      const tailX = this.x + this.length * Math.cos(this.angle);
      const tailY = this.y - this.length * Math.sin(this.angle);
      
      const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.shadowBlur = 14;
      ctx.shadowColor = this.color;
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      ctx.restore();
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < CONFIG.starCount; i++) {
      stars.push(new Star());
    }
  }

  function spawnMeteorOccasionally() {
    if (Math.random() < 0.012 && meteors.length < 3) {
      meteors.push(new Meteor());
    }
  }

  function launchCelebrationMeteor() {
    meteors.push(new Meteor());
    meteors.push(new Meteor());
  }

  function renderGalaxy() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    ctx.save();
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 75) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    spawnMeteorOccasionally();
    for (let i = meteors.length - 1; i >= 0; i--) {
      meteors[i].update();
      meteors[i].draw();
      if (!meteors[i].active) {
        meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(renderGalaxy);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  renderGalaxy();

  // ==========================================
  // 5. LIVE RELATIONSHIP ORBIT COUNTER
  // ==========================================
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMinutes = document.getElementById('count-minutes');
  const countSeconds = document.getElementById('count-seconds');

  function updateOrbitCounter() {
    const now = new Date();
    const diff = now - CONFIG.startDate;

    if (diff < 0) {
      countDays.textContent = '000';
      countHours.textContent = '00';
      countMinutes.textContent = '00';
      countSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countDays.textContent = String(days).padStart(3, '0');
    countHours.textContent = String(hours).padStart(2, '0');
    countMinutes.textContent = String(minutes).padStart(2, '0');
    countSeconds.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateOrbitCounter, 1000);
  updateOrbitCounter();

  // ==========================================
  // 6. DUAL-MODE MUSIC & AMBIENT SYNTH ENGINE
  // ==========================================
  const audioElem = document.getElementById('romantic-audio');
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const audioEq = document.getElementById('audio-eq');
  const musicDisc = document.getElementById('music-disc');

  let isPlaying = false;
  let audioContext = null;
  let synthInterval = null;

  function playProceduralRomanticChords() {
    try {
      if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioCtx();
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

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
        const now = audioContext.currentTime;

        notes.forEach((freq, idx) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          const filter = audioContext.createBiquadFilter();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600 + idx * 80, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(audioContext.destination);

          osc.start(now);
          osc.stop(now + 6);
        });

        chordIndex = (chordIndex + 1) % chordNotes.length;
      }

      triggerChord();
      synthInterval = setInterval(triggerChord, 5200);

    } catch (err) {
      console.warn('Web Audio Ambient Synthesizer is not supported in this browser.', err);
    }
  }

  function playCelestialChime() {
    try {
      if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') audioContext.resume();

      const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
      const now = audioContext.currentTime;

      chimeNotes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 2);
      });
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
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      audioEq.classList.add('active');
      musicDisc.classList.add('spinning');
      toggleAudioBtn.querySelector('.audio-btn-label').textContent = 'Pause Atmosphere';
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      audioEq.classList.remove('active');
      musicDisc.classList.remove('spinning');
      toggleAudioBtn.querySelector('.audio-btn-label').textContent = 'Play Atmosphere';
    }
  }

  function toggleAudio() {
    if (isPlaying) {
      audioElem.pause();
      stopProceduralChords();
      setPlaybackState(false);
    } else {
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
    }
  }

  toggleAudioBtn.addEventListener('click', toggleAudio);
  playPauseBtn.addEventListener('click', toggleAudio);

  // ==========================================
  // 7. STARDUST & HEART BURST EFFECTS
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

  const pulsingHeart = document.getElementById('pulsing-heart');
  if (pulsingHeart) {
    pulsingHeart.addEventListener('click', (e) => {
      const rect = pulsingHeart.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      burstOfLove(centerX, centerY, 20);
      playCelestialChime();

      if (!isPlaying) {
        toggleAudio();
      }
    });
  }

  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#pulsing-heart') || 
        e.target.closest('#btn-yes') || 
        e.target.closest('#scanner-btn') ||
        e.target.closest('#send-wish-btn')) return;
    spawnFloatingSparkle(e.clientX, e.clientY, Math.random() > 0.5 ? '✨' : '💖');
  });

  // ==========================================
  // 8. INTERACTIVE INPUT-OUTPUT: STARLIGHT TRANSMITTER
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

      transmitterOutput.classList.remove('hidden');
      responseTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      typeWriterEffect(outputResponseText, chosenReply);

      saveWishToVault(selectedMoodEmoji, selectedMoodLabel, userText);

      wishInput.value = '';
      charCount.textContent = '0 / 280';
      transmitterOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  renderVaultStream();

  // ==========================================
  // 9. INTERACTIVE BIOMETRIC LOVE SCANNER (HOLD TO SCAN)
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
      progressBar.style.strokeDashoffset = offset;

      const currentPercent = Math.floor(progressRatio * 1000);
      scannerPercentage.textContent = `${currentPercent}%`;

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
    scannerBtn.classList.remove('is-scanning');
    progressBar.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;
    scannerPercentage.textContent = '0%';
    scannerInstruction.textContent = 'Sentuh & tahan pemindai (Hold for 2s)';
    scannerInstruction.style.color = 'var(--text-secondary)';
  }

  function finishScan() {
    cancelAnimationFrame(scanHoldTimer);
    scannerBtn.classList.remove('is-scanning');
    scannerBtn.style.pointerEvents = 'none';
    scannerInstruction.textContent = '✦ SINKRONISASI SELESAI ✦';
    scannerInstruction.style.color = 'var(--neon-cyan)';
    scannerPercentage.textContent = '1000%';

    playCelestialChime();
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
  // 10. HOLOGRAPHIC LETTER MODAL
  // ==========================================
  const openLetterBtn = document.getElementById('open-letter-btn');
  const letterModal = document.getElementById('letter-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const kissBtn = document.getElementById('kiss-btn');

  function openLetter() {
    letterModal.classList.remove('hidden');
    burstOfLove(window.innerWidth / 2, window.innerHeight / 2, 16);
    playCelestialChime();
  }

  function closeLetter() {
    letterModal.classList.add('hidden');
  }

  if (openLetterBtn) openLetterBtn.addEventListener('click', openLetter);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeLetter);
  
  letterModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeLetter();
    }
  });

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
  // 11. PLAYFUL INTERACTIVE QUESTION SECTION
  // ==========================================
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const answerResponse = document.getElementById('answer-response');

  if (btnYes) {
    btnYes.addEventListener('click', (e) => {
      burstOfLove(e.clientX, e.clientY, 35);
      playCelestialChime();
      launchCelebrationMeteor();
      answerResponse.classList.remove('hidden');
      btnYes.style.transform = 'scale(1.08)';
      btnYes.innerHTML = '<span>Selamanya Milikmu! 💖✨</span>';
      btnNo.style.display = 'none';

      if (!isPlaying) {
        toggleAudio();
      }

      answerResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      btnNo.querySelector('.btn-text').textContent = cheekyPhrases[phraseIdx % cheekyPhrases.length];
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
    '%c✨ UNIVERSE OF LOVE ✨\n%cDedicated specially for Halisa Nurul Zakia.\nMay your days be as bright and boundless as the stars!',
    'color: #ff2a85; font-size: 16px; font-weight: bold;',
    'color: #00f0ff; font-size: 12px;'
  );

});
