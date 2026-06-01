export const adCreatives = [
  {
    id: 'ad-fnb-business',
    advertiser: 'FNB Botswana',
    title: 'FNB Business Solutions',
    description: 'Grow your business with FNB\'s tailored financial solutions. Apply today.',
    cta: 'Apply Now',
    ctaUrl: '/solutions',
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80',
    color: '#00A19C',
    targetCategories: ['business', 'news'],
    type: 'banner',
    priority: 1,
  },
  {
    id: 'ad-orange-money',
    advertiser: 'Orange Botswana',
    title: 'Orange Money — Send & Receive Instantly',
    description: 'Transfer money across Botswana in seconds. Download the app today.',
    cta: 'Get Started',
    ctaUrl: '/solutions',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    color: '#FF6600',
    targetCategories: ['business', 'lifestyle'],
    type: 'banner',
    priority: 2,
  },
  {
    id: 'ad-debswana',
    advertiser: 'Debswana',
    title: 'Building Botswana\'s Future Together',
    description: 'Sustainable mining for a brighter tomorrow. Learn about our community initiatives.',
    cta: 'Learn More',
    ctaUrl: '/solutions',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    color: '#1565C0',
    targetCategories: ['news', 'opinion'],
    type: 'banner',
    priority: 3,
  },
  {
    id: 'ad-mascom',
    advertiser: 'Mascom Wireless',
    title: 'Mascom SuperFast 5G',
    description: 'Experience blazing-fast internet with Mascom\'s new 5G network. Now available in Gaborone.',
    cta: 'Check Coverage',
    ctaUrl: '/solutions',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    color: '#7B1FA2',
    targetCategories: ['lifestyle', 'sport'],
    type: 'sidebar',
    priority: 1,
  },
  {
    id: 'ad-stanbic',
    advertiser: 'Stanbic Bank',
    title: 'Home Loans Made Simple',
    description: 'Own your dream home with competitive rates. Pre-qualify online in minutes.',
    cta: 'Pre-Qualify',
    ctaUrl: '/solutions',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    color: '#003DA5',
    targetCategories: ['business', 'lifestyle'],
    type: 'sidebar',
    priority: 2,
  },
  {
    id: 'ad-btc',
    advertiser: 'BTC',
    title: 'BTC Fibre — Ultra-Fast Broadband',
    description: 'Stream, game, and work from home with unlimited fibre. Plans from P299/month.',
    cta: 'View Plans',
    ctaUrl: '/solutions',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    color: '#E65100',
    targetCategories: ['lifestyle', 'sport'],
    type: 'sidebar',
    priority: 3,
  },
];

export const popupAds = [
  {
    id: 'popup-weekend-post-subscribe',
    advertiser: 'Weekend Post',
    title: 'Unlock Premium Journalism',
    description: 'Get unlimited access to in-depth reporting, exclusive analysis, and the digital E-Paper.',
    cta: 'Subscribe Now',
    ctaUrl: '/subscribe',
    color: '#B8860B',
    priority: 1,
    isInternal: true,
  },
  {
    id: 'popup-fnb-promo',
    advertiser: 'FNB Botswana',
    title: 'FNB Gold Business Account',
    description: 'Open a Gold Business Account and get 6 months zero fees. Limited time offer.',
    cta: 'Open Account',
    ctaUrl: '/solutions',
    color: '#00A19C',
    priority: 2,
    isInternal: false,
  },
  {
    id: 'popup-orange-data',
    advertiser: 'Orange Botswana',
    title: 'Orange Data Mega Bundles',
    description: '50GB for just P199. Stay connected with the best data deals in Botswana.',
    cta: 'Buy Bundle',
    ctaUrl: '/solutions',
    color: '#FF6600',
    priority: 3,
    isInternal: false,
  },
];

const AD_ANALYTICS_KEY = 'wp_ad_analytics';
const AD_FREQUENCY_KEY = 'wp_ad_frequency';

export function trackAdImpression(adId) {
  const analytics = JSON.parse(localStorage.getItem(AD_ANALYTICS_KEY) || '{}');
  if (!analytics[adId]) {
    analytics[adId] = { impressions: 0, clicks: 0, lastShown: null };
  }
  analytics[adId].impressions += 1;
  analytics[adId].lastShown = new Date().toISOString();
  localStorage.setItem(AD_ANALYTICS_KEY, JSON.stringify(analytics));
}

export function trackAdClick(adId) {
  const analytics = JSON.parse(localStorage.getItem(AD_ANALYTICS_KEY) || '{}');
  if (!analytics[adId]) {
    analytics[adId] = { impressions: 0, clicks: 0, lastShown: null };
  }
  analytics[adId].clicks += 1;
  localStorage.setItem(AD_ANALYTICS_KEY, JSON.stringify(analytics));
}

export function getAdAnalytics() {
  return JSON.parse(localStorage.getItem(AD_ANALYTICS_KEY) || '{}');
}

export function canShowPopupAd() {
  const freq = JSON.parse(localStorage.getItem(AD_FREQUENCY_KEY) || '{}');
  const now = Date.now();
  if (freq.lastPopup && (now - freq.lastPopup) < 30 * 60 * 1000) {
    return false;
  }
  return true;
}

export function recordPopupShown() {
  const freq = JSON.parse(localStorage.getItem(AD_FREQUENCY_KEY) || '{}');
  freq.lastPopup = Date.now();
  freq.popupCount = (freq.popupCount || 0) + 1;
  localStorage.setItem(AD_FREQUENCY_KEY, JSON.stringify(freq));
}

export function getRotatingAd(type, category = null) {
  const pool = adCreatives.filter(ad => {
    if (ad.type !== type) return false;
    if (category && !ad.targetCategories.includes(category)) return false;
    return true;
  });
  if (pool.length === 0) return adCreatives.find(ad => ad.type === type) || adCreatives[0];
  const totalWeight = pool.reduce((sum, ad) => sum + (4 - ad.priority), 0);
  let random = Math.random() * totalWeight;
  for (const ad of pool) {
    random -= (4 - ad.priority);
    if (random <= 0) return ad;
  }
  return pool[0];
}

export function getRotatingPopupAd() {
  const freq = JSON.parse(localStorage.getItem(AD_FREQUENCY_KEY) || '{}');
  const shownIds = freq.shownPopupIds || [];
  const unseen = popupAds.filter(ad => !shownIds.includes(ad.id));
  const pool = unseen.length > 0 ? unseen : popupAds;
  const ad = pool[Math.floor(Math.random() * pool.length)];
  freq.shownPopupIds = [...shownIds, ad.id].slice(-10);
  localStorage.setItem(AD_FREQUENCY_KEY, JSON.stringify(freq));
  return ad;
}
