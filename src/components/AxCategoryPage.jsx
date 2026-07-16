import { useEffect, useState } from 'react';
import Nav from './Nav';
import CTA from './CTA';
import Footer from './Footer';
import ContactModal from './ContactModal';
import AxIntro from './AxIntro';
import AxServiceModel from './AxServiceModel';
import AxStack from './AxStack';
import AxPricing from './AxPricing';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

export default function AxCategoryPage({ config, children }) {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.body.dataset.lang = DEFAULTS.lang;
    document.body.classList.toggle('dark', DEFAULTS.theme === 'dark');
    document.body.classList.add('intensity-' + DEFAULTS.intensity);
  }, []);

  const scrollTo = (id) => {
    if (id === 'top') {
      window.location.href = '/';
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const openContact = (source) => {
    trackEvent('contact_click', {
      page_path: window.location.pathname,
      source,
    });
    setModal(true);
  };

  return (
    <div className="business-page">
      <Nav onContact={() => openContact('nav')} onScrollTo={scrollTo} />

      <main>
        <section className="business-hero" id="top">
          <div className="business-hero-layout">
            <div className="business-hero-copy">
              <div className="business-hero-meta">
                {config.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <h1 className="business-title business-title--long">
                {config.title.map((line) => (
                  <span className="nowrap" key={line}>{line}</span>
                ))}
              </h1>
              <p className="business-lead">{config.lead}</p>
            </div>

            <aside className="business-hero-panel" aria-label={config.panelLabel}>
              <span className="business-hero-panel-label">{config.panelLabel}</span>
              <ul className="business-hero-paths">
                {config.highlights.map((item, index) => (
                  <li className="business-hero-path" key={item.strong}>
                    <span className="business-hero-path-num">{String(index + 1).padStart(2, '0')}</span>
                    <div className="business-hero-path-body">
                      <strong>{item.strong}</strong>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <AxIntro />

        <AxServiceModel />

        {children}

        <AxStack />

        <AxPricing />

        <CTA />
      </main>

      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
