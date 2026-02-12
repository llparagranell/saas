import { useEffect, useState } from "react"
import SectionHeader from "../../components/SectionHeader.jsx"
import StatCard from "../../components/StatCard.jsx"
import Card from "../../components/Card.jsx"
import RevenueChart from "../../components/RevenueChart.jsx"
import Badge from "../../components/Badge.jsx"
import { useAuth } from "../../../context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

export default function AdminDashboard() {
  const { token } = useAuth()

  const [summary, setSummary] = useState(null)
  const [revenueSeries, setRevenueSeries] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const headers = {
          Authorization: `Bearer ${token}`
        }

        const [summaryRes, revenueRes, attendanceRes] = await Promise.all([
          fetch(`${API_BASE}/api/reports/summary`, {
            headers,
            credentials: "include",
            signal: controller.signal
          }),
          fetch(`${API_BASE}/api/reports/revenue-monthly`, {
            headers,
            credentials: "include",
            signal: controller.signal
          }),
          fetch(`${API_BASE}/api/attendance`, {
            headers,
            credentials: "include",
            signal: controller.signal
          })
        ])

        const summaryData = summaryRes.ok ? await summaryRes.json() : { summary: null }
        const revenueData = revenueRes.ok ? await revenueRes.json() : { revenue: [] }
        const attendanceData = attendanceRes.ok ? await attendanceRes.json() : { records: [] }

        setSummary(summaryData.summary)
        setRevenueSeries(revenueData.revenue ?? [])

        const latest = (attendanceData.records ?? []).slice(0, 6).map((record) => {
          const date = new Date(record.date)
          return {
            id: record._id,
            name: record.member?.name ?? "Member",
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            method: record.method === "qr" ? "QR" : "Manual"
          }
        })
        setAttendance(latest)
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Unable to load dashboard data.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [token])

  const stats = summary
    ? [
        {
          label: "Active Members",
          value: summary.members.toString(),
          trend: "Total members in system"
        },
        {
          label: "Active Trainers",
          value: summary.trainers.toString(),
          trend: "Total trainers in system"
        },
        {
          label: "Total Revenue",
          value: `₹${summary.revenue.toLocaleString("en-IN")}`,
          trend: "All-time collected"
        },
        {
          label: "Attendance Today",
          value: summary.attendanceToday.toString(),
          trend: "Check-ins since midnight"
        }
      ]
    : []

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Admin Dashboard"
        description="Track revenue, members, and daily attendance in one glance."
      />
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading && !summary ? (
          <p className="text-sm text-slate-400">Loading summary...</p>
        ) : (
          stats.map((stat) => <StatCard key={stat.label} {...stat} />)
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card
          title="Revenue Pulse"
          subtitle="Monthly collection for the last 6 months"
        >
          {loading && revenueSeries.length === 0 ? (
            <p className="text-sm text-slate-400">Loading revenue...</p>
          ) : (
            <RevenueChart data={revenueSeries} />
          )}
        </Card>
        <Card title="Attendance Today" subtitle="Latest check-ins">
          {loading && attendance.length === 0 ? (
            <p className="text-sm text-slate-400">Loading attendance...</p>
          ) : (
            <div className="space-y-4">
              {attendance.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between border-b border-slate-800/70 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-100">{entry.name}</p>
                    <p className="text-xs text-slate-400">{entry.time}</p>
                  </div>
                  <Badge tone={entry.method === "QR" ? "success" : "warning"}>
                    {entry.method}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
