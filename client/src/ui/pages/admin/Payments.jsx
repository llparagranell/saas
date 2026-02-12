import SectionHeader from "../../components/SectionHeader.jsx"
import Card from "../../components/Card.jsx"
import DataTable from "../../components/DataTable.jsx"
import Button from "../../components/Button.jsx"
import Badge from "../../components/Badge.jsx"
import { payments } from "../../../data/mock.js"

export default function Payments() {
  const columns = [
    { key: "member", label: "Member" },
    { key: "amount", label: "Amount" },
    { key: "method", label: "Method" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge tone={row.status === "Paid" ? "success" : "warning"}>{row.status}</Badge>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Payments Overview"
        description="Track cash, card, UPI, and online payments."
        actions={<Button>Record payment</Button>}
      />
      <Card title="Latest Transactions" subtitle="Recent member payments">
        <DataTable columns={columns} rows={payments} />
      </Card>
    </div>
  )
}
