import { useState, useEffect } from "react"
import { cadastrarAquisicao } from "../../services/api"
import { listarTipos, listarMetodos, listarEtapas, listarStatus, listarSecretarias } from "../../services/api"
import { toast } from "react-toastify"

function ModalCadastro({ onFechar, onSalvar }) {
  const [dados, setDados] = useState({
    codigo: "", tipoAquisicaoId: "", metodoAquisicaoId: "",
    etapaAquisicaoId: "", descricaoObjetoNome: "", valorEstimado: "",
    responsavel: "", dataLimite: "", statusAquisicaoId: "", secretariaId: ""
  })
  const [tipos, setTipos] = useState([])
  const [metodos, setMetodos] = useState([])
  const [etapas, setEtapas] = useState([])
  const [statusList, setStatusList] = useState([])
  const [secretarias, setSecretarias] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      listarTipos(), listarMetodos(), listarEtapas(), listarStatus(), listarSecretarias()
    ]).then(([t, m, e, s, sec]) => {
      setTipos(t.data)
      setMetodos(m.data)
      setEtapas(e.data)
      setStatusList(s.data)
      setSecretarias(sec.data)
    })
  }, [])

  const handleChange = (campo, valor) => setDados(prev => ({ ...prev, [campo]: valor }))

  const handleSalvar = async () => {
    const obrigatorios = ["codigo", "tipoAquisicaoId", "metodoAquisicaoId", "etapaAquisicaoId", "descricaoObjetoNome", "valorEstimado", "responsavel", "dataLimite", "statusAquisicaoId", "secretariaId"]
    const faltando = obrigatorios.filter(c => !dados[c])
    if (faltando.length > 0) {
      toast.warning("Preencha todos os campos obrigatórios")
      return
    }
    setLoading(true)
    try {
      await cadastrarAquisicao({
        ...dados,
        tipoAquisicaoId: parseInt(dados.tipoAquisicaoId),
        metodoAquisicaoId: parseInt(dados.metodoAquisicaoId),
        etapaAquisicaoId: parseInt(dados.etapaAquisicaoId),
        statusAquisicaoId: parseInt(dados.statusAquisicaoId),
        secretariaId: parseInt(dados.secretariaId),
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
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">＋ Nova Aquisição</div>
            <div className="modal-subtitle">Preencha os dados para cadastrar</div>
          </div>
          <button className="modal-close" onClick={onFechar}>×</button>
        </div>

        <div className="modal-body">
          <div className="section-label">Dados da Aquisição</div>
          <div className="form-grid">
            <div className="form-group">
              <label>Código *</label>
              <input placeholder="Ex: ADQ-001" value={dados.codigo} onChange={e => handleChange("codigo", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo de Aquisição *</label>
              <select value={dados.tipoAquisicaoId} onChange={e => handleChange("tipoAquisicaoId", e.target.value)}>
                <option value="">Selecione...</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Método de Aquisição *</label>
              <select value={dados.metodoAquisicaoId} onChange={e => handleChange("metodoAquisicaoId", e.target.value)}>
                <option value="">Selecione...</option>
                {metodos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Etapa Inicial *</label>
              <select value={dados.etapaAquisicaoId} onChange={e => handleChange("etapaAquisicaoId", e.target.value)}>
                <option value="">Selecione...</option>
                {etapas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </div>
            <div className="form-group form-full">
              <label>Objeto / Descrição *</label>
              <textarea placeholder="Descreva o objeto da aquisição..." value={dados.descricaoObjetoNome} onChange={e => handleChange("descricaoObjetoNome", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor Estimado (USD) *</label>
              <input type="number" placeholder="0.00" value={dados.valorEstimado} onChange={e => handleChange("valorEstimado", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Responsável *</label>
              <input placeholder="Nome do responsável" value={dados.responsavel} onChange={e => handleChange("responsavel", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Limite *</label>
              <input type="date" value={dados.dataLimite} onChange={e => handleChange("dataLimite", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select value={dados.statusAquisicaoId} onChange={e => handleChange("statusAquisicaoId", e.target.value)}>
                <option value="">Selecione...</option>
                {statusList.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Secretaria *</label>
              <select value={dados.secretariaId} onChange={e => handleChange("secretariaId", e.target.value)}>
                <option value="">Selecione...</option>
                {secretarias.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline-dark" onClick={onFechar}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSalvar} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Aquisição"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalCadastro