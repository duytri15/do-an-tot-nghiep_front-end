import React, { useState, useEffect } from "react";
import axiosClient from "../../axios/axiosClient";
import { FaSearch, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Cấu hình SweetAlert2 mặc định đẹp hơn (chỉ cần chạy 1 lần)
Swal.mixin({
    customClass: {
        popup: "rounded-3xl shadow-2xl border border-gray-100",
        title: "text-xl font-semibold text-gray-900",
        htmlContainer: "text-gray-600 text-base",
        confirmButton: "rounded-2xl px-6 py-3 text-sm font-medium",
        cancelButton: "rounded-2xl px-6 py-3 text-sm font-medium",
    },
    buttonsStyling: false, // Tắt style mặc định để dùng Tailwind
}); // Chỉ init mixin

const AccountManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const pageSize = 10;

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(
                `/User/GetList?page=${currentPage}&pageSize=${pageSize}&search=${encodeURIComponent(searchTerm)}`
            );
            if (response.data.status === 200) {
                setUsers(response.data.data.data || []);
                setTotalItems(response.data.data.total || 0);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    // Toggle quyền với SweetAlert đẹp
    const handleUpdatePermission = async (userId, field, currentValue) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;

        const isCurrentEnabled = currentValue === true || currentValue === 1;
        const actionText = field === "canApprove" ? "quyền Duyệt hồ sơ" : "quyền Xem nhật ký";
        const statusText = !isCurrentEnabled ? "CẤP" : "THU HỒI";

        const result = await Swal.fire({
            title: "Xác nhận thay đổi quyền",
            html: `Bạn có chắc chắn muốn <strong>${statusText}</strong> ${actionText} cho tài khoản <strong>${user.fullName}</strong>?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#ef4444",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const payload = {
                    canApprove: field === "canApprove" ? !isCurrentEnabled : !!user.canApprove,
                    canViewLog: field === "canViewLog" ? !isCurrentEnabled : !!user.canViewLog,
                };

                const response = await axiosClient.put(`/User/UpdatePermissions?id=${userId}`, payload);

                if (response.data.status === 200) {
                    toast.success(`Đã ${statusText.toLowerCase()} quyền thành công!`);
                    fetchUsers();
                } else {
                    toast.error(response.data.message || "Cập nhật thất bại");
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Lỗi kết nối server");
            }
        }
    };

    // Toggle Switch mượt & đẹp hơn
    const ToggleSwitch = ({ enabled, onToggle }) => (
        <div
            onClick={onToggle}
            className={`relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full transition-all duration-300 ease-out shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                enabled ? "bg-emerald-500" : "bg-gray-300"
            }`}
        >
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-out ${
                    enabled ? "translate-x-7" : "translate-x-1"
                }`}
            />
        </div>
    );

    return (
        <div className="mt-15 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-2xl">
                        <FaUserShield className="text-3xl text-blue-600" />
                    </div>
                    <div>
                          <h1 className="text-2xl font-black text-gray-800 uppercase">
                Danh sách cán bộ
            </h1>

                        <p className="text-gray-500">Quản trị người dùng và phân quyền hệ thống</p>
                    </div>
                </div>

                <div className="relative flex-1 sm:w-80">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo họ tên, username..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Bảng */}
            <div className="bg-white rounded-3xl shadow border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai trò</th>
                                <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Duyệt hồ sơ</th>
                                <th className="px-6 py-5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Xem nhật ký</th>
                                <th className="px-6 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                                    {user.fullName?.charAt(0) || "?"}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">@{user.userName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span
                                                className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-2xl ${
                                                    user.roleName === "Admin"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {user.roleName || "User"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <ToggleSwitch
                                                enabled={user.canApprove === true || user.canApprove === 1}
                                                onToggle={() => handleUpdatePermission(user.id, "canApprove", user.canApprove)}
                                            />
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <ToggleSwitch
                                                enabled={user.canViewLog === true || user.canViewLog === 1}
                                                onToggle={() => handleUpdatePermission(user.id, "canViewLog", user.canViewLog)}
                                            />
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="inline-flex items-center gap-2 text-emerald-600 font-medium">
                                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                Hoạt động
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;