// hero背景の装飾線画：左からの1本の入力が起点（二重円）に届き、
// そこから右へ5本の線が放射状に拡散していく。線は直線ではなく、
// 水平＋45°ベンドのカクカクした回路調。並走区間は等間隔（約48px）で揃え、
// 各線の先端にノード、延長線の終端には小さな終端ドットを置く。
// pathLength=1 でdashアニメーションを正規化
export default function AxHeroLines() {
  return (
    <svg
      className="ax-hero-lines"
      viewBox="0 0 1200 640"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* 入力：左から起点へ */}
      <path className="p-in" pathLength="1" d="M -40 570 H 190 L 260 500 H 314" />

      {/* 起点（二重円） */}
      <circle className="n-hub-ring" cx="330" cy="500" r="12" />
      <circle className="n-hub" cx="330" cy="500" r="4.5" />

      {/* 放射：起点から右へ、45°ベンドで等間隔に拡散する5本 */}
      <path className="p-ray p-r1" pathLength="1" d="M 346 489 L 430 405 H 470 L 533 342 H 554" />
      <path className="p-ray p-r2" pathLength="1" d="M 348 493 L 389 452 H 520 L 574 398 H 644" />
      <path className="p-ray p-r3" pathLength="1" d="M 346 500 H 700" />
      <path className="p-ray p-r4" pathLength="1" d="M 348 507 L 389 548 H 520 L 554 582 H 648" />
      <path className="p-ray p-r5" pathLength="1" d="M 346 511 L 430 595 H 470 L 515 640" />

      {/* 各線の先端ノード */}
      <circle className="n-ray n-r1" cx="560" cy="342" r="3" />
      <circle className="n-ray n-r2" cx="650" cy="398" r="3" />
      <rect className="n-ray n-r3" x="704.5" y="495.5" width="9" height="9" transform="rotate(45 709 500)" />
      <circle className="n-ray n-r4" cx="654" cy="582" r="3" />

      {/* 拡散の続き：ノードの先へ、カクカクと伸びて終端ドットで終わる */}
      <path className="p-cont p-c1" pathLength="1" d="M 568 334 L 640 262 H 744 L 800 206" />
      <path className="p-cont p-c2" pathLength="1" d="M 658 398 H 730 L 780 348 H 960" />
      <path className="p-cont p-c3" pathLength="1" d="M 722 500 H 830 L 870 460 H 1090" />
      <path className="p-cont p-c4" pathLength="1" d="M 662 582 H 760 L 794 616 H 1020" />

      {/* 終端ドット：各延長線の末端に接続 */}
      <circle className="n-dust n-d1" cx="800" cy="206" r="2" />
      <circle className="n-dust n-d2" cx="960" cy="348" r="2" />
      <circle className="n-dust n-d3" cx="1090" cy="460" r="2" />
      <circle className="n-dust n-d4" cx="1020" cy="616" r="2" />
    </svg>
  );
}
