import { useState } from "react"
import ChecklistItem from "./ChecklistItem"

function ChecklistEtapa({ etapa, itens, etapaAtualId, onMarcar }) {
  const [aberta, setAberta] = useState(true)
  
  const concluidos = itens?.filter(i => i.concluido).length || 0
  const total = itens?.length || 0
  const porcentagem = total === 0 ? 0 : Math.round((concluidos / total) * 100)
  const etapaAtiva = etapa.id === etapaAtualId
  const todasConcluidas = concluidos === total && total > 0

  if (!itens || itens.length === 0) return null

  return (
    <div style={{ marginBottom: "12px", border: "1px solid var(--cinza-100)", borderRadius: "6px", overflow: "hidden" }}>
      <div
        onClick={() => setAberta(a => !a)}
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "8px 12px", cursor: "pointer",
          background: etapaAtiva ? "#D9E1F2" : todasConcluidas ? "var(--verde-bg)" : "var(--cinza-100)",
          color: etapaAtiva ? "#1F3864" : todasConcluidas ? "var(--verde)" : "var(--cinza-700)",
          fontWeight: "700", fontSize: "0.75rem",
          userSelect: "none",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {todasConcluidas ? "✓" : etapaAtiva ? "▶" : "○"} {etapa.nome}
          {etapaAtiva && <span style={{ fontSize: "0.65rem", background: "#1F3864", color: "#fff", padding: "1px 6px", borderRadius: "10px" }}>etapa atual</span>}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{concluidos}/{total}</span>
          <span style={{ fontSize: "0.65rem" }}>{aberta ? "▲" : "▼"}</span>
        </span>
      </div>

      <div style={{ height: "3px", background: "var(--cinza-100)" }}>
        <div style={{
          height: "100%", width: `${porcentagem}%`,
          background: todasConcluidas ? "var(--verde-claro)" : etapaAtiva ? "#2E75B6" : "var(--cinza-300)",
          transition: "width 0.3s"
        }} />
      </div>

      {aberta && (
        <div style={{ padding: "6px 4px" }}>
          {itens.map(item => (
            <ChecklistItem
              key={item.subEtapaId || item.id}
              item={item}
              etapaAtiva={etapaAtiva}
              onMarcar={onMarcar}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ChecklistEtapa