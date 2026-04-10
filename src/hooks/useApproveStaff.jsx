import { useState } from "react";
import axiosClient from "../axios/axiosClient";

export const useApproveStaff = (onSuccess) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleApprove = async (id, status) => {
        const actionText = status === 1 ? "phê duyệt" : "từ chối";

        // Xác nhận trước khi làm (Rất quan trọng trong nghiệp vụ)
        if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} hồ sơ này?`))
            return;

        setLoading(true);
        setError(null);

        try {
            // Gọi API theo đúng link Trí đưa, phương thức PATCH
            const response = await axiosClient.post(
                `/Staff/Approve/${id}`,
                status,
                {
                    headers: { "Content-Type": "application/json" },
                },
            );

            if (response.data.status === 200) {
                alert(response.data.message || "Thao tác thành công!");
                if (onSuccess) onSuccess(); // Gọi hàm load lại danh sách ở trang cha
            }
        } catch (err) {
            console.error("Lỗi Approve:", err);
            setError(err.response?.data?.message || "Có lỗi xảy ra");
            alert(
                "Lỗi: " +
                    (err.response?.data?.message || "Không thể kết nối API"),
            );
        } finally {
            setLoading(false);
        }
    };

    return { handleApprove, loading, error };
};
