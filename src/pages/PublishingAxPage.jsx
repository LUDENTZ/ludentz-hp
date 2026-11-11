import AxCategoryPage from '../components/AxCategoryPage';

const CONFIG = {
  meta: ['03', '情報発信AX', 'PUBLISHING'],
  title: ['発信を、', '続けられる体制に。'],
  lead: '事例記事からオウンドメディア、社内報まで。素材の集約から初稿生成、配信・多面展開までをAIエージェント化し、「書く時間がない」で止まらない発信体制をつくります。',
  panelLabel: 'ハイライト',
  highlights: [
    { strong: '初稿まで自動', body: '取材音源や実績データを投げれば、AIが構成と初稿を仕上げる。' },
    { strong: '1本から多面展開', body: '記事をSNS・メルマガ・社内報向けに自動で展開。' },
    { strong: '社外も社内も', body: '事例記事・オウンドメディアから社内発信まで、同じ体制で回す。' },
  ],
};

export default function PublishingAxPage() {
  return (
    <AxCategoryPage config={CONFIG}>
      <section className="business-band ax-publish" id="publishing">
        <div className="business-section-head">
          <p className="business-kicker">USE CASE</p>
          <h2>情報発信 × AIエージェント：制作ライン。</h2>
          <p className="business-section-copy">素材の集約から初稿生成、配信・多面展開までをAIエージェント化。社外向けの記事から社内発信まで、発信を「続けられる」体制をつくります。</p>
        </div>
        <div className="ax-step-grid ax-step-grid--four">
          <article className="ax-step">
            <span className="ax-step-num">STEP 01</span>
            <h3>素材の集約</h3>
            <p>取材音源・商談録・実績データなど、社内に散らばる一次情報をAIが整理します。</p>
          </article>
          <article className="ax-step">
            <span className="ax-step-num">STEP 02</span>
            <h3>構成・初稿生成</h3>
            <p>読者と目的に合わせてAIが構成を立て、初稿まで一気に書き上げます。</p>
          </article>
          <article className="ax-step">
            <span className="ax-step-num">STEP 03</span>
            <h3>レビュー・調整</h3>
            <p>トンマナと事実確認は人がレビュー。修正指示は自然言語でそのまま反映します。</p>
          </article>
          <article className="ax-step">
            <span className="ax-step-num">STEP 04</span>
            <h3>配信・多面展開</h3>
            <p>1本の記事をSNS・メルマガ・社内報向けに自動展開し、発信を止めません。</p>
          </article>
        </div>
        <div className="ax-channel-row" aria-label="対応アウトプット">
          <span className="ax-channel-label">対応アウトプット</span>
          <div className="ax-channel-tags">
            <span>事例記事</span>
            <span>オウンドメディア</span>
            <span>メルマガ</span>
            <span>SNS</span>
            <span>社内報・社内発信</span>
          </div>
        </div>
      </section>
    </AxCategoryPage>
  );
}
