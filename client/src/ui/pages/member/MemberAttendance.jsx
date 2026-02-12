import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import DataTable from "../../components/DataTable.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function MemberAttendance() {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const columns = [
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "method", label: "Method" }
  ]

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    const fetchAttendance = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await fetch(`${API_BASE}/api/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: "include",
          signal: controller.signal
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || "Unable to load attendance.")
        }

        const data = await response.json()
        const mapped =
          data.records?.map((record) => {
            const date = new Date(record.date)
            return {
              id: record._id,
              date: date.toLocaleDateString(),
              time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              method: record.method === "qr" ? "QR" : "Manual"
            }
          }) ?? []

        setRows(mapped)
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
    return () => controller.abort()
  }, [token])

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Attendance History"
        description="Review your recent check-ins."
      />
      <Card title="Recent Visits" subtitle="Last 7 sessions">
        {loading ? (
          <p className="text-sm text-slate-400">Loading attendance...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
      </Card>
    </div>
  )
}
