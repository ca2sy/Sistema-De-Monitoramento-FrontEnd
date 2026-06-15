function Tabs({ tipos, tipoAtivo, onChange }) {
  const cores = {
    1: "#1565C0",
    2: "#9ec753",
    3: "#F57F17"
  }

  return (
    <div className="tabs-bar">
      {tipos.map(tipo => (
        <button
          key={tipo.id}
          className={`tab-btn ${tipoAtivo === tipo.id ? "active" : ""}`}
          onClick={() => onChange(tipo.id)}
        >
          <span className="tab-dot" style={{ background: cores[tipo.id] || "#fff" }} />
          {tipo.nome}
        </button>
      ))}
    </div>
  )
}

export default Tabs