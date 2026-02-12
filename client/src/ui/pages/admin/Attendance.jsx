import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import DataTable from "../../components/DataTable.jsx"
import Button from "../../components/Button.jsx"
import Badge from "../../components/Badge.jsx"
import { attendance } from "../../../data/mock.js"

export default function Attendance() {
  const columns = [
    { key: "name", label: "Member" },
    { key: "time", label: "Time" },
    {
      key: "method",
      label: "Method",
      render: (row) => (
        <Badge tone={row.method === "QR" ? "success" : "warning"}>{row.method}</Badge>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Attendance Tracking"
        description="Manual and QR-based attendance check-ins."
        actions={<Button>New check-in</Button>}
      />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Attendance Log" subtitle="Latest check-ins">
          <DataTable columns={columns} rows={attendance} />
        </Card>
        <Card
          title="QR Attendance"
          subtitle="Placeholder for QR code scanner integration"
        >
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 text-center">
            <p className="text-sm text-slate-400">QR scanner module goes here.</p>
            <button className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-300">
              Connect device
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
