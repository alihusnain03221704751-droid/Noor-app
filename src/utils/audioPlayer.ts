// Audio player utility supporting authentic Azan streams and Web Audio synthesizer fallback

class AzanAudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  private azanSources: Record<string, string> = {
    makkah: 'https://cdn.alhanislam.com/audio/adhan-makkah.mp3',
    madinah: 'https://cdn.alhanislam.com/audio/adhan-madina.mp3',
    fajr: 'https://cdn.alhanislam.com/audio/adhan-fajr.mp3',
    chime: 'https://cdn.freesound.org/previews/316/316847_4939433-lq.mp3'
  };

  public playAzan(type: 'makkah' | 'madinah' | 'fajr' | 'chime' = 'makkah', onEnd?: () => void): boolean {
    this.stop();
    this.isPlaying = true;

    const audioUrl = this.azanSources[type] || this.azanSources.makkah;
    const audio = new Audio(audioUrl);
    this.currentAudioElement = audio;

    audio.volume = 0.85;

    audio.onended = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      // If CDN audio is blocked in iframe/sandbox, use Web Audio API authentic Islamic chime / tonal call
      this.playSyntheticAdhanChime(onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to web audio synthesis if browser blocked direct mp3
        this.playSyntheticAdhanChime(onEnd);
      });
    }

    return true;
  }

  // Beautiful harmonic chime using Web Audio API
  public playSyntheticAdhanChime(onEnd?: () => void): void {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      const ctx = this.audioCtx;

      // Authentic oriental Bayati/Hijaz harmonic sequence (Maqam Rast / Hijaz notes)
      const notes = [
        { freq: 293.66, dur: 1.2 }, // D4 (Allahu Akbar)
        { freq: 329.63, dur: 0.8 }, // E4
        { freq: 349.23, dur: 1.4 }, // F4
        { freq: 392.00, dur: 1.6 }, // G4
        { freq: 349.23, dur: 0.8 }, // F4
        { freq: 293.66, dur: 2.0 }, // D4
      ];

      let startTime = ctx.currentTime + 0.1;

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm sine + subtle triangle harmonics for bell-like quality
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.dur);

        startTime += note.dur * 0.9;
      });

      setTimeout(() => {
        this.isPlaying = false;
        if (onEnd) onEnd();
      }, (startTime - ctx.currentTime) * 1000);
    } catch {
      this.isPlaying = false;
      if (onEnd) onEnd();
    }
  }

  public playAyahRecitation(ayahNumberInQuran: number, onEnd?: () => void): HTMLAudioElement {
    this.stop();
    this.isPlaying = true;

    // High quality Mishary Rashid Alafasy Ayah by Ayah audio
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumberInQuran}.mp3`;
    const audio = new Audio(audioUrl);
    this.currentAudioElement = audio;

    audio.onended = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    };

    audio.play().catch(() => {
      this.isPlaying = false;
    });

    return audio;
  }

  public stop(): void {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioPlayer = new AzanAudioEngine();
