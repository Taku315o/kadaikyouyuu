'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AssignmentForm from '@/components/AssignmentForm';

export default function NewAssignmentPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 未ログインならトップページにリダイレクト
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">読み込み中...</div>;
  }

  if (!user) {
    return null; // リダイレクト中は何も表示しない
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg shadow flex items-center justify-between">
        <Link href="/" className="hover:underline">
          ← 戻る
        </Link>
        <h1 className="text-2xl font-bold">新しい課題を投稿</h1>
      </header>

      <main>
        <div className="max-w-2xl mx-auto">
          <AssignmentForm />
        </div>
      </main>
    </div>
  );
}