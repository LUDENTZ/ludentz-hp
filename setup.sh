#!/usr/bin/env bash
# LUDENTZ HP — Vercel + Resend deploy helper.
#
# Usage:
#   ./setup.sh          Phase 1: install deps, link Vercel, set env vars, preview deploy
#   ./setup.sh prod     Phase 2: production deploy (run this after DNS is verified on Resend)
#   ./setup.sh test     Send a test email via the deployed /api/send endpoint

set -euo pipefail
cd "$(dirname "$0")"

B=$'\033[1m'; DIM=$'\033[2m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; RST=$'\033[0m'
step()  { echo; echo "${B}▸ $1${RST}"; }
ok()    { echo "  ${GREEN}✓${RST} $1"; }
warn()  { echo "  ${YELLOW}!${RST} $1"; }
fail()  { echo "  ${RED}✗${RST} $1" >&2; exit 1; }

PHASE="${1:-setup}"

# ─── Load local .env if present ───────────────────────────────
if [[ -f .env ]]; then
  set -a; # shellcheck disable=SC1091
  source .env; set +a
fi

FROM_EMAIL="${CONTACT_FROM_EMAIL:-noreply@ludentz.net}"
TO_EMAILS="${CONTACT_TO_EMAILS:-aoi.ohira@ludentz.net,yudai.kobayashi@ludentz.net}"

# ─── Prereqs ──────────────────────────────────────────────────
step "Check prerequisites"
command -v node >/dev/null || fail "Install Node.js 18+ first (https://nodejs.org)"
command -v npm  >/dev/null || fail "npm is missing"
command -v curl >/dev/null || fail "curl is missing"
ok "node $(node -v), npm $(npm -v)"

# ─── Resend API key ───────────────────────────────────────────
if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo
  read -r -s -p "Resend API key (re_...): " RESEND_API_KEY
  echo
fi
[[ "${RESEND_API_KEY}" =~ ^re_ ]] || fail "Resend API key should start with re_"
ok "Resend key loaded"

# ─── test mode: just send a test email ───────────────────────
if [[ "$PHASE" == "test" ]]; then
  step "Sending test email through deployed /api/send"
  DEPLOY_URL="${DEPLOY_URL:-}"
  if [[ -z "$DEPLOY_URL" ]]; then
    read -r -p "Production URL (e.g. https://ludentz.vercel.app): " DEPLOY_URL
  fi
  curl -s -X POST "$DEPLOY_URL/api/send" \
    -H "Content-Type: application/json" \
    -d '{"name":"Setup test","email":"test@example.com","phone":"","intent":"This is a test from setup.sh — please ignore."}' \
    | tee /tmp/send-test.json
  echo
  grep -q '"ok":true' /tmp/send-test.json && ok "Email accepted by API" || fail "Send failed — check Resend dashboard > Emails"
  exit 0
fi

# ─── Install deps ─────────────────────────────────────────────
step "Install project deps"
npm install --silent
ok "deps installed"

# ─── Vercel CLI ───────────────────────────────────────────────
step "Vercel CLI"
if ! command -v vercel >/dev/null; then
  warn "Vercel CLI not found globally, using npx"
  VERCEL="npx --yes vercel@latest"
else
  VERCEL="vercel"
  ok "$(vercel --version)"
fi

step "Vercel login"
if ! $VERCEL whoami >/dev/null 2>&1; then
  $VERCEL login
fi
ok "logged in as $($VERCEL whoami 2>/dev/null)"

step "Link project"
if [[ ! -f .vercel/project.json ]]; then
  $VERCEL link
else
  ok "already linked"
fi

# ─── Env vars ─────────────────────────────────────────────────
step "Set Vercel environment variables"
push_env() {
  local name="$1" value="$2"
  for env in production preview development; do
    $VERCEL env rm "$name" "$env" --yes >/dev/null 2>&1 || true
  done
  for env in production preview development; do
    printf '%s' "$value" | $VERCEL env add "$name" "$env" >/dev/null
  done
  ok "$name"
}
push_env "RESEND_API_KEY"      "$RESEND_API_KEY"
push_env "CONTACT_FROM_EMAIL"  "$FROM_EMAIL"
push_env "CONTACT_TO_EMAILS"   "$TO_EMAILS"

# ─── Deploy ───────────────────────────────────────────────────
if [[ "$PHASE" == "prod" ]]; then
  step "Deploy to PRODUCTION"
  $VERCEL --prod
  cat <<EOF

${B}━━━ 本番デプロイ完了 ━━━${RST}

動作確認:
  1. 本番URL（上に出ているやつ）を開く
  2. 右上の「ご相談はコチラから」 → フォーム送信
  3. ${TO_EMAILS} にメールが届けばOK

何かおかしい場合:
  • Resend → Emails タブで送信ログ確認
  • From (${FROM_EMAIL}) のドメインが verified になっているか確認
  • コマンドでテスト: ${DIM}./setup.sh test${RST}

EOF
else
  step "Deploy PREVIEW"
  $VERCEL

  cat <<EOF

${B}━━━ Phase 1 完了。次は DNS 設定 ━━━${RST}

1. ブラウザで ${B}https://resend.com/domains${RST} を開く
2. [Add Domain] → ${B}ludentz.net${RST} を追加
3. 表示される DNS レコード（MX, SPF-TXT, DKIM-CNAME × 3 など）を
   ${B}ludentz.net の DNS 管理画面${RST}（お名前.com / Cloudflare / Route 53 など）で追加
4. 5〜15分待ってから、Resend の domain ページで ${B}[Verify DNS Records]${RST} をクリック
5. ${B}Verified ✓${RST} が付いたら、本番デプロイ:

     ${B}./setup.sh prod${RST}

${DIM}※ ドメイン検証が完了するまで、${FROM_EMAIL} からのメール送信はエラーになります。
  テスト送信をすぐやりたい場合は、CONTACT_FROM_EMAIL=onboarding@resend.dev にすれば
  Resend登録アドレスにだけ送信可能です (.env を編集 → ./setup.sh を再実行)。${RST}

EOF
fi
