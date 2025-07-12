import axios from "axios"

export const BASE_URL = "http://localhost:8080"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
   validateStatus: function (status) {
    return status >= 200 && status < 400; // accept 3xx like 302
  },
})

export default api
