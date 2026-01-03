import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { Router, Route, Link } from "wouter";
import { trpc } from "./lib/trpc";
import HomeSimple from "./pages/HomeSimple";
import MenuSimple from "./pages/MenuSimple";
import "./index.css";

console.log('[Step 3] Starting app with routing...');

// 创建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
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

function Step3App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 */}
      <nav style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
      }}>
        <Link href="/">
          <a style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '18px'
          }}>
            🍵 CHU TEA
          </a>
        </Link>
        
        <div style={{ flex: 1, display: 'flex', gap: '16px' }}>
          <Link href="/">
            <a style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              transition: 'background 0.2s'
            }}>
              首页
            </a>
          </Link>
          
          <Link href="/menu">
            <a style={{
              color: 'white',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              transition: 'background 0.2s'
            }}>
              菜单
            </a>
          </Link>
        </div>
      </nav>
      
      {/* 主内容区 */}
      <main style={{ flex: 1, background: '#f9fafb' }}>
        <Router>
          <Route path="/" component={HomeSimple} />
          <Route path="/menu" component={MenuSimple} />
          <Route path="/:rest*">
            {() => (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>404</h1>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>页面未找到</p>
                <Link href="/">
                  <a style={{
                    color: '#f59e0b',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    返回首页
                  </a>
                </Link>
              </div>
            )}
          </Route>
        </Router>
      </main>
      
      {/* 底部状态栏 */}
      <div style={{
        background: '#e0f2fe',
        padding: '16px 20px',
        textAlign: 'center',
        color: '#075985',
        fontSize: '14px'
      }}>
        ✅ 步骤 3：路由系统已集成 | wouter 路由正常工作
      </div>
    </div>
  );
}

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('[Step 3] Root element found');
  console.log('[Step 3] Creating React root...');
  
  const root = createRoot(rootElement);
  
  console.log('[Step 3] Rendering app with routing...');
  
  root.render(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Step3App />
      </QueryClientProvider>
    </trpc.Provider>
  );
  
  console.log('[Step 3] ✅ App rendered successfully!');
  
} catch (error) {
  console.error('[Step 3] ❌ Error:', error);
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #ef4444; font-size: 32px; margin-bottom: 20px;">❌ 步骤 3 失败</h1>
        <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="font-size: 20px; margin-bottom: 10px;">错误信息：</h2>
          <pre style="background: white; padding: 15px; border-radius: 8px; overflow: auto; font-size: 14px;">${error instanceof Error ? error.message : String(error)}

${error instanceof Error && error.stack ? error.stack : ''}</pre>
        </div>
        <p>路由集成失败。请检查浏览器控制台获取更多详细信息。</p>
      </div>
    `;
  }
}
