import { Fragment, useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import {
  LEAD_GEN_BOOKING_URL,
  LEAD_GEN_CHECK_SOURCE,
  LEAD_GEN_SOURCE,
  LEAD_GEN_VARIANTS,
} from '../config/leadGeneration';
import { trackEvent } from '../lib/analytics';

const DEFAULTS = { lang: 'ja', theme: 'light', intensity: 'normal' };

const anchorLinks = [
  ['issues', '解決する課題'],
  ['service', 'サービス'],
  ['process', '進め方'],
  ['pricing', '料金'],
  ['faq', 'よくある質問'],
];

// 訴求別のファーストビュー（?v=a|b|c|d）。「|」はスマホでの改行位置
const heroVariants = {
  a: ['来期の売上、', '紹介経由の案件だけで|足りますか？'],
  b: ['広告費を、', '商談の数で|割ってみてください。'],
  c: ['AI導入を考えている|社長は、', 'まだ御社を知らない。'],
  d: ['取引先の数社に、', '売上を預けたままに|しますか？'],
};

const promises = [
  ['01', '「誰に売るか」から設計する', '業種・規模・課題・訴求を組み合わせたターゲット仮説をつくり、優先順位をつけます。'],
  ['02', '商談が生まれるまで、丸ごと引き受ける', 'リスト作成から、フォーム・メール・電話でのアプローチまで。'],
  ['03', '初期費用0円。費用は成果が出たときだけ', '条件に合う相手とオンラインで商談できたときだけ課金。月の上限も決められます。'],
];

const issues = [
  ['01', <>売上の<em>8割</em>が、上位数社と元請けからの仕事になっている。</>],
  ['02', <>Web広告のリード単価が上がり続け、商談1件に<em>10万円</em>近くかかっている。</>],
  ['03', <>紹介が途切れた月は、新規の商談が<em>ゼロ</em>になる。</>],
  ['04', <>社長が新規開拓に使える時間は、週に<em>数時間</em>しかない。</>],
  ['05', <>営業代行も考えたが、合わない相手のアポにお金を払うのが怖い。</>],
];

const causes = [
  ['CAUSE 01', '誰に売るかが、決まっていない', '技術や対応範囲が広いからこそ、強みを絞れない。狙う相手が曖昧なままでは、文面も電話も刺さりません。'],
  ['CAUSE 02', '営業が、社長の時間と勘に頼っている', '仕組みになっていないので、案件や採用で忙しい月には新規開拓が止まります。'],
  ['CAUSE 03', '新規の入口が、紹介と広告しかない', 'どちらも自社ではコントロールできません。紹介は止まり、広告は単価が上がり続けます。'],
];

const risks = [
  ['主要な取引先が1社抜けるだけで、来期の計画が崩れる。', '元請けの方針ひとつで、売上が大きく動きます。'],
  ['単価の交渉力がないまま、利益率が下がり続ける。', '選べない受注は、条件も選べません。'],
  ['社長の時間が営業に取られ続ける。', '技術や組織への投資が、いつまでも後回しになります。'],
];

const checkQuestions = [
  '売上の半分以上を、上位3社（または元請け）が占めている',
  '直近1年の新規受注の多くが、紹介か既存顧客からの派生だ',
  '新規の商談がゼロだった月がある',
  '新規開拓を担っているのは、実質的に社長（または技術責任者）だ',
  '「誰に売るか」を、ひと言で答えられない',
];

const checkResults = [
  { max: 1, level: '依存度：低', msg: '新規の入口は、比較的分散しています。いまの強みが通用する業界をもう一つ増やすと、さらに安定します。' },
  { max: 3, level: '依存度：中', msg: '紹介や既存顧客が止まると、新規の商談が一気に減る状態です。紹介に頼らない入口を、いまのうちに一つ持っておくことをおすすめします。' },
  { max: 5, level: '依存度：高', msg: '来期の売上が、自社ではコントロールできない要因に左右されています。まずは「誰に売るか」を決めて、新規の入口を自分たちで動かせる状態をつくりましょう。' },
];

const cycleBoxes = [
  { x: 352, y: 47, num: '01', title: 'ターゲット設計', sub: '誰に・何を言うか' },
  { x: 542, y: 237, num: '02', title: 'リスト作成', sub: '仮説ごとに抽出' },
  { x: 352, y: 427, num: '03', title: 'アプローチ', sub: 'フォーム・メール・電話' },
  { x: 162, y: 237, num: '04', title: '検証と更新', sub: '当たる仮説に寄せる' },
];

const cycleArcs = [
  'M527.3,96.4 A190,190 0 0 1 623.6,192.7',
  'M623.6,347.3 A190,190 0 0 1 527.3,443.6',
  'M372.7,443.6 A190,190 0 0 1 276.4,347.3',
  'M276.4,192.7 A190,190 0 0 1 372.7,96.4',
];

const cycleSteps = [
  ['01', 'ターゲット設計', '戦略から', <>商材・強み・過去の受注先から、業種×規模×課題×訴求のターゲット仮説をつくり、優先順位をつけます。</>],
  ['02', 'リスト作成', null, <>公開情報からAIで企業を抽出し、仮説ごとに適合度をスコアリング。営業お断りの先はあらかじめ除外します。</>],
  ['03', 'アプローチ', null, <>フォーム・メール・電話を組み合わせて接点をつくります。文面もトークも、相手の事業内容に合わせて1社ずつ個別化します。</>],
  ['04', '検証と更新', 'データが残る', <>仮説ごとの反応率・商談化率・断られた理由を報告。当たった仮説に寄せ、外れた仮説はやめて、01に戻ります。商談で集まった商談相手の声をもとに、<strong>商材（サービス・プロダクト）の改善提案</strong>も行います。</>],
];

const beforeItems = [
  '新規の商談は、紹介と広告の問い合わせ次第',
  'どの業界の、どんな課題に刺さるのかがわからない',
  '忙しい月は、新規開拓が止まる',
  '元請けや大口顧客の方針に、売上が左右される',
];

const afterItems = [
  '自分たちで狙いを決めた相手と、毎月商談ができている',
  '刺さる業界・課題・訴求が、データでわかっている',
  '社長の時間に頼らず、新規の入口が動き続ける',
  '依存度が下がり、案件と条件を選べるようになる',
];

const processSteps = [
  ['01', 'ヒアリング', '商材、強み、過去の受注先と受注単価、断られやすい理由を伺います。', '1週目', 'ヒアリングシート'],
  ['02', 'ターゲット設計', 'ターゲット仮説マップと優先順位をつくり、有効な商談の条件について合意します。', '1〜2週目', 'ターゲット仮説マップ'],
  ['03', 'リスト作成', '仮説ごとにリストをつくり、適合度でスコアリングします。', '2週目', 'スコア付きリスト'],
  ['04', 'アプローチ', '文面とトークは、事前に必ずご確認いただきます。反応があった先は、すぐに日程を調整します。', '3週目〜', '商談'],
  ['05', '検証と更新', '仮説ごとの結果を報告し、当たった仮説に寄せて次の打ち手を決めます。', '継続', '検証レポート'],
];

const sampleRows = [
  ['H1', '地方の卸売・商社', '30〜100名', '受発注がFAX・電話で、担当者に業務が偏っている', '受発注業務のAI化で、残業を減らす', 'A', 72],
  ['H2', '建設・設備工事', '20〜80名', '見積もり作成が属人化し、若手に任せられない', '過去の見積もりを学習させた作成支援', 'A', 54],
  ['H3', '製造業（部品加工）', '50〜200名', '技術伝承が進まず、問い合わせ対応が熟練者頼み', '社内ナレッジのAI検索で、問い合わせを若手に', 'B', 36],
  ['H4', '士業事務所', '10〜30名', '書類作成の手作業が多く、繁忙期に回らない', '定型書類のAI作成で、繁忙期の負荷を平準化', 'C', 18],
];

const comparisonRows = [
  ['狙う相手', '選べない', '発注者次第', '検索した人', '依頼側が決める', '代行会社が設計', '狙う相手を自分たちで決め、仮説検証する'],
  ['費用の発生', 'なし', '掲載・成約時', 'クリックごとに先払い', 'アポごと', '月額の固定費', '条件に合う商談ができたときだけ'],
  ['商談の質', '高いが、時期が読めない', '相見積もりで価格競争になりやすい', '商談1件 約8〜12万円（試算）', '合わない相手が混ざりやすい', '高い', '事前に合意した条件に合う相手だけ'],
  ['残るもの', '—', '—', '広告の運用データ', 'アポ', 'レポート', '刺さる業界・課題・訴求のデータと、商材の改善提案'],
];

const priceSpecs = [
  ['成果の条件', '事前に合意した条件（業種・規模・課題など）に合う会社と、オンラインで商談を実施できたもの'],
  ['単価の決め方', '商材の受注単価と、狙う相手への届きやすさをもとに、ヒアリング後にご提示します（1商談5万円から）'],
  ['月の上限', '月あたりの商談数の上限を、あらかじめ決められます。想定以上に費用が膨らむことはありません'],
  ['請求', '商談を実施した月に請求し、翌月末にお支払い'],
  ['契約期間', '2か月〜'],
  ['アプローチ手段', '問い合わせフォーム、メール、電話を組み合わせて実施'],
  ['報告', '定期的に報告。仮説ごとの反応率・商談化率・断られた理由'],
];

const career = [
  ['LUDENTZ（現在）', <>法人向けの営業支援を担当。リード獲得から、商談後の管理（HubSpot）の改善・構築までを手がける。</>],
  ['新規事業開発のコンサルティング会社', <>大企業に、新規事業の立ち上げ支援を提案・販売。<b>全社売上の約4分の1</b>をつくる。</>],
  ['人材系ベンチャー', <>事業責任者として、<b>3つの事業を立ち上げ</b>（スキマ時間で働く人と企業をつなぐサービス、不動産仲介、M&amp;A仲介）。営業リストづくりから電話でのアプローチ、受注、納品までを1人で担う。電話では、<b>担当者と話せた企業の約30社に1社から受注</b>した。</>],
  ['外資系ラグジュアリーブランド', <>新卒で入社し、販売職として3年で、約1,000人の中で<b>売上ランキング上位1.5%</b>に入る。</>],
];

const faqs = [
  ['自社の技術やサービスを、理解してもらえますか？', <>ヒアリングと過去の受注先の分析から仮説をつくります。文面とトークは事前に必ずご確認いただくので、意図しない伝え方になることはありません。</>],
  ['合わない相手との商談が入ったら、どうなりますか？', <>事前に合意した条件に合わない商談には、費用は発生しません。</>],
  ['自社の評判が下がりませんか？', <>「営業お断り」と明記された窓口には送りません。同じ会社への連絡には間隔をあけ、送信履歴を管理しています。</>],
  ['成果が出なかった場合は？', <>費用は一切かかりません（初期費用も0円です）。反応が取れなかった仮説についても結果と考察を報告するので、次の打ち手の材料になります。</>],
  ['どれくらいで商談が始まりますか？', <>開始から3週目以降が目安です。1〜2週目でヒアリング、ターゲット設計、リスト作成を行います。</>],
  ['商談の後の営業や、受注までの仕組みづくりも相談できますか？', <>できます。商談から受注までの管理や営業オペレーションの整備は、<a href="/service/sales-ax">セールスAX</a>などで支援しています。</>],
  ['どんな会社が対象ですか？', <>法人向けに技術やサービスを提供している会社が対象です。DX・AI導入支援やシステムの受託開発、製造業向けの技術・設備など、1件あたりの受注単価が高い商材と相性が良いサービスです。</>],
  ['商談1件の単価は、どう決まりますか？', <>商材の受注単価と、狙う相手への届きやすさをもとに、ヒアリング後にご提示します。1商談5万円からです。</>],
  ['商談が増えすぎて、費用が膨らむことはありませんか？', <>月あたりの商談数の上限を、あらかじめ決められます。上限に達した月は、それ以上アプローチしません。</>],
  ['2か月で解約できますか？', <>できます。契約期間は2か月からで、その後は月単位で継続・終了を決められます。</>],
  ['秘密保持契約は結べますか？', <>結べます。商材や顧客の情報をお預かりする前に締結します。</>],
];

const SEND_ERROR = '送信に失敗しました。時間をおいてもう一度お試しいただくか、日程予約からご連絡ください。';

async function postLead(payload) {
  const r = await fetch('/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

function Arrow() {
  return <span className="lg-arrow">→</span>;
}

function ApplyLink({ cta }) {
  return (
    <a className="lg-btn" href="#contact" data-cta={cta}>
      無料の仮説マップを申し込む <Arrow />
    </a>
  );
}

function VariantLine({ text }) {
  return text.split('|').map((part, index) => (
    <Fragment key={part}>
      {index > 0 && <br className="lg-sp" />}
      {part}
    </Fragment>
  ));
}

function SectionHead({ kicker, title, lead }) {
  return (
    <div className="lg-head">
      <p className="lg-kicker">{kicker}</p>
      <h2 className="lg-h2">{title}</h2>
      {lead && <p className="lg-lead">{lead}</p>}
    </div>
  );
}

function Honeypot({ value, onChange }) {
  return (
    <input
      className="lg-hp"
      type="text"
      name="company_website"
      value={value}
      onChange={onChange}
      tabIndex="-1"
      autoComplete="off"
      aria-hidden="true"
    />
  );
}

export default function LeadGenerationPage() {
  const [variant, setVariant] = useState('a');
  const variantRef = useRef('a');
  const formStarted = useRef(false);

  const [checks, setChecks] = useState(() => checkQuestions.map(() => false));
  const [checkResult, setCheckResult] = useState(null);
  const [checkMail, setCheckMail] = useState({ email: '', product: '', hp: '' });
  const [checkMailStatus, setCheckMailStatus] = useState('idle');

  const [lead, setLead] = useState({ company: '', name: '', email: '', product: '', hp: '' });
  const [leadStatus, setLeadStatus] = useState('idle');

  const [stickyHidden, setStickyHidden] = useState(true);

  const track = (name, params = {}) => trackEvent(name, { ...params, variant: variantRef.current });

  useEffect(() => {
    document.body.dataset.lang = DEFAULTS.lang;
    document.body.classList.toggle('dark', DEFAULTS.theme === 'dark');
    document.body.classList.add(`intensity-${DEFAULTS.intensity}`);
  }, []);

  useEffect(() => {
    const v = (new URLSearchParams(window.location.search).get('v') || 'a').toLowerCase();
    if (LEAD_GEN_VARIANTS.includes(v)) {
      variantRef.current = v;
      setVariant(v);
    }
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      const target = event.target.closest?.('[data-cta]');
      if (target) track('cta_click', { cta: target.getAttribute('data-cta') });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // スマホの固定CTA：ファーストビューを過ぎたら表示し、お問い合わせ欄では隠す
  useEffect(() => {
    const hero = document.getElementById('top');
    const contact = document.getElementById('contact');
    if (!hero || !contact || !('IntersectionObserver' in window)) return undefined;
    let heroVisible = true;
    let contactVisible = false;
    const update = () => setStickyHidden(heroVisible || contactVisible);
    const heroObserver = new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      update();
    });
    const contactObserver = new IntersectionObserver((entries) => {
      contactVisible = entries[0].isIntersecting;
      update();
    });
    heroObserver.observe(hero);
    contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const noteFormStart = (form) => {
    if (formStarted.current) return;
    formStarted.current = true;
    track('form_start', { form });
  };

  const runCheck = () => {
    const score = checks.filter(Boolean).length;
    const result = checkResults.find((item) => score <= item.max);
    setCheckResult({ ...result, score });
    track('check_complete', { score });
  };

  const submitCheckMail = async (event) => {
    event.preventDefault();
    if (checkMailStatus === 'sending') return;
    setCheckMailStatus('sending');
    try {
      await postLead({
        source: LEAD_GEN_CHECK_SOURCE,
        email: checkMail.email,
        product: checkMail.product,
        hp: checkMail.hp,
        score: checkResult ? checkResult.score : '',
        variant: variantRef.current,
      });
      track('generate_lead', { form: 'dependency-check' });
      setCheckMailStatus('sent');
    } catch {
      setCheckMailStatus('error');
    }
  };

  const submitLead = async (event) => {
    event.preventDefault();
    if (leadStatus === 'sending') return;
    setLeadStatus('sending');
    try {
      await postLead({
        source: LEAD_GEN_SOURCE,
        company: lead.company,
        name: lead.name,
        email: lead.email,
        product: lead.product,
        hp: lead.hp,
        variant: variantRef.current,
      });
      track('generate_lead', { form: 'lead-generation' });
      setLeadStatus('sent');
    } catch {
      setLeadStatus('error');
    }
  };

  const setLeadField = (key) => (event) => setLead((current) => ({ ...current, [key]: event.target.value }));
  const setCheckMailField = (key) => (event) => setCheckMail((current) => ({ ...current, [key]: event.target.value }));

  const [h1a, h1b] = heroVariants[variant];

  return (
    <div className="lg-page">
      <nav className="nav sales-ax-nav" aria-label="リード獲得代行ページ内ナビゲーション">
        <a className="nav-logo" href="/">LUDENTZ</a>
        <div className="sales-ax-nav-links">
          {anchorLinks.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
        </div>
        <button className="nav-btn" type="button" data-cta="header" onClick={scrollToContact}>
          <span className="sales-ax-nav-cta-full">無料の仮説マップを申し込む</span>
          <span className="sales-ax-nav-cta-short">仮説マップを申し込む</span>
        </button>
      </nav>

      <main>
        <section className="lg-hero" id="top">
          <div className="lg-wrap">
            <div className="lg-hero-grid">
              <div>
                <p className="lg-eyebrow">法人向けに、技術やサービスを提供する会社へ</p>
                <h1 className="lg-h1">
                  <span className="lg-line"><VariantLine text={h1a} /></span>
                  <span className="lg-line"><VariantLine text={h1b} /></span>
                </h1>
                <p className="lg-hero-sub">狙う相手の設計から、商談まで。<br />払うのは、成果が出たときだけ。</p>
                <p className="lg-lead">誰に売るべきかの仮説づくりから、リスト作成、1社ずつ個別化したアプローチ、検証と改善までをLUDENTZが一貫して担います。<strong>初期費用は0円。</strong>費用が発生するのは、条件に合う相手とオンラインで商談できたときだけです。</p>
                <div className="lg-hero-cta">
                  <ApplyLink cta="hero" />
                  <span className="lg-note" style={{ margin: 0 }}>30分のヒアリングで、狙うべき業界・課題・訴求の仮説を1枚にまとめてお渡しします。</span>
                  <a className="lg-textlink" href={LEAD_GEN_BOOKING_URL} target="_blank" rel="noopener" data-cta="hero-booking">先に日程を決めたい方は、こちらから直接予約 <Arrow /></a>
                </div>
              </div>
              <aside className="lg-panel" aria-label="リード獲得代行の3つの約束">
                <p className="lg-kicker" style={{ margin: 0 }}>3 promises — 3つの約束</p>
                <ol className="lg-panel-list">
                  {promises.map(([num, title, desc]) => (
                    <li key={num}>
                      <span className="lg-num">{num}</span>
                      <div><strong>{title}</strong><span className="lg-desc">{desc}</span></div>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
            <div className="lg-flow" aria-label="サービスの流れ">
              <span><b>ターゲット設計</b></span><Arrow />
              <span><b>リスト作成</b></span><Arrow />
              <span><b>アプローチ</b>（フォーム・メール・電話）</span><Arrow />
              <span><b>商談</b>（ここで初めて費用が発生）</span>
            </div>
          </div>
        </section>

        <section className="lg-section" id="issues">
          <div className="lg-wrap">
            <SectionHead
              kicker="Issues — 解決する課題"
              title={<>新規の案件、<br />紹介と広告頼みになっていませんか。</>}
              lead="技術やサービスには自信がある。案件もいまは回っている。それでも、来期の案件がどこから来るかは読めていない。こんな状態に心当たりはありませんか。"
            />
            <div className="lg-rows">
              {issues.map(([num, body]) => (
                <div className="lg-row" key={num}><span className="lg-num">{num}</span><p>{body}</p></div>
              ))}
            </div>

            <div className="lg-statement">
              <h2 className="lg-h2">問題は、営業の手が足りないことではありません。</h2>
              <p className="lg-lead">商談が増えない原因は、たいてい「量」より手前にあります。</p>
            </div>
            <div className="lg-cards lg-cards--3" style={{ marginTop: 48 }}>
              {causes.map(([num, title, body]) => (
                <article className="lg-card" key={num}>
                  <span className="lg-num">{num}</span>
                  <h3 className="lg-h3">{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <div className="lg-cta-inline">
              <div>
                <p className="lg-cta-inline-title">まずは、御社の「誰に売るか」を1枚にしませんか。</p>
                <p className="lg-note" style={{ margin: '8px 0 0' }}>30分・オンライン。ご契約いただかなくても、そのままお使いいただけます。</p>
              </div>
              <ApplyLink cta="issues" />
            </div>
          </div>
        </section>

        <section className="lg-section lg-dark" id="why-now">
          <div className="lg-wrap">
            <SectionHead
              kicker="Why now — なぜ今か"
              title={<>待っているあいだに、<br />商談は他社へ流れていく。</>}
            />
            <div className="lg-risk-grid lg-risk-grid--single">
              <div>
                <p className="lg-kicker" style={{ margin: 0 }}>Risk — 放っておくと</p>
                <ul className="lg-risk-list">
                  {risks.map(([title, body]) => <li key={title}><strong>{title}</strong>{body}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="lg-section lg-band" id="check">
          <div className="lg-wrap">
            <SectionHead
              kicker="Check — 紹介依存度チェック"
              title={<>御社の新規開拓、<br />どれくらい“紹介頼み”ですか。</>}
              lead="当てはまるものを選んでください。5問、30秒で終わります。"
            />
            <div className="lg-check">
              <form className="lg-check-q" onSubmit={(event) => event.preventDefault()}>
                {checkQuestions.map((question, index) => (
                  <label key={question}>
                    <input
                      type="checkbox"
                      name="q"
                      checked={checks[index]}
                      onChange={(event) => setChecks((current) => current.map((value, i) => (i === index ? event.target.checked : value)))}
                    />{' '}
                    {question}
                  </label>
                ))}
                <button className="lg-btn" type="button" data-cta="check-run" onClick={runCheck}>結果を見る <Arrow /></button>
              </form>
              <div className="lg-check-result" aria-live="polite">
                <p className="lg-kicker" style={{ margin: 0 }}>Result — 結果</p>
                <p className="lg-check-level">{checkResult ? `${checkResult.level}（${checkResult.score}/5）` : '—'}</p>
                <p className="lg-check-msg">{checkResult ? checkResult.msg : '当てはまる項目を選んで「結果を見る」を押してください。'}</p>
                <ApplyLink cta="check-result" />
                <form
                  className="lg-check-mail"
                  data-ldz-contact="dependency-check"
                  onSubmit={submitCheckMail}
                  onFocus={() => noteFormStart('dependency-check')}
                >
                  <p className="lg-check-mail-title">まだ相談するほどではない方へ</p>
                  <p className="lg-note" style={{ margin: '6px 0 14px' }}>ヒアリングなしで、<strong>簡易版のターゲット仮説</strong>をメールでお送りします。商材のページURLがない場合は、一言での説明で大丈夫です。</p>
                  {checkMailStatus === 'sent' ? (
                    <p className="lg-check-mail-sent" role="status">受け付けました。簡易版のターゲット仮説を、担当の小林よりメールでお送りします。</p>
                  ) : (
                    <>
                      <div className="lg-check-mail-fields">
                        <input name="email" type="email" placeholder="メールアドレス" aria-label="メールアドレス" autoComplete="email" required value={checkMail.email} onChange={setCheckMailField('email')} disabled={checkMailStatus === 'sending'} />
                        <input name="product" type="text" placeholder="商材のページURL、または一言での説明" aria-label="商材のページURL、または一言での説明" required maxLength={2000} value={checkMail.product} onChange={setCheckMailField('product')} disabled={checkMailStatus === 'sending'} />
                        <Honeypot value={checkMail.hp} onChange={setCheckMailField('hp')} />
                        <button className="lg-btn lg-btn--ghost" type="submit" data-cta="check-mail" disabled={checkMailStatus === 'sending'}>
                          {checkMailStatus === 'sending' ? '送信中…' : <>簡易版の仮説を受け取る <Arrow /></>}
                        </button>
                      </div>
                      {checkMailStatus === 'error' && <p className="lg-form-error" role="alert">{SEND_ERROR}</p>}
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="lg-section" id="service">
          <div className="lg-wrap">
            <SectionHead
              kicker="Service — リード獲得代行とは"
              title={<>誰に売るかを決め、検証し、<br />商談をつくる。</>}
              lead="一般的な営業代行では、ターゲットを決めるのは依頼する側です。LUDENTZは、その一段手前の「どこを狙うべきか」の設計から引き受けます。成果報酬なので、狙いを外せば私たちの売上にもなりません。設計から引き受けるのは、そのためです。"
            />
            <div className="lg-cycle-wrap">
              <div className="lg-cycle-fig">
                <svg className="lg-cycle" viewBox="150 30 600 510" role="img" aria-label="ターゲット設計、リスト作成、アプローチ、検証と更新を繰り返し、商談を生むサイクルの図">
                  <defs>
                    <marker id="lg-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="#0A0A0A" />
                    </marker>
                  </defs>
                  <circle cx="450" cy="270" r="190" fill="none" stroke="#D4D4D4" strokeDasharray="2 6" />
                  {cycleArcs.map((d) => <path key={d} d={d} fill="none" stroke="#0A0A0A" strokeWidth="1.6" markerEnd="url(#lg-arr)" />)}
                  <circle cx="450" cy="270" r="86" fill="#0A0A0A" />
                  <text x="450" y="242" textAnchor="middle" fill="#B3B3B3" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="1.5">OUTPUT</text>
                  <text x="450" y="282" textAnchor="middle" fill="#FAFAF8" fontFamily="Zen Old Mincho, serif" fontWeight="900" fontSize="34">商談</text>
                  <text x="450" y="308" textAnchor="middle" fill="#B3B3B3" fontFamily="Zen Kaku Gothic New, sans-serif" fontSize="11">ここで初めて費用が発生</text>
                  {cycleBoxes.map((box) => (
                    <g key={box.num}>
                      <rect x={box.x} y={box.y} width="196" height="66" fill="#FAFAF8" stroke="#0A0A0A" />
                      <text x={box.x + 14} y={box.y + 27} fill="#8F8F8F" fontFamily="JetBrains Mono, monospace" fontSize="11">{box.num}</text>
                      <text x={box.x + 40} y={box.y + 29} fill="#0A0A0A" fontFamily="Zen Old Mincho, serif" fontWeight="700" fontSize="18">{box.title}</text>
                      <text x={box.x + 40} y={box.y + 51} fill="#6B6B6B" fontFamily="Zen Kaku Gothic New, sans-serif" fontSize="12">{box.sub}</text>
                    </g>
                  ))}
                  <text x="450" y="526" textAnchor="middle" fill="#6B6B6B" fontFamily="JetBrains Mono, monospace" fontSize="11" letterSpacing="1.5">HYPOTHESIS → TEST → LEARN</text>
                </svg>
              </div>
              <div className="lg-cycle-steps">
                <p className="lg-cycle-cap">ターゲットは一度決めて終わりにしません。<strong>仮説を立てて実際にアプローチし、結果を見て次の狙いを決める。</strong>これを繰り返して、商談につながる相手と訴求に絞り込みます。</p>
                <ol className="lg-cycle-list">
                  {cycleSteps.map(([num, title, tag, body]) => (
                    <li key={num}>
                      <span className="lg-num">{num}</span>
                      <div>
                        <h3 className="lg-h3">{title}{tag && <> <span className="lg-tag">{tag}</span></>}</h3>
                        <p>{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="lg-section lg-band" id="after">
          <div className="lg-wrap">
            <SectionHead kicker="After — 導入後" title={<>案件を、<br />選べる会社へ。</>} />
            <div className="lg-ba">
              <article>
                <p className="lg-kicker" style={{ margin: 0 }}>Before</p>
                <ul>{beforeItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
              <article>
                <p className="lg-kicker" style={{ margin: 0, color: 'var(--ink-6)' }}>After</p>
                <ul>{afterItems.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            </div>
          </div>
        </section>

        <section className="lg-section" id="process">
          <div className="lg-wrap">
            <SectionHead
              kicker="Process — 進め方"
              title="3週目から、商談が動き出す。"
              lead="ブラックボックスにはしません。各段階で何をつくり、何がわかったかをお渡しします。"
            />
            <div className="lg-steps">
              {processSteps.map(([num, title, body, when, output]) => (
                <div className="lg-step" key={num}>
                  <span className="lg-num">{num}</span>
                  <h3 className="lg-h3">{title}</h3>
                  <p>{body}</p>
                  <span className="lg-when">{when}</span>
                  <p className="lg-out">成果物：{output}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lg-section lg-band" id="sample">
          <div className="lg-wrap">
            <SectionHead
              kicker="Deliverable — 成果物サンプル"
              title={<>「誰に、何を言えば刺さるか」を、<br />1枚にする。</>}
              lead="最初にお渡しするターゲット仮説マップの例です。アプローチを始めた後は、反応率と商談化率をここに書き足し、当たる仮説を絞り込んでいきます。"
            />
            <span className="lg-sample-label">SAMPLE — 架空の例：中小企業向けにAI導入を支援する会社の場合</span>
            <div className="lg-table-wrap">
              <table className="lg-table">
                <thead>
                  <tr><th>仮説</th><th>業種</th><th>規模</th><th>想定する課題</th><th>訴求</th><th>優先度</th><th>反応率（検証後に記入）</th></tr>
                </thead>
                <tbody>
                  {sampleRows.map(([id, industry, size, issue, appeal, priority, bar]) => (
                    <tr key={id}>
                      <th>{id}</th><td>{industry}</td><td>{size}</td><td>{issue}</td><td>{appeal}</td>
                      <td><span className={'lg-pri' + (priority === 'A' ? ' lg-pri--a' : '')}>{priority}</span></td>
                      <td><span className="lg-bar" style={{ width: bar }} />—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="lg-note">※ 表の内容は説明用の架空の例です。実際の仮説は、ヒアリングと御社の受注実績から作成します。</p>
            <div className="lg-cta-inline">
              <div><p className="lg-cta-inline-title">御社版の仮説マップを、無料でつくります。</p></div>
              <ApplyLink cta="sample" />
            </div>
          </div>
        </section>

        <section className="lg-section" id="difference">
          <div className="lg-wrap">
            <SectionHead
              kicker="Difference — 他の手段との違い"
              title={<>設計から引き受けるのに、<br />成果報酬。</>}
              lead="戦略から設計する営業代行は固定費が高く、成果報酬の営業代行はターゲットを自分で決める必要があります。LUDENTZは、その間を埋めます。"
            />
            <div className="lg-table-wrap">
              <table className="lg-table">
                <thead>
                  <tr><th /><th>紹介を待つ</th><th>受託案件のマッチングサイト</th><th>Web広告</th><th>量産型のテレアポ代行</th><th>戦略設計型の営業代行</th><th className="lg-us">LUDENTZ<br />リード獲得代行</th></tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([axis, ...values]) => (
                    <tr key={axis}>
                      <th>{axis}</th>
                      {values.map((value, index) => (
                        <td className={index === values.length - 1 ? 'lg-us' : undefined} key={index}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="lg-note">※ Web広告の商談単価は、高単価IT商材のリード獲得単価の相場（平均約2.5万円）に、リードから商談への転換率を20〜30%と置いた試算です。</p>

            <div className="lg-details" style={{ marginTop: 48 }}>
              <details>
                <summary><span className="lg-num">NOTE</span>新規開拓AXとの違い</summary>
                <div className="lg-answer"><p>新規開拓AXは、リスト作成から送信・返信対応までの<strong>仕組みを御社の中に構築する</strong>伴走支援です。リード獲得代行は、その仕組みを<strong>LUDENTZが運用し、商談を成果報酬でお届けする</strong>サービスです。まずは代行で成果を確かめ、手応えが出たら社内に仕組みを移す、という進め方もできます。<a href="/service/prospecting-ax">新規開拓AXを見る →</a></p></div>
              </details>
            </div>
          </div>
        </section>

        <section className="lg-section" id="pricing">
          <div className="lg-wrap">
            <SectionHead kicker="Pricing — 料金" title="払うのは、商談が生まれたときだけ。" />
            <div className="lg-price-grid">
              <div className="lg-price">
                <p className="lg-kicker" style={{ margin: 0 }}>Setup — 初期費用</p>
                <p className="lg-amount">0円</p>
                <p>ターゲット設計、リスト作成、文面作成も含めて、初期費用はいただきません。</p>
              </div>
              <div className="lg-price">
                <p className="lg-kicker" style={{ margin: 0 }}>Success fee — 成果報酬</p>
                <p className="lg-amount">1商談 5万円〜<small>（税別）</small></p>
                <p>事前に合意した条件に合う相手と、オンラインで商談できた場合のみ発生します。</p>
              </div>
            </div>
            <div className="lg-spec">
              <dl>
                {priceSpecs.map(([term, desc]) => <Fragment key={term}><dt>{term}</dt><dd>{desc}</dd></Fragment>)}
              </dl>
            </div>

            <div className="lg-cta-inline">
              <div>
                <p className="lg-cta-inline-title">まずは、無料の仮説マップから。</p>
                <p className="lg-note" style={{ margin: '8px 0 0' }}>初期費用0円・月の上限設定あり</p>
              </div>
              <ApplyLink cta="pricing" />
            </div>
          </div>
        </section>

        <section className="lg-section lg-dark" id="consultant">
          <div className="lg-wrap">
            <SectionHead kicker="Consultant — 担当" title={<>売る現場を知る人間が、<br />設計する。</>} />
            <div className="lg-person">
              <div className="lg-person-photo">
                <img src="/assets/kobayashi.webp" alt="小林 勇大" width="600" height="600" loading="lazy" />
              </div>
              <div>
                <p className="lg-person-name">小林 勇大</p>
                <p className="lg-person-role">LUDENTZ株式会社 取締役</p>
                <p className="lg-person-lead">業界も商材も異なる事業で、営業リストづくりから受注まで、自ら売上をつくってきました。</p>
                <ul className="lg-career">
                  {career.map(([where, body]) => <li key={where}><span className="lg-where">{where}</span><span>{body}</span></li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="lg-section" id="faq">
          <div className="lg-wrap">
            <SectionHead kicker="FAQ — よくある質問" title="はじめる前に、よくいただく質問。" />
            <div className="lg-details">
              {faqs.map(([question, answer], index) => (
                <details key={question}>
                  <summary><span className="lg-num">Q{String(index + 1).padStart(2, '0')}</span>{question}</summary>
                  <div className="lg-answer"><p>{answer}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="lg-section lg-dark" id="contact">
          <div className="lg-wrap">
            <div className="lg-contact-grid">
              <div>
                <p className="lg-kicker">Contact</p>
                <h2 className="lg-h2" style={{ marginTop: 20 }}>まずは、御社の<br />ターゲット仮説マップを<br />無料でつくります。</h2>
                <p className="lg-lead">30分のヒアリングで、狙うべき業界・課題・訴求の仮説を1枚にまとめてお渡しします。ご契約いただかなくても、そのままお使いいただけます。</p>
                <ul className="lg-contact-points"><li>初期費用0円</li><li>費用は商談が生まれたときだけ</li><li>月の上限を決められる</li><li>2か月から</li></ul>
                <p className="lg-note">ご相談は無料です。オンラインで実施します。</p>
              </div>
              <form
                className="lg-form"
                data-ldz-contact="lead-generation"
                onSubmit={submitLead}
                onFocus={() => noteFormStart('lead-generation')}
              >
                <h3 className="lg-h3">Free — 30分・オンライン</h3>
                <h2 className="lg-h2">無料の仮説マップを申し込む</h2>
                {leadStatus === 'sent' ? (
                  <div className="lg-form-sent" role="status">
                    <h3 className="lg-h3">お申し込みありがとうございます。</h3>
                    <p>1営業日以内に、担当の小林より日程調整のご連絡をします。先に日程を決めたい方は、下のボタンからそのままご予約いただけます。</p>
                    <a className="lg-btn" href={LEAD_GEN_BOOKING_URL} target="_blank" rel="noopener" data-booking-link data-cta="sent-booking">30分のヒアリング日程を選ぶ <Arrow /></a>
                  </div>
                ) : (
                  <>
                    <p className="lg-note" style={{ marginTop: 8 }}>入力は4項目だけです。AIではなく、人が読みます。</p>
                    <div className="lg-field"><label htmlFor="lg-company">Company — 会社名</label><input id="lg-company" name="company" autoComplete="organization" required value={lead.company} onChange={setLeadField('company')} disabled={leadStatus === 'sending'} /></div>
                    <div className="lg-field"><label htmlFor="lg-name">Name — お名前</label><input id="lg-name" name="name" autoComplete="name" required value={lead.name} onChange={setLeadField('name')} disabled={leadStatus === 'sending'} /></div>
                    <div className="lg-field"><label htmlFor="lg-email">Email — メール</label><input id="lg-email" name="email" type="email" autoComplete="email" required value={lead.email} onChange={setLeadField('email')} disabled={leadStatus === 'sending'} /></div>
                    <div className="lg-field"><label htmlFor="lg-url">Product — 商材のページURL、または一言での説明</label><input id="lg-url" name="product" type="text" placeholder="例：https://〜 ／ 中小製造業向けの生産管理システム" required maxLength={2000} value={lead.product} onChange={setLeadField('product')} disabled={leadStatus === 'sending'} /></div>
                    <Honeypot value={lead.hp} onChange={setLeadField('hp')} />
                    {leadStatus === 'error' && <p className="lg-form-error" role="alert">{SEND_ERROR}</p>}
                    <div className="lg-form-foot">
                      <small>送信により、<a href="/privacy">プライバシーポリシー</a>に同意したものとみなします。</small>
                      <button className="lg-btn" type="submit" data-cta="form-submit" disabled={leadStatus === 'sending'}>
                        {leadStatus === 'sending' ? '送信中…' : <>申し込む <Arrow /></>}
                      </button>
                    </div>
                    <div className="lg-form-alt">
                      <span>フォームより先に日程を決めたい方は</span>
                      <a href={LEAD_GEN_BOOKING_URL} target="_blank" rel="noopener" data-booking-link data-cta="booking">日程を直接予約する <Arrow /></a>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <div className={'lg-sticky' + (stickyHidden ? ' is-hidden' : '')}>
        <a className="lg-btn" href="#contact" data-cta="sticky">無料の仮説マップを申し込む <Arrow /></a>
      </div>
    </div>
  );
}
