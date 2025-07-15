// pages/admin/AdminLayout.jsx
import Sidebar from "@/pages/admin/Sidebar"
import { Outlet } from "react-router-dom"


const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
