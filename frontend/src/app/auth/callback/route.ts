import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';

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
      await supabase.auth.exchangeCodeForSession(code);
    }
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('認証コールバックエラー:', error);
    return NextResponse.redirect(redirectUrl);
  }
}