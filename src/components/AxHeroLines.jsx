// hero背景の装飾線画：左からの1本の入力が起点（二重円）に届き、
// そこから右へ5本の線が放射状に拡散していく。線は直線ではなく、
// 水平＋45°ベンドのカクカクした回路調。先端に小さなノード、その先は薄い線と微粒子が散る。
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

      {/* 放射：起点から右へ、45°ベンドで拡散する5本 */}
      <path className="p-ray p-r1" pathLength="1" d="M 346 490 L 402 434 H 468 L 560 342" />
      <path className="p-ray p-r2" pathLength="1" d="M 348 494 L 396 446 H 520 L 568 398 H 644" />
      <path className="p-ray p-r3" pathLength="1" d="M 346 500 H 420 L 460 460 H 550 L 590 500 H 700" />
      <path className="p-ray p-r4" pathLength="1" d="M 348 506 L 386 544 H 500 L 538 582 H 648" />
      <path className="p-ray p-r5" pathLength="1" d="M 346 510 L 398 562 H 480 L 528 610 H 564" />

      {/* 各線の先端ノード */}
      <circle className="n-ray n-r1" cx="560" cy="342" r="3" />
      <circle className="n-ray n-r2" cx="650" cy="398" r="3" />
      <rect className="n-ray n-r3" x="704.5" y="495.5" width="9" height="9" transform="rotate(45 709 500)" />
      <circle className="n-ray n-r4" cx="654" cy="582" r="3" />
      <circle className="n-ray n-r5" cx="570" cy="610" r="3" />

      {/* 拡散の続き：ノードの先へ、薄くカクカクと伸びる */}
      <path className="p-cont p-c1" pathLength="1" d="M 568 334 L 640 262 H 744 L 800 206" />
      <path className="p-cont p-c2" pathLength="1" d="M 658 398 H 720 L 770 348 H 948" />
      <path className="p-cont p-c3" pathLength="1" d="M 722 500 H 810 L 850 460 H 1069" />
      <path className="p-cont p-c4" pathLength="1" d="M 662 582 H 760 L 794 616 H 1020" />
      <path className="p-cont p-c5" pathLength="1" d="M 578 610 H 636 L 666 640" />

      {/* 微粒子：さらに先で散る */}
      <circle className="n-dust n-d1" cx="836" cy="176" r="2" />
      <circle className="n-dust n-d2" cx="1010" cy="240" r="2" />
      <circle className="n-dust n-d3" cx="1146" cy="520" r="2.5" />
      <circle className="n-dust n-d4" cx="1000" cy="624" r="2" />
    </svg>
  );
}
