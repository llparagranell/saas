import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import RevenueChart from "../../components/RevenueChart.jsx"
import { revenue } from "../../../data/mock.js"

export default function Reports() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Reports"
        description="Download summaries and trends for stakeholders."
      />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Revenue Trend" subtitle="Monthly growth">
          <RevenueChart data={revenue} />
        </Card>
        <Card title="Export Center" subtitle="Generate PDF/CSV reports">
          <div className="space-y-3">
            {["Monthly Revenue", "Attendance Summary", "Trainer Utilization"].map((item) => (
              <button
                key={item}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm"
              >
                {item}
                <span className="text-xs text-neon">Download</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
