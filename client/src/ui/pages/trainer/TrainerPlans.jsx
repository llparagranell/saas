import { useEffect, useMemo, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import Button from "../../components/Button.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

const getMemberId = (plan) =>
  typeof plan.member === "object" && plan.member !== null ? plan.member._id : plan.member

const MEAL_SLOTS = [
  { key: "breakfast", label: "Breakfast" },
  { key: "brunch", label: "Brunch" },
  { key: "lunch", label: "Lunch" },
  { key: "snacks", label: "Snacks" },
  { key: "dinner", label: "Dinner" },
  { key: "beforeBed", label: "Before Bed" }
]

const normalizeMealName = (value = "") => value.toLowerCase().replace(/\s+/g, "")

export default function TrainerPlans() {
  const { token } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [diets, setDiets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [members, setMembers] = useState([])

  const [showWorkoutForm, setShowWorkoutForm] = useState(false)
  const [showDietForm, setShowDietForm] = useState(false)

  const [creating, setCreating] = useState(false)
  const [deletingWorkoutId, setDeletingWorkoutId] = useState("")
  const [deletingDietId, setDeletingDietId] = useState("")
  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState("")

  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [visiblePlanTypeByMember, setVisiblePlanTypeByMember] = useState({})

  const [workoutForm, setWorkoutForm] = useState({
    member: "",
    title: "",
    notes: ""
  })

  const [dietForm, setDietForm] = useState({
    member: "",
    title: "",
    notes: "",
    breakfast: "",
    brunch: "",
    lunch: "",
    snacks: "",
    dinner: "",
    beforeBed: ""
  })

  const memberNameMap = members.reduce((acc, member) => {
    acc[member.id] = member.name
    return acc
  }, {})

  const getMemberName = (plan) => {
    const memberId = getMemberId(plan)
    return memberNameMap[memberId] || "Unknown member"
  }

  const selectedMemberWorkouts = useMemo(
    () => workouts.filter((plan) => getMemberId(plan) === selectedMemberId),
    [workouts, selectedMemberId]
  )

  const selectedMemberDiets = useMemo(
    () => diets.filter((plan) => getMemberId(plan) === selectedMemberId),
    [diets, selectedMemberId]
  )

  const loadData = async (signal) => {
    if (!token) return
    try {
      setLoading(true)
      setError("")
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const [workoutsRes, dietsRes, membersRes] = await Promise.all([
        fetch(`${API_BASE}/api/workouts`, {
          headers,
          credentials: "include",
          signal
        }),
        fetch(`${API_BASE}/api/diets`, {
          headers,
          credentials: "include",
          signal
        }),
        fetch(`${API_BASE}/api/users/trainer/members`, {
          headers,
          credentials: "include",
          signal
        })
      ])

      const workoutsData = workoutsRes.ok ? await workoutsRes.json() : { workouts: [] }
      const dietsData = dietsRes.ok ? await dietsRes.json() : { diets: [] }
      const membersData = membersRes.ok ? await membersRes.json() : { members: [] }

      setWorkouts(workoutsData.workouts ?? [])
      setDiets(dietsData.diets ?? [])
      setMembers(membersData.members ?? [])
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Unable to load plans.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    loadData(controller.signal)
    return () => controller.abort()
  }, [token])

  const handleWorkoutChange = (event) => {
    const { name, value } = event.target
    setWorkoutForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDietChange = (event) => {
    const { name, value } = event.target
    setDietForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateWorkout = async (event) => {
    event.preventDefault()
    if (!token) return
    if (!workoutForm.member) {
      setFormError("Select a member for the workout plan.")
      return
    }

    setCreating(true)
    setFormError("")
    setSuccess("")

    try {
      const response = await fetch(`${API_BASE}/api/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          member: workoutForm.member,
          title: workoutForm.title,
          notes: workoutForm.notes || undefined
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to create workout plan.")
      }

      setSuccess("Workout plan created.")
      setWorkoutForm({ member: "", title: "", notes: "" })
      await loadData()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleCreateDiet = async (event) => {
    event.preventDefault()
    if (!token) return
    if (!dietForm.member) {
      setFormError("Select a member for the diet plan.")
      return
    }

    setCreating(true)
    setFormError("")
    setSuccess("")

    const meals = MEAL_SLOTS.map((slot) => {
      const raw = dietForm[slot.key] || ""
      return {
        name: slot.label,
        items: raw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    }).filter((meal) => meal.items.length > 0)

    try {
      const response = await fetch(`${API_BASE}/api/diets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          member: dietForm.member,
          title: dietForm.title,
          notes: dietForm.notes || undefined,
          meals: meals.length ? meals : undefined
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to create diet plan.")
      }

      setSuccess("Diet plan created.")
      setDietForm({
        member: "",
        title: "",
        notes: "",
        breakfast: "",
        brunch: "",
        lunch: "",
        snacks: "",
        dinner: "",
        beforeBed: ""
      })
      await loadData()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteWorkout = async (plan) => {
    if (!token || !plan?._id) return
    const confirmed = window.confirm(`Delete workout "${plan.title}"?`)
    if (!confirmed) return

    try {
      setDeletingWorkoutId(plan._id)
      setFormError("")
      setSuccess("")

      const response = await fetch(`${API_BASE}/api/workouts/${plan._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to delete workout plan.")
      }

      setSuccess("Workout plan deleted.")
      await loadData()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setDeletingWorkoutId("")
    }
  }

  const handleDeleteDiet = async (plan) => {
    if (!token || !plan?._id) return
    const confirmed = window.confirm(`Delete diet "${plan.title}"?`)
    if (!confirmed) return

    try {
      setDeletingDietId(plan._id)
      setFormError("")
      setSuccess("")

      const response = await fetch(`${API_BASE}/api/diets/${plan._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Unable to delete diet plan.")
      }

      setSuccess("Diet plan deleted.")
      await loadData()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setDeletingDietId("")
    }
  }

  const showPlanForMember = (memberId, planType) => {
    setSelectedMemberId(memberId)
    setVisiblePlanTypeByMember((prev) => ({
      ...prev,
      [memberId]: planType
    }))
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Plans Workspace"
        description="Create and review workout and diet plans for assigned members."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="secondary" onClick={() => setShowWorkoutForm((o) => !o)}>
              {showWorkoutForm ? "Close workout form" : "New workout plan"}
            </Button>
            <Button variant="secondary" onClick={() => setShowDietForm((o) => !o)}>
              {showDietForm ? "Close diet form" : "New diet plan"}
            </Button>
          </div>
        }
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      {success && <p className="text-sm text-emerald-400">{success}</p>}
      {(showWorkoutForm || showDietForm) && (
        <Card title="Create Plans" subtitle="Select a member and define workout or diet details.">
          <div className="grid gap-6 lg:grid-cols-2">
            {showWorkoutForm && (
              <form className="space-y-3" onSubmit={handleCreateWorkout}>
                <h3 className="text-sm font-semibold text-slate-100">Workout plan</h3>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Member</label>
                  <select
                    name="member"
                    value={workoutForm.member}
                    onChange={handleWorkoutChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                    required
                  >
                    <option value="">Select member</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={workoutForm.title}
                    onChange={handleWorkoutChange}
                    required
                    placeholder="e.g. Starter Strength Block"
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={workoutForm.notes}
                    onChange={handleWorkoutChange}
                    placeholder="Optional overview or key focus points."
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <Button type="submit" disabled={creating}>
                  {creating ? "Saving..." : "Save workout plan"}
                </Button>
              </form>
            )}

            {showDietForm && (
              <form className="space-y-3" onSubmit={handleCreateDiet}>
                <h3 className="text-sm font-semibold text-slate-100">Diet plan</h3>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Member</label>
                  <select
                    name="member"
                    value={dietForm.member}
                    onChange={handleDietChange}
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                    required
                  >
                    <option value="">Select member</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={dietForm.title}
                    onChange={handleDietChange}
                    required
                    placeholder="e.g. Lean Plan"
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={dietForm.notes}
                    onChange={handleDietChange}
                    placeholder="Optional overview or calorie target."
                    className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {MEAL_SLOTS.map((slot) => (
                    <div key={slot.key}>
                      <label className="mb-1 block text-xs font-medium text-slate-300">
                        {slot.label}
                      </label>
                      <input
                        type="text"
                        name={slot.key}
                        value={dietForm[slot.key]}
                        onChange={handleDietChange}
                        placeholder="Comma separated items"
                        className="w-full rounded-md border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-100"
                      />
                    </div>
                  ))}
                </div>
                <Button type="submit" disabled={creating}>
                  {creating ? "Saving..." : "Save diet plan"}
                </Button>
              </form>
            )}
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Members" subtitle="Choose a member to view assigned plans">
          {loading ? (
            <p className="text-sm text-slate-400">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-slate-400">No members assigned yet.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-300">
              {members.map((member) => {
                const selectedType = visiblePlanTypeByMember[member.id]
                return (
                  <li
                    key={member.id}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-slate-100">{member.name}</p>
                      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <button
                          type="button"
                          onClick={() => showPlanForMember(member.id, "workout")}
                          className="rounded-md border border-sky-500/60 px-2 py-1 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/10"
                        >
                          View workout plan
                        </button>
                        <button
                          type="button"
                          onClick={() => showPlanForMember(member.id, "diet")}
                          className="rounded-md border border-emerald-500/60 px-2 py-1 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
                        >
                          View diet plan
                        </button>
                      </div>
                    </div>
                    {selectedType && selectedMemberId === member.id && (
                      <p className="mt-2 text-xs text-slate-400">
                        Showing {selectedType} plan in details panel.
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card title="Plan Details" subtitle="All workout and diet plans for selected member">
          {!selectedMemberId ? (
            <p className="text-sm text-slate-400">Select a member and click a view button.</p>
          ) : (
            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Member</p>
                <p className="font-medium text-slate-100">
                  {memberNameMap[selectedMemberId] || "Unknown member"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Workout Plans</p>
                {selectedMemberWorkouts.length === 0 ? (
                  <p className="mt-1 text-slate-400">No workout plans assigned.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {selectedMemberWorkouts.map((plan) => (
                      <li
                        key={plan._id}
                        className="rounded-lg border border-slate-800 bg-slate-900/60 p-2"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-100">{plan.title}</p>
                            {plan.notes && <p className="text-xs text-slate-400">{plan.notes}</p>}
                            <p className="mt-1 text-xs text-slate-500">Assigned to {getMemberName(plan)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteWorkout(plan)}
                            disabled={deletingWorkoutId === plan._id}
                            className="rounded-md border border-red-500/60 px-2 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingWorkoutId === plan._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Diet Plans</p>
                {selectedMemberDiets.length === 0 ? (
                  <p className="mt-1 text-slate-400">No diet plans assigned.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {selectedMemberDiets.map((plan) => (
                      <li
                        key={plan._id}
                        className="rounded-lg border border-slate-800 bg-slate-900/60 p-2"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-100">{plan.title}</p>
                            {plan.notes && <p className="text-xs text-slate-400">{plan.notes}</p>}
                            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {MEAL_SLOTS.map((slot) => {
                                const meal = (plan.meals || []).find(
                                  (m) => normalizeMealName(m?.name) === normalizeMealName(slot.label)
                                )
                                const items =
                                  Array.isArray(meal?.items) && meal.items.length > 0
                                    ? meal.items.join(", ")
                                    : "Not set"

                                return (
                                  <div
                                    key={`${plan._id}-${slot.key}`}
                                    className="rounded-md border border-slate-700 bg-slate-950/40 p-2"
                                  >
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      {slot.label}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-300">{items}</p>
                                  </div>
                                )
                              })}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Assigned to {getMemberName(plan)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteDiet(plan)}
                            disabled={deletingDietId === plan._id}
                            className="rounded-md border border-red-500/60 px-2 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingDietId === plan._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
         )}
        </Card>
      </div>
    </div>
  )
}
