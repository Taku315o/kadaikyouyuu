import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImage, createAssignment, setAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type FormData = {
  title: string;
  description: string;
};

export default function AssignmentForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { getAccessToken } = useAuth();
  const router = useRouter();

  // 画像プレビュー表示
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // ファイル形式チェック
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('JPEGまたはPNG形式の画像のみアップロード可能です');
        return;
      }
      
      // ファイルサイズチェック (5MB以下)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('ファイルサイズは5MB以下にしてください');
        return;
      }
      
      setImage(file);
      
      // プレビュー表示
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  // 投稿処理
  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);
      
      // 認証トークン取得
      const token = await getAccessToken();
      if (!token) {
        toast.error('ログインが必要です');
        router.push('/auth/login');
        return;
      }
      
      // トークンをセット
      setAuthToken(token);
      
      let imageUrl = null;
      
      // 画像アップロード
      if (image) {
        const uploadResult = await uploadImage(image);
        imageUrl = uploadResult.url;
      }
      
      // 課題投稿
      await createAssignment({
        title: data.title,
        description: data.description,
        image_url: imageUrl ?? undefined,
      });
      
      toast.success('課題を投稿しました');
      reset();
      setImage(null);
      setImagePreview(null);
      
      // トップページにリダイレクト
      router.push('/');
    } catch (error) {
      console.error('投稿エラー:', error);
      toast.error('投稿に失敗しました');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: '必須項目です' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description', { required: '必須項目です' })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          画像（任意）
        </label>
        <input
          id="image"
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {imagePreview && (
          <div className="mt-2">
            <Image src={imagePreview} alt="Preview" width={160} height={160} className="h-40 w-auto object-cover rounded" />
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {uploading ? '投稿中...' : '投稿する'}
        </button>
      </div>
    </form>
  );
}