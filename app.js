// THINK LEFT - QUIZ NIGHT APPLICATION LOGIC

// ==================== STATE MANAGEMENT ====================
class QuizApp {
  constructor() {
    this.currentSlideIndex = 0;
    this.slides = []; // Populated dynamically
    this.teams = this.loadTeams();
    this.timerDuration = 60; // seconds
    this.timerRemaining = 60;
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.revealedAnswers = {}; // track question reveal states
    this.audioCanvas = null;
    this.audioAnimFrame = null;

    this.init();
  }

  loadTeams() {
    const saved = localStorage.getItem('sdy_quiz_teams_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved teams', e);
      }
    }
    // Default 6 teams
    return [
      { id: 'team_1', name: 'Баг 1 - Шонхорууд', score: 0, r1: 0, r2: 0, r3: 0, r4: 0, bonus: 0, color: '#00e5ff' },
      { id: 'team_2', name: 'Баг 2 - Ирвэсүүд', score: 0, r1: 0, r2: 0, r3: 0, r4: 0, bonus: 0, color: '#ff5226' },
      { id: 'team_3', name: 'Баг 3 - Чононууд', score: 0, r1: 0, r2: 0, r3: 0, r4: 0, bonus: 0, color: '#ffd700' },
      { id: 'team_4', name: 'Баг 4 - Галт шувуу', score: 0, r1: 0, r2: 0, r3: 0, r4: 0, bonus: 0, color: '#e040fb' },
      { id: 'team_5', name: 'Баг 5 - Сүлд', score: 0, r1: 0, r2: 0, r3: 0, r4: 0, bonus: 0, color: '#00e676' },
      { id: 'team_6', name: 'Баг 6 - Тэмүүлэл', score: 0, r1: 0, r2: 0, r3: 0, r4: 0, bonus: 0, color: '#ff4081' }
    ];
  }

  saveTeams() {
    localStorage.setItem('sdy_quiz_teams_v1', JSON.stringify(this.teams));
    this.renderScoreboardDrawer();
    this.renderQuickScoreBars();
    this.renderPodium();
  }

  init() {
    this.buildSlideDeck();
    this.renderSlides();
    this.bindEvents();
    this.renderScoreboardDrawer();
    this.updateSlideView();
    this.initAudioVisualizer();
  }

  // ==================== SLIDE DECK BUILDER ====================
  buildSlideDeck() {
    this.slides = [];

    // Slide 0: Home / Opening
    this.slides.push({
      type: 'home',
      title: 'НЭЭЛТ',
      roundNumber: 0
    });

    // Rounds 1 to 4
    QUIZ_DATA.rounds.forEach((round) => {
      // Round Cover Slide
      this.slides.push({
        type: 'round_cover',
        round: round,
        roundNumber: round.number,
        title: `${round.number}-Р ҮЕ: ${round.title}`
      });

      // Individual Question Slides
      round.questions.forEach((q) => {
        this.slides.push({
          type: 'question',
          round: round,
          roundNumber: round.number,
          question: q,
          title: `${round.number}-р үе: Асуулт №${q.questionNumber}`
        });
      });
    });

    // Final Slide: Podium / Victory
    this.slides.push({
      type: 'podium',
      title: 'ДҮН ТАНИЛЦУУЛАХ',
      roundNumber: 5
    });
  }

  // ==================== RENDER DOM SLIDES ====================
  renderSlides() {
    const container = document.getElementById('slide-viewport');
    container.innerHTML = '';

    this.slides.forEach((slide, idx) => {
      const slideEl = document.createElement('section');
      slideEl.className = 'view-slide';
      slideEl.id = `slide-${idx}`;

      if (slide.type === 'home') {
        slideEl.innerHTML = this.getHomeSlideHtml();
      } else if (slide.type === 'round_cover') {
        slideEl.innerHTML = this.getRoundCoverHtml(slide.round);
      } else if (slide.type === 'question') {
        slideEl.innerHTML = this.getQuestionSlideHtml(slide.round, slide.question, idx);
      } else if (slide.type === 'podium') {
        slideEl.innerHTML = this.getPodiumSlideHtml();
      }

      container.appendChild(slideEl);
    });

    this.renderNavDots();
  }

  getHomeSlideHtml() {
    const s = QUIZ_DATA.meta;
    return `
      <div class="neon-hero-card">
        <img src="assets/images/sdy_dornogovi_dark.png" alt="SDY Dornogovi" class="hero-logo-img">
        <div>
          <span class="hero-think-left">${s.brand || 'THINK LEFT'}</span>
        </div>
        <h1 class="hero-main-title">${s.title}</h1>
        <p class="hero-sub-title">${s.subtitle}</p>
      </div>

      <div class="schedule-grid">
        ${s.schedule.map(sch => `
          <div class="schedule-card">
            <span class="schedule-num">${sch.num}</span>
            <h3 class="schedule-title">${sch.title}</h3>
            <p class="schedule-desc">${sch.desc}</p>
            <span class="schedule-time">⏱️ ${sch.time}</span>
          </div>
        `).join('')}
      </div>

      <div class="rules-hero-section">
        <div class="rules-content-wrap">
          <h2 class="rules-heading">
            🏆 ТЭМЦЭЭНИЙ ЕРӨНХИЙ ДҮРЭМ
          </h2>
          <ul class="rules-list">
            ${s.rules.map(r => `
              <li><span class="rules-bullet">✦</span> <span>${r}</span></li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="action-hero-bar">
        <button class="btn-primary-neon" onclick="app.nextSlide()">
          🚀 ТЭМЦЭЭНИЙГ ЭХЛҮҮЛЭХ
        </button>
      </div>
    `;
  }

  getRoundCoverHtml(round) {
    return `
      <div style="text-align: center; max-width: 800px; margin: 0 auto;">
        <div class="neon-hero-card" style="box-shadow: 0 0 30px ${round.color}88, inset 0 0 20px ${round.color}44; border-color: ${round.color};">
          <img src="assets/images/sdy_dornogovi_dark.png" alt="SDY Dornogovi" class="hero-logo-img">
          <div>
            <span class="hero-think-left" style="color: ${round.color}; border-color: ${round.color}66; background: ${round.color}18; text-shadow: 0 0 10px ${round.color};">
              THINK LEFT • QUIZ NIGHT
            </span>
          </div>
          <h1 class="hero-main-title" style="color: #fff; text-shadow: 0 0 20px ${round.color}; font-size: 3.5rem;">
            ${round.title}
          </h1>
          <p class="hero-sub-title" style="color: ${round.color};">
            ${round.subtitle}
          </p>
        </div>

        <p style="font-size: 1.15rem; color: #cbd5e1; margin-bottom: 30px;">
          Асуулт тус бүр: <strong style="color: #ffd700; font-size: 1.3rem;">${round.defaultPoints} оноо</strong>
        </p>

        <button class="btn-primary-neon" style="background: linear-gradient(135deg, ${round.color}, #3b82f6);" onclick="app.nextSlide()">
          Эхний асуулт руу орох ➜
        </button>
      </div>
    `;
  }

  getQuestionSlideHtml(round, q, slideIdx) {
    let contentHtml = '';

    // Round 1: Picture Guessing
    if (round.id === 'round1') {
      contentHtml = `
        <div class="picture-duo-grid">
          ${q.items.map((item, i) => `
            <div class="picture-card">
              <div class="picture-frame blurred" id="picframe-${q.id}-${i}" onclick="app.toggleBlur('${q.id}', ${i})">
                <img src="${item.image}" alt="${item.name}">
                <div class="blur-overlay-hint">
                  <span style="font-size: 2rem;">🔍</span>
                  <span style="font-weight: 700; font-size: 0.95rem;">Зургийг тодруулах</span>
                </div>
              </div>
              <div class="picture-info-panel">
                <div class="mystery-placeholder" id="placeholder-${q.id}-${i}">
                  ❓ ${item.label}
                </div>
                <div class="revealed-info" id="reveal-${q.id}-${i}">
                  <h3 class="person-name">${item.name}</h3>
                  <div class="person-title">${item.title}</div>
                  <p class="person-bio">${item.bio}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Round 2: Multiple Choice
    else if (round.id === 'round2') {
      contentHtml = `
        <div class="mc-container">
          <div class="mc-question-box">
            <h2 class="mc-question-text">${q.question}</h2>
            <div class="mc-options-grid">
              ${q.options.map(opt => `
                <button class="mc-option-btn" id="opt-${q.id}-${opt.key}" onclick="app.chooseOption('${q.id}', '${opt.key}', ${opt.correct})">
                  <span class="option-key">${opt.key}</span>
                  <span class="option-text">${opt.text}</span>
                </button>
              `).join('')}
            </div>
            <div class="explanation-box" id="explain-${q.id}">
              <strong>💡 Тайлбар:</strong> ${q.explanation}
            </div>
          </div>
        </div>
      `;
    }

    // Round 3: Audio / Music Round
    else if (round.id === 'round3') {
      contentHtml = `
        <div class="audio-card-container">
          <div class="audio-player-box">
            <div class="audio-hint-pill">🎵 Асуулт №${q.questionNumber}: ${q.hint}</div>
            
            <div class="visualizer-canvas-wrap">
              <canvas id="visualizer-${q.id}" width="500" height="90" style="width: 100%; height: 90px; border-radius: 12px;"></canvas>
            </div>

            <div class="audio-controls-row">
              <button class="btn-audio-play" id="play-btn-${q.id}" onclick="app.playAudioTrack('${q.id}', '${q.melodyPreset}')" title="Тоглуулах">
                ▶
              </button>
              <button class="btn-audio-stop" onclick="app.stopAudioTrack()" title="Зогсоох">
                ⏹
              </button>
            </div>

            <div>
              <label class="custom-audio-upload-btn">
                📁 Өөрийн дууны файл оруулах (MP3)
                <input type="file" accept="audio/*" style="display: none;" onchange="app.handleCustomAudioUpload(event, '${q.id}')">
              </label>
            </div>

            <div class="answer-reveal-card" id="audio-answer-${q.id}" style="margin-top: 24px;">
              <div class="answer-title">🎤 ${q.singer} — "${q.songName}"</div>
              <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 6px;">
                <strong>Төрөл:</strong> ${q.genre} (${q.year})
              </p>
              <p style="color: #94a3b8; font-size: 0.88rem;">${q.details}</p>
            </div>
          </div>
        </div>
      `;
    }

    // Round 4: Thematic Round (Gobi / Camels / Desert)
    else if (round.id === 'round4') {
      contentHtml = `
        <div class="mc-container">
          <div class="mc-question-box" style="border-color: rgba(0, 230, 118, 0.4); box-shadow: 0 10px 30px rgba(0, 230, 118, 0.12);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
              <span style="font-size: 1.4rem;">🐪</span>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--green-neon); text-transform: uppercase; letter-spacing: 1.5px;">Говь нутгийн танин мэдэхүй</span>
            </div>
            <h2 class="mc-question-text">${q.question}</h2>
            <div class="mc-options-grid">
              ${q.options.map(opt => `
                <button class="mc-option-btn" id="opt-${q.id}-${opt.key}" onclick="app.chooseOption('${q.id}', '${opt.key}', ${opt.correct})">
                  <span class="option-key" style="background: rgba(0, 230, 118, 0.15); color: var(--green-neon);">${opt.label || opt.key}</span>
                  <span class="option-text">${opt.text}</span>
                </button>
              `).join('')}
            </div>
            <div class="answer-reveal-card" id="thematic-answer-${q.id}" style="margin-top: 24px;">
              <div class="answer-title">✅ Зөв хариулт: ${q.answer}</div>
              <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">${q.explanation}</p>
            </div>
          </div>
        </div>
      `;
    }

    // Bottom Action Bar: Reveal button + Quick Point Awarding to Teams
    const isRound1 = round.id === 'round1';
    const isRound2 = round.id === 'round2';
    const isRound3 = round.id === 'round3';
    const isRound4 = round.id === 'round4';

    return `
      <div class="question-header">
        <div class="question-headline">
          <span class="q-badge" style="background: ${round.color};">${round.badge}</span>
          <span>${q.prompt || `Асуулт №${q.questionNumber}`}</span>
        </div>
        <div class="header-q-points" style="font-weight: 700; color: #ffd700; font-size: 0.95rem;">
          Зөв хариулт: +${round.defaultPoints} оноо
        </div>
      </div>

      ${contentHtml}

      <div class="action-bottom-bar">
        <div class="reveal-controls">
          <button class="btn-reveal-answer" onclick="app.revealQuestionAnswer('${q.id}', '${round.id}')">
            👁️ Зөв хариултыг харуулах
          </button>
        </div>

        <div class="quick-points-bar">
          <span class="quick-points-label">Оноо олгох:</span>
          ${this.teams.map(t => `
            <button class="team-chip-btn" onclick="app.awardPointsToTeam('${t.id}', ${round.defaultPoints}, '${round.id}')" title="${t.name}">
              <span>${t.name.split(' - ')[0]}</span>
              <span class="chip-plus">+${round.defaultPoints}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  getPodiumSlideHtml() {
    return `
      <div class="victory-container">
        <h1 class="victory-title">🎉 ТЭМЦЭЭНИЙ ЯЛАГЧИД 🎉</h1>

        <div class="podium-stage" id="podium-stage">
          <!-- Populated by renderPodium() -->
        </div>

        <div style="margin: 20px 0;">
          <button class="btn-primary-neon" onclick="app.triggerVictoryConfetti()">
            🎊 Баярын салют буудуулах!
          </button>
        </div>

        <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 30px; text-align: left;">
          📊 БАГУУДЫН НЭГДСЭН ОНОО
        </h3>
        <table class="final-results-table" id="final-results-table">
          <!-- Populated by renderPodium() -->
        </table>
      </div>
    `;
  }

  // ==================== QUESTION REVEAL LOGIC ====================
  toggleBlur(qId, itemIdx) {
    const frame = document.getElementById(`picframe-${qId}-${itemIdx}`);
    if (frame) {
      frame.classList.toggle('blurred');
      sounds.playTick();
    }
  }

  revealQuestionAnswer(qId, roundId) {
    sounds.playCorrect();

    if (roundId === 'round1') {
      [0, 1].forEach(i => {
        const frame = document.getElementById(`picframe-${qId}-${i}`);
        const placeholder = document.getElementById(`placeholder-${qId}-${i}`);
        const reveal = document.getElementById(`reveal-${qId}-${i}`);
        if (frame) frame.classList.remove('blurred');
        if (placeholder) placeholder.style.display = 'none';
        if (reveal) reveal.classList.add('show');
      });
    } else if (roundId === 'round2') {
      const q = QUIZ_DATA.rounds[1].questions.find(item => item.id === qId);
      if (q) {
        q.options.forEach(opt => {
          const btn = document.getElementById(`opt-${qId}-${opt.key}`);
          if (btn) {
            btn.classList.add('locked');
            if (opt.correct) {
              btn.classList.add('correct');
            }
          }
        });
        const explain = document.getElementById(`explain-${qId}`);
        if (explain) explain.classList.add('show');
      }
    } else if (roundId === 'round3') {
      const card = document.getElementById(`audio-answer-${qId}`);
      if (card) card.classList.add('show');
    } else if (roundId === 'round4') {
      const q = QUIZ_DATA.rounds[3].questions.find(item => item.id === qId);
      if (q && q.options) {
        q.options.forEach(opt => {
          const btn = document.getElementById(`opt-${qId}-${opt.key}`);
          if (btn) {
            btn.classList.add('locked');
            if (opt.correct) {
              btn.classList.add('correct');
            }
          }
        });
      }
      const card = document.getElementById(`thematic-answer-${qId}`);
      if (card) card.classList.add('show');
    }
  }

  chooseOption(qId, key, isCorrect) {
    const btn = document.getElementById(`opt-${qId}-${key}`);
    if (btn && !btn.classList.contains('locked')) {
      if (isCorrect) {
        sounds.playCorrect();
        btn.classList.add('correct');
        const explain = document.getElementById(`explain-${qId}`);
        if (explain) explain.classList.add('show');
        const thematicAnswer = document.getElementById(`thematic-answer-${qId}`);
        if (thematicAnswer) thematicAnswer.classList.add('show');
      } else {
        sounds.playWrong();
        btn.classList.add('wrong');
      }
    }
  }

  // ==================== AUDIO VISUALIZER & PLAYBACK ====================
  playAudioTrack(qId, presetName) {
    const playBtn = document.getElementById(`play-btn-${qId}`);

    // If currently playing, toggle to stop
    if (sounds.isPlaying && playBtn && playBtn.innerHTML.includes('⏸')) {
      this.stopAudioTrack();
      return;
    }

    this.stopAudioTrack();
    if (playBtn) playBtn.innerHTML = '⏸';

    const onFinish = () => {
      this.stopVisualizer();
      if (playBtn) playBtn.innerHTML = '▶';
    };

    const q = QUIZ_DATA.rounds[2].questions.find(item => item.id === qId);
    if (q && q.audioSrc) {
      sounds.playTrack(q.audioSrc, q.startTime || 0, q.endTime || null, onFinish);
    } else {
      sounds.playMelody(presetName, onFinish);
    }
    this.startVisualizer(qId);
  }

  stopAudioTrack() {
    sounds.stopAll();
    this.stopVisualizer();
    document.querySelectorAll('.btn-audio-play').forEach(btn => btn.innerHTML = '▶');
  }

  handleCustomAudioUpload(event, qId) {
    const file = event.target.files[0];
    if (file) {
      sounds.playCustomFile(file, () => {
        this.stopVisualizer();
      });
      this.startVisualizer(qId);
    }
  }

  initAudioVisualizer() {
    // Canvas animation loop
  }

  startVisualizer(qId) {
    const canvas = document.getElementById(`visualizer-${qId}`);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      if (!sounds.isPlaying) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barWidth = canvas.width / bars - 4;

      for (let i = 0; i < bars; i++) {
        const height = Math.abs(Math.sin(phase + i * 0.35)) * (canvas.height * 0.75) + 10;
        const x = i * (barWidth + 4);
        const y = canvas.height - height;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#7c4dff');
        grad.addColorStop(1, '#e040fb');

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, height);
      }
      phase += 0.15;
      this.audioAnimFrame = requestAnimationFrame(render);
    };
    render();
  }

  stopVisualizer() {
    if (this.audioAnimFrame) {
      cancelAnimationFrame(this.audioAnimFrame);
      this.audioAnimFrame = null;
    }
  }

  // ==================== SCOREBOARD & TEAMS ====================
  awardPointsToTeam(teamId, points, roundKey) {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return;

    team.score += points;
    if (roundKey === 'round1') team.r1 += points;
    else if (roundKey === 'round2') team.r2 += points;
    else if (roundKey === 'round3') team.r3 += points;
    else if (roundKey === 'round4') team.r4 += points;
    else team.bonus += points;

    sounds.playTone(800, 'sine', 0.15, 0.15);
    this.saveTeams();
    this.showToast(`${team.name}: +${points} оноо нэмэгдлээ! (Нийт: ${team.score})`);
  }

  adjustTeamScore(teamId, delta) {
    const team = this.teams.find(t => t.id === teamId);
    if (!team) return;
    team.score += delta;
    team.bonus += delta;
    if (delta > 0) sounds.playTone(600, 'sine', 0.1);
    else sounds.playTone(200, 'sawtooth', 0.1);
    this.saveTeams();
  }

  addNewTeam(name) {
    if (!name.trim()) return;
    const newId = 'team_' + Date.now();
    const colors = ['#00e5ff', '#ff5226', '#ffd700', '#e040fb', '#00e676', '#ff4081', '#7c4dff'];
    const color = colors[this.teams.length % colors.length];

    this.teams.push({
      id: newId,
      name: name.trim(),
      score: 0,
      r1: 0, r2: 0, r3: 0, r4: 0, bonus: 0,
      color: color
    });

    this.saveTeams();
    this.renderSlides();
    this.updateSlideView();
    sounds.playTone(550, 'sine', 0.2);
  }

  removeTeam(teamId) {
    if (confirm('Энэ багийг устгах уу?')) {
      this.teams = this.teams.filter(t => t.id !== teamId);
      this.saveTeams();
      this.renderSlides();
      this.updateSlideView();
    }
  }

  renderScoreboardDrawer() {
    const container = document.getElementById('drawer-teams-list');
    if (!container) return;

    // Sort teams by score descending
    const sorted = [...this.teams].sort((a, b) => b.score - a.score);

    container.innerHTML = sorted.map((t, idx) => `
      <div class="drawer-team-card">
        <div class="team-rank-badge" style="background: ${idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : 'rgba(255,255,255,0.1)'}; color: ${idx < 3 ? '#000' : '#fff'};">
          ${idx + 1}
        </div>
        <div class="drawer-team-info">
          <input type="text" class="drawer-team-name" value="${t.name}" onchange="app.renameTeam('${t.id}', this.value)" style="background: transparent; border: none; color: #fff; width: 100%;">
          <div class="drawer-team-breakdown">
            1-р: ${t.r1} | 2-р: ${t.r2} | 3-р: ${t.r3} | 4-р: ${t.r4} | Бонус: ${t.bonus}
          </div>
        </div>
        <div class="drawer-score-control">
          <button class="btn-score-adjust minus" onclick="app.adjustTeamScore('${t.id}', -1)">-</button>
          <span class="drawer-score-val">${t.score}</span>
          <button class="btn-score-adjust plus" onclick="app.adjustTeamScore('${t.id}', 1)">+</button>
          <button onclick="app.removeTeam('${t.id}')" style="background: transparent; border: none; color: #64748b; cursor: pointer; margin-left: 6px; font-size: 1rem;" title="Устгах">×</button>
        </div>
      </div>
    `).join('');
  }

  renderQuickScoreBars() {
    // Updates chip labels across question slides if teams change
  }

  renameTeam(teamId, newName) {
    const team = this.teams.find(t => t.id === teamId);
    if (team && newName.trim()) {
      team.name = newName.trim();
      this.saveTeams();
    }
  }

  renderPodium() {
    const stage = document.getElementById('podium-stage');
    const table = document.getElementById('final-results-table');
    if (!stage || !table) return;

    const sorted = [...this.teams].sort((a, b) => b.score - a.score);

    const first = sorted[0] || { name: 'Баг 1', score: 0 };
    const second = sorted[1] || { name: 'Баг 2', score: 0 };
    const third = sorted[2] || { name: 'Баг 3', score: 0 };

    stage.innerHTML = `
      <div class="podium-pillar pillar-2nd">
        <span class="podium-medal">🥈</span>
        <div class="podium-team-name">${second.name}</div>
        <div class="podium-score">${second.score} оноо</div>
      </div>
      <div class="podium-pillar pillar-1st">
        <span class="podium-medal">🥇</span>
        <div class="podium-team-name">${first.name}</div>
        <div class="podium-score">${first.score} оноо</div>
      </div>
      <div class="podium-pillar pillar-3rd">
        <span class="podium-medal">🥉</span>
        <div class="podium-team-name">${third.name}</div>
        <div class="podium-score">${third.score} оноо</div>
      </div>
    `;

    table.innerHTML = `
      <thead>
        <tr>
          <th>Байр</th>
          <th>Багийн нэр</th>
          <th>1-р үе (Зураг)</th>
          <th>2-р үе (Random)</th>
          <th>3-р үе (Дуу)</th>
          <th>4-р үе (Сэдэвчилсэн)</th>
          <th>Бонус</th>
          <th style="color: var(--cyan-neon);">Нийт оноо</th>
        </tr>
      </thead>
      <tbody>
        ${sorted.map((t, idx) => `
          <tr>
            <td style="font-weight: 800; color: ${idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#94a3b8'};">
              ${idx === 0 ? '🥇 1-р байр' : idx === 1 ? '🥈 2-р байр' : idx === 2 ? '🥉 3-р байр' : `${idx + 1}-р байр`}
            </td>
            <td style="font-weight: 700;">${t.name}</td>
            <td>${t.r1}</td>
            <td>${t.r2}</td>
            <td>${t.r3}</td>
            <td>${t.r4}</td>
            <td>${t.bonus}</td>
            <td style="font-size: 1.25rem; font-weight: 900; color: var(--cyan-neon);">${t.score}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }

  // ==================== SLIDE NAVIGATION ====================
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.currentSlideIndex = index;
    sounds.stopAll();
    this.stopVisualizer();
    this.updateSlideView();

    // Trigger fanfare if entered podium
    if (this.slides[index].type === 'podium') {
      this.triggerVictoryConfetti();
      sounds.playFanfare();
    }
  }

  nextSlide() {
    this.goToSlide(this.currentSlideIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlideIndex - 1);
  }

  updateSlideView() {
    // Hide all slides
    document.querySelectorAll('.view-slide').forEach((el, idx) => {
      el.classList.toggle('active', idx === this.currentSlideIndex);
    });

    // Update nav dots
    document.querySelectorAll('.nav-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentSlideIndex);
    });

    // Update Header Badge
    const current = this.slides[this.currentSlideIndex];
    const badge = document.getElementById('header-round-badge');
    if (badge) {
      if (current.type === 'home') badge.textContent = '🏠 НЭЭЛТ';
      else if (current.type === 'podium') badge.textContent = '🏆 ДҮН ГАРГАЛТ';
      else badge.textContent = current.title;
    }

    // Prev/Next button disabled state
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');
    if (prevBtn) prevBtn.disabled = this.currentSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentSlideIndex === this.slides.length - 1;

    // Reset and prepare timer if on question
    this.resetTimer(60);
  }

  renderNavDots() {
    const container = document.getElementById('nav-dots-container');
    if (!container) return;
    container.innerHTML = this.slides.map((s, idx) => `
      <div class="nav-dot ${idx === this.currentSlideIndex ? 'active' : ''}" onclick="app.goToSlide(${idx})" title="${s.title}"></div>
    `).join('');
  }

  // ==================== COUNTDOWN TIMER ====================
  toggleTimer() {
    if (this.isTimerRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    document.getElementById('timer-play-btn').textContent = '⏸️';

    this.timerInterval = setInterval(() => {
      this.timerRemaining--;
      this.updateTimerDisplay();

      if (this.timerRemaining <= 5 && this.timerRemaining > 0) {
        sounds.playTick();
      }

      if (this.timerRemaining <= 0) {
        this.pauseTimer();
        sounds.playTimesUp();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    const btn = document.getElementById('timer-play-btn');
    if (btn) btn.textContent = '▶️';
  }

  resetTimer(seconds = 60) {
    this.pauseTimer();
    this.timerDuration = seconds;
    this.timerRemaining = seconds;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return;
    const mins = Math.floor(this.timerRemaining / 60);
    const secs = this.timerRemaining % 60;
    display.textContent = `${secs < 10 ? '0' : ''}${secs}`;

    display.classList.toggle('danger', this.timerRemaining <= 10 && this.timerRemaining > 0);
  }

  // ==================== DRAWER & MODALS ====================
  toggleScoreboardDrawer() {
    const drawer = document.getElementById('scoreboard-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer && backdrop) {
      const isOpen = drawer.classList.toggle('open');
      backdrop.classList.toggle('open', isOpen);
      if (isOpen) {
        this.renderScoreboardDrawer();
      }
    }
  }

  closeScoreboardDrawer() {
    const drawer = document.getElementById('scoreboard-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  toggleSound() {
    const isMuted = sounds.toggleMute();
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) {
      btn.innerHTML = isMuted ? '🔇 Дуу хаагдсан' : '🔊 Дуутай';
    }
  }

  resetAllGame() {
    if (confirm('Бүх оноо болон тоглоомыг шинээр эхлүүлэх үү?')) {
      localStorage.removeItem('sdy_quiz_teams_v1');
      this.teams = this.loadTeams();
      this.saveTeams();
      this.goToSlide(0);
      this.showToast('Тоглоом шинээр эхэллээ!');
    }
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--cyan-neon);
      color: #fff;
      padding: 12px 24px;
      border-radius: 30px;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
      font-weight: 700;
      font-size: 0.95rem;
      z-index: 9999;
      pointer-events: none;
      animation: fadeIn 0.25s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ==================== CONFETTI ENGINE ====================
  triggerVictoryConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ffd700', '#ff5226', '#00e5ff', '#e040fb', '#00e676', '#ffffff'];

    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width * 0.5,
        y: canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.5) * 22 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        life: 1,
        decay: Math.random() * 0.008 + 0.006
      });
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      particles.forEach(p => {
        if (p.life > 0) {
          alive++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.rotation += p.vRot;
          p.life -= p.decay;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (alive > 0) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animateConfetti();
  }

  // ==================== KEYBOARD BINDINGS ====================
  bindEvents() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if typing in an input
      if (e.target.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.prevSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.toggleTimer();
      } else if (e.key.toLowerCase() === 's') {
        this.toggleScoreboardDrawer();
      } else if (e.key.toLowerCase() === 'm') {
        this.toggleSound();
      } else if (e.key.toLowerCase() === 'f') {
        this.toggleFullscreen();
      } else if (e.key === 'Escape') {
        this.closeScoreboardDrawer();
      }
    });

    window.addEventListener('resize', () => {
      const canvas = document.getElementById('confetti-canvas');
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    });
  }
}

// Global App Instance
let app = null;
window.addEventListener('DOMContentLoaded', () => {
  app = new QuizApp();
});
