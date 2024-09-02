import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL as string;
const http = backendURL.includes("localhost") ? "http://" : "https://"
const backendPort = import.meta.env.VITE_BACKEND_PORT as string;

const baseURL = `${http}${backendURL}:${backendPort}/api`
console.log(baseURL);

export const api = axios.create({
  baseURL 
})