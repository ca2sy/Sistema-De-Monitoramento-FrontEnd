import { useState } from "react"
import ModalDetalhes from "../modais/ModalDetalhes"

const statusConfig = {
  "Em dia":   { cor: "#2E7D32", bg: "#E8F5E9", borda: "#1B5E20" },
  "Atenção":  { cor: "#E65100", bg: "#FFF8E1", borda: "#F9A825" },
  "Atrasado": { cor: "#B71C1C", bg: "#FFEBEE", borda: "#B71C1C" },
}

function KanbanCard({ aquisicao, etapas, onAtualizar }) {
  const [modalAberto, setModalAberto] = useState(false)

  const totalItens = aquisicao.aquisicaoChecklists?.length || 0
  const itensConcluidos = aquisicao.aquisicaoChecklists?.filter(i => i.concluido).length || 0
  const porcentagem = totalItens === 0 ? 0 : Math.round((itensConcluidos / totalItens) * 100)

  const status = statusConfig[aquisicao.statusAquisicao?.nome] || { cor: "#9E9E9E", bg: "#F5F5F5", borda: "#9E9E9E" }

  const hoje = new Date()
  const limite = new Date(aquisicao.dataLimite)
  const atrasado = limite < hoje && aquisicao.statusAquisicao?.nome === "Atrasado"

  return (
    <>
      <div
        className="card"
        onClick={() => setModalAberto(true)}
        style={{
          borderLeftColor: status.borda,
          opacity: aquisicao.cancelado ? 0.6 : 1
        }}
      >
        <div className="card-code">
          <span>{aquisicao.codigo}</span>
          <span style={{
            fontSize: "0.66rem", fontWeight: "700", padding: "2px 7px",
            borderRadius: "3px", background: status.bg, color: status.cor,
            border: `1px solid ${status.bg}`
          }}>
            {aquisicao.cancelado ? "CANCELADO" : aquisicao.statusAquisicao?.nome}
          </span>
        </div>

        <div className="card-title">{aquisicao.descricaoObjetoNome}</div>

        <div className="card-meta">
          {aquisicao.metodoAquisicao && (
            <span className="meta-chip">📋 {aquisicao.metodoAquisicao.nome}</span>
          )}
          {aquisicao.responsavel && (
            <span className="meta-chip">👤 {aquisicao.responsavel}</span>
          )}
          {aquisicao.valorEstimado && (
            <span className="meta-chip">💵 USD {Number(aquisicao.valorEstimado).toLocaleString("pt-BR")}</span>
          )}
          {aquisicao.projeto && (
            <span className="meta-chip">📁 {aquisicao.projeto.nome}</span>
          )}
        </div>

        <div className="progress-label">
          <span>Progresso</span>
          <span style={{ fontWeight: "700", color: porcentagem === 100 ? "#2E7D32" : "inherit" }}>
            {itensConcluidos}/{totalItens} — {porcentagem}%
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${porcentagem}%`,
            background: porcentagem === 100 ? "#2E7D32" : porcentagem > 50 ? "#F9A825" : status.borda
          }} />
        </div>

        <div className="card-footer">
          <span className={`deadline ${atrasado ? "late" : ""}`}>
            📅 {limite.toLocaleDateString("pt-BR")}
          </span>
          {aquisicao.secretaria && (
            <span style={{ fontSize: "0.66rem", color: "#757575" }}>{aquisicao.secretaria.nome}</span>
          )}
        </div>
      </div>

      {modalAberto && (
        <ModalDetalhes
          aquisicao={aquisicao}
          etapas={etapas}
          onFechar={() => setModalAberto(false)}
          onAtualizar={onAtualizar}
          onExcluir={() => { onAtualizar(); setModalAberto(false) }}
        />
      )}
    </>
  )
}

export default KanbanCard