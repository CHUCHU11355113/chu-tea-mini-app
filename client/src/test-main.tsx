import { createRoot } from "react-dom/client";
import "./index.css";

console.log('[Test App] Starting...');

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('[Test App] Root element found, creating React root...');
  
  const root = createRoot(rootElement);
  
  console.log('[Test App] Rendering test component...');
  
  root.render(
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#f59e0b',
        fontSize: '32px',
        marginBottom: '20px'
      }}>
        🎉 CHU TEA Mini App
      </h1>
      
      <div style={{
        background: '#f3f4f6',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>✅ 测试成功！</h2>
        <p>React 应用已成功加载和渲染。</p>
      </div>
      
      <div style={{
        background: '#e0f2fe',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>系统信息</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✓ React 19.x</li>
          <li>✓ Vite 7.x</li>
          <li>✓ TypeScript</li>
          <li>✓ TailwindCSS</li>
        </ul>
      </div>
      
      <div style={{
        background: '#fef3c7',
        padding: '20px',
        borderRadius: '12px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>下一步</h3>
        <p>基础测试通过后，将加载完整的应用程序。</p>
      </div>
    </div>
  );
  
  console.log('[Test App] Rendered successfully!');
  
} catch (error) {
  console.error('[Test App] Error:', error);
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #ef4444; font-size: 32px; margin-bottom: 20px;">❌ 应用启动失败</h1>
        <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="font-size: 20px; margin-bottom: 10px;">错误信息：</h2>
          <pre style="background: white; padding: 15px; border-radius: 8px; overflow: auto;">${error}</pre>
        </div>
        <p>请检查浏览器控制台获取更多详细信息。</p>
      </div>
    `;
  }
}
