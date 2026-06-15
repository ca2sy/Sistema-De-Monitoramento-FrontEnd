function ModalConfirmacao({ titulo, mensagem, confirmLabel = "Confirmar", cancelLabel = "Cancelar", tipo = "danger", onConfirmar, onCancelar, children }) {
  return (
    <div className="overlay" style={{ zIndex: 300 }} onClick={onCancelar}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "10px",
          width: "420px",
          maxWidth: "94vw",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          overflow: "hidden"
        }}
      >
        <div style={{
          background: tipo === "danger" ? "#FEE2E2" : tipo === "warning" ? "#FEF9C3" : "#E8F5E9",
          padding: "20px 24px 16px",
          borderBottom: "1px solid",
          borderColor: tipo === "danger" ? "#FECACA" : tipo === "warning" ? "#FDE68A" : "#BBF7D0"
        }}>
          <div style={{
            fontSize: "1.5rem",
            marginBottom: "8px"
          }}>
            {tipo === "danger" ? "🗑" : tipo === "warning" ? "⚠️" : "✅"}
          </div>
          <div style={{
            fontWeight: "700",
            fontSize: "1rem",
            color: tipo === "danger" ? "#991B1B" : tipo === "warning" ? "#92400E" : "#166534"
          }}>
            {titulo}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--cinza-700)", marginTop: "4px" }}>
            {mensagem}
          </div>
        </div>

        {children && (
          <div style={{ padding: "16px 24px 0" }}>
            {children}
          </div>
        )}

        <div style={{ padding: "16px 24px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button className="btn btn-outline-dark" onClick={onCancelar}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${tipo === "danger" ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirmar}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmacao