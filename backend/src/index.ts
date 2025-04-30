// ① 必要なライブラリをインポート
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// ② 環境変数を使えるようにする（.env ファイルを読み込む）
dotenv.config()

// ③ Supabase クライアントを作成（必要ならここに書く、または外部ファイル化）
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ④ Express アプリの初期化
const app = express()

// ⑤ ポート番号の指定（.env に PORT がなければ 3001）
const PORT = process.env.PORT || 3001

// ⑥ ミドルウェア設定（CORS & JSON パース）
app.use(cors()) // フロント（Next.js）との連携用
app.use(express.json()) // JSON リクエストの読み取りを可能にする

// ⑦ 動作確認用のルート（GET / にアクセスするとメッセージが返る）
app.get('/', (req, res) => {
  res.send('🚀 Hello from Express + TypeScript!')
})

// ⑧ サーバー起動
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
