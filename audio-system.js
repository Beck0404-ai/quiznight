// Web Audio API Synthesizer & Sound FX Engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.currentMelodyTimer = null;
    this.customAudio = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopAll();
    }
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.3, gainLevel = 0.2, delay = 0) {
    if (this.muted) return;
    this.init();
    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      this.playTone(freq, 'triangle', 0.35, 0.2, i * 0.08);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.35);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playTick() {
    if (this.muted) return;
    this.init();
    this.playTone(880, 'sine', 0.04, 0.08);
  }

  playTimesUp() {
    if (this.muted) return;
    this.init();
    // Gong / alarm sound
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.2, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + 1.3);
    });
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    // Regal victory fanfare chord progression
    const sequence = [
      { f: 523.25, d: 0.15, t: 0.0 }, // C5
      { f: 523.25, d: 0.15, t: 0.18 }, // C5
      { f: 523.25, d: 0.15, t: 0.36 }, // C5
      { f: 659.25, d: 0.45, t: 0.54 }, // E5
      { f: 587.33, d: 0.20, t: 1.05 }, // D5
      { f: 659.25, d: 0.20, t: 1.28 }, // E5
      { f: 783.99, d: 0.70, t: 1.50 }, // G5
      { f: 1046.50, d: 1.2, t: 2.25 }  // C6
    ];

    sequence.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, 0.25, n.t);
      this.playTone(n.f * 0.5, 'sine', n.d, 0.18, n.t); // warm bass octave
    });
  }

  stopAll() {
    if (this.currentMelodyTimer) {
      clearTimeout(this.currentMelodyTimer);
      this.currentMelodyTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.isPlaying = false;
  }

  // Melodies for Round 3
  playMelody(presetName, onEnd = null) {
    this.stopAll();
    if (this.muted) {
      if (onEnd) onEnd();
      return;
    }
    this.init();
    this.isPlaying = true;

    const presets = {
      // 1. Толин хул (Харанга) - Pentatonic rock epic theme
      toliin_khul: [
        { f: 293.66, d: 0.3 }, // D4
        { f: 329.63, d: 0.3 }, // E4
        { f: 440.00, d: 0.45 }, // A4
        { f: 392.00, d: 0.3 }, // G4
        { f: 329.63, d: 0.3 }, // E4
        { f: 293.66, d: 0.6 }, // D4
        { f: 220.00, d: 0.4 }, // A3
        { f: 293.66, d: 0.8 }  // D4 long
      ],

      // 2. Цасан бороо (A-Sound) - Melancholic indie melody
      tsasan_boroo: [
        { f: 440.00, d: 0.35 }, // A4
        { f: 523.25, d: 0.35 }, // C5
        { f: 659.25, d: 0.5 },  // E5
        { f: 587.33, d: 0.35 }, // D5
        { f: 523.25, d: 0.35 }, // C5
        { f: 440.00, d: 0.45 }, // A4
        { f: 392.00, d: 0.45 }, // G4
        { f: 440.00, d: 0.9 }   // A4 long
      ],

      // 3. The HU - Wolf Totem - Driving warrior chant rhythm
      wolf_totem: [
        { f: 146.83, d: 0.25 }, // D3
        { f: 146.83, d: 0.25 }, // D3
        { f: 220.00, d: 0.25 }, // A3
        { f: 293.66, d: 0.5 },  // D4
        { f: 261.63, d: 0.25 }, // C4
        { f: 220.00, d: 0.25 }, // A3
        { f: 196.00, d: 0.3 },  // G3
        { f: 146.83, d: 0.8 }   // D3 long
      ],

      // 4. Billie Jean (Michael Jackson) - Iconic bassline
      billie_jean: [
        { f: 185.00, d: 0.2 }, // F#3
        { f: 220.00, d: 0.2 }, // C#3
        { f: 246.94, d: 0.2 }, // E3
        { f: 277.18, d: 0.2 }, // F#3
        { f: 246.94, d: 0.2 }, // E3
        { f: 220.00, d: 0.2 }, // C#3
        { f: 196.00, d: 0.2 }, // B2
        { f: 220.00, d: 0.4 }  // C#3
      ],

      // 5. We Will Rock You (Queen) - Stomp Stomp Clap motif
      we_will_rock_you: [
        { f: 110.00, d: 0.18 }, // Stomp
        { f: 110.00, d: 0.18 }, // Stomp
        { f: 330.00, d: 0.35 }, // Clap
        { f: 110.00, d: 0.18 }, // Stomp
        { f: 110.00, d: 0.18 }, // Stomp
        { f: 330.00, d: 0.35 }, // Clap
        { f: 370.00, d: 0.25 }, // "Buddy"
        { f: 370.00, d: 0.25 }, // "you're a"
        { f: 370.00, d: 0.50 }  // "boy..."
      ],

      // 6. Blinding Lights (The Weeknd) - 80s Synth hook
      blinding_lights: [
        { f: 659.25, d: 0.2 },  // E5
        { f: 659.25, d: 0.2 },  // E5
        { f: 587.33, d: 0.2 },  // D5
        { f: 659.25, d: 0.35 }, // E5
        { f: 493.88, d: 0.25 }, // B4
        { f: 587.33, d: 0.2 },  // D5
        { f: 440.00, d: 0.4 },  // A4
        { f: 392.00, d: 0.6 }   // G4
      ]
    };

    const notes = presets[presetName] || presets.toliin_khul;
    let totalTime = 0;

    notes.forEach((n, idx) => {
      setTimeout(() => {
        if (!this.isPlaying) return;
        this.playTone(n.f, 'sawtooth', n.d, 0.22);
        this.playTone(n.f * 0.5, 'triangle', n.d, 0.15); // sub-bass warmth
      }, totalTime * 1000);
      totalTime += n.d + 0.05;
    });

    this.currentMelodyTimer = setTimeout(() => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    }, totalTime * 1000);
  }

  playTrack(audioSrc, startTime = 0, endTime = null, onEnd = null) {
    this.stopAll();
    if (this.muted) {
      if (onEnd) onEnd();
      return;
    }
    this.isPlaying = true;
    this.customAudio = new Audio(audioSrc);

    const onCanPlay = () => {
      this.customAudio.removeEventListener('canplay', onCanPlay);
      if (startTime > 0) {
        this.customAudio.currentTime = startTime;
      }
      this.customAudio.play().catch(e => {
        console.warn('Audio play failed:', e);
        this.isPlaying = false;
        if (onEnd) onEnd();
      });
    };

    if (this.customAudio.readyState >= 2) {
      onCanPlay();
    } else {
      this.customAudio.addEventListener('canplay', onCanPlay);
    }

    if (endTime && endTime > startTime) {
      const checkEnd = () => {
        if (!this.customAudio) return;
        if (this.customAudio.currentTime >= endTime) {
          this.stopAll();
          if (onEnd) onEnd();
        } else if (this.isPlaying) {
          requestAnimationFrame(checkEnd);
        }
      };
      requestAnimationFrame(checkEnd);
    } else {
      this.customAudio.onended = () => {
        this.isPlaying = false;
        if (onEnd) onEnd();
      };
    }
  }

  playCustomFile(fileOrUrl, onEnd = null) {
    this.stopAll();
    this.isPlaying = true;
    const url = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
    this.customAudio = new Audio(url);
    this.customAudio.play();
    this.customAudio.onended = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    };
  }
}

const sounds = new SoundEngine();
