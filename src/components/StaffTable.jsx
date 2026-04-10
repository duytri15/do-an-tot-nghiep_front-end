import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import cái này
import StaffDetailPage from "../manager/StaffDetailPage";
import { useStaffSearch } from "../hooks/useStaffSearch";
import { jwtDecode } from "jwt-decode"; // Nhớ import thư viện này ở đầu file
const StaffTable = ({
    data = [],
    totalItems = 0,
    currentPage = 1,
    setPage,
    pageSize = 10,
}) => {
    const navigate = useNavigate(); // 2. Khởi tạo điều hướng
    const [searchTerm, setSearchTerm] = useState("");
    const { data: searchData, loading } = useStaffSearch(searchTerm);
    const displayData = searchTerm ? searchData : data;
    const totalPages = Math.ceil(totalItems / pageSize);
    const token = localStorage.getItem("accessToken");
    let userRole = "";
    if (token) {
        try {
            const decoded = jwtDecode(token);
            // Lấy đúng claim role của ASP.NET Core
            userRole =
                decoded[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] || decoded.role;
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
        }
    }
    return (
        <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
            {/* Phần Header & Thanh Search */}
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Quản lý nhân sự
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Tổng cộng: {totalItems} cán bộ
                    </p>
                </div>

                {/* Thanh tìm kiếm góc phải */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email..."
                        className="w-full md:w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Phần Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Hồ sơ cán bộ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Đơn vị
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Chức vụ / Học vị
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {loading && (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-4 text-blue-500"
                                >
                                    Đang tìm kiếm...
                                </td>
                            </tr>
                        )}
                        {!loading && displayData.length > 0 ? (
                            displayData.map((staff) => (
                                <tr
                                    key={staff.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs mr-3">
                                                {staff.fullName
                                                    ? staff.fullName
                                                          .charAt(0)
                                                          .toUpperCase()
                                                    : "S"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {staff.fullName || "N/A"}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {staff.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 font-medium">
                                            {staff.departmentName || "---"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md w-fit font-medium">
                                                {staff.positionName ||
                                                    "Giảng viên"}
                                            </span>
                                            <span className="text-[10px] text-gray-400 italic">
                                                {staff.highestDegreeName ||
                                                    "Thạc sĩ"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => {
                                                // Giả sử Trí đã lấy userRole từ token hoặc context
                                                const targetPath =
                                                    userRole === "Admin"
                                                        ? `/admin/staff/detail/${staff.id}`
                                                        : `/manager/staff/detail/${staff.id}`;

                                                navigate(targetPath);
                                            }}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-100 transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                    <td></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-10 text-center text-gray-400"
                                >
                                    Không có dữ liệu hiển thị
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {!searchTerm && totalPages > 1 && (
                    <div className="px-8 py-5 flex items-center justify-between border-t border-slate-100 bg-white rounded-b-[2rem]">
                        {/* Thông tin trạng thái */}
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Trang{" "}
                                <span className="text-blue-600">
                                    {currentPage}
                                </span>{" "}
                                trên{" "}
                                <span className="text-slate-800">
                                    {totalPages}
                                </span>
                            </p>
                        </div>

                        {/* Cụm điều hướng */}
                        <div className="flex items-center gap-2">
                            {/* Nút Trước */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setPage(currentPage - 1)}
                                className="group flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all duration-200"
                            >
                                <svg
                                    className="w-4 h-4 text-slate-600 group-hover:-translate-x-0.5 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>

                            {/* Danh sách số trang */}
                            <div className="flex items-center gap-1.5">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Logic để chỉ hiện một vài số trang nếu quá nhiều (tùy chọn)
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all duration-200 ${
                                                currentPage === pageNum
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                                                    : "bg-white border border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Nút Sau */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setPage(currentPage + 1)}
                                className="group flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all duration-200"
                            >
                                <svg
                                    className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffTable;
