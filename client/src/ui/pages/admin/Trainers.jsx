import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import DataTable from "../../components/DataTable.jsx"
import Button from "../../components/Button.jsx"
import Input from "../../components/Input.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function Trainers() {
  const { token } = useAuth()

  const [showForm, setShowForm] = useState(false)
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingTrainerId, setDeletingTrainerId] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialties: "",
    experienceYears: "",
    bio: ""
  })

  const fetchTrainers = async (signal) => {
    if (!token) return
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/users/trainers`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        signal
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to load trainers.")
      }

      const data = await response.json()
      const rows =
        data.trainers?.map((trainer) => ({
          id: trainer.id,
          name: trainer.name,
          specialty:
            trainer.specialties && trainer.specialties.length > 0
              ? trainer.specialties.join(", ")
              : "General",
          members: trainer.members ?? 0
        })) ?? []

      setTrainers(rows)
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchTrainers(controller.signal)
    return () => controller.abort()
  }, [token])

  const columns = [
    { key: "name", label: "Trainer" },
    { key: "specialty", label: "Specialty" },
    { key: "members", label: "Assigned Members" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          type="button"
          onClick={() => handleDeleteTrainer(row)}
          disabled={deletingTrainerId === row.id}
          className="rounded-md border border-red-500/60 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deletingTrainerId === row.id ? "Deleting..." : "Delete"}
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
      setError("You must be logged in as an admin to add trainers.")
      return
    }

    setSubmitting(true)
    setError("")
    setSuccess("")

    const specialtiesArray = form.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const profile = {
      specialties: specialtiesArray,
      bio: form.bio || undefined
    }

    if (form.experienceYears) {
      profile.experienceYears = Number(form.experienceYears)
    }

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
          role: "trainer",
          profile
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to create trainer.")
      }

      setSuccess("Trainer created successfully.")
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        specialties: "",
        experienceYears: "",
        bio: ""
      })

      // Refresh trainer list
      fetchTrainers()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTrainer = async (trainer) => {
    if (!token) {
      setError("You must be logged in as an admin to delete trainers.")
      return
    }

    const confirmed = window.confirm(`Delete trainer "${trainer.name}"?`)
    if (!confirmed) return

    try {
      setDeletingTrainerId(trainer.id)
      setError("")
      setSuccess("")

      const response = await fetch(`${API_BASE}/api/users/${trainer.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to delete trainer.")
      }

      setSuccess("Trainer deleted successfully.")
      fetchTrainers()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingTrainerId("")
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Trainers"
        description="View trainer workload and specializations."
        actions={
          <Button onClick={() => setShowForm((open) => !open)}>
            {showForm ? "Close form" : "Add trainer"}
          </Button>
        }
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}

      {showForm && (
        <Card title="Add Trainer" subtitle="Create a new trainer and profile.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              name="name"
              placeholder="Trainer name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="trainer@gym.com"
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
            <Input
              label="Specialties"
              name="specialties"
              placeholder="e.g. Strength, Mobility, HIIT"
              value={form.specialties}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <Input
              label="Experience (years)"
              name="experienceYears"
              type="number"
              min="0"
              step="1"
              value={form.experienceYears}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-200">Bio</label>
              <textarea
                name="bio"
                rows={3}
                className="w-full rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Short intro, certifications, or coaching style."
                value={form.bio}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating trainer..." : "Create trainer"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card title="Trainer Roster" subtitle="Active coaching staff">
        {loading ? (
          <p className="text-sm text-slate-400">Loading trainers...</p>
        ) : (
        <DataTable columns={columns} rows={trainers} />
        )}
      </Card>
    </div>
  )
}
