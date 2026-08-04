// hero背景の装飾線画：AIエージェントのメタファー（シャープな計器調）。
// 点線の境界の中で、クロスヘア付きのモデルノード3つを45°ベンドの直線回路が循環し、
// 左から入力を受け、右へアクションが出ていく。pathLength=1 でdashアニメーションを正規化
export default function AxHeroLines() {
  return (
    <svg
      className="ax-hero-lines"
      viewBox="0 0 1200 640"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* 入力：左から境界へ（交点にティック） */}
      <path className="p-in" pathLength="1" d="M -40 585 H 300 L 380 505 H 480" />
      <line className="tick t-in" x1="480" y1="497" x2="480" y2="513" />

      {/* エージェント境界（点線・直角） */}
      <rect className="b-box" x="480" y="236" width="360" height="368" />

      {/* モデルノード：クロスヘア付きの円 */}
      <g className="c-m g-a">
        <circle cx="600" cy="292" r="12" />
        <circle className="dot" cx="600" cy="292" r="2.5" />
        <line x1="600" y1="274" x2="600" y2="282" />
        <line x1="600" y1="302" x2="600" y2="310" />
        <line x1="582" y1="292" x2="590" y2="292" />
        <line x1="610" y1="292" x2="618" y2="292" />
      </g>
      <g className="c-m g-b">
        <circle cx="762" cy="552" r="12" />
        <circle className="dot" cx="762" cy="552" r="2.5" />
        <line x1="762" y1="534" x2="762" y2="542" />
        <line x1="762" y1="562" x2="762" y2="570" />
        <line x1="744" y1="552" x2="752" y2="552" />
        <line x1="772" y1="552" x2="780" y2="552" />
      </g>
      <g className="c-m g-c">
        <circle cx="533" cy="483" r="12" />
        <circle className="dot" cx="533" cy="483" r="2.5" />
        <line x1="533" y1="465" x2="533" y2="473" />
        <line x1="533" y1="493" x2="533" y2="501" />
        <line x1="515" y1="483" x2="523" y2="483" />
        <line x1="543" y1="483" x2="551" y2="483" />
      </g>

      {/* 循環回路：A→B→C→A（45°ベンドの直線） */}
      <path className="p-arc p-arc1" pathLength="1" d="M 612 304 L 700 392 V 470 L 754 524" />
      <path className="p-arc p-arc2" pathLength="1" d="M 744 552 H 620 L 553 496" />
      <path className="p-arc p-arc3" pathLength="1" d="M 533 465 V 390 L 588 316" />
      {/* 矢じり */}
      <path className="a-h a-h1" d="M 754 524 l -10 -3 l 3 -7 z" />
      <path className="a-h a-h2" d="M 553 496 l 3 -10 l 7 4 z" />
      <path className="a-h a-h3" d="M 588 316 l -10 3 l 3 7 z" />

      {/* 出力：境界から右へ（交点にティック） */}
      <path className="p-out" pathLength="1" d="M 774 552 H 1000 L 1062 610 H 1240" />
      <line className="tick t-out" x1="840" y1="544" x2="840" y2="560" />
    </svg>
  );
}
