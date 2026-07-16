import AxCategoryPage from '../components/AxCategoryPage';

const CONFIG = {
  meta: ['01', '広告運用AX', 'AD OPERATIONS'],
  title: ['広告運用の実務を、', 'AIエージェントに。'],
  lead: '提案資料からレポーティング、入稿、運用改善まで。広告運用まわりの実務を7領域×工程レベルに分解してAIエージェント化し、人はレビューと承認に集中できる体制へ変えていきます。',
  panelLabel: 'ハイライト',
  highlights: [
    { strong: '工数 約90%削減', body: '営業提案資料：約6〜8時間 → 約30分。' },
    { strong: 'レポーティング完全自動化', body: 'データ取得から配信まで無人で実行。人が動くのはアラート時のみ。' },
    { strong: '運用改善は週30分', body: '分析から改善提案までAIが実行。人は承認して反映するだけ。' },
  ],
};

const useCases = [
  { number: '01', title: '営業提案資料', before: '約6〜8時間', after: '約30分', badge: '工数 約90%削減' },
  { number: '02', title: '定例資料', before: '約3〜4時間', after: '約15分', badge: '工数 約92%削減' },
  { number: '03', title: 'レポーティング', before: '1〜2時間×社数', after: 'ほぼゼロ', badge: '完全自動化' },
  { number: '04', title: 'バナー生成', before: '約2〜3時間', after: '数十分で10案', badge: '工数 約85%削減' },
  { number: '05', title: '動画生成', before: '数日〜数週間', after: '1時間以内', badge: '※検証フェーズ推奨' },
  { number: '06', title: '入稿・構築', before: '約8〜16時間', after: '2〜3時間', badge: '工数 約75%削減' },
  { number: '07', title: '運用改善', before: '約2〜3時間', after: '週30分', badge: '工数 約80%削減' },
];

export default function AdOperationsAxPage() {
  return (
    <AxCategoryPage config={CONFIG}>
      <section className="business-band ax-usecase">
        <div className="business-section-head">
          <p className="business-kicker">USE CASE</p>
          <h2>広告運用 × AIエージェント：活用領域マップ。</h2>
          <p className="business-section-copy">広告運用まわりの実務を7領域×工程レベルに分解し、AIエージェント化。人はレビューと承認に集中できる体制に変えていきます。</p>
        </div>
        <div className="ax-usecase-grid">
          {useCases.map((useCase) => (
            <article className="ax-usecase-card" key={useCase.number}>
              <span className="ax-usecase-num">{useCase.number}</span>
              <h3>{useCase.title}</h3>
              <div className="ax-usecase-flow">
                <div>
                  <small>Before</small>
                  <span>{useCase.before}</span>
                </div>
                <span className="ax-usecase-arrow" aria-hidden="true">→</span>
                <div>
                  <small>After</small>
                  <span>{useCase.after}</span>
                </div>
              </div>
              <p className="ax-usecase-badge">{useCase.badge}</p>
            </article>
          ))}
        </div>
        <div className="ax-usecase-notes">
          <div className="ax-usecase-stages">
            <span>人の関与は3段階</span>
            <ul>
              <li>完全自動：レポーティング</li>
              <li>AI一気通貫 × レビュー：資料・クリエイティブ</li>
              <li>AI提案 × 承認実行：入稿・運用改善</li>
            </ul>
          </div>
          <p className="ax-usecase-disclaimer">※ 工数は業界一般の目安です。導入時は御社の実測値でBeforeを置き換え、効果を測定します。</p>
        </div>
      </section>
    </AxCategoryPage>
  );
}
