import React, { useState, useEffect } from "react";
import axiosClient from "../../axios/axiosClient";
import {
    FaHistory,
    FaCalendarAlt,
    FaUserCircle,
    FaChevronLeft,
    FaChevronRight,
    FaDatabase,
    FaSync, // Icon cho nút làm mới
} from "react-icons/fa";
import { toast } from "react-toastify";
import moment from "moment";

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 10;

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(
                `/AuditLog/GetList?page=${currentPage}&pageSize=${pageSize}`,
            );
            if (response.data.status === 200) {
                setLogs(response.data.data.data || []);
                setTotalItems(response.data.data.total || 0);
                // Thông báo nhẹ khi làm mới thành công (tùy chọn)
                if (!loading) toast.success("Đã cập nhật dữ liệu mới nhất");
            }
        } catch (error) {
            toast.error("Không thể tải nhật ký hệ thống");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [currentPage]);

    const totalPages = Math.ceil(totalItems / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Hàm render Value Cell (Giữ nguyên logic fix plain text của Trí)
    const renderValueCell = (val, isOldValue) => {
        if (val === null || val === undefined || val === "") {
            return (
                <span className="text-gray-300 italic text-[11px]">Trống</span>
            );
        }
        const strVal = val.toString();
        if (!(strVal.startsWith("{") && strVal.endsWith("}"))) {
            return (
                <div
                    className={`text-[12px] font-medium leading-tight px-3 py-1.5 rounded-lg w-fit break-all ${
                        isOldValue
                            ? "text-rose-600 bg-rose-50"
                            : "text-emerald-700 bg-emerald-50 font-bold"
                    }`}
                >
                    {strVal}
                </div>
            );
        }
        try {
            const obj = JSON.parse(strVal);
            return (
                <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                    {Object.keys(obj).map((key) => (
                        <div
                            key={key}
                            className="flex flex-col border-b border-gray-100 pb-1 last:border-0"
                        >
                            <span className="text-[9px] uppercase font-black text-gray-400 tracking-tighter">
                                {key}
                            </span>
                            <span
                                className={`text-[12px] font-medium break-all leading-tight ${
                                    isOldValue
                                        ? "text-rose-500 line-through opacity-70"
                                        : "text-emerald-600 font-bold"
                                }`}
                            >
                                {obj[key]?.toString() || "null"}
                            </span>
                        </div>
                    ))}
                </div>
            );
        } catch (e) {
            return <div className="text-[12px]">{strVal}</div>;
        }
    };

    const renderActionBadge = (action) => {
        const styles = {
            Create: "bg-emerald-500 text-white shadow-emerald-100",
            Update: "bg-amber-500 text-white shadow-amber-100",
            Delete: "bg-rose-500 text-white shadow-rose-100",
        };
        return (
            <span
                className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg shadow-md ${styles[action] || "bg-gray-500 text-white"}`}
            >
                {action}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 mt-10">
            <div className="max-w-[1600px] mx-auto">
                {/* Header Section Cải Tiến */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-gray-100 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200">
                                <FaHistory className="text-white text-xl" />
                            </div>
                            <h1 className="text-2xl font-black text-gray-800 uppercase">
                                Danh sách cán bộ
                            </h1>
                        </div>
                        <p className="text-gray-400 font-medium ml-1">
                            Giám sát mọi biến động dữ liệu hệ thống
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Nút Làm Mới */}
                        <button
                            onClick={fetchLogs}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            <FaSync
                                className={`${loading ? "animate-spin" : ""} text-indigo-500`}
                            />
                            {loading ? "Đang tải..." : "Làm mới"}
                        </button>

                        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <FaCalendarAlt className="text-indigo-500" />
                            <span className="text-sm font-bold text-gray-700">
                                {moment().format("DD/MM/YYYY")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/40 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="w-[15%] px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Thao tác
                                    </th>
                                    <th className="w-[18%] px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Người thực hiện
                                    </th>
                                    <th className="w-[26%] px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-800/50">
                                        Giá trị cũ
                                    </th>
                                    <th className="w-[26%] px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-800">
                                        Giá trị mới
                                    </th>
                                    <th className="w-[15%] px-8 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
                                        Thời gian
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    Array(pageSize)
                                        .fill(0)
                                        .map((_, i) => (
                                            <tr
                                                key={i}
                                                className="animate-pulse"
                                            >
                                                <td
                                                    colSpan="5"
                                                    className="px-8 py-8"
                                                >
                                                    <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                                                </td>
                                            </tr>
                                        ))
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-indigo-50/20 transition-all group"
                                        >
                                            <td className="px-8 py-8 align-top">
                                                <div className="flex flex-col items-start gap-2.5">
                                                    {renderActionBadge(
                                                        log.action || "Update",
                                                    )}
                                                    <div className="flex items-center gap-1.5 text-gray-900 font-black text-[10px] px-2 py-1 bg-gray-100 rounded-md">
                                                        <FaDatabase className="text-gray-400" />
                                                        {log.tableName}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                                                        <FaUserCircle className="text-2xl" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-black text-gray-800 truncate">
                                                            {log.staffName ||
                                                                "Hệ thống"}
                                                        </span>
                                                        <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest leading-none mt-1">
                                                            ID: {log.staffId}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 align-top bg-rose-50/5 border-x border-gray-50/50">
                                                {renderValueCell(
                                                    log.oldValue,
                                                    true,
                                                )}
                                            </td>
                                            <td className="px-8 py-8 align-top bg-emerald-50/5 border-r border-gray-50/50">
                                                {renderValueCell(
                                                    log.newValue,
                                                    false,
                                                )}
                                            </td>
                                            <td className="px-8 py-8 align-top text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-lg font-black text-gray-900 leading-none">
                                                        {moment(
                                                            log.changedAt,
                                                        ).format("HH:mm:ss")}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                                                        {moment(
                                                            log.changedAt,
                                                        ).format("DD/MM/YYYY")}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-20 text-center text-gray-400 font-bold"
                                        >
                                            Không tìm thấy dữ liệu nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogPage;
