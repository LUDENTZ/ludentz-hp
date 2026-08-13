import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="business-page privacy-page">
      <nav className="nav"><a className="nav-logo" href="/">LUDENTZ</a></nav>
      <main className="privacy-main">
        <header>
          <p className="business-kicker">PRIVACY POLICY</p>
          <h1>プライバシーポリシー</h1>
        </header>
        <section>
          <p>LUDENTZ株式会社（以下「当社」）は、当社が提供するサービスおよび当ウェブサイトにおいて取得する個人情報を、以下の方針に基づき適切に取り扱います。</p>
          <h2>取得する情報</h2>
          <p>お問い合わせ時にご入力いただく会社名、氏名、メールアドレス、電話番号、お問い合わせ内容のほか、当ウェブサイトの利用状況に関する情報を取得することがあります。</p>
          <h2>利用目的</h2>
          <p>お問い合わせへの対応、相談日程の調整、当社サービスの提供・改善、必要なご案内、および不正利用の防止のために利用します。</p>
          <h2>第三者提供</h2>
          <p>法令に基づく場合を除き、ご本人の同意なく個人情報を第三者へ提供しません。業務遂行に必要な範囲で外部事業者へ取り扱いを委託する場合は、適切な管理を行います。</p>
          <h2>安全管理</h2>
          <p>個人情報への不正アクセス、漏えい、滅失または毀損を防止するため、必要かつ適切な安全管理措置を講じます。</p>
          <h2>開示・訂正・削除</h2>
          <p>ご本人から個人情報の開示、訂正、利用停止または削除等の請求があった場合は、本人確認のうえ、法令に従って対応します。</p>
          <h2>お問い合わせ</h2>
          <p>本方針および個人情報の取り扱いに関するお問い合わせは、当ウェブサイトの<a href="/#contact">お問い合わせ窓口</a>よりご連絡ください。</p>
          <p className="privacy-updated">制定日：2026年8月13日<br />LUDENTZ株式会社</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
