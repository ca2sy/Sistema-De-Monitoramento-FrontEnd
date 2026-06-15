function Loading() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#EEF2F7"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "40px", height: "40px", border: "4px solid #D9E1F2",
          borderTop: "4px solid #2E75B6", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 12px"
        }} />
        <span style={{ color: "#1F3864", fontWeight: "600", fontSize: "0.9rem" }}>Carregando...</span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default Loading