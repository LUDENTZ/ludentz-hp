// hero背景の装飾線画：オーケストレーションのメタファー。
// 左からの入力が中央のオーケストレーター（二重円）に届き、
// そこから3本のスポークがワーカーノードへ伸び、各ワーカーが右へ走り続ける。
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
      {/* 入力：左から中央のオーケストレーターへ */}
      <path className="p-in" pathLength="1" d="M -40 560 H 320 L 430 470 H 540 L 600 408" />
      {/* スポーク：オーケストレーター → 各ワーカー */}
      <path className="p-s1" pathLength="1" d="M 600 400 V 250 L 665 185 H 800" />
      <path className="p-s2" pathLength="1" d="M 594 394 L 460 260 V 200 L 415 155" />
      <path className="p-s3" pathLength="1" d="M 600 400 L 700 500 H 810" />
      {/* ワーカーから先へ走る線 */}
      <path className="p-e1" pathLength="1" d="M 800 185 H 950 L 1010 125 H 1240" />
      <path className="p-e2" pathLength="1" d="M 810 500 H 990 L 1050 560 H 1240" />
      {/* オーケストレーター（二重円） */}
      <circle className="n-hub-ring" cx="600" cy="400" r="12" />
      <circle className="n-hub" cx="600" cy="400" r="4.5" />
      {/* ワーカー */}
      <circle className="n-w1" cx="800" cy="185" r="4" />
      <rect className="n-w2" x="410" y="150" width="9" height="9" transform="rotate(45 414.5 154.5)" />
      <circle className="n-w3" cx="810" cy="500" r="4" />
    </svg>
  );
}
