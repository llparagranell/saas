import { useNavigate } from "react-router-dom"
import Input from "../components/Input.jsx"
import Button from "../components/Button.jsx"

export default function Register() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate("/login")
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="font-display text-2xl font-semibold">Create account</h2>
        <p className="mt-2 text-sm text-slate-400">
          Member registrations default to the member role.
        </p>
      </div>
      <Input label="Full name" name="name" placeholder="Member name" required />
      <Input label="Email" name="email" type="email" placeholder="member@gym.com" required />
      <Input label="Password" name="password" type="password" placeholder="••••••••" required />
      <Button type="submit">Create account</Button>
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="w-full text-sm text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
      >
        Already have an account? Login
      </button>
      <p className="text-xs text-slate-400">
        Admins can create trainer or member accounts from the dashboard.
      </p>
    </form>
  )
}
