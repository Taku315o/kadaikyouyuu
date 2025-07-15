import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
//トップページの上部に表示される、アプリケーションの概要を説明するためのヒーロー（メインビジュアル）コンポーネントです。
export default function Hero() {
  const { user, signInWithGoogle } = useAuth();
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 rounded-lg shadow-lg mb-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">課題を共有して学びを深めよう</h2>
        <p className="mb-8 text-lg">StudyShareは大学の課題をみんなで共有し合うためのプラットフォームです。</p>
        {user ? (
          <Link href="/assignments/new" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-md">
            課題を投稿
          </Link>
        ) : (
          <button onClick={() => signInWithGoogle()} className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-md">
            Googleでログイン
          </button>
        )}
      </div>
    </section>
  );
}
