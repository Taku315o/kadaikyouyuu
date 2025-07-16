// backend/src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './lib/supabase';
// 新しく作るassignmentsルーターをインポート
import assignmentRoutes from './routes/assignments'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

// ルートを定義
app.get('/', (req, res) => {
  res.send('🚀 Hello from Express + TypeScript!');
});

// '/api' パスにルーターを適用
app.use('/api', assignmentRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});