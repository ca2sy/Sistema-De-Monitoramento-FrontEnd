import KanbanCard from "./KanbanCard"

const coresEtapa = [
  { bg: "#E8F5E9", fg: "#1B5E20" },
  { bg: "#FFF8E1", fg: "#E65100" },
  { bg: "#E3F2FD", fg: "#0D47A1" },
  { bg: "#FCE4EC", fg: "#880E4F" },
  { bg: "#F3E5F5", fg: "#4A148C" },
  { bg: "#E0F7FA", fg: "#006064" },
  { bg: "#F1F8E9", fg: "#33691E" },
  { bg: "#FFF3E0", fg: "#BF360C" },
  { bg: "#E8EAF6", fg: "#1A237E" },
  { bg: "#ECEFF1", fg: "#263238" },
]

function KanbanColuna({ etapa, etapas, aquisicoes, onAtualizar }) {
  const cor = coresEtapa[(etapa.ordem - 1) % coresEtapa.length]

  return (
    <div className="column">
      <div className="column-header" style={{ background: cor.bg, color: cor.fg }}>
        <span className="column-title">{etapa.nome}</span>
        <span className="col-count">{aquisicoes.length}</span>
      </div>
      <div className="column-body">
        {aquisicoes.length === 0
          ? <div className="empty-col">Nenhuma aquisição</div>
          : aquisicoes.map(a => (
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
  )
}

export default KanbanColuna