import React, { useEffect, useState } from "react";
import { useApproveStaff } from "../../hooks/useApproveStaff";
import axiosClient from "../../axios/axiosClient";
import { useNavigate } from "react-router-dom";
import { EyeIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
function ApproveStaffAdmin() {
    const [staffs, setStaffs] = useState([]);
    const navigate = useNavigate();

    // 1. Hàm load danh sách chờ duyệt bằng API GetAll
    const fetchPending = async () => {
        try {
            const res = await axiosClient.get("/Staff/GetAll");
            console.log("Dữ liệu Staff từ API:", res.data.data); // Xem isApproved của họ là mấy
            setStaffs(res.data.data || []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách chờ duyệt:", err);
            setStaffs([]); // Reset mảng để không bị lỗi .map()
        }
    };

    // 2. Sử dụng Hook Approve
    const { handleApprove, loading: isApproving } =
        useApproveStaff(fetchPending);

    useEffect(() => {
        fetchPending();
    }, []);

    return (
        <div className="p-8 mt-15 bg-gray-50 min-h-screen">
         <h1 className="text-2xl font-black mb-6 text-gray-800 uppercase">
Hồ sơ phê duyệt
            </h1>

            <div className="grid gap-4">
                {staffs && staffs.length > 0 ? (
                    staffs.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {item.fullName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {/* Lưu ý: Nếu dùng GetAll đơn giản, hãy chắc chắn Backend đã .Include khoa và chức vụ */}
                                    {item.departmentName || "Chưa rõ khoa"} -{" "}
                                    {item.positionName || "Chưa rõ chức vụ"}
                                </p>
                            </div>

                            <div className="flex gap-6 items-center">
                                {/* Icon Xem chi tiết - Con mắt */}
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/manager/staff/detail/${item.id}`,
                                        )
                                    }
                                    title="Xem chi tiết"
                                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                >
                                    <i className="fa-regular fa-eye text-xl"></i>
                                </button>

                                {/* Icon Phê duyệt - Dấu tích (V) */}
                                <button
                                    onClick={() => handleApprove(item.id, 1)}
                                    disabled={isApproving}
                                    title="Phê duyệt"
                                    className="text-gray-400 hover:text-green-500 disabled:opacity-30 transition-colors duration-200"
                                >
                                    {isApproving ? (
                                        <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
                                    ) : (
                                        <i className="fa-solid fa-check text-xl"></i>
                                    )}
                                </button>

                                {/* Icon Từ chối - Dấu X */}
                                <button
                                    onClick={() => handleApprove(item.id, 2)}
                                    disabled={isApproving}
                                    title="Từ chối"
                                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors duration-200"
                                >
                                    <i className="fa-solid fa-xmark text-xl"></i>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">
                        Hiện không có hồ sơ nào cần duyệt.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ApproveStaffAdmin;
