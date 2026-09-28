/**
 * Device Fingerprinting & Identification Helper
 * Generates and persists a unique device UUID and extracts human-readable device model/browser info.
 */

export function getClientDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  const STORAGE_KEY = 'qyedx_trusted_device_id';
  let deviceId = localStorage.getItem(STORAGE_KEY);
  
  if (!deviceId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      deviceId = 'DEV-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
    }
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  
  return deviceId;
}

export function getClientDeviceInfo(): string {
  if (typeof window === 'undefined') return 'Unknown Device';
  
  const ua = navigator.userAgent;
  let os = 'Unknown OS';
  let model = '';
  let browser = 'Browser';

  // Detect OS & Model
  if (/iPhone/i.test(ua)) {
    os = 'iOS';
    model = 'Apple iPhone';
    const match = ua.match(/OS (\d+_\d+(_\d+)?)/);
    if (match) os = `iOS ${match[1].replace(/_/g, '.')}`;
  } else if (/iPad/i.test(ua)) {
    os = 'iPadOS';
    model = 'Apple iPad';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    const androidMatch = ua.match(/Android\s([0-9\.]+)/i);
    if (androidMatch) os = `Android ${androidMatch[1]}`;

    // Try to extract Android Device Model (e.g. SM-S918B, Pixel 8, Redmi Note 12)
    const modelMatch = ua.match(/;\s?([A-Za-z0-9\-_\s]+)\s+Build\//i) || ua.match(/;\s?([A-Za-z0-9\-_]+)\)/i);
    if (modelMatch && modelMatch[1]) {
      model = modelMatch[1].trim();
    } else {
      model = 'Android Device';
    }
  } else if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows 10/11';
    model = 'PC';
  } else if (/Macintosh/i.test(ua)) {
    os = 'macOS';
    model = 'Mac';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
    model = 'Device';
  }

  // Detect Browser
  if (/Edg\//i.test(ua)) {
    browser = 'Edge';
  } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Firefox';
  }

  if (model && model !== 'Device' && model !== 'PC' && model !== 'Mac') {
    return `${model} (${os}) / ${browser}`;
  }
  
  return `${os} / ${browser}`;
}
