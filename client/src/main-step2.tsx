import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpc } from "./lib/trpc";
import "./index.css";

console.log('[Step 2] Starting app with tRPC integration...');

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

function Step2App() {
  // 测试 tRPC 调用
  const storesQuery = trpc.store.list.useQuery();
  
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#f59e0b',
        fontSize: '36px',
        marginBottom: '20px',
        fontWeight: '700'
      }}>
        🍵 CHU TEA Mini App
      </h1>
      
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#92400e' }}>
          ✅ 步骤 2：tRPC 集成
        </h2>
        <p style={{ color: '#78350f', lineHeight: '1.6' }}>
          tRPC 客户端已成功初始化，可以与后端 API 通信了！
        </p>
      </div>
      
      <div style={{
        background: '#f3f4f6',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>API 测试</h3>
        
        {storesQuery.isLoading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            ⏳ 加载门店列表...
          </div>
        )}
        
        {storesQuery.error && (
          <div style={{ 
            padding: '20px', 
            background: '#fee2e2', 
            borderRadius: '8px',
            color: '#991b1b'
          }}>
            ❌ 错误: {storesQuery.error.message}
          </div>
        )}
        
        {storesQuery.data && (
          <div>
            <p style={{ marginBottom: '12px', color: '#059669', fontWeight: '600' }}>
              ✓ 成功获取 {storesQuery.data.length} 个门店
            </p>
            <ul style={{ lineHeight: '2', listStyle: 'none', padding: 0 }}>
              {storesQuery.data.slice(0, 3).map((store: any) => (
                <li key={store.id} style={{ 
                  padding: '8px 12px',
                  background: 'white',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  📍 {store.name}
                </li>
              ))}
              {storesQuery.data.length > 3 && (
                <li style={{ color: '#6b7280', padding: '8px 12px' }}>
                  ... 还有 {storesQuery.data.length - 3} 个门店
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <div style={{
        background: '#e0f2fe',
        padding: '24px',
        borderRadius: '16px'
      }}>
        <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#075985' }}>
          下一步
        </h3>
        <p style={{ color: '#0c4a6e', lineHeight: '1.6' }}>
          接下来将添加：路由系统 → 主题 → Telegram SDK → 完整功能页面
        </p>
      </div>
    </div>
  );
}

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('[Step 2] Root element found');
  console.log('[Step 2] Creating React root...');
  
  const root = createRoot(rootElement);
  
  console.log('[Step 2] Rendering app with tRPC...');
  
  root.render(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Step2App />
      </QueryClientProvider>
    </trpc.Provider>
  );
  
  console.log('[Step 2] ✅ App rendered successfully!');
  
} catch (error) {
  console.error('[Step 2] ❌ Error:', error);
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #ef4444; font-size: 32px; margin-bottom: 20px;">❌ 步骤 2 失败</h1>
        <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="font-size: 20px; margin-bottom: 10px;">错误信息：</h2>
          <pre style="background: white; padding: 15px; border-radius: 8px; overflow: auto; font-size: 14px;">${error instanceof Error ? error.message : String(error)}

${error instanceof Error && error.stack ? error.stack : ''}</pre>
        </div>
        <p>tRPC 集成失败。请检查浏览器控制台获取更多详细信息。</p>
      </div>
    `;
  }
}
