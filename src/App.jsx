import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import Manifesto from './components/Manifesto';
import Company from './components/Company';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import { trackEvent } from './lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.body.dataset.lang = DEFAULTS.lang;
    document.body.classList.toggle('dark', DEFAULTS.theme === 'dark');
    document.body.classList.add('intensity-' + DEFAULTS.intensity);
  }, []);

  useReveal();

  const scrollTo = (id) => {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
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
    <div className="app">
      <Nav onContact={() => openContact('nav')} onScrollTo={scrollTo} />
      <main>
        <Hero onContact={() => openContact('hero')} onScrollTo={scrollTo} />
        <Pillars />
        <Manifesto />
        <Company />
        <CTA onContact={() => openContact('cta')} />
      </main>
      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
