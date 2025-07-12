import { isAccessTokenExpired } from "./tokenUtils"

export function getAccessToken() {
  const token = sessionStorage.getItem("accessToken")
    console.log("token",token)

  if (!token) {
    return null
  }

  if (isAccessTokenExpired(token)) {
    window.NavigationHistoryEntry()
  }

  return token
}
