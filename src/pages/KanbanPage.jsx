import { useState, useEffect, useCallback } from "react"  
import { listarAquisicoes, listarEtapas, listarTipos, listarProjetos } from "../services/api"
import { toast } from "react-toastify"
import Tabs from "../components/UI/Tabs"
import KanbanBoard from "../components/kanban/KanbanBoard"
import Filtros from "../components/UI/Filtros"
import ModalCadastro from "../components/modais/ModalCadastro"
import Loading from "../components/UI/Loading"
import { useNavigate } from "react-router-dom"
import ProjetosSelect from "../components/UI/ProjetosSelect"

function KanbanPage() {
  const [aquisicoes, setAquisicoes] = useState([])
  const [etapas, setEtapas] = useState([])
  const [tipos, setTipos] = useState([])
  const [projetos, setProjetos] = useState([])
  const [projetoSelecionado, setProjetoSelecionado] = useState(null)
  const [tipoAtivo, setTipoAtivo] = useState(null)
  const [filtros, setFiltros] = useState({})
  const [loading, setLoading] = useState(true)
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const navigate = useNavigate()

  const carregarDadosIniciais = async () => {
    try {
      const [resProjetos, resTipos] = await Promise.all([
        listarProjetos(), 
        listarTipos()
      ])
      setProjetos(resProjetos.data)
      setTipos(resTipos.data)
      
      if (resProjetos.data.length > 0) {
        setProjetoSelecionado(resProjetos.data[0])
        setTipoAtivo(resTipos.data[0]?.id)
      }
    } catch {
      toast.error("Erro ao carregar dados iniciais")
    } finally {
      setLoading(false)
    }
  }

  const carregarEtapas = useCallback(async (tipoId) => {
    try {
      const res = await listarEtapas(tipoId)
      setEtapas(res.data)
    } catch {
      toast.error("Erro ao carregar etapas")
    }
  }, [])

  const carregarAquisicoes = useCallback(async () => {
    if (!projetoSelecionado) return
    
    try {
      const res = await listarAquisicoes({ 
        ...filtros, 
        tipoId: tipoAtivo,
        projetoId: projetoSelecionado.id 
      })
      setAquisicoes(res.data)
    } catch {
      toast.error("Erro ao carregar aquisições")
    }
  }, [filtros, tipoAtivo, projetoSelecionado])


  useEffect(() => { 
    carregarDadosIniciais() 
  }, [])


  useEffect(() => { 
    if (tipoAtivo) carregarEtapas(tipoAtivo) 
  }, [tipoAtivo, carregarEtapas])


  useEffect(() => { 
    if (projetoSelecionado && tipoAtivo) carregarAquisicoes() 
  }, [projetoSelecionado, tipoAtivo, carregarAquisicoes])

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
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setModalCadastroAberto(true)}
            disabled={!projetoSelecionado}
          >
            ＋ Nova Aquisição
          </button>
        </div>
      </header>

      {/* Seleção de Projeto */}
      <div style={{ padding: "12px 24px", background: "#f8f9fa", borderBottom: "1px solid #e9ecef" }}>
        <ProjetosSelect 
          projetos={projetos}
          projetoSelecionado={projetoSelecionado}
          onSelect={setProjetoSelecionado}
        />
      </div>

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
          projetoId={projetoSelecionado?.id}
          onFechar={() => setModalCadastroAberto(false)}
          onSalvar={() => { 
            carregarAquisicoes(); 
            setModalCadastroAberto(false) 
          }}
        />
      )}
    </div>
  )
}

export default KanbanPage