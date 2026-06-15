// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { getDashboard } from "../services/api"
// import { toast } from "react-toastify"
// import {
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
//   CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts"
// import Loading from "../components/UI/Loading"

// const CORES_STATUS = {
//   "Em dia":   "#2E7D32",
//   "Atenção":  "#F9A825",
//   "Atrasado": "#B71C1C",
// }

// const CORES_TIPO = ["#1565C0", "#2E7D32", "#F9A825", "#7B1FA2", "#E64A19"]

// function CardMetrica({ titulo, valor, sub, cor }) {
//   return (
//     <div style={{
//       background: "#fff",
//       border: "1px solid #E0E0E0",
//       borderLeft: `4px solid ${cor || "#1B5E20"}`,
//       borderRadius: "6px",
//       padding: "18px 20px",
//       boxShadow: "0 1px 3px rgba(0,0,0,.06)"
//     }}>
//       <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#757575", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: "6px" }}>
//         {titulo}
//       </div>
//       <div style={{ fontSize: "1.8rem", fontWeight: "700", color: cor || "#1B5E20", lineHeight: 1 }}>
//         {valor}
//       </div>
//       {sub && <div style={{ fontSize: "0.75rem", color: "#9E9E9E", marginTop: "4px" }}>{sub}</div>}
//     </div>
//   )
// }

// function SecaoTitulo({ children }) {
//   return (
//     <div style={{
//       fontFamily: "'Roboto Condensed', sans-serif",
//       fontSize: "0.72rem",
//       fontWeight: "700",
//       color: "#1B5E20",
//       textTransform: "uppercase",
//       letterSpacing: ".8px",
//       borderBottom: "2px solid #E8F5E9",
//       paddingBottom: "6px",
//       marginBottom: "16px",
//       marginTop: "28px"
//     }}>
//       {children}
//     </div>
//   )
// }

// function DashboardPage() {
//   const [dados, setDados] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     getDashboard()
//       .then(res => setDados(res.data))
//       .catch(() => toast.error("Erro ao carregar dashboard"))
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) return <Loading />

//   const { totais, porStatus, porTipo, porSecretaria, porMes } = dados

//   const dadosConclusao = [
//     { nome: "No prazo", valor: totais.concluidasNoPrazo, cor: "#2E7D32" },
//     { nome: "Com atraso", valor: totais.concluidasAtrasadas, cor: "#B71C1C" },
//   ]

//   return (
//     <div style={{ minHeight: "100vh", background: "#F5F6F5" }}>

//       {/* Header */}
//       <header className="header">
//         <div className="header-logo">
//           <div className="header-logo-brasao">📊</div>
//           <div>
//             <div className="header-title">Dashboards de Acompanhamento</div>
//             <div className="header-subtitle">SEPLAN — Governo do Piauí</div>
//           </div>
//         </div>
//         <div className="header-actions">
//           <button className="btn btn-outline btn-sm" onClick={() => navigate("/")}>
//             ← Voltar ao Kanban
//           </button>
//         </div>
//       </header>

//       <div style={{ padding: "24px 28px", maxWidth: "1400px", margin: "0 auto" }}>

//         {/* Métricas principais */}
//         <SecaoTitulo>Visão Geral</SecaoTitulo>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "8px" }}>
//           <CardMetrica titulo="Total de Aquisições" valor={totais.total} cor="#1565C0" />
//           <CardMetrica titulo="Em Dia" valor={porStatus.find(s => s.nome === "Em dia")?.quantidade || 0} cor="#2E7D32" />
//           <CardMetrica titulo="Em Atenção" valor={porStatus.find(s => s.nome === "Atenção")?.quantidade || 0} cor="#F9A825" />
//           <CardMetrica titulo="Atrasadas" valor={porStatus.find(s => s.nome === "Atrasado")?.quantidade || 0} cor="#B71C1C" />
//           <CardMetrica titulo="Concluídas" valor={totais.concluidas} cor="#1B5E20" />
//           <CardMetrica titulo="Canceladas" valor={totais.canceladas} cor="#757575" />
//           <CardMetrica
//             titulo="Valor Total Estimado"
//             valor={`USD ${Number(totais.valorTotal).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`}
//             cor="#1565C0"
//             sub="soma de todas as aquisições"
//           />
//         </div>

//         {/* Gráficos linha 1 */}
//         <SecaoTitulo>Distribuição por Status e Tipo</SecaoTitulo>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>

//           {/* Pizza status */}
//           <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: "6px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
//             <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#424242", marginBottom: "12px" }}>Aquisições por Status</div>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={porStatus} dataKey="quantidade" nameKey="nome" cx="50%" cy="50%" outerRadius={75} label={({ nome, quantidade }) => `${nome}: ${quantidade}`} labelLine={false} fontSize={11}>
//                   {porStatus.map((s, i) => (
//                     <Cell key={i} fill={CORES_STATUS[s.nome] || CORES_TIPO[i]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(v) => [v, "Qtd"]} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Pizza tipo */}
//           <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: "6px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
//             <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#424242", marginBottom: "12px" }}>Aquisições por Tipo</div>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={porTipo} dataKey="quantidade" nameKey="nome" cx="50%" cy="50%" outerRadius={75} label={({ nome, quantidade }) => `${quantidade}`} fontSize={11}>
//                   {porTipo.map((_, i) => (
//                     <Cell key={i} fill={CORES_TIPO[i % CORES_TIPO.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(v, n, p) => [v, p.payload.nome]} />
//                 <Legend formatter={(v) => v} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Concluídas no prazo vs atrasadas */}
//           <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: "6px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
//             <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#424242", marginBottom: "12px" }}>Concluídas: Prazo vs Atraso</div>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie data={dadosConclusao} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={75} label={({ nome, valor }) => valor > 0 ? `${nome}: ${valor}` : ""} fontSize={11}>
//                   {dadosConclusao.map((d, i) => <Cell key={i} fill={d.cor} />)}
//                 </Pie>
//                 <Tooltip formatter={(v, n) => [v, n]} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Gráficos linha 2 */}
//         <SecaoTitulo>Por Secretaria e Valor</SecaoTitulo>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

//           {/* Barras por secretaria */}
//           <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: "6px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
//             <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#424242", marginBottom: "12px" }}>Aquisições por Secretaria</div>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={porSecretaria} layout="vertical" margin={{ left: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" horizontal={false} />
//                 <XAxis type="number" fontSize={11} />
//                 <YAxis type="category" dataKey="nome" width={80} fontSize={11} />
//                 <Tooltip formatter={(v) => [v, "Qtd"]} />
//                 <Bar dataKey="quantidade" fill="#1B5E20" radius={[0, 3, 3, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Barras valor por tipo */}
//           <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: "6px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
//             <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#424242", marginBottom: "12px" }}>Valor Estimado por Tipo (USD)</div>
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={porTipo} margin={{ bottom: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="nome" fontSize={11} tick={{ fill: "#616161" }} />
//                 <YAxis fontSize={11} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
//                 <Tooltip formatter={(v) => [`USD ${Number(v).toLocaleString("pt-BR")}`, "Valor"]} />
//                 <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
//                   {porTipo.map((_, i) => <Cell key={i} fill={CORES_TIPO[i % CORES_TIPO.length]} />)}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default DashboardPage