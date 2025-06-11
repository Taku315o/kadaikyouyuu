# StudyShare

大学生のための課題共有アプリケーション。
ユーザーはGoogleログインを使ってサインインし、課題の回答（テキスト＋画像）を投稿・閲覧・検索することができます。

---

## 技術スタック

| 層 | 技術 |
|----|------|
| フロントエンド | Next.js (App Router) |
| バックエンド | Node.js + Express |
| 認証 | Supabase Auth (Google OAuth) |
| データベース | Supabase PostgreSQL |
| ストレージ | Supabase Storage |

---

## プロジェクト構成

```bash
studyshare/
├── frontend/   # Next.js アプリケーション
├── backend/    # Express API サーバー
├── .gitignore
└── README.md
```

---

## セットアップ

1. リポジトリをクローンし、各ディレクトリで依存関係をインストールします。

```bash
cd frontend && npm install
cd ../backend && npm install
```

2. 環境変数を設定します。`backend/.env` に Supabase の情報を記入してください。

3. それぞれのディレクトリで開発サーバーを起動します。

```bash
# Frontend
cd frontend && npm run dev

# Backend
cd ../backend && npm run dev
```

フロントエンドは `http://localhost:3000`、バックエンドは `http://localhost:3001` で起動します。
