# StudyShare

大学生のための課題共有アプリケーション。  
ユーザーはGoogleログインを使ってサインインし、課題の回答（テキスト＋画像）を投稿・閲覧・検索することができます。

---

##  技術スタック

| 層 | 技術 |
|----|------|
| フロントエンド | Next.js (App Router) |
| バックエンド | Node.js + Express |
| 認証 | Supabase Auth (Google OAuth) |
| データベース | Supabase PostgreSQL |
| ストレージ | Supabase Storage |

---

##  プロジェクト構成

```bash
studyshare/
├── frontend/   # Next.js アプリケーション
├── backend/    # Express API サーバー
├── package.json  # ワークスペース定義（npm workspaces）
├── .gitignore
└── README.md
