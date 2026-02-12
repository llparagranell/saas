import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import Button from "../../components/Button.jsx"
import Badge from "../../components/Badge.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function MembershipPlans() {
  const { token } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingPlanId, setDeletingPlanId] = useState("")
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({
    name: "",
    durationMonths: "",
    price: "",
    description: ""
  })

  const loadPlans = async (signal) => {
    if (!token) return
    try {
      setLoading(true)
      setError("")
      const response = await fetch(`${API_BASE}/api/memberships`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        signal
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to load membership plans.")
      }

      const data = await response.json()
      setPlans(data.plans ?? [])
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    loadPlans(controller.signal)
    return () => controller.abort()
  }, [token])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!token) {
      setError("You must be logged in as an admin to create plans.")
      return
    }

    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE}/api/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          durationMonths: Number(form.durationMonths),
          price: Number(form.price),
          description: form.description || undefined,
          isActive: true
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to create membership plan.")
      }

      setSuccess("Plan created successfully.")
      setForm({
        name: "",
        durationMonths: "",
        price: "",
        description: ""
      })

      // reload plans so the new one appears
      loadPlans()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePlan = async (plan) => {
    if (!token) {
      setError("You must be logged in as an admin to delete plans.")
      return
    }

    const confirmed = window.confirm(`Delete plan "${plan.name}"?`)
    if (!confirmed) return

    try {
      setDeletingPlanId(plan._id)
      setError("")
      setSuccess("")

      const response = await fetch(`${API_BASE}/api/memberships/${plan._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to delete membership plan.")
      }

      setSuccess("Plan deleted successfully.")
      loadPlans()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingPlanId("")
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Membership Plans"
        description="Create and manage pricing tiers."
        actions={
          <Button onClick={() => setShowForm((open) => !open)}>
            {showForm ? "Close form" : "Create plan"}
          </Button>
        }
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}
      {showForm && (
        <Card title="Create Plan" subtitle="Define pricing and duration for a new membership.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-200">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. One Month, Six Months, Annual"
                className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">
                Duration (months)
              </label>
              <input
                type="number"
                name="durationMonths"
                min="1"
                step="1"
                value={form.durationMonths}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="1"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-200">
                Description (optional)
              </label>
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Short description shown in the plans list."
                className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create plan"}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading plans...</p>
        ) : (
          plans.map((plan) => (
          <Card
              key={plan._id}
            title={plan.name}
              subtitle={`${plan.durationMonths} month${plan.durationMonths > 1 ? "s" : ""}`}
            action={
              <div className="flex flex-col items-end gap-2">
                <Badge tone={plan.isActive === false ? "warning" : "success"}>
                  {plan.isActive === false ? "Inactive" : "Active"}
                </Badge>
                <button
                  type="button"
                  onClick={() => handleDeletePlan(plan)}
                  disabled={deletingPlanId === plan._id}
                  className="rounded-md border border-red-500/60 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingPlanId === plan._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            }
          >
            <div className="flex items-end justify-between">
                <p className="font-display text-3xl font-semibold">
                  ₹{plan.price.toLocaleString("en-IN")}
                </p>
                {plan.description && (
                  <p className="max-w-[60%] text-right text-xs text-slate-400">
                    {plan.description}
                  </p>
                )}
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}
