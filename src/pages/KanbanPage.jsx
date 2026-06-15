import { useState, useEffect } from "react"
import { listarAquisicoes, listarEtapas, listarTipos } from "../services/api"
import { toast } from "react-toastify"
import Tabs from "../components/UI/Tabs"
import KanbanBoard from "../components/kanban/KanbanBoard"
import Filtros from "../components/UI/Filtros"
import ModalCadastro from "../components/modais/ModalCadastro"
import Loading from "../components/UI/Loading"
import { useNavigate } from "react-router-dom"

function KanbanPage() {
  const [aquisicoes, setAquisicoes] = useState([])
  const [etapas, setEtapas] = useState([])
  const [tipos, setTipos] = useState([])
  const [tipoAtivo, setTipoAtivo] = useState(null)
  const [filtros, setFiltros] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { carregarDados() }, [])
  useEffect(() => { if (tipoAtivo) carregarAquisicoes() }, [filtros, tipoAtivo])

  const carregarDados = async () => {
    try {
      const [resEtapas, resTipos] = await Promise.all([listarEtapas(), listarTipos()])
      setEtapas(resEtapas.data)
      setTipos(resTipos.data)
      setTipoAtivo(resTipos.data[0]?.id)
    } catch {
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  const carregarAquisicoes = async () => {
    try {
      const res = await listarAquisicoes({ ...filtros, tipoId: tipoAtivo })
      setAquisicoes(res.data)
    } catch {
      toast.error("Erro ao carregar aquisições")
    }
  }

  const aquisicoesFiltradas = aquisicoes.filter(a => 
  a.tipoAquisicaoId === tipoAtivo && !a.cancelado
)
  const stats = {
    total: aquisicoesFiltradas.length,
    emDia: aquisicoesFiltradas.filter(a => a.statusAquisicao?.nome === "Em dia").length,
    atencao: aquisicoesFiltradas.filter(a => a.statusAquisicao?.nome === "Atenção").length,
    atrasado: aquisicoesFiltradas.filter(a => a.statusAquisicao?.nome === "Atrasado").length,
  }

  if (loading) return <Loading />

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-icon">
            <img src="/logo-governo.png" alt="Logo Governo do Piauí" />
          </div>
          <div>
            <div className="header-title">Monitoramento de Aquisições</div>
            <div className="header-subtitle">Governo do Piauí</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline btn-sm" onClick={carregarAquisicoes}>↻ Atualizar</button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/dashboard")}>
  📊 Dashboards
</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModalCadastroAberto(true)}>＋ Nova Aquisição</button>
        </div>
      </header>

      {/* Tabs */}
      <Tabs tipos={tipos} tipoAtivo={tipoAtivo} onChange={setTipoAtivo} />

      {/* Controls */}
      <div className="controls">
        <Filtros onFiltrar={setFiltros} />
        <div className="stats-bar">
          <span className="stat-chip stat-total">Total: {stats.total}</span>
          <span className="stat-chip stat-em-dia">✓ {stats.emDia} Em dia</span>
          <span className="stat-chip stat-atencao">⚠ {stats.atencao} Atenção</span>
          <span className="stat-chip stat-atrasado">✗ {stats.atrasado} Atrasado</span>
        </div>
      </div>

      {/* Board */}
<KanbanBoard
  aquisicoes={aquisicoesFiltradas}
  canceladas={aquisicoes.filter(a => a.cancelado)}
  etapas={etapas}
  onAtualizar={carregarAquisicoes}
/>

      {modalCadastroAberto && (
        <ModalCadastro
          onFechar={() => setModalCadastroAberto(false)}
          onSalvar={() => { carregarAquisicoes(); setModalCadastroAberto(false) }}
        />
      )}
    </div>
  )
}

export default KanbanPage