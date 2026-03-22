import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Thêm BrowserRouter vào đây
import { use, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import ResumeExport from "./pages/ResumeExport";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Update from "./pages/Update";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./pages/MainLayout";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
    return (
        <>
            <Routes>
                {/* TRANG CÔNG CỘNG: Ai cũng vào được */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* TRANG NỘI BỘ: Phải qua lớp bảo vệ ProtectedRoute */}
                <Route element={<ProtectedRoute />}>
                    {/* MainLayout chứa Sidebar và Navbar của bạn */}
                    <Route path="/user" element={<MainLayout />}>
                        {/* Các trang con hiện ở <Outlet /> */}
                        <Route index element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="edit-staff/:id" element={<Update />} />
                        <Route path="export" element={<ResumeExport />} />
                        {/* Thêm các trang khác ở đây */}
                    </Route>
                </Route>

                {/* --- CÁI NÀY QUAN TRỌNG: Bẫy mọi link sai --- */}
                <Route path="/404" element={<ErrorPage type="404" />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </>
    );
};

export default App;
