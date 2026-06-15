import { useState, useEffect } from "react"
import { listarStatus, listarSecretarias } from "../../services/api"

function Filtros({ onFiltrar }) {
  const [busca, setBusca] = useState("")
  const [statusId, setStatusId] = useState("")
  const [secretariaId, setSecretariaId] = useState("")
  const [statusList, setStatusList] = useState([])
  const [secretarias, setSecretarias] = useState([])

  useEffect(() => {
    Promise.all([listarStatus(), listarSecretarias()]).then(([s, sec]) => {
      setStatusList(s.data)
      setSecretarias(sec.data)
    })
  }, [])

  const handleBusca = (valor) => {
    setBusca(valor)
    onFiltrar({ busca: valor, statusId, secretariaId })
  }

  const handleStatus = (valor) => {
    setStatusId(valor)
    onFiltrar({ busca, statusId: valor, secretariaId })
  }

  const handleSecretaria = (valor) => {
    setSecretariaId(valor)
    onFiltrar({ busca, statusId, secretariaId: valor })
  }

  const handleLimpar = () => {
    setBusca("")
    setStatusId("")
    setSecretariaId("")
    onFiltrar({})
  }

  const temFiltro = busca || statusId || secretariaId

  return (
    <>
      <div className="search-box" style={{ maxWidth: "480px", flex: 1 }}>
        <svg width="13" height="13" fill="none" stroke="#6C757D" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          placeholder="Buscar por código, responsável ou objeto..."
          value={busca}
          onChange={e => handleBusca(e.target.value)}
        />
      </div>

      <select className="control-select" value={statusId} onChange={e => handleStatus(e.target.value)}>
        <option value="">Todos os status</option>
        {statusList.map(s => (
          <option key={s.id} value={s.id}>{s.nome}</option>
        ))}
      </select>

      <select className="control-select" value={secretariaId} onChange={e => handleSecretaria(e.target.value)}>
        <option value="">Todas as secretarias</option>
        {secretarias.map(s => (
          <option key={s.id} value={s.id}>{s.nome}</option>
        ))}
      </select>

      {temFiltro && (
        <button className="btn btn-outline-dark btn-sm" onClick={handleLimpar}>✕ Limpar</button>
      )}
    </>
  )
}

export default Filtros