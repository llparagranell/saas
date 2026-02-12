import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import DataTable from "../../components/DataTable.jsx"
import Button from "../../components/Button.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function TrainerMembers() {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedMember, setSelectedMember] = useState("")
  const [progress, setProgress] = useState([])
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [progressError, setProgressError] = useState("")
  const [progressForm, setProgressForm] = useState({
    date: "",
    weightKg: "",
    bodyFatPercent: "",
    notes: ""
  })
  const [saving, setSaving] = useState(false)

  const columns = [
    { key: "name", label: "Member" },
    { key: "workoutPlan", label: "Workout Plan" },
    { key: "dietPlan", label: "Diet Plan" },
    { key: "goal", label: "Goal" },
    { key: "status", label: "Status" }
  ]

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    const fetchMembers = async () => {
      try {
        setLoading(true)
        setError("")
        const headers = {
          Authorization: `Bearer ${token}`
        }

        const [membersRes, workoutsRes, dietsRes] = await Promise.all([
          fetch(`${API_BASE}/api/users/trainer/members`, {
            headers,
            credentials: "include",
            signal: controller.signal
          }),
          fetch(`${API_BASE}/api/workouts`, {
            headers,
            credentials: "include",
            signal: controller.signal
          }),
          fetch(`${API_BASE}/api/diets`, {
            headers,
            credentials: "include",
            signal: controller.signal
          })
        ])

        if (!membersRes.ok) {
          const data = await membersRes.json().catch(() => ({}))
          throw new Error(data.message || "Unable to load members.")
        }

        const membersData = await membersRes.json()
        const workoutsData = workoutsRes.ok ? await workoutsRes.json() : { workouts: [] }
        const dietsData = dietsRes.ok ? await dietsRes.json() : { diets: [] }

        const latestWorkoutByMember = new Map()
        const latestDietByMember = new Map()

        ;(workoutsData.workouts ?? []).forEach((plan) => {
          const memberId =
            typeof plan.member === "object" && plan.member !== null ? plan.member._id : plan.member
          if (memberId && !latestWorkoutByMember.has(memberId)) {
            latestWorkoutByMember.set(memberId, plan.title)
          }
        })

        ;(dietsData.diets ?? []).forEach((plan) => {
          const memberId =
            typeof plan.member === "object" && plan.member !== null ? plan.member._id : plan.member
          if (memberId && !latestDietByMember.has(memberId)) {
            latestDietByMember.set(memberId, plan.title)
          }
        })

        const mapped =
          membersData.members?.map((m) => ({
            id: m.id,
            name: m.name,
            workoutPlan: latestWorkoutByMember.get(m.id) || "Not assigned",
            dietPlan: latestDietByMember.get(m.id) || "Not assigned",
            goal: m.goal || "-",
            status: m.status
          })) ?? []

        setRows(mapped)
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
    return () => controller.abort()
  }, [token])

  const handleSelectChange = (event) => {
    const memberId = event.target.value
    setSelectedMember(memberId)
  }

  useEffect(() => {
    if (!token || !selectedMember) {
      setProgress([])
      setProgressError("")
      return
    }
    const controller = new AbortController()

    const fetchProgress = async () => {
      try {
        setLoadingProgress(true)
        setProgressError("")
        const response = await fetch(
          `${API_BASE}/api/progress?memberId=${encodeURIComponent(selectedMember)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            credentials: "include",
            signal: controller.signal
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || "Unable to load member progress.")
        }

        const data = await response.json()
        setProgress(data.entries ?? [])
      } catch (err) {
        if (err.name !== "AbortError") {
          setProgressError(err.message)
        }
      } finally {
        setLoadingProgress(false)
      }
    }

    fetchProgress()
    return () => controller.abort()
  }, [token, selectedMember])

  const handleProgressChange = (event) => {
    const { name, value } = event.target
    setProgressForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitProgress = async (event) => {
    event.preventDefault()
    if (!token || !selectedMember) return

    setSaving(true)
    setProgressError("")
    try {
      const body = {
        member: selectedMember,
        weightKg: progressForm.weightKg ? Number(progressForm.weightKg) : undefined,
        bodyFatPercent: progressForm.bodyFatPercent
          ? Number(progressForm.bodyFatPercent)
          : undefined,
        notes: progressForm.notes || undefined
      }
      if (progressForm.date) {
        body.date = progressForm.date
      }

      const response = await fetch(`${API_BASE}/api/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to save progress.")
      }

      setProgressForm({
        date: "",
        weightKg: "",
        bodyFatPercent: "",
        notes: ""
      })

      const controller = new AbortController()
      const res = await fetch(
        `${API_BASE}/api/progress?memberId=${encodeURIComponent(selectedMember)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          signal: controller.signal
        }
      )
      if (res.ok) {
        const data = await res.json()
        setProgress(data.entries ?? [])
      }
    } catch (err) {
      setProgressError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Assigned Members"
        description="Track progress and update plans."
        actions={
          <div className="flex w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              Message group
            </Button>
          </div>
        }
      />
      <Card title="Member List" subtitle="Your current roster with assigned plans">
        {loading ? (
          <p className="text-sm text-slate-400">Loading members...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </Card>
      <Card title="Progress" subtitle="Log and review measurements for a member.">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Member</label>
            <select
              value={selectedMember}
              onChange={handleSelectChange}
              className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
            >
              <option value="">Select a member</option>
              {rows.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <>
              <form className="grid gap-3 md:grid-cols-4" onSubmit={handleSubmitProgress}>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={progressForm.date}
                    onChange={handleProgressChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weightKg"
                    min="0"
                    step="0.1"
                    value={progressForm.weightKg}
                    onChange={handleProgressChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Body fat (%)
                  </label>
                  <input
                    type="number"
                    name="bodyFatPercent"
                    min="0"
                    step="0.1"
                    value={progressForm.bodyFatPercent}
                    onChange={handleProgressChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="mb-1 block text-xs font-medium text-slate-300">Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={progressForm.notes}
                    onChange={handleProgressChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Add progress entry"}
                  </Button>
                </div>
              </form>

              {progressError && <p className="text-sm text-red-500">{progressError}</p>}

              <div className="space-y-2 text-sm text-slate-300">
                {loadingProgress ? (
                  <p className="text-sm text-slate-400">Loading progress...</p>
                ) : progress.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No progress entries yet for this member.
                  </p>
                ) : (
                  progress.map((entry) => (
                    <div
                      key={entry._id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2"
                    >
                      <span className="w-full sm:w-auto">{new Date(entry.date).toLocaleDateString()}</span>
                      <span className="w-full sm:w-auto">
                        {entry.weightKg != null ? `${entry.weightKg} kg` : "-"} /{" "}
                        {entry.bodyFatPercent != null ? `${entry.bodyFatPercent.toFixed(1)} %` : "-"}
                      </span>
                      <span className="w-full text-xs text-slate-400 sm:w-auto">{entry.notes || ""}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
