import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useWorkData = (initialData = [], staffId) => {
    const [workHistories, setWorkHistories] = useState([]);

    // Đồng bộ dữ liệu từ API đổ về
    useEffect(() => {
        if (initialData?.length === 0 && workHistories?.length === 0) return;
        if (initialData) setWorkHistories(initialData);
    }, [initialData]);

    // 1. Logic Thay đổi Input (Hàm Trí đã viết, đưa vào Hook)
    const handleWorkChange = (index, e) => {
        const { name, value, type } = e.target;
        const updatedWork = [...workHistories];

        let val = value === "" ? null : value;

        // Ép kiểu số cho ID hoặc Năm
        if (val !== null && (name.endsWith("Id") || name.endsWith("Year"))) {
            val = parseInt(value) || 0;
        }

        // Xử lý ngày tháng
        if (type === "date" && !value) {
            val = null;
        }

        updatedWork[index] = { ...updatedWork[index], [name]: val };
        setWorkHistories(updatedWork);
    };

    // 2. Logic Thêm mới (Create)
    const addWorkHistory = () => {
        const newWork = {
            id: 0,
            staffId: parseInt(staffId),
            fromDate: null,
            toDate: null,
            organization: "", // Khớp với Organization
            position: "", // Khớp với Position
            address: "", // Khớp với Address
        };
        setWorkHistories([...workHistories, newWork]);
    };

    // 3. Logic Xóa (Delete)
    const removeWorkHistory = async (index) => {
        const work = workHistories[index];

        if (!window.confirm("Bạn có chắc muốn xoá quá trình công tác này?"))
            return;

        try {
            // Nếu có ID thực (đã lưu trong DB) thì mới gọi API xóa
            if (work.id && work.id !== 0) {
                await axiosClient.delete(`/EmpHistory/Delete?id=${work.id}`);
            }

            // Xóa khỏi State UI
            const updated = workHistories.filter((_, i) => i !== index);
            setWorkHistories(updated);

            return { success: true };
        } catch (error) {
            console.error("Lỗi xóa công tác:", error);
            alert("Xoá thất bại");
            return { success: false };
        }
    };

    return {
        workHistories,
        setWorkHistories,
        handleWorkChange,
        addWorkHistory,
        removeWorkHistory,
    };
};
