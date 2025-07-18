import { Request, Response, NextFunction } from 'express';
import supabase from '../lib/supabase';

// リクエストにユーザー情報を追加するための型拡張
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// 認証ミドルウェア
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: '認証トークンが必要です' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Supabaseで検証
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      res.status(401).json({ error: '無効なトークンです' });
      return;
    }
    
    // ユーザー情報を取得
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!userData) {
      res.status(404).json({ error: 'ユーザーが見つかりません' });
      return;
    }
    
    // リクエストにユーザー情報をセット
    req.user = {
      id: user.id,
      email: userData.email,
      role: userData.role
    };
    
    next();
  } catch (error) {
    console.error('認証エラー:', error);
    res.status(500).json({ error: '認証処理でエラーが発生しました' });
  }
};

// 管理者権限チェック
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ error: '認証が必要です' });
    return;
  }
  
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: '管理者権限が必要です' });
    return;
  }
  
  next();
};