import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import DataTable from "../../components/DataTable.jsx"
import Button from "../../components/Button.jsx"
import Badge from "../../components/Badge.jsx"
import Input from "../../components/Input.jsx"
import Select from "../../components/Select.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function Members() {
  const { token } = useAuth()

  const [showForm, setShowForm] = useState(false)
  const [plans, setPlans] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loadingMeta, setLoadingMeta] = useState(false)

  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [deletingMemberId, setDeletingMemberId] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    membershipPlan: "",
    trainer: "",
    startDate: "",
    endDate: "",
    heightCm: "",
    weightKg: "",
    goals: ""
  })

  const fetchMembers = async (signal) => {
    if (!token) return
    try {
      setLoadingMembers(true)
      const response = await fetch(`${API_BASE}/api/users/members`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        signal
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to load members.")
      }

      const data = await response.json()
      const rows =
        data.members?.map((member) => ({
          id: member.id,
          name: member.name,
          plan: member.plan,
          trainer: member.trainer,
          status: member.status === "active" ? "Active" : "Inactive",
          expires: member.expires ? new Date(member.expires).toLocaleDateString() : "—"
        })) ?? []

      setMembers(rows)
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message)
      }
    } finally {
      setLoadingMembers(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchMembers(controller.signal)
    return () => controller.abort()
  }, [token])

  useEffect(() => {
    if (!showForm || !token) return

    const controller = new AbortController()
    const headers = {
      Authorization: `Bearer ${token}`
    }

    const loadMeta = async () => {
      try {
        setLoadingMeta(true)
        setError("")

        const [plansRes, trainersRes] = await Promise.all([
          fetch(`${API_BASE}/api/memberships`, {
            headers,
            credentials: "include",
            signal: controller.signal
          }),
          fetch(`${API_BASE}/api/users?role=trainer`, {
            headers,
            credentials: "include",
            signal: controller.signal
          })
        ])

        const plansData = plansRes.ok ? await plansRes.json() : { plans: [] }
        const trainersData = trainersRes.ok ? await trainersRes.json() : { users: [] }

        setPlans(plansData.plans ?? [])
        setTrainers(trainersData.users ?? [])
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load plans or trainers.")
        }
      } finally {
        setLoadingMeta(false)
      }
    }

    loadMeta()

    return () => controller.abort()
  }, [showForm, token])

  const columns = [
    { key: "name", label: "Member" },
    { key: "plan", label: "Plan" },
    { key: "trainer", label: "Trainer" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "Active" ? "success" : "warning"}>{row.status}</Badge>
      )
    },
    { key: "expires", label: "Expires" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          type="button"
          onClick={() => handleDeleteMember(row)}
          disabled={deletingMemberId === row.id}
          className="rounded-md border border-red-500/60 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deletingMemberId === row.id ? "Deleting..." : "Delete"}
        </button>
      )
    }
  ]

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!token) {
      setError("You must be logged in as an admin to add members.")
      return
    }

    setSubmitting(true)
    setError("")
    setSuccess("")

    const profile = {
      goals: form.goals || undefined
    }

    if (form.trainer) profile.trainer = form.trainer
    if (form.membershipPlan) profile.membershipPlan = form.membershipPlan
    if (form.startDate) profile.startDate = form.startDate
    if (form.endDate) profile.endDate = form.endDate
    if (form.heightCm) profile.heightCm = Number(form.heightCm)
    if (form.weightKg) profile.weightKg = Number(form.weightKg)

    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
          role: "member",
          profile
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to create member.")
      }

      setSuccess("Member created successfully.")
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        membershipPlan: "",
        trainer: "",
        startDate: "",
        endDate: "",
        heightCm: "",
        weightKg: "",
        goals: ""
      })

      // Refresh members list so the new member appears in the table
      fetchMembers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteMember = async (member) => {
    if (!token) {
      setError("You must be logged in as an admin to delete members.")
      return
    }

    const confirmed = window.confirm(`Delete member "${member.name}"?`)
    if (!confirmed) return

    try {
      setDeletingMemberId(member.id)
      setError("")
      setSuccess("")

      const response = await fetch(`${API_BASE}/api/users/${member.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to delete member.")
      }

      setSuccess("Member deleted successfully.")
      fetchMembers()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingMemberId("")
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Members"
        description="Manage member profiles, plans, and trainer assignments."
        actions={
          <Button onClick={() => setShowForm((open) => !open)}>
            {showForm ? "Close form" : "Add member"}
          </Button>
        }
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}

      {showForm && (
        <Card title="Add Member" subtitle="Create a new member and optional profile details.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              name="name"
              placeholder="Member name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="member@gym.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              placeholder="Contact number"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Temporary password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Select
              label="Membership plan"
              name="membershipPlan"
              value={form.membershipPlan}
              onChange={handleChange}
            >
              <option value="">Select plan (optional)</option>
              {plans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.name} · {plan.durationMonths}m · ₹{plan.price}
                </option>
              ))}
            </Select>

            <Select
              label="Trainer"
              name="trainer"
              value={form.trainer}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {trainers.map((trainer) => (
                <option key={trainer._id} value={trainer._id}>
                  {trainer.name}
                </option>
              ))}
            </Select>

            <Input
              label="Start date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
            />
            <Input
              label="End date"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
            />

            <Input
              label="Height (cm)"
              name="heightCm"
              type="number"
              min="0"
              step="1"
              value={form.heightCm}
              onChange={handleChange}
            />
            <Input
              label="Weight (kg)"
              name="weightKg"
              type="number"
              min="0"
              step="0.1"
              value={form.weightKg}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-200">Goals</label>
              <textarea
                name="goals"
                rows={3}
                className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. Weight loss, strength, mobility"
                value={form.goals}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting || loadingMeta}>
                {submitting ? "Creating member..." : "Create member"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Active Members" subtitle="Quick view of current memberships">
        {loadingMembers ? (
          <p className="text-sm text-slate-400">Loading members...</p>
        ) : (
          <DataTable columns={columns} rows={members} />
        )}
      </Card>
    </div>
  )
}
