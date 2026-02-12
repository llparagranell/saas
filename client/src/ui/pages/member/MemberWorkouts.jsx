import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import Badge from "../../components/Badge.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function MemberWorkouts() {
  const { token } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    const fetchWorkouts = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await fetch(`${API_BASE}/api/workouts`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          signal: controller.signal
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || "Unable to load workouts.")
        }

        const data = await response.json()
        setWorkouts(data.workouts ?? [])
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
    return () => controller.abort()
  }, [token])

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Workout Plans"
        description="Your current training split and focus areas."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <p className="text-sm text-slate-400">Loading workouts...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : workouts.length === 0 ? (
          <Card title="No workout plans yet">
            <p className="text-sm text-slate-400">
              Your trainer hasn&apos;t assigned any workout plans yet. They will appear here once
              available.
            </p>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card
              key={workout._id}
              title={workout.title}
              subtitle={
                workout.schedule && workout.schedule.length > 0
                  ? workout.schedule.map((s) => s.focus || s.day).join(" • ")
                  : workout.notes || "Custom program"
              }
              action={<Badge tone="success">Active</Badge>}
            >
              <p className="text-sm text-slate-400">
                {workout.notes ||
                  "Detailed exercises and reps will appear here after your trainer assigns them."}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
