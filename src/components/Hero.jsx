import { useRef, useEffect } from 'react';

export default function Hero({ onContact, onScrollTo }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => ref.current && ref.current.classList.add('in'), 120);
    return () => clearTimeout(t);
  }, []);

  const line1 = "Let's shape";
  const line2 = "what's next";
  let idx = 0;

  const renderLine = (text, italic = false) => (
    <span className="line">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="word">
          {word.split('').map((c, ci) => {
            const i = idx++;
            const isApos = c === '\u2019' || c === "'";
            return (
              <span
                key={ci}
                className={'char' + (italic ? ' the' : '') + (isApos ? ' apos' : '')}
                style={{ transitionDelay: `${i * 28}ms` }}
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
    <section className="hero" id="top">
      <div className="hero-body">
        <h1 className="hero-title" ref={ref}>
          {renderLine(line1)}
          {renderLine(line2, true)}
        </h1>
        <div className="hero-jp">
          <span className="show-en">遊びの中に、次の産業がある。</span>
          <span className="show-ja">探索から構造へ。</span>
        </div>
      </div>

      <div className="hero-footmeta">
        <p className="hero-lede">
          <span className="show-en">LUDENTZ is a Tokyo studio operating across two axes — marketing AX and business development. We partner with operators and founders to turn raw intent into products that ship.</span>
          <span className="show-ja">LUDENTZは、東京を拠点とするスタジオです。Marketing AX・新規事業開発の二つの軸で、先端を走ります。</span>
        </p>
        <div className="hero-scroll" onClick={() => onScrollTo('work')} style={{ cursor: 'pointer' }}>
          <span>Scroll</span>
          <span className="hero-scroll-line" />
        </div>
      </div>

      <div className="hero-marquee">
        <div className="track">
          <span>Let's shape what's next</span>
          <span>探索から構造へ</span>
          <span>新規事業開発</span>
          <span>Marketing AX</span>
          <span>Let's shape what's next</span>
          <span>探索から構造へ</span>
          <span>新規事業開発</span>
          <span>Marketing AX</span>
        </div>
      </div>
    </section>
  );
}
