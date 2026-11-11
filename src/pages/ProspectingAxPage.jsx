import AxCategoryPage from '../components/AxCategoryPage';

const CONFIG = {
  meta: ['02', '新規開拓AX', 'PROSPECTING'],
  title: ['新規開拓を、', '止まらない仕組みに。'],
  lead: 'ターゲットリストの作成から文面生成、送信、返信対応まで。新規開拓を一本のパイプラインとして自動化し、人は商談に集中できる体制へ変えていきます。',
  panelLabel: 'ハイライト',
  highlights: [
    { strong: '5チャネル対応', body: 'フォーム・メール・手紙・FAX・テレアポ（検証中）。' },
    { strong: '1社ずつパーソナライズ', body: '企業ごとの事業内容・文脈を踏まえ、AIが文面を起案。' },
    { strong: '返信を逃さない', body: '反応をAIが検知して一次対応し、商談機会として人に引き渡す。' },
  ],
};

export default function ProspectingAxPage() {
  return (
    <AxCategoryPage config={CONFIG}>
      <section className="business-band ax-prospect" id="prospecting">
        <div className="business-section-head">
          <p className="business-kicker">USE CASE</p>
          <h2>新規開拓 × AIエージェント：パイプライン。</h2>
          <p className="business-section-copy">リスト作成から返信対応までを一本のパイプラインとして自動化。人は商談に集中できる体制に変えていきます。</p>
        </div>
        <div className="ax-step-grid ax-step-grid--four">
          <article className="ax-step">
            <span className="ax-step-num">STEP 01</span>
            <h3>リスト作成</h3>
            <p>ICP定義をもとに、AIがターゲット企業リストを生成・更新し続けます。</p>
          </article>
          <article className="ax-step">
            <span className="ax-step-num">STEP 02</span>
            <h3>文面生成</h3>
            <p>企業ごとの事業内容・文脈を踏まえ、AIが1社ずつパーソナライズした文面を起案します。</p>
          </article>
          <article className="ax-step">
            <span className="ax-step-num">STEP 03</span>
            <h3>マルチチャネル送信</h3>
            <p>チャネルごとの特性に合わせて送信を自動実行。到達状況も記録します。</p>
          </article>
          <article className="ax-step">
            <span className="ax-step-num">STEP 04</span>
            <h3>返信検知・商談化</h3>
            <p>返信・反応をAIが検知して一次対応し、商談機会として人に引き渡します。</p>
          </article>
        </div>
        <div className="ax-channel-row" aria-label="対応チャネル">
          <span className="ax-channel-label">対応チャネル</span>
          <div className="ax-channel-tags">
            <span>フォーム</span>
            <span>メール</span>
            <span>手紙</span>
            <span className="is-pilot">テレアポ<small>※検証フェーズ</small></span>
            <span>FAX</span>
          </div>
        </div>
      </section>
    </AxCategoryPage>
  );
}
