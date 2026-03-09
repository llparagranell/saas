import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import DataTable from "../../components/DataTable.jsx"
import Input from "../../components/Input.jsx"
import Button from "../../components/Button.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function SuperAdminGyms() {
  const { token } = useAuth()
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({
    gymName: "",
    gymCode: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: ""
  })

  const columns = [
    { key: "name", label: "Gym" },
    { key: "code", label: "Code" },
    { key: "admins", label: "Admins" }
  ]

  const fetchGyms = async (signal) => {
    if (!token) return
    try {
      setLoading(true)
      setError("")
      const response = await fetch(`${API_BASE}/api/super-admin/gyms`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        signal
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to load gyms.")
      }
      const data = await response.json()
      const rows =
        data.gyms?.map((gym) => ({
          id: gym.id,
          name: gym.name,
          code: gym.code || "-",
          admins:
            gym.admins && gym.admins.length > 0
              ? gym.admins.map((admin) => admin.email).join(", ")
              : "No admins"
        })) ?? []
      setGyms(rows)
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
    fetchGyms(controller.signal)
    return () => controller.abort()
  }, [token])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!token) return
    try {
      setSubmitting(true)
      setError("")
      setSuccess("")
      const response = await fetch(`${API_BASE}/api/super-admin/gyms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          gymName: form.gymName,
          gymCode: form.gymCode || undefined,
          admin: {
            name: form.adminName,
            email: form.adminEmail,
            phone: form.adminPhone || undefined,
            password: form.adminPassword
          }
        })
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to create gym.")
      }
      setSuccess("Gym and admin created successfully.")
      setForm({
        gymName: "",
        gymCode: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        adminPassword: ""
      })
      fetchGyms()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Super Admin"
        description="Create gyms and assign one admin account to each gym."
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}

      <Card title="Create Gym + Admin" subtitle="Provision a new gym workspace and admin login.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            label="Gym name"
            name="gymName"
            value={form.gymName}
            onChange={handleChange}
            required
          />
          <Input label="Gym code" name="gymCode" value={form.gymCode} onChange={handleChange} />
          <Input
            label="Admin name"
            name="adminName"
            value={form.adminName}
            onChange={handleChange}
            required
          />
          <Input
            label="Admin email"
            name="adminEmail"
            type="email"
            value={form.adminEmail}
            onChange={handleChange}
            required
          />
          <Input
            label="Admin phone"
            name="adminPhone"
            value={form.adminPhone}
            onChange={handleChange}
          />
          <Input
            label="Admin password"
            name="adminPassword"
            type="password"
            value={form.adminPassword}
            onChange={handleChange}
            required
          />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create gym"}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Gyms" subtitle="All gyms and linked admin users">
        {loading ? (
          <p className="text-sm text-slate-400">Loading gyms...</p>
        ) : (
          <DataTable columns={columns} rows={gyms} />
        )}
      </Card>
    </div>
  )
}
