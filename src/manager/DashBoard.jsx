import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosClient from "../axios/axiosClient";

import { 
    FaUsers, FaUserClock, FaCheckDouble, FaGraduationCap, 
    FaChartBar, FaEllipsisV, FaFileExport 
} from "react-icons/fa";

const DashBoard = () => {
    // 1. State lưu trữ dữ liệu từ API
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. Hàm gọi API
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Lấy token từ localStorage (Giả sử Trí lưu token khi login)
                const token = localStorage.getItem("token"); 
                
                const response = await axiosClient.get("http://localhost:5277/api/Dashboard/GetFullData", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.status === 200) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API Dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-6 text-center font-bold">Đang tải dữ liệu DNTU...</div>;
    if (!data) return <div className="p-6 text-center text-red-500">Không thể tải dữ liệu. Vui lòng kiểm tra Token hoặc Server!</div>;

    // 3. Map dữ liệu vào mảng Stats để hiển thị 4 ô trên cùng
    const statsCards = [
        { label: "Tổng nhân sự", value: data.stats.totalStaff, icon: <FaUsers />, color: "bg-blue-500" },
        { label: "Chờ phê duyệt", value: data.stats.pendingApproval, icon: <FaUserClock />, color: "bg-amber-500" },
        { label: "Đã xác thực", value: data.stats.approved, icon: <FaCheckDouble />, color: "bg-green-500" },
        { label: "Trình độ cao", value: data.stats.highQualification, icon: <FaGraduationCap />, color: "bg-purple-500" },
    ];

    return (
        <div className="p-6 mt-15 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Tổng quan quản trị</h1>
                    <p className="text-sm text-slate-500 font-medium">Khoa: {data.recentUpdates[0]?.departmentName || "Đang cập nhật"}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
                    <FaFileExport className="text-blue-600" /> Xuất báo cáo
                </button>
            </div>

            {/* Hàng 1: Thống kê nhanh từ API */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Hàng 2: Biểu đồ (Sử dụng degreeDistribution để mô phỏng) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest flex items-center gap-2">
                            <FaChartBar className="text-blue-600" /> Cơ cấu học vị trong khoa
                        </h3>
                    </div>
                    <div className="flex items-end justify-around h-64 bg-slate-50 rounded-3xl p-6">
                        {data.degreeDistribution.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 w-full">
                                <div 
                                    className="bg-blue-500 w-12 rounded-t-lg transition-all duration-500" 
                                    style={{ height: `${(item.value / data.stats.totalStaff) * 100}%`, minHeight: '20px' }}
                                ></div>
                                <p className="text-[10px] font-bold text-slate-600 truncate w-20 text-center">{item.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danh sách cập nhật gần đây từ API */}
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm w-full"> {/* Thêm w-full */}
    <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest mb-6">Cập nhật gần đây</h3>
    <div className="space-y-6">
        {data.recentUpdates.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4"> {/* Thêm gap-4 để tránh dính nhau */}
                <div className="flex items-center gap-3 min-w-0 flex-1"> {/* Quan trọng: flex-1 và min-w-0 */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {user.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0"> {/* Thêm min-w-0 để truncate hoạt động */}
                        <h4 className="text-sm font-bold text-slate-800 truncate"> {/* Thêm truncate nếu tên quá dài */}
                            {user.fullName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">{user.updatedAt}</p>
                    </div>
                </div>
                
                {/* Phần Badge: Thêm flex-shrink-0 để nó không bao giờ bị méo */}
                <span className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-center min-w-[80px] ${
                    user.isApproved === 1 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                }`}>
                    {user.isApproved === 1 ? "Đã duyệt" : "Chờ duyệt"}
                </span>
            </div>
        ))}
    </div>
</div>
            </div>

            {/* Hàng 3: Trình độ học vấn chi tiết */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest mb-6">Chi tiết trình độ chuyên môn</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.degreeDistribution.map((level, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{level.name}</p>
                            <div className="flex items-end gap-2">
                                <span className="text-xl font-black text-slate-800">{level.value}</span>
                                <span className="text-[10px] text-blue-600 font-bold mb-1">nhân sự</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashBoard;