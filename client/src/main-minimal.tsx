import { createRoot } from "react-dom/client";
import "./index.css";

console.log('[Minimal App] Step 1: Starting minimal React app...');

function MinimalApp() {
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
          ✅ 步骤 1：最小化应用
        </h2>
        <p style={{ color: '#78350f', lineHeight: '1.6' }}>
          React 应用已成功加载！这是一个最小化的入口点，没有任何复杂的依赖。
        </p>
      </div>
      
      <div style={{
        background: '#f3f4f6',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>系统信息</h3>
        <ul style={{ lineHeight: '2', listStyle: 'none', padding: 0 }}>
          <li>✓ React 19.x</li>
          <li>✓ TypeScript</li>
          <li>✓ Vite 7.x</li>
          <li>✓ TailwindCSS</li>
        </ul>
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
          接下来将逐步添加：tRPC → 路由 → 主题 → Telegram SDK → 完整功能
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
  
  console.log('[Minimal App] Root element found');
  console.log('[Minimal App] Creating React root...');
  
  const root = createRoot(rootElement);
  
  console.log('[Minimal App] Rendering app...');
  
  root.render(<MinimalApp />);
  
  console.log('[Minimal App] ✅ App rendered successfully!');
  
} catch (error) {
  console.error('[Minimal App] ❌ Error:', error);
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #ef4444; font-size: 32px; margin-bottom: 20px;">❌ 应用启动失败</h1>
        <pre style="background: #fee2e2; padding: 20px; border-radius: 12px; overflow: auto;">${error}</pre>
      </div>
    `;
  }
}
