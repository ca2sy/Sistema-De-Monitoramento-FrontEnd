function ChecklistItem({ item, etapaAtiva, onMarcar }) {
  const subEtapa = item.subEtapa || {}
  
  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: "8px",
        padding: "5px 8px", borderRadius: "4px", cursor: "pointer",
        fontSize: "0.79rem",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--cinza-50)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      onClick={() => onMarcar(item.subEtapaId || item.id, !item.concluido)}
    >
      <input
        type="checkbox"
        checked={item.concluido}
        onChange={e => e.stopPropagation()}
        style={{
          marginTop: "2px", accentColor: "var(--verde-claro)",
          width: "14px", height: "14px", cursor: "pointer", flexShrink: 0
        }}
      />
      <span style={{
        textDecoration: item.concluido ? "line-through" : "none",
        color: item.concluido ? "var(--cinza-500)" : "var(--cinza-900)"
      }}>
         {item.subEtapa?.descricao}
      </span>
    </div>
  )
}

export default ChecklistItem