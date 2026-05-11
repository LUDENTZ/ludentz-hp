const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

let initialized = false;

function loadScript(src, attrs = {}) {
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  Object.entries(attrs).forEach(([key, value]) => {
    script.setAttribute(key, value);
  });
  document.head.appendChild(script);
}

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      page_path: window.location.pathname + window.location.search,
    });

    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  }

  if (CLARITY_ID) {
    window.clarity = window.clarity || function clarity() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };

    loadScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
  }
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', name, params);
  }
}
