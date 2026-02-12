import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.9)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  color: "#e2e8f0",
  fontSize: "12px"
}

export default function RevenueChart({ data }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5ce1e6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#5ce1e6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke="#5ce1e6" fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
