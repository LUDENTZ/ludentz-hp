// サービスページ用：担当者（代表 大平）のプロフィールセクション
export default function ConsultantProfile() {
  return (
    <section className="business-band consultant">
      <div className="business-section-head">
        <p className="business-kicker">CONSULTANT — 担当</p>
        <h2>全案件、代表が直接入ります。</h2>
        <p className="business-section-copy">
          （創業1期目限定）業務の棚卸しから設計・実装・定着まで、代表の大平が一貫して担当します。
        </p>
      </div>
      <div className="consultant-card">
        <img
          className="consultant-photo"
          src="/assets/person-k.png"
          alt="大平 葵"
          width="180"
          height="180"
          loading="lazy"
        />
        <div className="consultant-body">
          <p className="consultant-name">大平 葵</p>
          <p className="consultant-role">LUDENTZ株式会社 創業者・代表取締役</p>
          <p>
            PRエージェンシーの創業・10年間の経営を経て、運用型広告コンサルティング会社にて立ち上げ期サービスの広告戦略・運用を担当。戦略設計から運用改善まで一気通貫で支援。
          </p>
          <p>
            その後、上場企業10社以上の新規事業開発を伴走し、AIを活用した事業開発にも複数従事。2026年にLUDENTZ株式会社を創業。自社の営業・経理・総務・デリバリー業務をAIエージェントで運営し、その実運用から得た型をもとにマーケティング領域のAX支援を行っている。
          </p>
        </div>
      </div>
    </section>
  );
}
