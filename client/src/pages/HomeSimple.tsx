import { trpc } from "../lib/trpc";

export default function HomeSimple() {
  const storesQuery = trpc.store.list.useQuery();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#f59e0b' }}>
        🍵 CHU TEA 首页
      </h1>
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>欢迎来到 CHU TEA</h2>
        <p>俄罗斯最受欢迎的茶饮品牌</p>
      </div>
      
      <div style={{ 
        background: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '12px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>门店列表</h3>
        {storesQuery.isLoading && <p>加载中...</p>}
        {storesQuery.error && <p style={{ color: '#ef4444' }}>加载失败</p>}
        {storesQuery.data && (
          <p style={{ color: '#059669' }}>
            找到 {storesQuery.data.length} 个门店
          </p>
        )}
      </div>
    </div>
  );
}
