import { createContext, useContext, useMemo, useState } from "react"

const AuthContext = createContext(null)

const STORAGE_KEY = "gym_auth"

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { user: null, token: null }
    }
    try {
      const parsed = JSON.parse(stored)
      // Backwards-compat: older demos only stored the user object
      if (parsed && !("user" in parsed) && !("token" in parsed)) {
        return { user: parsed, token: null }
      }
      return {
        user: parsed.user ?? null,
        token: parsed.token ?? null
      }
    } catch {
      return { user: null, token: null }
    }
  })

  const login = ({ user, token }) => {
    const next = { user, token }
    setAuth(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const logout = () => {
    setAuth({ user: null, token: null })
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      role: auth.user?.role,
      isAuthenticated: Boolean(auth.user && auth.token),
      login,
      logout
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
