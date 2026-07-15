import { useRef, useEffect } from 'react';

export default function Hero({ onContact, onScrollTo }) {
  const ref = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => ref.current && ref.current.classList.add('in'), 120);
    return () => clearTimeout(t);
  }, []);

  const line1 = 'We are';
  const line2 = 'AI-native.';
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
          <span className="show-ja">会社そのものが、AI前提でできている。</span>
        </div>
      </div>

      <div className="hero-footmeta">
        <p className="hero-lede">
          <span className="show-en">LUDENTZ is an AI-native studio in Tokyo. We run our own work on AI agents — and transplant that playbook into your organisation.</span>
          <span className="show-ja">LUDENTZは、AIを「使う」のではなく、AI前提で働くスタジオです。自分たちの実務で磨いた型を、クライアントの組織に移植します。</span>
        </p>
        <div className="hero-scroll" onClick={() => onScrollTo('work')} style={{ cursor: 'pointer' }}>
          <span>Scroll</span>
          <span className="hero-scroll-line" />
        </div>
      </div>

      <div className="hero-marquee">
        <div className="track">
          <span>We are AI-native</span>
          <span>探索から構造へ</span>
          <span>新規事業開発</span>
          <span>Marketing AX</span>
          <span>We are AI-native</span>
          <span>探索から構造へ</span>
          <span>新規事業開発</span>
          <span>Marketing AX</span>
        </div>
      </div>
    </section>
  );
}
