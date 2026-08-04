// hero背景の装飾線画。決定論的パイプラインを思わせるヘアラインが表示時にゆっくり描画される。
// pathLength=1 でCSS側のdashアニメーションを正規化している
export default function AxHeroLines() {
  return (
    <svg
      className="ax-hero-lines"
      viewBox="0 0 1200 640"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      <path className="l1" pathLength="1" d="M -40 520 H 250 L 330 440 H 620" />
      <path className="l2" pathLength="1" d="M 620 440 H 810 L 878 372 H 1240" />
      <path className="l3" pathLength="1" d="M 330 440 V 250 L 404 176 H 750" />
      <path className="l4" pathLength="1" d="M 750 176 L 816 110 H 1240" />
      <circle className="n1" cx="250" cy="520" r="4" />
      <circle className="n2" cx="620" cy="440" r="4" />
      <circle className="n3" cx="750" cy="176" r="4" />
      <rect className="n4" x="873" y="367" width="10" height="10" />
    </svg>
  );
}
