import { useEffect, useRef } from 'react';

const HOVER_TARGETS = [
  'a',
  'button',
  '[role="button"]',
  '.process-row',
  '.pillar-link',
  '.chip',
  '.nav-logo',
  '.footer-wordmark',
  '.business-service-tab',
  '.business-plan-card-toggle',
].join(', ');

export default function Cursor({ enabled = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let x = rx;
    let y = ry;

    const onMove = (event) => {
      rx = event.clientX;
      ry = event.clientY;
    };

    const onOver = (event) => {
      const target = event.target;
      if (target.closest && target.closest(HOVER_TARGETS)) {
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
