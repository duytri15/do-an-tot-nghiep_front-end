// hooks/useEducation.js
import { useState, useEffect } from 'react';
import axiosClient from '../axios/axiosClient'; // Giả sử Trí đã có axiosClient như mình hướng dẫn

export const useEducationData = (initialData = [], staffId) => {
    const [eduHistories, setEduHistories] = useState([]);

    // Đồng bộ khi dữ liệu từ API StaffData đổ về
    useEffect(() => {
        if (initialData) setEduHistories(initialData);
    }, [initialData]);

    // 1. Logic Thay đổi Input
    const handleEduChange = (index, e) => {
        const { name, value, type } = e.target;
        const updated = [...eduHistories];
        let val = value === "" ? null : value;

        if (val !== null && (name.endsWith("Id") || name.endsWith("Year"))) {
            val = parseInt(value) || 0;
        }

        updated[index] = { ...updated[index], [name]: val };
        setEduHistories(updated);
    };

    // 2. Logic Thêm dòng mới
    const addEduHistory = () => {
        const newEdu = {
            id: 0, // Đánh dấu là hàng mới
            staffId: parseInt(staffId),
            degreeLevelId: null,
            trainingFormId: null,
            major: "",
            institution: "",
            graduationYear: new Date().getFullYear(),
            countryName: "",
            thesisName: "",
        };
        setEduHistories([...eduHistories, newEdu]);
    };

    // 3. Logic Xóa
    const removeEduHistory = async (index) => {
        const edu = eduHistories[index];
        if (!window.confirm("Bạn có chắc muốn xoá văn bằng này?")) return;

        try {
            if (edu.id && edu.id !== 0) {
                // Chỉ xóa trong DB nếu record đã tồn tại
                await axiosClient.delete(`/EduHistory/Delete?id=${edu.id}`);
            }
            // Xóa khỏi UI
            const updated = eduHistories.filter((_, i) => i !== index);
            setEduHistories(updated);
        } catch (error) {
            console.error(error);
            alert("Xoá thất bại");
        }
    };

    return {
        eduHistories,
        setEduHistories,
        handleEduChange,
        addEduHistory,
        removeEduHistory
    };
};