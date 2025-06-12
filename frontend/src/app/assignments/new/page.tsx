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
      <header className="mb-8">
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          ← 戻る
        </Link>
        <h1 className="text-2xl font-bold mt-4">新しい課題を投稿</h1>
      </header>

      <main>
        <div className="max-w-2xl mx-auto">
          <AssignmentForm />
        </div>
      </main>
    </div>
  );
}