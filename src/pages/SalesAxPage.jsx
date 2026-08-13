import { useEffect, useState } from 'react';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { SALES_AX_SCHEDULE_URL, SALES_AX_SOURCE } from '../config/salesAx';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const anchorLinks = [
  ['issues', '解決する課題'],
  ['capabilities', 'できること'],
  ['process', '導入の流れ'],
  ['faq', 'よくある質問'],
];

const heroValues = [
  ['01', '新しいツールを増やさない', 'HubSpotやGoogle Workspaceの標準機能を先に使い、不要な開発を避けます。'],
  ['02', '入力する人にも、見る人にも役に立つ', '営業担当者には入力削減と次の行動、マネージャーには最新の案件情報と判断材料を返します。'],
  ['03', '根拠を確認してから反映できる', 'AIの案と元の発言を一緒に示し、重要な更新や顧客への送信は人が決めます。'],
];

const symptoms = [
  '議事録を読み返し、HubSpotの複数項目へ転記する',
  '商談内容を再び整理し、お礼メールや次回タスクを作る',
  'チャット、メール、提案資料の情報が案件に反映されない',
];

const sfaIssues = [
  '入力項目は増えたのに、何の判断に使うか説明できない',
  'ステージと実際の営業プロセスがずれ、更新基準が人によって異なる',
  'SFAが管理者の報告用ツールになり、入力する営業担当者に価値が返らない',
  'データを信頼できず、会議での口頭確認やExcel管理が復活している',
];

const capabilities = [
  ['01', '商談情報を正しい案件へ整理', '参加者、会社、案件、過去の活動を照合し、商談情報の誤ったひもづけを防ぎます。'],
  ['02', 'HubSpotの更新案を根拠付きで作成', '顧客課題、次のアクション、期限、関係者、リスク等の更新候補を、元の発言や情報源とともに示します。'],
  ['03', 'フォローアップを早く開始', 'お礼メール、次回アクション、タスクの下書きを作成。顧客への送信と約束は、担当者が確認します。'],
  ['04', '次回商談の準備を短縮', '未確認事項、意思決定者、競合、リスク、過去の経緯を整理し、次回確認すべき論点を提示します。'],
  ['05', '会議前に「変化と要判断案件」を把握', '運用が安定した後は、前回から変化した案件、停滞、リスク、支援依頼をまとめ、週次会議を状況確認から意思決定の場へ変えます。'],
];

const roleValues = [
  {
    label: 'FOR SALES',
    title: '営業担当者へ',
    items: [
      'SFA入力、メール、タスク、報告作成の負担を減らす',
      '商談直後にフォローを開始しやすくする',
      '次のアクション、未確認事項、関係者、リスクの見落としを減らす',
      '次回商談と提案準備に使える情報が返ってくる',
    ],
  },
  {
    label: 'FOR MANAGERS',
    title: '営業マネージャーへ',
    items: [
      '口頭確認やExcel集計の負担を減らす',
      '前回からの変化、停滞、リスク、支援依頼を会議前に把握する',
      '案件会議を「状況確認」から「判断とコーチング」へ変える',
      '担当者ごとの報告形式のばらつきを減らす',
    ],
  },
];

const expansion = [
  ['商談前', '顧客・過去接点の調査、商談準備、確認事項の整理'],
  ['案件進行', 'ステージ進行の根拠、次のアクション、停滞・競合・稟議・法務・セキュリティリスクの整理'],
  ['日常管理', '優先アクション、案件レビュー、売上予測の判断材料の準備'],
  ['受注後・学習', 'デリバリー・CSへの引き継ぎ、受注・失注理由、営業ナレッジの整理'],
];

const differences = [
  ['01', '標準機能を先に使う', '既存機能で目的を満たせる場合は、独自開発しません。'],
  ['02', '営業設計から実装まで扱う', 'ステージ、入力項目、承認、会議運営を含めて設計します。'],
  ['03', '人とシステムの間をつなぐ', '確認、承認、修正が必要な仕事を適切な人へ渡し、会議、メール、チャット、資料の情報を正しい案件へつなぎます。'],
  ['04', '個社の営業プロセスを織り込む', '稟議、法務、セキュリティ、代理店、RFP等を運用へ反映します。'],
  ['05', '導入後も運用を見直す', '品質、権限、利用状況、標準機能の変化を継続的に確認します。'],
];

const decisions = [
  ['活動履歴・原文URL', '追記できる範囲を設定'],
  ['次のアクション・タスク', '根拠と運用実績に応じて承認または条件付き自動'],
  ['ステージ・金額・受注予定日', 'AIが根拠付きの案を作り、権限者が承認'],
  ['受注・失注、売上予測、価格、契約条件、顧客送信', '人が決定・実行'],
];

const processSteps = [
  ['01', '現状把握', 'HubSpotと既存ツールの設定、営業担当者の業務、実際の案件、管理会議を確認し、現在の工数と課題を可視化します。', '現行業務フロー、HubSpot・周辺ツールの設定台帳、導入前の基準値'],
  ['02', 'To-Be設計', '廃止する業務、標準機能で行う業務、AIで補完する業務、人が判断する業務を切り分け、評価指標と受入基準を決めます。', '標準機能／AI／人の役割分担、更新・承認ルール、評価指標と受入基準'],
  ['03', '実装', 'HubSpotの標準設定から着手し、必要に応じてAIエージェント、外部連携、テスト、権限、ロールバックを実装します。', 'HubSpot設定、必要なAIエージェント・連携、テスト結果、運用手順'],
  ['04', '定着・改善', '利用率、修正率、処理時間、データ品質、権限、機能変更を継続的に確認します。', '利用・品質・工数のレポート、改善バックログ'],
];

const metrics = [
  ['01', '商談後処理時間', '商談終了から、記録・メール・タスクの準備完了までの実作業時間'],
  ['02', 'HubSpotの情報鮮度', '対象となる商談後、決めた時間内に必要情報が更新された割合'],
  ['03', 'AI出力の修正率', 'AIが作った更新案や文面を、人が修正・却下した割合'],
];

const fitItems = [
  'HubSpotを運用している',
  '営業担当者が3〜15名程度',
  'B2Bの無形商材を扱っている',
  '複数回の商談や、一定期間の案件管理がある',
  '営業責任者またはプレイングマネージャーがいる',
  'Google Workspaceや会議基盤と安全に連携できる',
  '商談後の重複入力、週次レビューの確認作業、SFAデータの鮮度に課題がある',
];

const notFitItems = [
  '営業が1〜2名で、全案件を経営者が直接把握できる',
  'SFAが未導入で、顧客データと営業プロセスの基礎整備から必要',
  '商談が単発・短期で、記録やレビューの反復負担が小さい',
  '録音同意、個人情報、データ接続の条件を整えられない',
];

const plans = [
  ['ADVISORY', '助言のみ', '月20万円〜', '営業AXの方針、HubSpot活用、対象業務の優先順位に関する助言・壁打ちを中心としたプランです。実働は含みません。'],
  ['HANDS-ON', '伴走支援', '月50万円〜200万円', '週次ミーティングと、業務の棚卸し、設計、実装、定着の実行支援。支援範囲は内容に応じて調整します。'],
];

const faqs = [
  ['HubSpotの入れ替えが必要ですか？', 'いいえ。HubSpotを営業情報の正本として活かすことを前提に、設定と運用を見直します。'],
  ['新しい会議Botや営業ツールを導入するのですか？', '原則として、HubSpot、Google Workspace、現在の会議基盤、既存の議事録ツール等を優先します。既存機能で目的を満たせない場合に限り、追加実装を検討します。'],
  ['HubSpotの標準AIと何が違いますか？', <>HubSpot標準で実現できる記録、更新提案、メール、タスク、ワークフロー等は積極的に利用します。<p>LUDENTZが担うのは、標準AIを導入することだけではありません。貴社の営業プロセスに合わせて「何を、どの案件に、どの根拠から記録するか」を設計し、標準機能だけでは残る次の領域を補完します。</p><ul><li>HubSpotと人の接続：確認、承認、修正、次のアクションを適切な人に渡す</li><li>人の判断が残る業務：根拠、矛盾、未確認事項を整理し、ステージ、金額、売上予測、契約等の判断を支援する</li><li>HubSpotと他システムの接続：会議、メール、チャット、資料等の情報を、権限と情報源を保ったまま正しい案件へつなぐ</li></ul>標準AIを置き換えるのではなく、十分に活かしたうえで営業運営を最後までつなぐことが違いです。</>],
  ['AIがHubSpotの情報を誤って書き換える心配はありませんか？', '更新対象ごとに、自動追記、条件付き自動、必須承認、AI実行禁止を設定します。根拠、確信度、変更履歴、ロールバックを含めて設計します。'],
  ['どの業務から始めますか？', '初期は、商談後のHubSpot更新、フォローアップ、タスク、次回準備など、営業担当者に直接メリットが返る業務から始めます。'],
  ['導入にどのくらいかかりますか？', '対象業務、HubSpotの設定、データ、連携数、権限、セキュリティ審査により変わります。初回ヒアリングで現状と対象範囲を確認した後、工程とスケジュールをご提案します。'],
  ['売上や受注率の向上を保証できますか？', '保証しません。まずは商談後処理時間、データの鮮度・完全性、フォロー速度、修正率、利用率など、直接測定できる運用指標で効果を確認します。'],
  ['Salesforceでも利用できますか？', '初期はHubSpotを優先対象としています。Salesforce等への対応は今後の検証対象です。'],
];

function buildScheduleUrl() {
  if (typeof window === 'undefined') return SALES_AX_SCHEDULE_URL;
  const target = new URL(SALES_AX_SCHEDULE_URL);
  const source = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const value = source.get(key);
    if (value) target.searchParams.set(key, value);
  });
  return target.toString();
}

function SalesAxNav({ onCta }) {
  return (
    <nav className="nav sales-ax-nav" aria-label="営業AXページ内ナビゲーション">
      <a className="nav-logo" href="/">LUDENTZ</a>
      <div className="sales-ax-nav-links">
        {anchorLinks.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
      </div>
      <button className="nav-btn" type="button" onClick={() => onCta('header')}>30分の無料相談を予約</button>
    </nav>
  );
}

function SectionHead({ kicker, title, copy }) {
  return (
    <div className="business-section-head">
      {kicker && <p className="business-kicker">{kicker}</p>}
      <h2>{title}</h2>
      {copy && <p className="business-section-copy">{copy}</p>}
    </div>
  );
}

function SalesAxCta({ position, onClick, compact = false }) {
  return (
    <div className={'sales-ax-cta-block' + (compact ? ' is-compact' : '')}>
      <button className="nav-btn sales-ax-cta" type="button" onClick={() => onClick(position)}>
        30分の無料相談を予約する <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

export default function SalesAxPage() {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    document.body.dataset.lang = DEFAULTS.lang;
    document.body.classList.toggle('dark', DEFAULTS.theme === 'dark');
    document.body.classList.add('intensity-' + DEFAULTS.intensity);
  }, []);

  const scrollToContact = (position) => {
    trackEvent('sales_ax_cta_click', { position, page_path: window.location.pathname });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSuccess = () => {
    const url = buildScheduleUrl();
    setRedirecting(true);
    trackEvent('sales_ax_schedule_view', { page_path: window.location.pathname });
    window.setTimeout(() => window.location.assign(url), 1000);
  };

  return (
    <div className="business-page sales-ax-page">
      <SalesAxNav onCta={scrollToContact} />
      <main>
        <section className="sales-ax-hero" id="top">
          <div className="sales-ax-hero-main">
            <div className="sales-ax-hero-copy">
              <p className="sales-ax-eyebrow">HubSpotを利用する、営業3〜15名規模のB2B組織へ</p>
              <h1>商談後の仕事を減らし、<br />次の一手を早くする。</h1>
              <p className="sales-ax-hero-lead">商談内容を正しい案件へひもづけ、HubSpotの更新案、フォローメール、タスク、次回商談の準備までを一つの流れに。既存の標準機能を先に使い、貴社の営業に必要な差分だけを設計・実装します。</p>
              <SalesAxCta position="hero" onClick={scrollToContact} compact />
              <p className="sales-ax-cta-note">HubSpotへの接続や事前準備は不要です。現在の運用を伺い、営業AXとの適合性を整理します。</p>
            </div>
            <div className="sales-ax-hero-flow" role="img" aria-label="商談終了から人の確認を経てHubSpotへ反映する流れ">
              {['商談終了', '情報整理', '更新案・メール・タスク', '人が確認', 'HubSpotへ反映'].map((label, index) => (
                <div className={'sales-ax-flow-node' + (index === 3 ? ' is-human' : '')} key={label}>
                  <span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="sales-ax-value-strip">
            {heroValues.map(([num, title, body]) => (
              <article key={num}><span>{num}</span><h2>{title}</h2><p>{body}</p></article>
            ))}
          </div>
        </section>

        <section className="business-band sales-ax-issues" id="issues">
          <SectionHead kicker="ISSUES — 解決する課題" title="商談の後、こんな仕事が残っていませんか？" />
          <div className="sales-ax-issue-layers">
            <article><span className="sales-ax-card-label">商談後に残る仕事</span><ul>{symptoms.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="is-dark"><span className="sales-ax-card-label">その背後にあるSFA運用の課題</span><ul>{sfaIssues.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
          <p className="sales-ax-statement"><strong>問題は、営業が入力しないことではありません。</strong><br />入力する人に価値が返らず、蓄積した情報を判断に使い切れない運用に原因があります。</p>
        </section>

        <section className="business-band sales-ax-solution">
          <SectionHead kicker="SOLUTION — 営業AXとは" title="ツールを足すのではなく、営業の流れをAI前提で再設計する。" />
          <div className="sales-ax-solution-copy">
            <p>営業AXは、貴社の営業プロセスを「判断に必要な最小限のHubSpot設計」へ整理し、会議、メール、チャット、資料等にある情報を正しい案件へつなぎます。</p>
            <p>AIが単に要約を作るのではなく、根拠とともに更新案、次の行動、確認すべき事項を示し、営業担当者とマネージャーの判断に再利用できる状態を作ります。</p>
          </div>
          <p className="sales-ax-definition">営業AXとは、営業プロセス、SFA、AI、人の判断を、<span>一つの運用として再設計する取り組み</span>です。</p>
        </section>

        <section className="business-band sales-ax-capabilities" id="capabilities">
          <SectionHead kicker="CAPABILITIES — できること" title="商談が終わった後の「記録・連絡・準備」を、一つの流れへ。" />
          <div className="sales-ax-capability-grid">
            {capabilities.map(([num, title, body]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
          <div className="sales-ax-before-after">
            <article><span>BEFORE</span><p>商談終了 → 議事録を読み返す → HubSpotに手入力 → メール作成 → タスク作成 → チャットで報告 → 週次会議で再確認</p></article>
            <article className="is-after"><span>AFTER</span><p>商談終了 → AIが根拠付きの更新案・メール下書き・タスクを整理 → <strong>人が確認・判断</strong> → HubSpotへ反映 → 次回アクションへ</p></article>
          </div>
          <p className="sales-ax-disclaimer">実際の自動化範囲と確認方法は、貴社のHubSpotプラン、権限、会議基盤、データ品質、承認ルールに基づいて設計します。</p>
        </section>

        <section className="business-band sales-ax-value">
          <SectionHead title="入力を減らすだけではなく、営業と管理の両方を前に進める。" />
          <div className="sales-ax-role-grid">
            {roleValues.map((role) => <article key={role.label}><span>{role.label}</span><h3>{role.title}</h3><ul>{role.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
          </div>
          <div className="sales-ax-value-bridge"><strong>営業担当者の入力と報告が減り、フォローと次回準備が早くなる</strong><span>日常業務から案件情報が自然に蓄積される</span><strong>マネージャーは最新情報を信頼でき、会議を状況確認から判断へ変えられる</strong></div>
          <p className="sales-ax-disclaimer">導入当初は営業担当者に直接メリットが返る業務から始め、利用とデータ品質が安定してから管理用途へ拡張します。人事評価や監視目的へ自動転用しません。</p>
          <div className="sales-ax-expansion">
            <div><span className="business-kicker">EXPANSION</span><h3>商談後から、営業プロセス全体へ。</h3><p>最初は、効果を測りやすく営業担当者に価値が返りやすい商談後業務にフォーカスします。そこで整った案件情報と運用を基に、必要に応じて対象を広げます。</p></div>
            <div><ol>{expansion.map(([title, body]) => <li key={title}><strong>{title}</strong><span>{body}</span></li>)}</ol><p>一度に全てを実装するのではなく、課題と効果を確認しながら対象業務を順に広げます。</p></div>
          </div>
        </section>

        <section className="business-band sales-ax-difference">
          <SectionHead kicker="DIFFERENCE — 違い" title="AI議事録でも、HubSpot導入支援でも、単体のエージェント開発でもない。" copy="LUDENTZの営業AXは、HubSpot、Google Workspace、会議基盤、既存の営業AIを営業運営へ定着させ、標準機能では解けない差分だけを補完するサービスです。" />
          <div className="sales-ax-difference-grid">{differences.map(([num, title, body]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <p className="sales-ax-statement">新しい管理画面を前提とせず、HubSpotや普段使うチャットなど、既存の業務導線に確認・承認を組み込みます。</p>
          <div className="sales-ax-governance">
            <div><span className="business-kicker">SAFETY &amp; CONTROL</span><h3>AIに任せることと、人が決めることを、最初に設計する。</h3><p>AIの確信度が高くても、顧客への約束や重要な意思決定を無条件に自動化しません。情報の種類とリスクに応じて、追記、条件付き自動、必須承認、AI実行禁止を分けます。</p></div>
            <dl>{decisions.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </div>
          <p className="sales-ax-disclaimer">最小権限、データ取得範囲の制限、根拠の表示、変更履歴、ロールバック、緊急停止、録音・文字起こしの同意ルールを設計します。</p>
        </section>

        <section className="business-band sales-ax-process" id="process">
          <SectionHead kicker="PROCESS — 導入の流れ" title="先に作らず、現場を見てから、必要なものだけを実装します。" />
          <div className="sales-ax-process-list">{processSteps.map(([num, title, body, output]) => <article key={num}><span>{num}</span><div><h3>{title}</h3><p>{body}</p><dl><dt>成果物</dt><dd>{output}</dd></dl></div></article>)}</div>
          <p className="sales-ax-disclaimer">各工程の期間は、HubSpotの設定、対象業務、データ、連携数、権限、セキュリティ審査によって変わります。初回ヒアリング後に、対象範囲とスケジュールをご提案します。</p>
          <div className="sales-ax-measurement">
            <div><span className="business-kicker">MEASUREMENT</span><h3>「AIを入れた」で終わらせず、導入前後の運用を比べる。</h3><p>実装前に現状値を取得し、商談種別、担当者、顧客セグメントを揃えて導入後と比較します。</p></div>
            <div className="sales-ax-metric-grid">{metrics.map(([num, title, body]) => <article key={num}><span>{num}</span><h4>{title}</h4><p>{body}</p></article>)}</div>
          </div>
          <p className="sales-ax-disclaimer">工数、情報の鮮度・完全性、フォロー速度、修正率、利用率を主な評価対象とします。商談化率、受注率、売上は複数の要因に左右されるため、AI単独の成果として保証しません。</p>
        </section>

        <section className="business-band sales-ax-fit">
          <SectionHead kicker="FIT — 対象企業" title="営業AXが適合しやすい営業組織。" />
          <div className="sales-ax-fit-grid"><article><h3>適合しやすい条件</h3><ul>{fitItems.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>まずは別の改善が必要な可能性があるケース</h3><ul>{notFitItems.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
          <div className="sales-ax-fit-cta"><div><h3>対象に合うか、30分で確認できます。</h3><p>30分のご相談で、次の3点を整理します。</p><ul><li>商談後業務のどこに負担が集中しているか</li><li>HubSpot・既存ツールの標準機能で解決できそうか</li><li>検証するなら、どの一業務から始めるべきか</li></ul><p>無理な導入はお勧めしません。</p></div><SalesAxCta position="fit" onClick={scrollToContact} /></div>
        </section>

        <section className="business-band sales-ax-consultant">
          <SectionHead kicker="CONSULTANT — 担当" title="営業を知る人間が、営業AXを設計する。" />
          <div className="consultant-card">
            <img className="consultant-photo sales-ax-consultant-photo" src="/assets/sales-ax/kobayashi-yudai.png" alt="小林 勇大" width="180" height="180" loading="lazy" />
            <div className="consultant-body"><p className="consultant-name">小林 勇大</p><p className="consultant-role">LUDENTZ株式会社 取締役</p><p>エルメスで販売員全体の上位1％、人材系スタートアップでマッチングプラットフォームの法人営業・事業立ち上げ、新規事業開発支援で営業成績トップを経験。</p><p>toC・toB双方の営業現場で培った顧客理解と提案力をもとに、業務の棚卸しから営業プロセスとHubSpotの設計、AIエージェントの実装・定着まで、小林が一貫して担当します。</p></div>
          </div>
          <p className="sales-ax-consultant-note">営業現場とAI・システム実装の間に、伝言ゲームを作りません。</p>
        </section>

        <section className="business-band sales-ax-pricing">
          <SectionHead kicker="PRICING — 料金" title="まず助言から。実行フェーズで伴走へ。" copy="状況に合わせて、助言のみ／実行まで踏み込む伴走支援の2段階でご提供します。" />
          <div className="ax-plan-grid">{plans.map(([label, name, price, body]) => <article className="ax-plan" key={label}><span className="ax-plan-label">{label}</span><h3 className="ax-plan-name">{name}</h3><strong className="ax-plan-price">{price}</strong><p className="ax-plan-body">{body}</p></article>)}</div>
          <p className="sales-ax-disclaimer">外部ライセンス、HubSpotのプラン変更、個別開発等が必要な場合は、対象範囲の確定後に別途ご案内します。</p>
        </section>

        <section className="business-band sales-ax-faq" id="faq">
          <SectionHead kicker="FAQ — よくある質問" title="導入前によくいただくご質問。" />
          <div className="sales-ax-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>Q{String(index + 1).padStart(2, '0')}</span>{question}<i aria-hidden="true">＋</i></summary><div className="sales-ax-faq-answer">{answer}</div></details>)}</div>
        </section>

        <section className="sales-ax-contact" id="contact">
          <div className="sales-ax-contact-copy"><span className="business-kicker">CONTACT</span><h2>まずは、商談後のどの仕事を減らせるか、一緒に整理しませんか。</h2><p>現在のHubSpot運用、商談後業務、既存ツールを伺い、標準機能で解決できることと、追加の設計が必要なことを整理します。</p><small>相談時点でHubSpotへの接続は不要です。お話しいただいた内容から、適合性と次の検証ステップを整理します。</small></div>
          <div className="sales-ax-contact-form">
            <h3 className="sales-ax-contact-form-heading">まずはヒアリングからご一緒しましょう</h3>
            <ContactForm
              source={SALES_AX_SOURCE}
              trackingPrefix="sales_ax"
              submitLabel="日程選択へ進む →"
              sentTitle="お申し込みありがとうございます。"
              sentMessage="続けて30分のご相談日時をお選びください。"
              successLink={buildScheduleUrl()}
              successLinkLabel={redirecting ? '日程調整ページへ移動しています…' : '30分の相談日時を選ぶ →'}
              onSuccess={handleSuccess}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
