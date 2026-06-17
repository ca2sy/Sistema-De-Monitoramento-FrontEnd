import { useState } from "react"
import { marcarChecklist, excluirAquisicao, cancelarAquisicao } from "../../services/api"
import { toast } from "react-toastify"
import ChecklistEtapa from "../checklist/ChecklistEtapa"
import ModalConfirmacao from "./ModalConfirmacao"

function ModalDetalhes({ aquisicao: aquisicaoInicial, etapas, onFechar, onAtualizar, onExcluir }) {
  const [aquisicao, setAquisicao] = useState(aquisicaoInicial)
  const [alteracoes, setAlteracoes] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmExcluir, setConfirmExcluir] = useState(false)
  const [confirmSair, setConfirmSair] = useState(false)
  const [confirmCancelar, setConfirmCancelar] = useState(false)
  const [justificativa, setJustificativa] = useState("")

  const handleMarcar = (subEtapaId, concluido) => {
    setAquisicao(prev => ({
      ...prev,
      aquisicaoChecklists: prev.aquisicaoChecklists.map(i =>
        i.subEtapaId === subEtapaId ? { ...i, concluido } : i
      )
    }))
    setAlteracoes(prev => ({ ...prev, [subEtapaId]: concluido }))
  }

  const tentarFechar = () => {
    if (Object.keys(alteracoes).length > 0) {
      setConfirmSair(true)
    } else {
      onFechar()
    }
  }

  const salvarEFechar = async () => {
    if (Object.keys(alteracoes).length === 0) { 
      onFechar() 
      return 
    }
    
    setSalvando(true)
    try {
      await Promise.all(
        Object.entries(alteracoes).map(([subEtapaId, concluido]) =>
          marcarChecklist(aquisicao.codigo, subEtapaId, concluido)
        )
      )
      toast.success("Checklist salvo!")
      onAtualizar()
      onFechar()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast.error("Erro ao salvar checklist — tente novamente")
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async () => {
    setConfirmExcluir(false)
    setLoading(true)
    try {
      await excluirAquisicao(aquisicao.codigo)
      toast.success("Aquisição excluída com sucesso")
      onExcluir()
    } catch {
      toast.error("Erro ao excluir aquisição")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = async () => {
    if (!justificativa.trim()) {
      toast.warning("Preencha a justificativa para cancelar")
      return
    }
    setConfirmCancelar(false)
    setLoading(true)
    try {
      await cancelarAquisicao(aquisicao.codigo, justificativa)
      toast.success("Aquisição cancelada")
      onExcluir()
    } catch {
      toast.error("Erro ao cancelar aquisição")
    } finally {
      setLoading(false)
    }
  }

  const statusCores = { "Em dia": "#22C55E", "Atenção": "#EAB308", "Atrasado": "#EF4444" }
  const cor = statusCores[aquisicao.statusAquisicao?.nome] || "#E5E7EB"
  const qtdAlteracoes = Object.keys(alteracoes).length

  const checklistsPorEtapa = aquisicao.aquisicaoChecklists?.reduce((acc, item) => {
    const etapaId = item.subEtapa?.etapaAquisicaoId || item.subEtapa?.etapaAquisicao?.id
    if (!acc[etapaId]) {
      acc[etapaId] = {
        etapa: item.subEtapa?.etapaAquisicao || { nome: "Etapa", id: etapaId },
        itens: []
      }
    }
    acc[etapaId].itens.push(item)
    return acc
  }, {}) || {}

  return (
    <>
      <div className="overlay" onClick={tentarFechar}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div>
              <div className="modal-title">{aquisicao.codigo} — {aquisicao.descricaoObjetoNome}</div>
              <div className="modal-subtitle">
                {aquisicao.tipoAquisicao?.nome} · {aquisicao.secretaria?.nome}
                {aquisicao.cancelado && (
                  <span style={{ marginLeft: "8px", background: "#FEE2E2", color: "#991B1B", padding: "1px 8px", borderRadius: "10px", fontSize: "0.72rem" }}>
                    CANCELADO
                  </span>
                )}
              </div>
            </div>
            <button className="modal-close" onClick={tentarFechar}>×</button>
          </div>

          <div className="modal-body">
            <div className="section-label">Dados da Aquisição</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "8px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--cinza-500)", fontWeight: "600", marginBottom: "3px" }}>PROJETO</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "500" }}>{aquisicao.projeto?.nome || "N/A"}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--cinza-500)", fontWeight: "600", marginBottom: "3px" }}>RESPONSÁVEL</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "500" }}>{aquisicao.responsavel}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--cinza-500)", fontWeight: "600", marginBottom: "3px" }}>VALOR ESTIMADO</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "500" }}>USD {Number(aquisicao.valorEstimado).toLocaleString("pt-BR")}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--cinza-500)", fontWeight: "600", marginBottom: "3px" }}>SECRETARIA</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "500" }}>{aquisicao.secretaria?.nome}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--cinza-500)", fontWeight: "600", marginBottom: "3px" }}>ETAPA ATUAL</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "500" }}>{aquisicao.etapaAquisicao?.nome}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--cinza-500)", fontWeight: "600", marginBottom: "3px" }}>DATA LIMITE</div>
                <div style={{ fontSize: "0.85rem", fontWeight: "500" }}>{new Date(aquisicao.dataLimite).toLocaleDateString("pt-BR")}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--cinza-500)", fontWeight: "600", marginBottom: "3px" }}>STATUS</div>
                <span style={{ fontSize: "0.78rem", fontWeight: "700", padding: "3px 10px", borderRadius: "5px", background: `${cor}22`, color: cor }}>
                  {aquisicao.statusAquisicao?.nome}
                </span>
              </div>
            </div>

            {aquisicao.cancelado && aquisicao.justificativaCancelamento && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: "6px", padding: "10px 14px", marginBottom: "12px" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#991B1B", marginBottom: "3px" }}>JUSTIFICATIVA DO CANCELAMENTO</div>
                <div style={{ fontSize: "0.84rem", color: "#7F1D1D" }}>{aquisicao.justificativaCancelamento}</div>
              </div>
            )}

            {!aquisicao.cancelado && (
              <>
                <div className="section-label">Checklist do Processo</div>
                {Object.values(checklistsPorEtapa).map(({ etapa, itens }) => (
                  <ChecklistEtapa
                    key={etapa.id}
                    etapa={etapa}
                    itens={itens}
                    etapaAtualId={aquisicao.etapaAquisicaoId}
                    onMarcar={handleMarcar}
                  />
                ))}
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setConfirmExcluir(true)}
              disabled={loading || salvando}
              style={{ marginRight: "auto" }}
            >
              🗑 Excluir
            </button>

            {!aquisicao.cancelado && (
              <button
                className="btn btn-sm"
                onClick={() => setConfirmCancelar(true)}
                disabled={loading || salvando}
                style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
              >
                ✕ Cancelar Aquisição
              </button>
            )}

            {qtdAlteracoes > 0 && (
              <span style={{ fontSize: "0.78rem", color: "var(--cinza-500)", alignSelf: "center" }}>
                {qtdAlteracoes} alteração(ões) não salva(s)
              </span>
            )}

            <button className="btn btn-outline-dark" onClick={tentarFechar} disabled={salvando}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={salvarEFechar} disabled={salvando}>
              {salvando ? "Salvando..." : qtdAlteracoes > 0 ? "💾 Salvar e Fechar" : "Fechar"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmar exclusão */}
      {confirmExcluir && (
        <ModalConfirmacao
          titulo="Excluir aquisição?"
          mensagem={`A aquisição ${aquisicao.codigo} será excluída permanentemente. Esta ação não pode ser desfeita.`}
          confirmLabel="Sim, excluir"
          tipo="danger"
          onConfirmar={handleExcluir}
          onCancelar={() => setConfirmExcluir(false)}
        />
      )}

      {/* Confirmar saída sem salvar */}
      {confirmSair && (
        <ModalConfirmacao
          titulo="Sair sem salvar?"
          mensagem={`Você tem ${qtdAlteracoes} alteração(ões) não salva(s). Deseja salvar antes de sair?`}
          confirmLabel="Salvar e sair"
          cancelLabel="Sair sem salvar"
          tipo="warning"
          onConfirmar={salvarEFechar}
          onCancelar={() => { setConfirmSair(false); onFechar() }}
        />
      )}

      {/* Cancelar aquisição com justificativa */}
      {confirmCancelar && (
        <ModalConfirmacao
          titulo="Cancelar aquisição?"
          mensagem="Informe a justificativa para o cancelamento."
          confirmLabel="Confirmar cancelamento"
          tipo="warning"
          onConfirmar={handleCancelar}
          onCancelar={() => { setConfirmCancelar(false); setJustificativa("") }}
        >
          <textarea
            value={justificativa}
            onChange={e => setJustificativa(e.target.value)}
            placeholder="Descreva o motivo do cancelamento..."
            style={{
              width: "100%", minHeight: "80px", padding: "8px 10px",
              border: "1.5px solid var(--cinza-300)", borderRadius: "6px",
              fontSize: "0.84rem", fontFamily: "inherit", resize: "vertical",
              marginBottom: "4px"
            }}
          />
        </ModalConfirmacao>
      )}
    </>
  )
}

export default ModalDetalhes