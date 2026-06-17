import { useState, useEffect } from "react"
import { cadastrarAquisicao } from "../../services/api"
import { listarTipos, listarEtapas, listarStatus, listarSecretarias } from "../../services/api"
import { toast } from "react-toastify"

function ModalCadastro({ onFechar, onSalvar, projetoId }) {
  const [dados, setDados] = useState({
    codigo: "", 
    tipoAquisicaoId: "", 
    etapaAquisicaoId: "", 
    descricaoObjetoNome: "", 
    valorEstimado: "",
    responsavel: "", 
    dataLimite: "", 
    statusAquisicaoId: "", 
    secretariaId: "",
    projetoId: projetoId || ""
  })
  const [tipos, setTipos] = useState([])
  const [etapas, setEtapas] = useState([])
  const [statusList, setStatusList] = useState([])
  const [secretarias, setSecretarias] = useState([])
  const [loading, setLoading] = useState(false)
  const [etapasCarregando, setEtapasCarregando] = useState(false)

  useEffect(() => {
    Promise.all([
      listarTipos(), 
      listarStatus(), 
      listarSecretarias()
    ]).then(([t, s, sec]) => {
      setTipos(t.data)
      setStatusList(s.data)
      setSecretarias(sec.data)
    })
  }, [])

  useEffect(() => {
    if (dados.tipoAquisicaoId) {
      setEtapasCarregando(true)
      listarEtapas(dados.tipoAquisicaoId)
        .then(res => {
          setEtapas(res.data)
          if (res.data.length > 0) {
            setDados(prev => ({ ...prev, etapaAquisicaoId: res.data[0].id }))
          }
        })
        .catch(() => toast.error("Erro ao carregar etapas"))
        .finally(() => setEtapasCarregando(false))
    } else {
      setEtapas([])
      setDados(prev => ({ ...prev, etapaAquisicaoId: "" }))
    }
  }, [dados.tipoAquisicaoId])

  useEffect(() => {
    if (projetoId) {
      setDados(prev => ({ ...prev, projetoId }))
    }
  }, [projetoId])

  const handleChange = (campo, valor) => setDados(prev => ({ ...prev, [campo]: valor }))

  const handleSalvar = async () => {
    const obrigatorios = [
      "codigo", "tipoAquisicaoId", 
      "etapaAquisicaoId", "descricaoObjetoNome", "valorEstimado", 
      "responsavel", "dataLimite", "statusAquisicaoId", 
      "secretariaId", "projetoId"
    ]
    
    const faltando = obrigatorios.filter(c => !dados[c])
    if (faltando.length > 0) {
      toast.warning(`Preencha todos os campos obrigatórios`)
      return
    }
    
    setLoading(true)
    try {
      await cadastrarAquisicao({
        ...dados,
        tipoAquisicaoId: parseInt(dados.tipoAquisicaoId),
        etapaAquisicaoId: parseInt(dados.etapaAquisicaoId),
        statusAquisicaoId: parseInt(dados.statusAquisicaoId),
        secretariaId: parseInt(dados.secretariaId),
        projetoId: parseInt(dados.projetoId),
        valorEstimado: parseFloat(dados.valorEstimado),
      })
      toast.success("Aquisição cadastrada com sucesso!")
      onSalvar()
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao cadastrar aquisição")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay" onClick={onFechar}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "700px" }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">＋ Nova Aquisição</div>
            <div className="modal-subtitle">
              {projetoId ? `Projeto: ${dados.projetoId}` : "Selecione um projeto no Kanban primeiro"}
            </div>
          </div>
          <button className="modal-close" onClick={onFechar}>×</button>
        </div>

        <div className="modal-body">
          <div className="section-label">Dados da Aquisição</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Código *</label>
              <input 
                placeholder="Ex: ADQ-001" 
                value={dados.codigo} 
                onChange={e => handleChange("codigo", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Tipo de Aquisição *</label>
              <select 
                value={dados.tipoAquisicaoId} 
                onChange={e => handleChange("tipoAquisicaoId", e.target.value)}
              >
                <option value="">Selecione...</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Etapa Inicial *</label>
              <select 
                value={dados.etapaAquisicaoId} 
                onChange={e => handleChange("etapaAquisicaoId", e.target.value)}
                disabled={etapasCarregando || !dados.tipoAquisicaoId}
              >
                <option value="">
                  {etapasCarregando ? "Carregando..." : "Selecione o tipo primeiro"}
                </option>
                {etapas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </div>
            <div className="form-group form-full">
              <label>Objeto / Descrição *</label>
              <textarea 
                placeholder="Descreva o objeto da aquisição..." 
                value={dados.descricaoObjetoNome} 
                onChange={e => handleChange("descricaoObjetoNome", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Valor Estimado (USD) *</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={dados.valorEstimado} 
                onChange={e => handleChange("valorEstimado", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Responsável *</label>
              <input 
                placeholder="Nome do responsável" 
                value={dados.responsavel} 
                onChange={e => handleChange("responsavel", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Data Limite *</label>
              <input 
                type="date" 
                value={dados.dataLimite} 
                onChange={e => handleChange("dataLimite", e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select 
                value={dados.statusAquisicaoId} 
                onChange={e => handleChange("statusAquisicaoId", e.target.value)}
              >
                <option value="">Selecione...</option>
                {statusList.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Secretaria *</label>
              <select 
                value={dados.secretariaId} 
                onChange={e => handleChange("secretariaId", e.target.value)}
              >
                <option value="">Selecione...</option>
                {secretarias.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline-dark" onClick={onFechar}>Cancelar</button>
          <button 
            className="btn btn-primary" 
            onClick={handleSalvar} 
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Aquisição"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalCadastro