// 記事共通の著者ブロック。JSON-LD側でも同一人物を参照できるよう定義を共有する
export const AUTHOR_JSONLD = {
  '@type': 'Person',
  name: '大平 葵',
  jobTitle: '代表取締役',
  image: 'https://ludentz.net/assets/person-k.png',
  worksFor: { '@type': 'Organization', name: 'LUDENTZ株式会社' },
  sameAs: ['https://note.com/marketing_ax'],
};

export const PUBLISHER_JSONLD = {
  '@type': 'Organization',
  name: 'LUDENTZ株式会社',
  logo: { '@type': 'ImageObject', url: 'https://ludentz.net/assets/logo.svg' },
};

export default function ArticleAuthor() {
  return (
    <section className="article-author" aria-label="この記事の執筆者">
      <h2>この記事の執筆者</h2>
      <div className="article-author-card">
        <img
          className="article-author-photo"
          src="/assets/person-k.png"
          alt="大平 葵"
          width="72"
          height="72"
          loading="lazy"
        />
        <div className="article-author-body">
          <p className="article-author-name">
            大平 葵（LUDENTZ株式会社 創業者・代表取締役）
          </p>
          <p>
            PRエージェンシーの創業・10年間の経営を経て、運用型広告コンサルティング会社にて立ち上げ期サービスの広告戦略・運用を担当。戦略設計から運用改善まで一気通貫で支援。
          </p>
          <p>
            その後、上場企業10社以上の新規事業開発を伴走し、AIを活用した事業開発にも複数従事。2026年にLUDENTZ株式会社を創業。自社の営業・経理・総務・デリバリー業務をAIエージェントで運営し、その実運用から得た型をもとにマーケティング領域のAX支援を行っている。
          </p>
        </div>
      </div>
      <p className="article-updated">最終更新: 2026年7月</p>
    </section>
  );
}
