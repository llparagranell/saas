import { Navigate, Route, Routes } from "react-router-dom"
import DashboardLayout from "../ui/layouts/DashboardLayout.jsx"
import AuthLayout from "../ui/layouts/AuthLayout.jsx"
import Login from "../ui/pages/Login.jsx"
import Register from "../ui/pages/Register.jsx"
import AdminDashboard from "../ui/pages/admin/AdminDashboard.jsx"
import Members from "../ui/pages/admin/Members.jsx"
import Trainers from "../ui/pages/admin/Trainers.jsx"
import MembershipPlans from "../ui/pages/admin/MembershipPlans.jsx"
import Attendance from "../ui/pages/admin/Attendance.jsx"
import Payments from "../ui/pages/admin/Payments.jsx"
import Reports from "../ui/pages/admin/Reports.jsx"
import ProfileSettings from "../ui/pages/common/ProfileSettings.jsx"
import MemberHome from "../ui/pages/member/MemberHome.jsx"
import TrainerHome from "../ui/pages/trainer/TrainerHome.jsx"
import MemberWorkouts from "../ui/pages/member/MemberWorkouts.jsx"
import MemberDiet from "../ui/pages/member/MemberDiet.jsx"
import MemberAttendance from "../ui/pages/member/MemberAttendance.jsx"
import TrainerMembers from "../ui/pages/trainer/TrainerMembers.jsx"
import TrainerPlans from "../ui/pages/trainer/TrainerPlans.jsx"
import SuperAdminGyms from "../ui/pages/superadmin/SuperAdminGyms.jsx"
import Home from "../ui/pages/public/Home.jsx"
import { useAuth } from "../context/AuthContext.jsx"

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

const RoleRoute = ({ roles, children }) => {
  const { role } = useAuth()
  if (!roles.includes(role)) return <Navigate to="/app/dashboard" replace />
  return children
}

export default function AppRoutes() {
  const { role } = useAuth()
  const dashboardElement =
    role === "super_admin" ? <SuperAdminGyms /> : role === "trainer" ? <TrainerHome /> : role === "member" ? <MemberHome /> : <AdminDashboard />

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={dashboardElement} />
        <Route path="members" element={<RoleRoute roles={["admin"]}><Members /></RoleRoute>} />
        <Route path="trainers" element={<RoleRoute roles={["admin"]}><Trainers /></RoleRoute>} />
        <Route path="plans" element={<RoleRoute roles={["admin"]}><MembershipPlans /></RoleRoute>} />
        <Route path="attendance" element={<RoleRoute roles={["admin"]}><Attendance /></RoleRoute>} />
        <Route path="payments" element={<RoleRoute roles={["admin"]}><Payments /></RoleRoute>} />
        <Route path="reports" element={<RoleRoute roles={["admin"]}><Reports /></RoleRoute>} />
        <Route path="profile" element={<ProfileSettings />} />

        <Route path="member-home" element={<RoleRoute roles={["member"]}><MemberHome /></RoleRoute>} />
        <Route path="member-workouts" element={<RoleRoute roles={["member"]}><MemberWorkouts /></RoleRoute>} />
        <Route path="member-diet" element={<RoleRoute roles={["member"]}><MemberDiet /></RoleRoute>} />
        <Route path="member-attendance" element={<RoleRoute roles={["member"]}><MemberAttendance /></RoleRoute>} />

        <Route path="trainer-home" element={<RoleRoute roles={["trainer"]}><TrainerHome /></RoleRoute>} />
        <Route path="trainer-members" element={<RoleRoute roles={["trainer"]}><TrainerMembers /></RoleRoute>} />
        <Route path="trainer-plans" element={<RoleRoute roles={["trainer"]}><TrainerPlans /></RoleRoute>} />
        <Route path="super-admin" element={<RoleRoute roles={["super_admin"]}><SuperAdminGyms /></RoleRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
