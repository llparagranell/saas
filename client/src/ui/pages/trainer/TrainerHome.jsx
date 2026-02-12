import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import StatCard from "../../components/StatCard.jsx"
import Card from "../../components/Card.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function TrainerHome() {
  const { token } = useAuth()
  const [members, setMembers] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [diets, setDiets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    const fetchAll = async () => {
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

        const membersData = membersRes.ok ? await membersRes.json() : { members: [] }
        const workoutsData = workoutsRes.ok ? await workoutsRes.json() : { workouts: [] }
        const dietsData = dietsRes.ok ? await dietsRes.json() : { diets: [] }

        setMembers(membersData.members ?? [])
        setWorkouts(workoutsData.workouts ?? [])
        setDiets(dietsData.diets ?? [])
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load trainer overview.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
    return () => controller.abort()
  }, [token])

  const activeMembers = members.length
  const totalPlans = workouts.length + diets.length
  const todayFocus = members.slice(0, 3)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Trainer Overview"
        description="Track assigned members and plan delivery."
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Active Members"
          value={activeMembers.toString()}
          trend={loading ? "Loading..." : `${activeMembers} assigned to you`}
        />
        <StatCard
          label="Plans"
          value={totalPlans.toString()}
          trend={`${workouts.length} workouts · ${diets.length} diets`}
        />
      </div>
      <Card title="Today Focus" subtitle="Sample of assigned members to check in with.">
        {loading ? (
          <p className="text-sm text-slate-400">Loading members...</p>
        ) : todayFocus.length === 0 ? (
          <p className="text-sm text-slate-400">
            No assigned members yet. Once members are assigned to you, they will appear here.
          </p>
        ) : (
          <div className="space-y-3 text-sm text-slate-300">
            {todayFocus.map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 px-4 py-3"
              >
                <span className="w-full sm:w-auto">{member.goal || "Check-in"}</span>
                <span className="w-full text-right sm:w-auto sm:text-left">{member.name}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
