// src/utils/tokenUtils.js
import { jwtDecode } from "jwt-decode"


export function isAccessTokenExpired(token) {
 
  if (!token) return true

  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000 // in seconds
    return decoded.exp < currentTime // true if expired
  } catch (e) {
    console.error("Invalid token", e)
    return true
  }
}
