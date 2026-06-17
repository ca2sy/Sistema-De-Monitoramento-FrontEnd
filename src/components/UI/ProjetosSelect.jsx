import React from 'react'

function ProjetosSelect({ projetos, projetoSelecionado, onSelect }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <label style={{ 
        fontSize: "0.8rem", 
        fontWeight: "600", 
        color: "#495057",
        whiteSpace: "nowrap"
      }}>
        📁 Projeto:
      </label>
      <select
        value={projetoSelecionado?.id || ""}
        onChange={(e) => {
          const projeto = projetos.find(p => p.id === parseInt(e.target.value))
          onSelect(projeto)
        }}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #ced4da",
          background: "#fff",
          fontSize: "0.85rem",
          minWidth: "200px",
          cursor: "pointer"
        }}
      >
        <option value="">Selecione um projeto...</option>
        {projetos.map(projeto => (
          <option key={projeto.id} value={projeto.id}>
            {projeto.nome}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProjetosSelect