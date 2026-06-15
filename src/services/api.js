import axios from "axios"


console.log("REACT_APP_API_URL =", process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
});

console.log("API:", process.env.REACT_APP_API_URL);

export const listarAquisicoes = (filtros = {}) => api.get("/aquisicoes", { params: filtros })
export const cadastrarAquisicao = (dados) => api.post("/aquisicoes", dados)
export const excluirAquisicao = (codigo) => api.delete(`/aquisicoes/${codigo}`)
export const marcarChecklist = (codigo, itemId, concluido) =>
  api.patch(`/aquisicoes/${codigo}/checklist/${itemId}`, { concluido })
export const cancelarAquisicao = (codigo, justificativa) =>
  api.patch(`/aquisicoes/${codigo}/cancelar`, { justificativa })

export const listarTipos = () => api.get("/tipos-aquisicao")
export const listarMetodos = () => api.get("/metodos-aquisicao")
export const listarEtapas = () => api.get("/etapas-aquisicao")
export const listarStatus = () => api.get("/status-aquisicao")
export const listarSecretarias = () => api.get("/secretarias")


export const getDashboard = () => api.get("/dashboard")