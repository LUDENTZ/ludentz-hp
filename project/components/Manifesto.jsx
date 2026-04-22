/* global React */
function Manifesto() {
  const ref = React.useRef(null);
  const [offset, setOffset] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress from -1 (below viewport) through 0 (center) to 1 (above)
      const progress = (vh - rect.top) / (vh + rect.height);
      setOffset(progress);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shift = (offset - 0.5) * 400; // px
  return (
    <section className="manifesto" id="manifesto" ref={ref} data-screen-label="Manifesto">
      <div className="manifesto-bg">
        <div className="big" style={{ transform: `translateX(${-shift}px)` }}>LUDENTZ · LUDENTZ · LUDENTZ · LUDENTZ</div>
        <div className="big" style={{ transform: `translateX(${shift}px)` }}>遊びの中に、次の産業がある。</div>
      </div>
      <div className="manifesto-content">
        <blockquote className="manifesto-quote">
          <span className="show-en">
            <em>Less,</em> but exact.<br/>
            秩序と、遊びを<br/>
            同じ文で、届ける。
          </span>
          <span className="show-ja">
            挑戦を<em>楽しむ</em>。<br/>
            泥臭く手を動かす。<br/>
            世界が少し良くなる。
          </span>
        </blockquote>
        <div className="manifesto-side">
          <p>
            <span className="show-en">Large visions only arrive through the quiet accumulation of small steps. Drawing the blueprint, and dirtying our hands to move it — we hold on to both.</span>
            <span className="show-ja">大きな構想は、地味な一歩の積み重ね。<br/>設計図を描くこと、手を汚して動かすこと、常にその両方を大切にする。</span>
          </p>
        </div>
      </div>
    </section>
  );
}
window.Manifesto = Manifesto;
