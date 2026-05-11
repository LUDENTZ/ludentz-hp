import { useState, useEffect, useRef } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import Manifesto from './components/Manifesto';
import Company from './components/Company';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import { trackEvent } from './lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal', cursor: 'on' };

function Cursor({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let x = rx, y = ry;
    const onMove = (e) => { rx = e.clientX; ry = e.clientY; };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest && t.closest('a, button, .process-row, .pillar-link, .chip, .nav-logo')) {
        el.classList.add('hover');
      } else {
        el.classList.remove('hover');
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    let raf;
    const loop = () => {
      x += (rx - x) * 0.22;
      y += (ry - y) * 0.22;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  if (!enabled) return null;
  return <div className="cursor" ref={ref} />;
}

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
      <Cursor enabled={DEFAULTS.cursor === 'on'} />
    </div>
  );
}
