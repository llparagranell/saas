import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"
import { useAuth } from "../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    const formData = new FormData(event.target)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to sign in. Please check your credentials.")
      }

      const data = await response.json()
      login({ user: data.user, token: data.token })
      navigate("/app/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="font-display text-2xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to your workspace with your gym account.
        </p>
      </div>
      <Input label="Email" name="email" type="email" placeholder="you@gym.com" required />
      <Input label="Password" name="password" type="password" placeholder="••••••••" required />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Login"}
      </Button>
      <button
        type="button"
        onClick={() => navigate("/register")}
        className="w-full text-sm text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
      >
        Don&apos;t have an account? Register
      </button>
      <p className="text-xs text-slate-400">
        Your role (super_admin, admin, trainer, member) is determined by the backend account associated with your
        email.
      </p>
    </form>
  )
}
