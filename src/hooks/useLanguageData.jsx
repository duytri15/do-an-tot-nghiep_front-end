import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useLanguageData = (initialData, staffId) => {
    const [languages, setLanguages] = useState([]);

    // Đồng bộ dữ liệu từ API đổ vào State
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setLanguages(initialData);
        }
    }, [initialData]);

    // 1. Xử lý thay đổi input
    const handleLanguageChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...languages];
        updated[index] = {
            ...updated[index],
            [name]: value === "" ? null : value,
        };
        setLanguages(updated);
    };

    // 2. Thêm một dòng ngoại ngữ mới
    const addLanguage = () => {
        const newLang = {
            id: 0, // Để handleSubmit gọi POST
            staffId: parseInt(staffId),
            languageName: "",
            proficiencyLevel: "",
            notes: "",
        };
        setLanguages([...languages, newLang]);
    };

    // 3. Xóa một dòng ngoại ngữ
    const removeLanguage = async (index) => {
        // 1. Lấy thông tin bản ghi ngoại ngữ dựa trên index
        const langItem = languages[index];

        // 2. Xác nhận với người dùng
        if (!window.confirm("Bạn có chắc muốn xoá thông tin ngoại ngữ này?"))
            return;

        try {
            // 3. Nếu ID > 0 (Dữ liệu đã nằm trong DB) thì gọi API Delete luôn
            if (langItem.id && langItem.id !== 0) {
                // Thay đổi đường dẫn API cho đúng với Backend của Trí nhé
                await axiosClient.delete(`/Language/Delete?id=${langItem.id}`);
            }

            // 4. Xóa khỏi State UI (Cái này luôn chạy dù là hàng mới hay hàng cũ)
            const updated = languages.filter((_, i) => i !== index);
            setLanguages(updated);

            return { success: true };
        } catch (error) {
            console.error("Lỗi xóa ngoại ngữ:", error);
            alert("Xoá ngoại ngữ thất bại!");
            return { success: false };
        }
    };

    return {
        languages,
        handleLanguageChange,
        addLanguage,
        removeLanguage,
    };
};
