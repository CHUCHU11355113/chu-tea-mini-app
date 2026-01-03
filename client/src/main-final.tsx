import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import superjson from "superjson";
import { Router, Route, Link, useLocation } from "wouter";
import { trpc } from "./lib/trpc";
import { UNAUTHED_ERR_MSG } from "../../shared/const";
import { getLoginUrl } from "./const";
import "./index.css";
import "./lib/i18n"; // 初始化 i18n

console.log('[Final App] Starting CHU TEA Mini App...');

// 初始化 Telegram SDK (如果在 Telegram 环境中)
if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
  const tg = (window as any).Telegram.WebApp;
  console.log('[Telegram] Telegram WebApp detected');
  tg.ready();
  tg.expand();
  
  // 应用 Telegram 主题
  const themeParams = tg.themeParams;
  if (themeParams.bg_color) {
    document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
  }
  if (themeParams.text_color) {
    document.documentElement.style.setProperty('--tg-theme-text-color', themeParams.text_color);
  }
}

// 处理未授权错误，重定向到登录页
const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (error instanceof TRPCClientError && error.message === UNAUTHED_ERR_MSG) {
    console.log('[Auth] Unauthorized, redirecting to login...');
    window.location.href = getLoginUrl();
  }
};

// 创建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        redirectToLoginIfUnauthorized(error);
        return failureCount < 1;
      },
    },
    mutations: {
      onError: redirectToLoginIfUnauthorized,
    },
  },
});

// 创建 tRPC 客户端
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
    }),
  ],
});

// 简单的首页组件
function HomePage() {
  const storesQuery = trpc.store.list.useQuery();
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '40px',
        borderRadius: '20px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <h1 style={{ 
          fontSize: '42px', 
          marginBottom: '16px', 
          color: '#92400e',
          fontWeight: '700'
        }}>
          🍵 欢迎来到 CHU TEA
        </h1>
        <p style={{ fontSize: '18px', color: '#78350f', lineHeight: '1.6' }}>
          俄罗斯最受欢迎的茶饮品牌 | Самый популярный чайный бренд в России
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <Link href="/menu">
          <a style={{
            display: 'block',
            background: '#f59e0b',
            color: 'white',
            padding: '30px',
            borderRadius: '16px',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
            <h3 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '600' }}>菜单</h3>
            <p style={{ opacity: 0.9 }}>浏览我们的茶饮菜单</p>
          </a>
        </Link>
        
        <div style={{
          background: '#10b981',
          color: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📍</div>
          <h3 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '600' }}>门店</h3>
          <p style={{ opacity: 0.9 }}>
            {storesQuery.isLoading && '加载中...'}
            {storesQuery.error && '加载失败'}
            {storesQuery.data && `${storesQuery.data.length} 个门店`}
          </p>
        </div>
      </div>
      
      <div style={{
        background: '#e0f2fe',
        padding: '24px',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#075985', fontSize: '14px' }}>
          ✅ 完整版应用 | React + tRPC + 路由 + Telegram SDK
        </p>
      </div>
    </div>
  );
}

// 菜单页面组件
function MenuPage() {
  const productsQuery = trpc.product.list.useQuery({ 
    page: 1, 
    pageSize: 20 
  });
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '36px', 
        marginBottom: '24px', 
        color: '#f59e0b',
        fontWeight: '700'
      }}>
        📋 菜单
      </h1>
      
      {productsQuery.isLoading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          ⏳ 加载菜单中...
        </div>
      )}
      
      {productsQuery.error && (
        <div style={{
          background: '#fee2e2',
          padding: '24px',
          borderRadius: '12px',
          color: '#991b1b'
        }}>
          ❌ 加载失败: {productsQuery.error.message}
        </div>
      )}
      
      {productsQuery.data && productsQuery.data.items.length === 0 && (
        <div style={{
          background: '#fef3c7',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧋</div>
          <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#92400e' }}>
            暂无产品
          </h3>
          <p style={{ color: '#78350f' }}>
            请在后台管理系统中添加产品
          </p>
        </div>
      )}
      
      {productsQuery.data && productsQuery.data.items.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {productsQuery.data.items.map((product: any) => (
            <div key={product.id} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
            }}>
              {product.imageUrl && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: `url(${product.imageUrl}) center/cover`,
                  backgroundColor: '#f3f4f6'
                }} />
              )}
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  marginBottom: '8px',
                  color: '#1f2937',
                  fontWeight: '600'
                }}>
                  {product.nameZh || product.nameRu || product.nameEn}
                </h3>
                <p style={{ 
                  fontSize: '24px', 
                  color: '#f59e0b',
                  fontWeight: '700'
                }}>
                  ¥{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 404 页面
function NotFoundPage() {
  return (
    <div style={{ 
      padding: '60px 20px', 
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>404</h1>
      <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '30px' }}>
        页面未找到
      </p>
      <Link href="/">
        <a style={{
          display: 'inline-block',
          background: '#f59e0b',
          color: 'white',
          padding: '12px 32px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px'
        }}>
          返回首页
        </a>
      </Link>
    </div>
  );
}

// 主应用组件
function FinalApp() {
  const [location] = useLocation();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#f9fafb'
    }}>
      {/* 顶部导航栏 */}
      <nav style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        padding: '16px 24px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Link href="/">
            <a style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🍵 CHU TEA
            </a>
          </Link>
          
          <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
            <Link href="/">
              <a style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: '10px',
                background: location === '/' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}>
                首页
              </a>
            </Link>
            
            <Link href="/menu">
              <a style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: '10px',
                background: location === '/menu' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}>
                菜单
              </a>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* 主内容区 */}
      <main style={{ flex: 1, paddingTop: '20px', paddingBottom: '20px' }}>
        <Router>
          <Route path="/" component={HomePage} />
          <Route path="/menu" component={MenuPage} />
          <Route path="/:rest*" component={NotFoundPage} />
        </Router>
      </main>
    </div>
  );
}

// 启动应用
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('[Final App] Root element found');
  console.log('[Final App] Creating React root...');
  
  const root = createRoot(rootElement);
  
  console.log('[Final App] Rendering final app...');
  
  root.render(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <FinalApp />
      </QueryClientProvider>
    </trpc.Provider>
  );
  
  console.log('[Final App] ✅ App rendered successfully!');
  
} catch (error) {
  console.error('[Final App] ❌ Error:', error);
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #ef4444; font-size: 32px; margin-bottom: 20px;">❌ 应用启动失败</h1>
        <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="font-size: 20px; margin-bottom: 10px;">错误信息：</h2>
          <pre style="background: white; padding: 15px; border-radius: 8px; overflow: auto; font-size: 14px;">${error instanceof Error ? error.message : String(error)}

${error instanceof Error && error.stack ? error.stack : ''}</pre>
        </div>
        <p>请检查浏览器控制台获取更多详细信息。</p>
      </div>
    `;
  }
}
