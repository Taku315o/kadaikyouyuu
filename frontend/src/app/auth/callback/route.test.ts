import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase';

// Next.jsのモジュールをモック化
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        redirect: jest.fn(() => ({ 
            redirect: true,
            url: '/',
        })),
    },
}));

// Supabaseクライアントをモック化
jest.mock('@/lib/supabase', () => ({
    createSupabaseClient: jest.fn(),
}));

const mockCreateSupabaseClient = createSupabaseClient as jest.MockedFunction<typeof createSupabaseClient>;
const mockExchangeCodeForSession = jest.fn();
const mockRedirect = NextResponse.redirect as jest.MockedFunction<typeof NextResponse.redirect>;

// console.errorをモック化してテスト出力をクリーンにする
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

beforeEach(() => {
    jest.clearAllMocks();
    mockCreateSupabaseClient.mockReturnValue({
        auth: {
            exchangeCodeForSession: mockExchangeCodeForSession,
        },
    } as unknown as ReturnType<typeof createSupabaseClient>);
});

afterAll(() => {
    consoleSpy.mockRestore();
});

function createMockRequest(url: string): NextRequest {
    const mockUrl = new URL(url);
    return {
        url,
        nextUrl: {
            clone: () => ({
                pathname: '/',
                searchParams: {
                    delete: jest.fn(),
                },
                toString: () => mockUrl.origin + '/',
            }),
        },
    } as unknown as NextRequest;
}

// テストファイルの後でGET関数をインポート
import { GET } from './route';

describe('GET', () => {
    it('should exchange code and redirect to root', async () => {
        const code = 'test-code';
        const url = `https://example.com/auth/callback?code=${code}`;
        const request = createMockRequest(url);

        await GET(request);

        expect(mockCreateSupabaseClient).toHaveBeenCalled();
        expect(mockExchangeCodeForSession).toHaveBeenCalledWith(code);
        expect(mockRedirect).toHaveBeenCalled();
    });

    it('should redirect to root if no code is present', async () => {
        const url = `https://example.com/auth/callback`;
        const request = createMockRequest(url);

        await GET(request);

        expect(mockCreateSupabaseClient).not.toHaveBeenCalled();
        expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
        expect(mockRedirect).toHaveBeenCalled();
    });

    it('should handle errors and redirect', async () => {
        mockExchangeCodeForSession.mockImplementationOnce(() => {
            throw new Error('test error');
        });
        const code = 'test-code';
        const url = `https://example.com/auth/callback?code=${code}`;
        const request = createMockRequest(url);

        await GET(request);

        expect(consoleSpy).toHaveBeenCalledWith('認証コールバックエラー:', expect.any(Error));
        expect(mockRedirect).toHaveBeenCalled();
    });
});
