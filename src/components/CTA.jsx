import { useRef, useEffect } from 'react';
import ContactForm from './ContactForm';

export default function CTA() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } }); },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let idx = 0;
  const renderLine = (text, italic = false) => (
    <span className="line">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="word">
          {word.split('').map((c, ci) => {
            const i = idx++;
            const isApos = c === '’' || c === "'";
            return (
              <span
                key={ci}
                className={'char' + (italic ? ' the' : '') + (isApos ? ' apos' : '')}
                style={{ transitionDelay: `${i * 36}ms` }}
              >
                {c}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );

  return (
    <section className="cta" id="contact">
      <div className="cta-head">Contact</div>
      <h2 className="cta-title hero-title" ref={ref}>
        <span className="show-en">
          {renderLine('Got an')}
          {renderLine('intent?', true)}
        </span>
        <span className="show-ja">
          {renderLine('まずは ヒアリングから ご一緒しましょう')}
        </span>
      </h2>
      <div className="cta-form-panel">
        <ContactForm />
      </div>
    </section>
  );
}
