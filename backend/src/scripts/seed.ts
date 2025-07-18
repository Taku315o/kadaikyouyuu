// backend/src/scripts/seed.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' }); // .env.developmentファイルを読み込み

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // バックエンドなのでサービスキーを使う
);

async function main() {
  // 1. まずテスト用ユーザーを作成
  console.log('テスト用ユーザーを作成中...');
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'test@example.com',
    password: 'password123',
    email_confirm: true // メール確認をスキップ
  });

  if (authError) {
    console.error('ユーザー作成エラー:', authError);
    return;
  }

  const userId = authData.user.id;
  console.log('ユーザー作成成功! ID:', userId);

  // 2. 作成したユーザーIDで課題データを投入
  console.log('課題データを投入中...');
  const assignments = [
    { title: '微積分の課題1', description: '教科書p.30の問1-5', user_id: userId },
    { title: '線形代数のレポート', description: '行列式に関する考察', user_id: userId },
    { title: 'プログラミング演習', description: '再帰関数についての課題', user_id: userId },
  ];

  const { data, error } = await supabase.from('assignments').insert(assignments);

  if (error) {
    console.error('データ投入エラー:', error);
  } else {
    console.log('データ投入成功:', data);
    console.log('シードデータの投入が完了しました！');
  }
}

main();