import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function MemberDiet() {
  const { token } = useAuth()
  const [diet, setDiet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    const fetchDiet = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await fetch(`${API_BASE}/api/diets`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          signal: controller.signal
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || "Unable to load diet plan.")
        }

        const data = await response.json()
        // Take the most recent diet plan for this member
        setDiet((data.diets ?? [])[0] || null)
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDiet()
    return () => controller.abort()
  }, [token])

  const meals = diet?.meals ?? []

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Diet Plan"
        description="Your daily nutrition schedule."
      />
      {loading ? (
        <p className="text-sm text-slate-400">Loading diet plan...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : !diet ? (
        <Card title="No diet plan yet" subtitle="Your trainer will assign one soon.">
          <p className="text-sm text-slate-400">
            Once your trainer assigns a diet plan, it will appear here with meals and timing.
          </p>
        </Card>
      ) : (
        <Card
          title={diet.title || "Diet plan"}
          subtitle="All meals for your current plan in one view."
        >
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal._id || meal.name} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between text-sm font-medium text-slate-100">
                  <span>{meal.name}</span>
                  {meal.time && <span className="text-xs text-slate-400">{meal.time}</span>}
                </div>
                <ul className="mt-2 space-y-1 text-sm text-slate-300">
                  {(meal.items || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
