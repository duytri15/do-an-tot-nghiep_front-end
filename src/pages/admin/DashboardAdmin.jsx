import React, { useEffect, useState } from "react";
import axiosClient from "../../axios/axiosClient";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];

function DashboardAdmin() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axiosClient.get(
                    "/AdminDashboard/GetFullOverview",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (res.data.status === 200) {
                    setData(res.data.data);
                }
            } catch {
                console.log("Lỗi load dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    const staffChart = [
        { name: "Nhân viên", value: data?.stats.totalStaff },
        { name: "Chờ duyệt", value: data?.stats.pendingApproval },
    ];

    const userChart = [
        { name: "User", value: data?.userStats.totalUsers },
        { name: "Manager", value: data?.userStats.managersCount },
    ];

    return (
        <div className="mt-15 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 space-y-6">

            {/* HEADER */}
            <h1 className="text-3xl font-black text-slate-800">
                🚀 Admin Dashboard
            </h1>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        title: "Nhân viên",
                        value: data?.stats.totalStaff,
                        color: "from-blue-500 to-blue-600",
                    },
                    {
                        title: "Chờ duyệt",
                        value: data?.stats.pendingApproval,
                        color: "from-yellow-400 to-orange-500",
                    },
                    {
                        title: "Tổng số tài khoản",
                        value: data?.userStats.totalUsers,
                        color: "from-green-400 to-emerald-500",
                    },
                    {
                        title: "Tổng số quản lý",
                        value: data?.userStats.managersCount,
                        color: "from-purple-500 to-pink-500",
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br ${item.color} hover:scale-105 transition`}
                    >
                        <p className="text-sm opacity-80">{item.title}</p>
                        <h2 className="text-3xl font-black mt-2">
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>

            {/* CHART */}
            <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BAR */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-4 text-slate-700">
                        📊 Nhân sự
                    </h3>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={staffChart}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3B82F6" radius={[6,6,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* PIE */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="font-bold mb-4 text-slate-700">
                        👥 Phân quyền
                    </h3>

                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={userChart}
                                dataKey="value"
                                outerRadius={90}
                                label
                            >
                                {userChart.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AUDIT LOG - TIMELINE STYLE */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold mb-6 text-slate-700">
                    📝 Hoạt động gần đây
                </h3>

                <div className="space-y-4">
                    {data?.recentAuditLogs?.length > 0 ? (
                        data.recentAuditLogs.map((log, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition"
                            >
                                {/* DOT */}
                                <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full"></div>

                                {/* CONTENT */}
                                <div className="flex-1">
                                    <p className="text-sm text-slate-700">
                                        <span className="font-bold text-blue-600">
                                            {log.changedBy}
                                        </span>{" "}
                                        đã sửa{" "}
                                        <span className="font-semibold">
                                            {log.staffName}
                                        </span>
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                        {log.fieldName}
                                    </p>

                                    <div className="flex gap-4 mt-2 text-xs">
                                        <span className="text-red-400 line-through">
                                            {log.oldValue || "Trống"}
                                        </span>
                                        →
                                        <span className="text-green-600 font-bold">
                                            {log.newValue}
                                        </span>
                                    </div>
                                </div>

                                {/* TIME */}
                                <div className="text-xs text-slate-400">
                                    {log.changedAt}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-400">
                            Chưa có hoạt động
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardAdmin;