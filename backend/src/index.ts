// ① 必要なライブラリをインポート
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
// Supabase クライアントをインポート
import supabase from './lib/supabase'

// ② 環境変数を使えるようにする（.env ファイルを読み込む）
dotenv.config()


// ④ Express アプリの初期化
// ここで Express アプリを初期化します
const app = express()

// ⑤ ポート番号の指定（.env に PORT がなければ 3001）
const PORT = process.env.PORT || 3001

// ⑥ ミドルウェア設定（CORS & JSON パース）
// CORS を有効にする（フロントエンドとバックエンドの通信を許可）
app.use(cors()) // フロント（Next.js）との連携用
app.use(express.json()) // JSON リクエストの読み取りを可能にする

// ⑦ 動作確認用のルート（GET / にアクセスするとメッセージが返る）
// ルートを定義します
app.get('/', (req, res) => {
  res.send('🚀 Hello from Express + TypeScript!')
})

// ⑧ サーバー起動

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
