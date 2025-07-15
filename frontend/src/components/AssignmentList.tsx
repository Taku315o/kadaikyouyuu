// studyshare/frontend/src/components/AssignmentList.tsx
// 課題一覧を表示し、検索や削除機能を提供するコンポーネント
//課題の一覧を表示するコンポーネント。
// 検索クエリ（query）が渡された場合は、その条件でSupabaseのDB関数を呼び出して検索結果を表示し、クエリがない場合は最近の課題を一覧表示。
// 管理者（admin）権限を持つユーザーには削除ボタンが表示されます。
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import supabase from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { deleteAssignment } from '@/lib/api';
import toast from 'react-hot-toast';

type Assignment = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  user_id: string;
  created_at: string;
  user?: {
    email: string;
  };
};

type AssignmentListProps = {
  query?: string;
};

export default function AssignmentList({ query }: AssignmentListProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, getAccessToken } = useAuth();

  // 課題一覧を取得する関数
  // useCallbackを使ってるのは、useEffectの無限ループを防ぐため！
  // 普通の関数だと再レンダリングのたびに新しい関数が作られちゃって、
  // useEffectが「あ、fetchAssignmentsが変わった！」って勘違いして
  // また実行 → 状態更新 → 再レンダリング → また実行... の無限ループになっちゃう
  // queryが変わった時だけ関数を作り直すようにしてるよ
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      
      if (query) {
        // 検索時はSupabaseの関数を使用
        const { data: searchData, error: searchError } = await supabase
          .rpc('search_assignments', { search_query: query });
          
        if (searchError) throw searchError;
        data = searchData;
      } else {
        // 通常の一覧表示
        const { data: assignData, error } = await supabase
          .from('assignments')
          .select(`
            *,
            user:user_id (
              email
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        data = assignData;
      }
      
      setAssignments(data || []);
    } catch (error) {
      console.error('課題取得エラー:', error);
      toast.error('課題の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [query]);

  // 削除処理
  const handleDelete = async (id: string) => {
    if (!window.confirm('本当にこの課題を削除しますか？')) return;
    
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('認証が必要です');
      
      await deleteAssignment(id);
      toast.success('課題を削除しました');
      // 一覧を更新
      fetchAssignments();
    } catch (error) {
      console.error('削除エラー:', error);
      toast.error('削除に失敗しました');
    }
  };

  // クエリが変わったらデータを再取得
  // ここでfetchAssignmentsを依存配列に入れてるから、上でuseCallbackが必要なんだよね
  // fetchAssignmentsがuseCallbackじゃないと、無限ループの原因になっちゃう
  useEffect(() => {
    fetchAssignments();
  }, [query, fetchAssignments]);

  if (loading) {
    return <div className="text-center p-8">読み込み中...</div>;
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center p-8">
        {query ? `"${query}" に一致する課題はありません` : '課題はまだ投稿されていません'}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="border rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow group">
          {assignment.image_url && (
            <div className="w-full h-48 overflow-hidden relative">
              <Image
                src={assignment.image_url}
                alt={assignment.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold">{assignment.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{assignment.description}</p>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>投稿者: {assignment.user?.email || '不明'}</span>
              <span>{new Date(assignment.created_at).toLocaleString('ja-JP')}</span>
            </div>
            
            {/* 管理者のみ削除ボタンを表示 */}
            {isAdmin && (
              <button
                onClick={() => handleDelete(assignment.id)}
                className="mt-3 px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900"
              >
                削除
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}