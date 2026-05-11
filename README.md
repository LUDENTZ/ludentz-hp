# LUDENTZ HP

Vite + React で構築した LUDENTZ のコーポレートサイト。

## 開発

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

## デプロイ（Vercel + Resend）

お問い合わせフォームは `/api/send` (Vercel Serverless Function) から **Resend** で
`aoi.ohira@ludentz.net` と `yudai.kobayashi@ludentz.net` に送信します。

### 初回セットアップ

セットアップはほぼスクリプト任せ。DNS設定だけ手作業です。

```bash
./setup.sh
```

これで以下が自動で走ります:

1. npm install
2. Vercel CLI のログイン（ブラウザが開く・初回のみ）
3. Vercel プロジェクトのリンク（既存選択 or 新規作成）
4. 環境変数 (`RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAILS`) の登録
5. プレビュー環境へデプロイ

スクリプト実行後、表示される案内に従って **Resendダッシュボードでドメイン (`ludentz.net`) を追加** →
表示されたDNSレコードを **DNS管理画面** で登録 → **Resendで検証** します。

Verified ✓ になったら:

```bash
./setup.sh prod       # 本番デプロイ
./setup.sh test       # /api/send にテストPOST
```

### 必要な入力

スクリプトは Resend API キーを聞いてきます（プロンプトで入力・非表示）。事前に用意しておくと楽:

- Resend API key: https://resend.com/api-keys

Vercel のログインは CLI がブラウザを開いて OAuth で完結します。

### 環境変数

`.env` に書いておけば `./setup.sh` が自動で読みます (`.env.example` 参照)。

| 変数                  | 内容                                        |
| --------------------- | ------------------------------------------- |
| `RESEND_API_KEY`      | Resend APIキー                              |
| `CONTACT_FROM_EMAIL`  | 送信元アドレス（Resendで検証済みドメイン） |
| `CONTACT_TO_EMAILS`   | 受信者リスト（カンマ区切り）                |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 の測定ID（例: `G-XXXXXXXXXX`） |
| `VITE_CLARITY_PROJECT_ID` | Microsoft Clarity のプロジェクトID |

### アクセス解析

GA4 と Microsoft Clarity は全ページ共通で読み込みます。環境変数が未設定の場合は読み込まれません。

GA4 には以下のイベントも送信します:

- `contact_click`: CTA / ナビからの問い合わせ導線クリック
- `contact_form_submit_attempt`: フォーム送信試行
- `contact_form_submit_success`: フォーム送信成功
- `contact_form_submit_error`: フォーム送信失敗
- `contact_form_validation_error`: 必須項目不足
- `business_service_tab_click`: 新規事業開発LPの支援方法タブ切り替え
- `business_plan_detail_toggle`: 新規事業開発LPの料金プラン詳細開閉

### 受信メールの仕様

- 件名: `[LUDENTZ LP] {名前} — {問い合わせ内容の冒頭60字}`
- Reply-To: 送信者のメール（返信でそのまま問い合わせ主へ）
- honeypot フィールドでボット送信を弾く
