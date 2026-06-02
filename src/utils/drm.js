/**
 * DRM and Device Fingerprinting utilities
 */

export const getDeviceFingerprint = async () => {
  // Simple browser fingerprinting for demo purposes
  // In production, use fingerprintjs2 or similar
  const navigatorInfo = `${navigator.userAgent}-${navigator.language}-${navigator.platform}`;
  const screenInfo = `${window.screen.width}x${window.screen.height}-${window.screen.colorDepth}`;
  
  // Basic hash function
  const str = `${navigatorInfo}-${screenInfo}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `DEV-${Math.abs(hash).toString(16).toUpperCase()}`;
};

export const checkDeviceAuthorization = async (userId, subscriptionType) => {
  const currentFingerprint = await getDeviceFingerprint();
  const storageKey = `drm_devices_${userId}`;
  
  let authorizedDevices = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  if (authorizedDevices.includes(currentFingerprint)) {
    return true;
  }

  // Enforce Max Devices (3 for paid, 1 for free/guest)
  const maxDevices = subscriptionType === 'free' ? 1 : 3;
  
  if (authorizedDevices.length < maxDevices) {
    authorizedDevices.push(currentFingerprint);
    localStorage.setItem(storageKey, JSON.stringify(authorizedDevices));
    return true;
  }

  return false; // Device limit reached
};
