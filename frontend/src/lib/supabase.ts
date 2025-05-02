import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'student' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'student' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      search_assignments: {
        Args: { search_query: string };
        Returns: Array<{
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          user_id: string;
          created_at: string;
        }>;
      };
    };
  };
};

// クライアントサイドでのsupabaseインスタンス作成
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return supabase;
};

// クライアントインスタンス（シングルトン）
const supabase = createSupabaseClient();
export default supabase;