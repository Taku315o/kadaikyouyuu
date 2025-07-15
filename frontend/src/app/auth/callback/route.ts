//Supabaseを使ったGoogle OAuth認証後、リダイレクトされるコールバック処理を行うAPIルート。
// URLに含まれる認証コードをSupabaseに送り、ユーザーセッション（ログイン状態）を確立します。処理完了後、ユーザーをトップページにリダイレクトさせます。


import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';
//Supabaseが返してきたcodeを使ってセッションを作成
//codeなどのクエリを取り除いたうえでトップページにリダイレクト
// Supabase認証コールバック処理
export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/';
  redirectUrl.searchParams.delete('code');
  redirectUrl.searchParams.delete('error');
  redirectUrl.searchParams.delete('error_description');

  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    if (code) {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('セッション交換エラー:', error);
        redirectUrl.searchParams.set('error', 'auth_error');
        return NextResponse.redirect(redirectUrl);
      }

      // セッションが正常に設定されたことを確認
      if (data.session) {
        console.log('セッション正常に設定されました:', data.session.user.id);
      }
    }
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('認証コールバックエラー:', error);
    redirectUrl.searchParams.set('error', 'callback_error');
    return NextResponse.redirect(redirectUrl);
  }
}