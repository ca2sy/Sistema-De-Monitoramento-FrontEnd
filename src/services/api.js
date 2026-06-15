import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" }
})


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