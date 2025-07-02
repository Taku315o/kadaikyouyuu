import { Request, Response } from 'express';
import { uploadToStorage, isValidImageType, isValidFileSize } from '../services/uploadService';

// ファイルアップロードのコントローラー
export const uploadController = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const user = req.user;

    if (!file) {
      return res.status(400).json({ error: 'ファイルがアップロードされていません' });
    }

    if (!user) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    // ファイル形式とサイズのバリデーション
    if (!isValidImageType(file.mimetype)) {
      return res.status(400).json({ error: '無効なファイル形式です（png/jpgのみ）' });
    }
    if (!isValidFileSize(file.size)) {
      return res.status(400).json({ error: 'ファイルサイズが大きすぎます（5MBまで）' });
    }

    // Storageにアップロードして公開URLを取得
    const imageUrl = await uploadToStorage(file, user.id);

    res.status(200).json({ url: imageUrl });
  } catch (error: any) {
    console.error('アップロードコントローラーエラー:', error);
    res.status(500).json({ error: error.message || 'アップロード処理でエラーが発生しました' });
  }
};