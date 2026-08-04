// hero背景の装飾線画：AIエージェントのメタファー。
// 点線の境界の中で、ノードグラフを内包した3つのモデル円が弧で循環し、
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
      {/* 入力：左からエージェント境界へ */}
      <path className="p-in" pathLength="1" d="M -40 585 H 320 L 420 505 H 500" />

      {/* エージェント境界（点線） */}
      <rect className="b-box" x="470" y="225" width="380" height="390" rx="14" />

      {/* モデルA（上） */}
      <circle className="c-m c-a" cx="600" cy="292" r="34" />
      <g className="g-m g-a">
        <line x1="586" y1="282" x2="602" y2="276" />
        <line x1="602" y1="276" x2="614" y2="288" />
        <line x1="586" y1="282" x2="592" y2="300" />
        <line x1="592" y1="300" x2="610" y2="304" />
        <line x1="614" y1="288" x2="610" y2="304" />
        <circle cx="586" cy="282" r="2.2" />
        <circle cx="602" cy="276" r="2.2" />
        <circle cx="614" cy="288" r="2.2" />
        <circle cx="592" cy="300" r="2.2" />
        <circle cx="610" cy="304" r="2.2" />
      </g>

      {/* モデルB（右下） */}
      <circle className="c-m c-b" cx="762" cy="552" r="29" />
      <g className="g-m g-b">
        <line x1="750" y1="546" x2="766" y2="540" />
        <line x1="766" y1="540" x2="776" y2="554" />
        <line x1="750" y1="546" x2="756" y2="562" />
        <line x1="756" y1="562" x2="772" y2="564" />
        <circle cx="750" cy="546" r="2.2" />
        <circle cx="766" cy="540" r="2.2" />
        <circle cx="776" cy="554" r="2.2" />
        <circle cx="756" cy="562" r="2.2" />
        <circle cx="772" cy="564" r="2.2" />
      </g>

      {/* モデルC（左下） */}
      <circle className="c-m c-c" cx="533" cy="483" r="27" />
      <g className="g-m g-c">
        <line x1="522" y1="477" x2="538" y2="472" />
        <line x1="538" y1="472" x2="546" y2="486" />
        <line x1="522" y1="477" x2="528" y2="493" />
        <line x1="528" y1="493" x2="544" y2="494" />
        <circle cx="522" cy="477" r="2.2" />
        <circle cx="538" cy="472" r="2.2" />
        <circle cx="546" cy="486" r="2.2" />
        <circle cx="528" cy="493" r="2.2" />
        <circle cx="544" cy="494" r="2.2" />
      </g>

      {/* 循環の弧：A→B→C→A */}
      <path className="p-arc p-arc1" pathLength="1" d="M 631 306 Q 742 380 766 522" />
      <path className="p-arc p-arc2" pathLength="1" d="M 733 555 Q 640 540 559 470" />
      <path className="p-arc p-arc3" pathLength="1" d="M 528 456 Q 540 350 570 318" />
      {/* 弧の矢じり */}
      <path className="a-h a-h1" d="M 766 522 l -8 -10 l 11 -1 z" />
      <path className="a-h a-h2" d="M 559 470 l 12 1 l -5 10 z" />
      <path className="a-h a-h3" d="M 570 318 l -10 6 l -1 -11 z" />

      {/* 出力：境界から右へ */}
      <path className="p-out" pathLength="1" d="M 791 552 H 1000 L 1062 610 H 1240" />
    </svg>
  );
}
