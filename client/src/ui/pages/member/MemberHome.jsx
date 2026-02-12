import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import StatCard from "../../components/StatCard.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function MemberHome() {
  const { token } = useAuth()
  const [progress, setProgress] = useState([])
  const [profile, setProfile] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    const fetchProgress = async () => {
      try {
        setLoadingProgress(true)
        setError("")
        const response = await fetch(`${API_BASE}/api/progress`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          signal: controller.signal
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || "Unable to load progress.")
        }

        const data = await response.json()
        setProgress(data.entries ?? [])
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoadingProgress(false)
      }
    }

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true)
        const response = await fetch(`${API_BASE}/api/users/me/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          signal: controller.signal
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || "Unable to load membership profile.")
        }

        const data = await response.json()
        setProfile(data.profile ?? null)
      } catch (err) {
        if (err.name !== "AbortError") {
          // Don’t override an existing progress error, just append in console
          console.error(err)
        }
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProgress()
    fetchProfile()

    return () => controller.abort()
  }, [token])

  const latest = progress[0]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Member Overview"
        description="Track membership status and progress."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Membership"
          value={profile?.membershipPlan?.name ?? "No plan"}
          trend={
            profile?.endDate
              ? `Renews ${new Date(profile.endDate).toLocaleDateString()}`
              : "No end date set"
          }
        />
        <StatCard
          label="Trainer"
          value={profile?.trainer?.name ?? "Unassigned"}
          trend={profile?.trainer?.email ?? "Waiting for trainer assignment"}
        />
        <StatCard
          label="Latest Weight"
          value={latest?.weightKg != null ? `${latest.weightKg} kg` : "—"}
          trend={latest?.date ? new Date(latest.date).toLocaleDateString() : "No measurements yet"}
        />
      </div>
      <Card title="Progress Tracking" subtitle="Recent measurements">
        {loadingProgress ? (
          <p className="text-sm text-slate-400">Loading progress...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : progress.length === 0 ? (
          <p className="text-sm text-slate-400">
            No progress entries yet. Your trainer can start logging your measurements from the
            admin/trainer side.
          </p>
        ) : (
          <div className="grid gap-3">
            {progress.map((entry) => (
              <div
                key={entry._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm"
              >
                <span className="w-full sm:w-auto">{new Date(entry.date).toLocaleDateString()}</span>
                <span>{entry.weightKg != null ? `${entry.weightKg} kg` : "—"}</span>
                <span className="w-full sm:w-auto">
                  {entry.bodyFatPercent != null ? `${entry.bodyFatPercent.toFixed(1)} %` : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
