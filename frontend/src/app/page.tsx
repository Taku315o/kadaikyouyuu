'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AssignmentList from '@/components/AssignmentList';
import SearchForm from '@/components/SearchForm';

export default function HomePage() {
  const { user, isLoading, signInWithGoogle, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">StudyShare</h1>
        <div>
          {isLoading ? (
            <div>読み込み中...</div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/assignments/new" 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                課題を投稿
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-800"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Googleでログイン
            </button>
          )}
        </div>
      </header>

      <main>
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">課題を検索</h2>
          <SearchForm onSearch={handleSearch} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery ? `"${searchQuery}" の検索結果` : '最近の課題'}
          </h2>
          <AssignmentList query={searchQuery} />
        </div>
      </main>
    </div>
  );
}