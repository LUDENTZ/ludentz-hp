import { useRef, useEffect } from 'react';

export default function CTA({ onContact }) {
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
          {renderLine('突破 しましょう')}
        </span>
      </h2>
      <div className="cta-row">
        <button className="btn-inv" onClick={onContact}>
          <span className="show-en">Start a project</span>
          <span className="show-ja">ご相談はコチラから</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 6h8M7 2l4 4-4 4"/></svg>
        </button>
      </div>
    </section>
  );
}
