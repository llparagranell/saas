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
import { useAuth } from "../context/AuthContext.jsx"

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
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
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="plans" element={<MembershipPlans />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<ProfileSettings />} />

        <Route path="member-home" element={<MemberHome />} />
        <Route path="member-workouts" element={<MemberWorkouts />} />
        <Route path="member-diet" element={<MemberDiet />} />
        <Route path="member-attendance" element={<MemberAttendance />} />

        <Route path="trainer-home" element={<TrainerHome />} />
        <Route path="trainer-members" element={<TrainerMembers />} />
        <Route path="trainer-plans" element={<TrainerPlans />} />
      </Route>

      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}
