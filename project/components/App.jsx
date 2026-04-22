/* global React, ReactDOM, Nav, Hero, Pillars, Manifesto, Company, CTA, Footer, ContactModal, Tweaks, TWEAK_DEFAULTS */

function Cursor({ enabled }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2;
    let x = rx, y = ry;
    const onMove = (e) => { rx = e.clientX; ry = e.clientY; };
    const onOver = (e) => {
      const t = e.target;
      if (t.closest && t.closest('a, button, .work-row, .process-row, .pillar-link, .chip, .nav-link, .nav-logo')) {
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
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function App() {
  const [modal, setModal] = React.useState(false);
  const [state, setState] = React.useState(() => ({ ...TWEAK_DEFAULTS }));

  const setKey = (k, v) => {
    setState(s => ({ ...s, [k]: v }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  // Apply state → DOM
  React.useEffect(() => {
    document.body.dataset.lang = state.lang;
    document.body.classList.toggle('dark', state.theme === 'dark');
    document.body.classList.remove('intensity-quiet', 'intensity-normal', 'intensity-loud');
    document.body.classList.add('intensity-' + state.intensity);
  }, [state]);

  useReveal();

  const scrollTo = (id) => {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  const openContact = () => setModal(true);

  return (
    <div className="app">
      <Nav onContact={openContact} onScrollTo={scrollTo} />
      <main>
        <Hero onContact={openContact} onScrollTo={scrollTo} />
        <Pillars />
        <Manifesto />
        <Company />
        <CTA onContact={openContact} />
      </main>
      <Footer />
      <ContactModal open={modal} onClose={() => setModal(false)} />
      <Cursor enabled={state.cursor === 'on'} />
      <Tweaks state={state} setKey={setKey} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
