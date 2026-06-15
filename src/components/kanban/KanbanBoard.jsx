import KanbanColuna from "./KanbanColuna"
import KanbanCard from "./KanbanCard"

function KanbanBoard({ aquisicoes, canceladas, etapas, onAtualizar }) {
  return (
    <div className="board">
      {etapas.map(etapa => (
        <KanbanColuna
          key={etapa.id}
          etapa={etapa}
          etapas={etapas}
          aquisicoes={aquisicoes.filter(a => a.etapaAquisicaoId === etapa.id)}
          onAtualizar={onAtualizar}
        />
      ))}

      <div className="column" style={{ borderTop: "3px solid #B71C1C" }}>
        <div className="column-header" style={{ background: "#FFEBEE", color: "#B71C1C" }}>
          <span className="column-title">✕ Canceladas</span>
          <span className="col-count">{canceladas?.length || 0}</span>
        </div>
        <div className="column-body">
          {!canceladas?.length
            ? <div className="empty-col">Nenhuma cancelada</div>
            : canceladas.map(a => (
                <KanbanCard
                  key={a.codigo}
                  aquisicao={a}
                  etapas={etapas}
                  onAtualizar={onAtualizar}
                />
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default KanbanBoard