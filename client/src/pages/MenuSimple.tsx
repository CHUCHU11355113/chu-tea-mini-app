export default function MenuSimple() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px', color: '#f59e0b' }}>
        📋 菜单
      </h1>
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>🧋 经典奶茶</h3>
        <p style={{ color: '#78350f' }}>¥25</p>
      </div>
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '20px', 
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>🍓 草莓奶茶</h3>
        <p style={{ color: '#78350f' }}>¥28</p>
      </div>
      
      <div style={{ 
        background: '#fef3c7', 
        padding: '20px', 
        borderRadius: '12px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>🥭 芒果奶茶</h3>
        <p style={{ color: '#78350f' }}>¥30</p>
      </div>
    </div>
  );
}
