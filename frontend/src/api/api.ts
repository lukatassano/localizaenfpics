import axios from "axios";

const backendURL = (import.meta.env.VITE_BACKEND_URL || window.location.hostname) as string;
const http = backendURL.includes("localhost") ? "http://" : "https://"
const backendPort = (import.meta.env.VITE_BACKEND_PORT || window.location.port) as string;

const baseURL = backendPort ? `${http}${backendURL}:${backendPort}/localizaenfpics/api` : `${http}${backendURL}/localizaenfpics/api`

export const api = axios.create({
  baseURL
})

export function fetcher(url: string) {
  return api.get(url).then(response => response.data)
}