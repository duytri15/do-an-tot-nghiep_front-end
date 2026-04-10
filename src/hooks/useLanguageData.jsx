import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useLanguageData = (initialData, staffId) => {
    const [languages, setLanguages] = useState([]);
    const [allLanguages, setAllLanguages] = useState([]); // THÊM: Danh mục cho Dropdown

    // 1. Đồng bộ dữ liệu ban đầu của Staff
    useEffect(() => {
        if (initialData && initialData.length > 0) {
            setLanguages(initialData);
        }
    }, [initialData]);

    // 2. Fetch danh mục ngôn ngữ để đổ vào Dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axiosClient.get("/Language/GetAll"); // Kiểm tra URL này nhé
                setAllLanguages(res.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy danh mục ngôn ngữ:", err);
            }
        };
        fetchCategories();
    }, []);

    // 3. Xử lý thay đổi input (Cập nhật để ép kiểu số cho languageId)
    const handleLanguageChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...languages];

        let finalValue = value === "" ? null : value;
        // Nếu là chọn từ Dropdown, ép kiểu sang Number để Backend nhận đúng int
        if (name === "languageId" && finalValue !== null) {
            finalValue = Number(finalValue);
        }

        updated[index] = {
            ...updated[index],
            [name]: finalValue,
        };
        setLanguages(updated);
    };

    // 4. Thêm một dòng ngoại ngữ mới (Sửa languageName thành languageId)
    const addLanguage = () => {
        setLanguages([
            ...languages,
            {
                id: 0,
                staffId: Number(staffId),
                languageId: null, // Dùng ID để map với Dropdown
                proficiencyLevel: "",
                notes: "",
                status: 1,
            },
        ]);
    };

    // 5. Xóa ngoại ngữ (Giữ nguyên logic của Trí)
    const removeLanguage = async (index) => {
        const langItem = languages[index];
        if (!window.confirm("Bạn có chắc muốn xoá thông tin ngoại ngữ này?"))
            return;

        try {
            if (langItem.id && langItem.id !== 0) {
                // Nhớ đổi thành StaffLanguage nếu Trí đã đổi tên Controller ở Backend
                await axiosClient.delete(
                    `/StaffLanguage/Delete?id=${langItem.id}`,
                );
            }
            setLanguages(languages.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Lỗi xóa:", error);
            alert("Xoá thất bại!");
        }
    };

    return {
        languages,
        allLanguages, // TRẢ VỀ: Để Update.jsx không bị lỗi undefined
        handleLanguageChange,
        addLanguage,
        removeLanguage,
    };
};
