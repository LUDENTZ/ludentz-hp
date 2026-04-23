import { useRef, useState, useEffect } from 'react';

export default function Manifesto() {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      setOffset(progress);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shift = (offset - 0.5) * 400;

  return (
    <section className="manifesto" id="manifesto" ref={ref}>
      <div className="manifesto-bg">
        <div className="big" style={{ transform: `translateX(${-shift}px)` }}>LUDENTZ · LUDENTZ · LUDENTZ · LUDENTZ</div>
        <div className="big" style={{ transform: `translateX(${shift}px)` }}>遊びの中に、次の産業がある。</div>
      </div>
      <div className="manifesto-content">
        <blockquote className="manifesto-quote">
          <span className="show-en">
            <em>Less,</em> but exact.<br />
            秩序と、遊びを<br />
            同じ文で、届ける。
          </span>
          <span className="show-ja">
            挑戦を<em>楽しむ</em>。<br />
            泥臭く手を動かす。<br />
            世界が少し良くなる。
          </span>
        </blockquote>
        <div className="manifesto-side">
          <p>
            <span className="show-en">Large visions only arrive through the quiet accumulation of small steps. Drawing the blueprint, and dirtying our hands to move it — we hold on to both.</span>
            <span className="show-ja">大きな構想は、地味な一歩の積み重ね。<br />設計図を描くこと、手を汚して動かすこと、常にその両方を大切にする。</span>
          </p>
        </div>
      </div>
    </section>
  );
}
