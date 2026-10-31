import { audioPlayer } from './audioPlayer';

export interface PrayerAlertConfig {
  enabledPrayers: Record<string, boolean>; // e.g. { Fajr: true, Sunrise: false, Zuhr: true, Asr: true, Maghrib: true, Isha: true }
  soundEnabled: boolean;
  azanSound: 'makkah' | 'madinah' | 'fajr' | 'chime';
  timingOffsetMinutes: number; // 0 for exact time, -5 for 5 min before
}

export interface ActiveAlertNotification {
  id: string;
  prayerKey: string;
  prayerNameUrdu: string;
  prayerNameEn: string;
  time: string;
  cityName: string;
  timestamp: number;
}

class PrayerNotificationEngine {
  private notifiedToday: Set<string> = new Set();
  private checkIntervalId: number | null = null;
  private inAppAlertListeners: ((alert: ActiveAlertNotification) => void)[] = [];

  constructor() {
    this.loadNotifiedFromStorage();
  }

  private loadNotifiedFromStorage() {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`noor_notified_prayers_${todayStr}`);
      if (saved) {
        const arr: string[] = JSON.parse(saved);
        this.notifiedToday = new Set(arr);
      } else {
        // Clean up older keys
        this.notifiedToday = new Set();
      }
    } catch {
      this.notifiedToday = new Set();
    }
  }

  private saveNotifiedToStorage() {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem(
      `noor_notified_prayers_${todayStr}`,
      JSON.stringify(Array.from(this.notifiedToday))
    );
  }

  // Parse "05:12 AM" or "01:30 PM" to today's Date object
  public parseTimeStringToDate(timeStr: string): Date | null {
    if (!timeStr) return null;
    const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);
    return targetDate;
  }

  public subscribeInAppAlert(callback: (alert: ActiveAlertNotification) => void) {
    this.inAppAlertListeners.push(callback);
    return () => {
      this.inAppAlertListeners = this.inAppAlertListeners.filter((cb) => cb !== callback);
    };
  }

  public async requestBrowserPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  public getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  }

  // Trigger an alert for a specific prayer
  public triggerPrayerAlert(
    prayerKey: string,
    prayerNameUrdu: string,
    prayerNameEn: string,
    timeDisplay: string,
    cityName: string,
    config: PrayerAlertConfig,
    isManualTest: boolean = false
  ) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const alertKey = `${prayerKey}_${todayStr}`;

    if (!isManualTest) {
      if (this.notifiedToday.has(alertKey)) return;
      this.notifiedToday.add(alertKey);
      this.saveNotifiedToStorage();
    }

    const title = `حی علی الصلاۃ — وقتِ ${prayerNameUrdu} شروع ہو گیا ہے`;
    const body = `شہر: ${cityName} | وقت: ${timeDisplay}\nباجماعت نماز کی تیاری کریں۔`;

    // 1. Browser Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `prayer-${prayerKey}-${todayStr}`,
          requireInteraction: true,
          silent: !config.soundEnabled
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (err) {
        console.warn('Browser notification instantiation error:', err);
      }
    }

    // 2. Play authorized Azan Audio if sound is enabled
    if (config.soundEnabled) {
      const soundType = prayerKey === 'Fajr' ? 'fajr' : config.azanSound;
      audioPlayer.playAzan(soundType);
    }

    // 3. Dispatch to In-App Toast/Banner listeners
    const alertData: ActiveAlertNotification = {
      id: `${Date.now()}_${prayerKey}`,
      prayerKey,
      prayerNameUrdu,
      prayerNameEn,
      time: timeDisplay,
      cityName,
      timestamp: Date.now()
    };

    this.inAppAlertListeners.forEach((listener) => {
      try {
        listener(alertData);
      } catch (e) {
        console.error('Error dispatching in-app alert:', e);
      }
    });
  }

  // Start background periodic check (every 10 seconds)
  public startScheduledWatcher(
    getSchedule: () => {
      prayers: { key: string; nameUrdu: string; nameEn: string; time: string }[];
      cityName: string;
      config: PrayerAlertConfig;
    }
  ) {
    this.stopScheduledWatcher();

    const checkNow = () => {
      const { prayers, cityName, config } = getSchedule();
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

      prayers.forEach((prayer) => {
        // If toggle is OFF for this prayer, skip
        if (!config.enabledPrayers[prayer.key]) return;

        const prayerDate = this.parseTimeStringToDate(prayer.time);
        if (!prayerDate) return;

        // Apply offset (e.g. timingOffsetMinutes = -5 means 5 minutes before)
        const targetMs = prayerDate.getTime() + (config.timingOffsetMinutes * 60 * 1000);
        const targetDate = new Date(targetMs);
        const targetSeconds = targetDate.getHours() * 3600 + targetDate.getMinutes() * 60;

        // If we are within the current minute window of the scheduled start time
        const currentMinuteOfDay = Math.floor(currentSeconds / 60);
        const targetMinuteOfDay = Math.floor(targetSeconds / 60);

        if (currentMinuteOfDay === targetMinuteOfDay) {
          const todayStr = now.toISOString().slice(0, 10);
          const alertKey = `${prayer.key}_${todayStr}`;
          if (!this.notifiedToday.has(alertKey)) {
            this.triggerPrayerAlert(
              prayer.key,
              prayer.nameUrdu,
              prayer.nameEn,
              prayer.time,
              cityName,
              config,
              false
            );
          }
        }
      });
    };

    // Run immediately on start, then every 10 seconds
    checkNow();
    this.checkIntervalId = window.setInterval(checkNow, 10000);
  }

  public stopScheduledWatcher() {
    if (this.checkIntervalId !== null) {
      clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
  }

  public clearTodayHistory() {
    this.notifiedToday.clear();
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.removeItem(`noor_notified_prayers_${todayStr}`);
  }
}

export const prayerNotificationEngine = new PrayerNotificationEngine();
