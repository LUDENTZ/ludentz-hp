// hero背景の装飾線画：左からの1本の入力が起点（二重円）に届き、
// そこから右へ放射状に5本の線が拡散していく。遠ざかるほど線は薄くなり、
// 先端に小さなノード、さらに先に微粒子が散る。pathLength=1 でdashアニメーションを正規化
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

      {/* 放射：起点から右へ拡散する5本 */}
      <path className="p-ray p-r1" pathLength="1" d="M 347 489 L 562 344" />
      <path className="p-ray p-r2" pathLength="1" d="M 349 494 L 644 398" />
      <path className="p-ray p-r3" pathLength="1" d="M 350 499 L 709 473" />
      <path className="p-ray p-r4" pathLength="1" d="M 350 503 L 677 549" />
      <path className="p-ray p-r5" pathLength="1" d="M 348 508 L 596 587" />

      {/* 各線の先端ノード */}
      <circle className="n-ray n-r1" cx="562" cy="344" r="3" />
      <circle className="n-ray n-r2" cx="644" cy="398" r="3" />
      <rect className="n-ray n-r3" x="704.5" y="468.5" width="9" height="9" transform="rotate(45 709 473)" />
      <circle className="n-ray n-r4" cx="677" cy="549" r="3" />
      <circle className="n-ray n-r5" cx="596" cy="587" r="3" />

      {/* 拡散の続き：ノードの先へ、薄く伸びる */}
      <path className="p-cont p-c1" pathLength="1" d="M 572 337 L 794 187" />
      <path className="p-cont p-c2" pathLength="1" d="M 655 394 L 948 299" />
      <path className="p-cont p-c3" pathLength="1" d="M 721 472 L 1069 448" />
      <path className="p-cont p-c4" pathLength="1" d="M 688 550 L 1023 597" />
      <path className="p-cont p-c5" pathLength="1" d="M 608 590 L 761 640" />

      {/* 微粒子：さらに先で散る */}
      <circle className="n-dust n-d1" cx="838" cy="152" r="2" />
      <circle className="n-dust n-d2" cx="1000" cy="278" r="2" />
      <circle className="n-dust n-d3" cx="1120" cy="442" r="2.5" />
      <circle className="n-dust n-d4" cx="1072" cy="608" r="2" />
    </svg>
  );
}
