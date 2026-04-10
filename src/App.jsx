import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
// Import các trang hiện có
import Profile from "./pages/user/Profile";
import ResumeExport from "./pages/user/ResumeExport";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/user/Home";
import ChangePassword from "./pages/user/ChangePassword";
import Update from "./pages/user/Update";
import AuditLogPageUser from "./pages/user/AuditLogPageUser";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import MainLayout from "./pages/shared/MainLayout";
import ErrorPage from "./pages/shared/ErrorPage";
import ManagerStaffPage from "./manager/ManagerStaffPage";
import StaffDetailPage from "./manager/StaffDetailPage";
import ApproveStaff from "./manager/ApproveStaff";
import DashBoard from "./manager/DashBoard";
import AdminStaffPage from "./pages/admin/AdminStaffPage";
import ApproveStaffAdmin from "./pages/admin/ApproveStaffAdmin";
import AccountManagement from "./pages/admin/AccountManagement";
import AuditLogPage from "./pages/admin/AuditLogPage";
import CategoriesManagement from "./pages/admin/CategoriesManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import LanguageManagement from "./pages/admin/LanguageManagement";
import RegisterManagement from "./pages/admin/RegisterManagement";

// --- IMPORT THÊM TRANG ADMIN VỪA VIẾT ---
import DashboardAdmin from "./pages/admin/DashboardAdmin"; // Trí nhớ check lại đường dẫn file này nhé

const App = () => {
    return (
        <Routes>
            {/* 1. TRANG CÔNG CỘNG */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 2. CỤM CHO USER */}
            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={["User", "Manager", "Admin"]}
                    />
                }
            >
                <Route path="/user" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="edit-staff/:id" element={<Update />} />
                    <Route path="export" element={<ResumeExport />} />
                    <Route path="logs" element={<AuditLogPageUser />} />
                    <Route
                        path="change-password"
                        element={<ChangePassword />}
                    />
                </Route>
            </Route>

            {/* --- CỤM CHO MANAGER (Người đi duyệt hồ sơ) --- */}
            <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
                <Route path="/manager" element={<MainLayout />}>
                    {/* Dashboard của Manager: Thống kê tình hình duyệt hồ sơ của khoa mình */}
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path="staff-list" element={<ManagerStaffPage />} />
                    <Route
                        path="staff/detail/:id"
                        element={<StaffDetailPage />}
                    />
                    <Route path="approve" element={<ApproveStaff />} />
                </Route>
            </Route>
            <Route
                element={<ProtectedRoute allowedRoles={["Admin", "Manager"]} />}
            >
                <Route element={<MainLayout />}>
                    {/* Đường dẫn này sẽ khớp với path: "/admin/logs" trong Sidebar của Trí */}
                    <Route path="/admin/logs" element={<AuditLogPage />} />

                    {/* Nếu Trí có các trang khác dùng chung cho cả 2 role thì để ở đây */}
                </Route>
            </Route>
            {/* Nhóm các trang dùng chung Layout (Có Sidebar & Navbar) */}
            <Route element={<MainLayout />}>
                <Route path="/admin/logs" element={<AuditLogPage />} />
                {/* 🔥 QUAN TRỌNG: Thêm route Manager vào đây để nó nhận Layout */}
                <Route path="/manager/logs" element={<AuditLogPage />} />
            </Route>
            {/* --- CỤM CHO ADMIN (Người quản trị hệ thống & Cấp quyền) --- */}
            <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                <Route path="/admin" element={<MainLayout />}>
                    <Route index element={<DashboardAdmin />} />
                    <Route path="staff-list" element={<AdminStaffPage />} />
                    <Route
                        path="staff/detail/:id"
                        element={<StaffDetailPage />}
                    />
                    <Route path="approve" element={<ApproveStaffAdmin />} />
                    <Route path="categories-management" element={<CategoriesManagement />} />
                    <Route path="departments-management" element={<DepartmentManagement />} />
                    <Route path="languages-management" element={<LanguageManagement />} />
                    <Route path="register-management" element={<RegisterManagement />} />
                    <Route
                        path="accounts-management"
                        element={<AccountManagement />}
                    />
                </Route>
            </Route>

            {/* BẪY LỖI */}
            <Route path="/404" element={<ErrorPage type="404" />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default App;
