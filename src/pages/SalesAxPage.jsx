import { useEffect, useState } from 'react';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import AxHeroLines from '../components/AxHeroLines';
import { SALES_AX_SCHEDULE_URL, SALES_AX_SOURCE } from '../config/salesAx';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const anchorLinks = [
  ['issues', '解決する課題'],
  ['capabilities', 'できること'],
  ['process', '導入の流れ'],
  ['faq', 'よくある質問'],
];

const heroHighlights = [
  ['01', '商談後の4つをまとめて準備', 'HubSpot更新案、フォローメール、タスク、次回商談の確認事項をAIが整理します。'],
  ['02', '入力する人にも、見る人にも役立つ', '営業担当者には入力削減と次の行動を、マネージャーには最新の案件情報と判断材料を返します。'],
  ['03', '既存のHubSpotをそのまま活かす', '標準機能を先に使い、足りない業務だけをAIエージェントや連携で補完します。'],
];

const issueCards = [
  ['01', '議事録からHubSpotへ何度も転記', '顧客課題、次のアクション、期限、関係者など、複数項目へ手入力している。'],
  ['02', 'メール・タスク・社内報告を別々に作成', '同じ商談内容を、用途ごとに何度も整理し直している。'],
  ['03', '情報を信頼できず、会議でまた口頭確認', '更新が遅れ、マネージャーが担当者へ一件ずつ聞き直している。'],
];

const issueChain = [
  '入力する営業担当者に価値が返らない',
  '更新が遅れ、情報が古くなる',
  'マネージャーがHubSpotを信頼できない',
  'Excel・口頭確認へ戻る',
];

const capabilities = [
  ['01', '案件を探して、商談内容をひもづける手間を減らす', '参加者、会社、案件、過去の活動を照合し、商談内容を該当案件へ整理します。'],
  ['02', '議事録からHubSpotへ転記する手間を減らす', '顧客課題、次のアクション、期限、関係者、リスク等の更新案を根拠付きで作成します。'],
  ['03', 'お礼メールとタスクを一から作る手間を減らす', 'フォローメールと次回アクションの下書きを作り、担当者の確認後に反映・送信します。'],
  ['04', '次回商談のために情報を集め直す手間を減らす', '未確認事項、意思決定者、競合、リスク、過去の経緯を整理し、確認すべき論点を提示します。'],
];

const salesValues = [
  '転記、メール、タスク、社内報告を一から作らなくてよくなる',
  '商談直後からフォローと次回準備を進められる',
  '次のアクション、未確認事項、リスクが整理された状態で返ってくる',
];

const managerValues = [
  '担当者への口頭確認やExcel集計を減らせる',
  '停滞、リスク、支援が必要な案件を会議前に把握できる',
  '案件会議を状況確認ではなく、判断とコーチングに使える',
];

const expansion = [
  ['商談前', '顧客・過去接点の調査、商談準備、確認事項の整理'],
  ['案件進行', 'ステージ進行の根拠、次のアクション、停滞・競合・稟議等の整理'],
  ['日常管理', '優先アクション、要判断案件、売上予測の判断材料の準備'],
  ['受注後・学習', 'CSへの引き継ぎ、受注・失注理由、営業ナレッジの整理'],
];

const differences = [
  ['01', '使える標準機能は、作らない。', 'HubSpotやGoogle Workspaceの標準機能を先に確認し、足りない業務だけを補完します。'],
  ['02', '点の自動化で、終わらせない。', '議事録、HubSpot、メール、タスク、人の承認をつなぎ、商談後の一連の業務をAIが進められる状態を作ります。'],
  ['03', '実装して、終わらせない。', '営業担当者の手作業、情報の鮮度、AI出力の修正率を測り、現場で使われる運用へ改善します。'],
];

const comparisons = [
  ['主な目的', '商談の記録・要約', 'HubSpotの初期設定・活用', '特定業務のAI化', '商談後の手作業削減と営業運用の改善'],
  ['対象範囲', '会議・議事録が中心', 'HubSpot内が中心', '個別に定めた一機能', '会議、HubSpot、メール、タスク、人の判断'],
  ['標準機能との関係', '製品ごとに異なる', 'HubSpotを活用', '独自実装になる場合がある', '標準機能を先に使い、足りない部分だけを補完'],
  ['導入後', '要約を利用', '設定・運用を支援', '構築した機能を利用', '工数・情報鮮度・修正率を測り、定着まで改善'],
];

const decisions = [
  ['活動履歴・原文URL', '追記できる範囲を設定'],
  ['次のアクション・タスク', '根拠と運用実績に応じて承認または条件付き自動'],
  ['ステージ・金額・受注予定日', 'AIが根拠付きの案を作り、権限者が承認'],
  ['受注・失注、売上予測、価格、契約条件、顧客送信', '人が決定・実行'],
];

const processSteps = [
  ['01', '現状把握', 'HubSpotと既存ツールの設定、営業担当者の業務、実際の案件、管理会議を確認し、現在の工数と課題を可視化します。', '現行業務フロー、設定台帳、導入前の基準値'],
  ['02', 'To-Be設計', '廃止する業務、標準機能で行う業務、AIで補完する業務、人が判断する業務を切り分けます。', '役割分担、更新・承認ルール、評価指標と受入基準'],
  ['03', '実装', 'HubSpotの標準設定から着手し、必要に応じてAIエージェント、外部連携、権限、ロールバックを実装します。', 'HubSpot設定、必要な連携、テスト結果、運用手順'],
  ['04', '定着・改善', '利用率、修正率、処理時間、データ品質、権限、機能変更を継続的に確認します。', '利用・品質・工数のレポート、改善バックログ'],
];

const metrics = [
  ['01', '商談後処理時間', '商談終了から、記録・メール・タスクの準備完了までの実作業時間'],
  ['02', 'HubSpotの情報鮮度', '決めた時間内に、対象商談の必要情報が更新された割合'],
  ['03', 'AI出力の修正率', 'AIが作った更新案や文面を、人が修正・却下した割合'],
];

const fitItems = [
  'HubSpotを運用している',
  '営業担当者が3〜15名程度',
  'B2Bの無形商材を扱っている',
  '複数回の商談や、一定期間の案件管理がある',
  '営業責任者またはプレイングマネージャーがいる',
  '商談後の重複入力、週次レビュー、SFAデータの鮮度に課題がある',
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
  ['HubSpotの標準AIと何が違いますか？', <>HubSpot標準で実現できる記録、更新提案、メール、タスク、ワークフロー等は積極的に利用します。<p>LUDENTZが担うのは、標準AIの導入だけではなく、貴社の営業プロセスに合わせて次の領域までつなぐことです。</p><ul><li>HubSpotと人の接続：確認、承認、修正、次のアクションを適切な人へ渡す</li><li>人の判断が残る部分：根拠、矛盾、未確認事項を整理し、ステージ、金額、売上予測、契約等の判断を支援する</li><li>HubSpotと他システムの接続：会議、メール、チャット、資料等の情報を、権限と情報源を保ちながら正しい案件へつなぐ</li></ul>標準AIを置き換えるのではなく、標準機能を十分に活かしたうえで、営業運営を最後までつなぐことが違いです。</>],
  ['AIがHubSpotの情報を誤って書き換える心配はありませんか？', '更新対象ごとに、自動追記、条件付き自動、必須承認、AI実行禁止を設定します。根拠、確信度、変更履歴、ロールバックを含めて設計します。'],
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
      <button className="nav-btn" type="button" onClick={() => onCta('header')}><span className="sales-ax-nav-cta-full">30分の無料相談を予約</span><span className="sales-ax-nav-cta-short">無料相談を予約</span></button>
    </nav>
  );
}

function SectionHead({ kicker, title, copy }) {
  return <div className="business-section-head">{kicker && <p className="business-kicker">{kicker}</p>}<h2>{title}</h2>{copy && <p className="business-section-copy">{copy}</p>}</div>;
}

function SalesAxCta({ position, onClick }) {
  return <div className="sales-ax-cta-block"><button className="nav-btn sales-ax-cta" type="button" onClick={() => onClick(position)}>30分の無料相談を予約する <span aria-hidden="true">→</span></button><small>フォーム送信後、30分の相談日時をお選びいただけます。</small></div>;
}

export default function SalesAxPage() {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    document.body.dataset.lang = DEFAULTS.lang;
    document.body.classList.toggle('dark', DEFAULTS.theme === 'dark');
    document.body.classList.add(`intensity-${DEFAULTS.intensity}`);
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
          <AxHeroLines />
          <div className="sales-ax-hero-layout">
            <div className="sales-ax-hero-copy">
              <p className="sales-ax-eyebrow">HubSpotを利用する、営業3〜15名規模のB2B組織へ</p>
              <h1><span className="nowrap">商談後の仕事を減らし、</span><span className="nowrap">次の一手を早くする。</span></h1>
              <p className="sales-ax-hero-lead">商談内容を該当案件へひもづけ、HubSpotの更新案、フォローメール、タスク、次回準備を根拠付きで整理。標準機能を活かし、貴社に必要な差分だけを設計・実装します。</p>
              <SalesAxCta position="hero" onClick={scrollToContact} />
              <p className="sales-ax-cta-note">HubSpotへの接続や事前準備は不要です。現在の運用を伺い、営業AXとの適合性を整理します。</p>
            </div>
            <aside className="sales-ax-hero-panel" aria-label="営業AXの3つの特徴">
              <span className="sales-ax-panel-label">営業AXの3つの特徴</span>
              <ol>{heroHighlights.map(([num, title, body]) => <li key={num}><span>{num}</span><div><strong>{title}</strong><p>{body}</p></div></li>)}</ol>
              <p className="sales-ax-panel-note">更新案は根拠とともに提示し、重要な反映や顧客への送信は人が判断します。</p>
            </aside>
          </div>
          <div className="sales-ax-hero-route" aria-hidden="true"><span>商談・メール・資料</span><i>→</i><strong>営業AX</strong><i>→</i><span>HubSpot・次のアクション</span></div>
        </section>

        <section className="business-band sales-ax-issues" id="issues">
          <SectionHead kicker="ISSUES — 解決する課題" title={<><span className="nowrap">HubSpotの入力項目は増えた。</span><span className="nowrap">商談後の手作業は、減っていない。</span></>} copy="議事録を読み返し、複数項目へ転記し、メールとタスクを別々に作る。そのうえ、案件会議では再び担当者へ確認している。" />
          <div className="sales-ax-issue-cards">{issueCards.map(([num, title, body]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <div className="sales-ax-cause-chain" aria-label="SFA運用課題の因果関係">{issueChain.map((item, index) => <div key={item}><strong>{item}</strong>{index < issueChain.length - 1 && <span aria-hidden="true">→</span>}</div>)}</div>
          <div className="sales-ax-issue-conclusion"><h3>問題は、営業が入力しないことではありません。</h3><p>入力する営業担当者に価値が返らないため、情報が古くなり、<br />マネージャーもHubSpotを判断に使えなくなっています。</p></div>
        </section>

        <section className="business-band sales-ax-solution">
          <SectionHead kicker="SOLUTION — 営業AXとは" title={<><span className="nowrap">商談後の仕事をAIが進め、</span><span className="nowrap">営業担当者は判断と顧客対応へ。</span></>} />
          <p className="sales-ax-solution-copy">営業AXは、商談内容を正しい案件へ整理し、HubSpotの更新案、フォローメール、タスク、次回商談の確認事項までを連続して準備します。営業担当者が一から作るのではなく、AIの案を確認し、必要な判断をして次のアクションへ進める状態を作ります。</p>
          <p className="sales-ax-definition">営業AXとは、営業プロセス、SFA、AI、人の判断を、<span>一つの運用として再設計する取り組み</span>です。</p>
        </section>

        <section className="business-band sales-ax-capabilities" id="capabilities">
          <SectionHead kicker="CAPABILITIES — できること" title={<><span className="nowrap">商談が終わったら、AIが</span><span className="nowrap">記録・連絡・準備を進める。</span><span className="nowrap">営業担当者は、確認して次の商談へ。</span></>} copy="商談内容を正しい案件へ整理し、HubSpotの更新案、フォローメール、タスク、次回商談の確認事項までを連続して準備します。重要な更新や顧客への送信は、担当者が確認します。" />
          <div className="sales-ax-capability-grid">{capabilities.map(([num, title, body]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <p className="sales-ax-capability-close">営業担当者が行うのは、AIの案を確認し、顧客や案件に関わる判断をすること。</p>
          <div className="sales-ax-before-after"><article><span>BEFORE</span><p>商談終了 → 議事録を読み返す → HubSpotへ転記 → メール作成 → タスク作成 → 社内報告 → 会議で再確認</p></article><article className="is-after"><span>AFTER</span><p>商談終了 → AIが更新案・メール・タスク・次回準備を作成 → <strong>人が確認・判断</strong> → 反映・送信 → 次のアクションへ</p></article></div>
        </section>

        <section className="business-band sales-ax-value">
          <SectionHead title={<><span className="nowrap">営業担当者の手間を減らすことが、</span><span className="nowrap">HubSpotを判断に使える状態につながる。</span></>} />
          <div className="sales-ax-role-grid"><article><span>FOR SALES</span><h3>営業担当者へ</h3><ul>{salesValues.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>FOR MANAGERS</span><h3>マネージャーへ</h3><ul>{managerValues.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
          <div className="sales-ax-value-bridge"><strong>営業担当者の手作業が減る</strong><span>商談後の業務から案件情報が自然に蓄積される</span><strong>マネージャーが最新情報を判断に使える</strong></div>
          <div className="sales-ax-expansion"><div><span className="business-kicker">EXPANSION</span><h3>商談後から、営業プロセス全体へ。</h3><p>商談後業務で整った案件情報と運用を基に、課題と効果を確認しながら対象を広げます。</p></div><ol>{expansion.map(([title, body]) => <li key={title}><strong>{title}</strong><span>{body}</span></li>)}</ol></div>
        </section>

        <section className="business-band sales-ax-difference">
          <SectionHead kicker="DIFFERENCE — 違い" title={<><span className="nowrap">標準機能を入れて終わらない。</span><span className="nowrap">営業担当者の手間が減るところまで、</span><span className="nowrap">業務をつなぎ直す。</span></>} copy="HubSpotや既存AIでできることはそのまま活用し、会議、メール、資料、人の判断にまたがる貴社固有の業務だけを設計・実装。商談後の手作業が減り、HubSpotに判断に使える情報が蓄積される運用まで定着させます。" />
          <div className="sales-ax-difference-grid">{differences.map(([num, title, body]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <div className="sales-ax-comparison-wrap"><table className="sales-ax-comparison"><thead><tr><th>比較軸</th><th>AI議事録</th><th>HubSpot導入支援</th><th>単体エージェント開発</th><th>LUDENTZ 営業AX</th></tr></thead><tbody>{comparisons.map(([axis, ...values]) => <tr key={axis}><th>{axis}</th>{values.map((value, index) => <td data-label={['AI議事録', 'HubSpot導入支援', '単体エージェント開発', 'LUDENTZ 営業AX'][index]} className={index === 3 ? 'is-ludentz' : ''} key={value}>{value}</td>)}</tr>)}</tbody></table><p>上記は一般的な支援範囲の傾向です。各サービス・提供会社によって対応範囲は異なります。</p></div>
          <div className="sales-ax-safety"><p className="sales-ax-safety-principle">重要な更新、顧客への約束・送信、価格・契約に関する判断は、人が行います。</p><details><summary>安全性と責任分界の詳細 <i aria-hidden="true">＋</i></summary><div><p>AIの確信度が高くても、顧客への約束や重要な意思決定を無条件に自動化しません。情報の種類とリスクに応じて、追記、条件付き自動、必須承認、AI実行禁止を分けます。</p><dl>{decisions.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><small>最小権限、データ取得範囲の制限、根拠の表示、変更履歴、ロールバック、緊急停止、録音・文字起こしの同意ルールを設計します。</small></div></details></div>
        </section>

        <section className="business-band sales-ax-consultant">
          <SectionHead kicker="CONSULTANT — 担当" title="営業を知る人間が、営業AXを設計する。" />
          <div className="consultant-card"><img className="consultant-photo sales-ax-consultant-photo" src="/assets/sales-ax/kobayashi-yudai.png" alt="小林 勇大" width="180" height="180" loading="lazy" /><div className="consultant-body"><p className="consultant-name">小林 勇大</p><p className="consultant-role">LUDENTZ株式会社 取締役</p><p>エルメスで販売員全体の上位1％、人材系スタートアップでマッチングプラットフォームの法人営業・事業立ち上げ、新規事業開発支援で営業成績トップを経験。</p><p>toC・toB双方の営業現場で培った顧客理解と提案力をもとに、業務の棚卸しから営業プロセスとHubSpotの設計、AIエージェントの実装・定着まで、小林が一貫して担当します。</p></div></div>
        </section>

        <section className="business-band sales-ax-process" id="process">
          <SectionHead kicker="PROCESS — 導入の流れ" title="先に作らず、現場を見てから、必要なものだけを実装します。" />
          <div className="sales-ax-process-list">{processSteps.map(([num, title, body, output]) => <article key={num}><span>{num}</span><div><h3>{title}</h3><p>{body}</p><dl><dt>成果物</dt><dd>{output}</dd></dl></div></article>)}</div>
          <p className="sales-ax-disclaimer">各工程の期間は、HubSpotの設定、対象業務、データ、連携数、権限、セキュリティ審査によって変わります。初回ヒアリング後に、対象範囲とスケジュールをご提案します。</p>
          <div className="sales-ax-measurement"><div><span className="business-kicker">MEASUREMENT</span><h3>「AIを入れた」で終わらせず、導入前後の運用を比べる。</h3><p>実装前に現状値を取得し、条件を揃えて導入後と比較します。</p></div><div className="sales-ax-metric-grid">{metrics.map(([num, title, body]) => <article key={num}><span>{num}</span><h4>{title}</h4><p>{body}</p></article>)}</div></div>
          <p className="sales-ax-disclaimer">商談化率、受注率、売上は複数の要因に左右されるため、AI単独の成果として保証しません。</p>
        </section>

        <section className="business-band sales-ax-fit">
          <SectionHead kicker="FIT — 対象企業" title="営業AXが適合しやすい営業組織。" />
          <div className="sales-ax-fit-grid"><article><h3>適合しやすい条件</h3><ul>{fitItems.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>まずは別の改善が必要な可能性があるケース</h3><ul>{notFitItems.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
          <div className="sales-ax-fit-cta"><div><h3>対象に合うか、30分で確認できます。</h3><p>商談後業務の負担、標準機能で解決できる範囲、最初に検証すべき一業務を整理します。無理な導入はお勧めしません。</p></div><SalesAxCta position="fit" onClick={scrollToContact} /></div>
        </section>

        <section className="business-band sales-ax-pricing">
          <SectionHead kicker="PRICING — 料金" title="まず助言から。実行フェーズで伴走へ。" copy="状況に合わせて、助言のみ／実行まで踏み込む伴走支援の2段階でご提供します。" />
          <div className="ax-plan-grid">{plans.map(([label, name, price, body]) => <article className="ax-plan" key={label}><span className="ax-plan-label">{label}</span><h3 className="ax-plan-name">{name}</h3><strong className="ax-plan-price">{price}</strong><p className="ax-plan-body">{body}</p></article>)}</div>
          <p className="sales-ax-pricing-note">対象業務数、HubSpotの設定変更、外部連携、実装・定着支援の範囲に応じて決定します。初回相談後に対象業務とお見積りをご提案します。</p><p className="sales-ax-disclaimer">外部ライセンス、HubSpotのプラン変更、個別開発等が必要な場合は、対象範囲の確定後に別途ご案内します。</p>
        </section>

        <section className="business-band sales-ax-faq" id="faq">
          <SectionHead kicker="FAQ — よくある質問" title="導入前によくいただくご質問。" />
          <div className="sales-ax-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>Q{String(index + 1).padStart(2, '0')}</span>{question}<i aria-hidden="true">＋</i></summary><div className="sales-ax-faq-answer">{answer}</div></details>)}</div>
        </section>

        <section className="sales-ax-contact" id="contact">
          <div className="sales-ax-contact-copy"><span className="business-kicker">CONTACT</span><h2>まずは、商談後のどの仕事を減らせるか、一緒に整理しませんか。</h2><p>現在のHubSpot運用、商談後業務、既存ツールを伺い、標準機能で解決できることと、追加の設計が必要なことを整理します。</p><small>相談時点でHubSpotへの接続は不要です。フォーム送信後、30分の相談日時をお選びいただけます。</small></div>
          <div className="sales-ax-contact-form"><h3 className="sales-ax-contact-form-heading">まずはヒアリングからご一緒しましょう</h3><ContactForm source={SALES_AX_SOURCE} trackingPrefix="sales_ax" submitLabel="日程選択へ進む →" sentTitle="お申し込みありがとうございます。" sentMessage="続けて30分のご相談日時をお選びください。" successLink={buildScheduleUrl()} successLinkLabel={redirecting ? '日程調整ページへ移動しています…' : '30分の相談日時を選ぶ →'} onSuccess={handleSuccess} /><p className="sales-ax-privacy-note">送信により、<a href="/privacy">プライバシーポリシー</a>に同意したものとみなします。</p></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
