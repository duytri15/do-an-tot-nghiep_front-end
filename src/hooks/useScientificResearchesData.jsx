import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useScientificResearchesData = (initialData = [], staffId) => {
    const [researches, setResearches] = useState([]);

    // 1. Đồng bộ dữ liệu từ API - Chỉ chạy khi initialData có dữ liệu thật sự
    useEffect(() => {
        if (Array.isArray(initialData) && initialData.length > 0) {
            setResearches(initialData);
        }
    }, [initialData]); // Không cần stringify nếu data từ useStaffData đã ổn định

    // 2. Logic Thay đổi Input - SỬA LẠI ĐỂ NHẬN CẢ EVENT THẬT VÀ OBJECT GIẢ
    const handleResearchChange = (index, e) => {
        // Kiểm tra xem e có phải là event thật không, nếu không thì lấy trực tiếp
        const name = e.target ? e.target.name : e.name;
        const value = e.target ? e.target.value : e.value;

        const updated = [...researches];
        let val = value;

        // Ép kiểu số cho các trường ID, Năm để Backend nhận đúng
        if (val !== "" && val !== null) {
            if (name.endsWith("Id") || name.endsWith("Year") || name === "status") {
                val = Number(val); 
            }
        } else {
            val = null;
        }

        updated[index] = { ...updated[index], [name]: val };
        setResearches(updated);
    };

    // 3. Logic Thêm dòng mới
    const addResearch = () => {
        const newResearch = {
            id: 0, 
            staffId: Number(staffId),
            researchName: "",
            startYear: new Date().getFullYear(),
            endYear: null,
            researchLevel: "", 
            roleInResearchId: "", // Để chuỗi rỗng để Select hiển thị "-- Chọn --"
            status: 1,
        };
        setResearches([...researches, newResearch]);
    };

    // 4. Logic Xóa (Giữ nguyên của Trí - Đã tốt)
    const removeResearch = async (index) => {
        const item = researches[index];
        if (!window.confirm("Bạn có chắc chắn muốn xóa đề tài nghiên cứu này?")) return;

        try {
            if (item.id && item.id !== 0) {
                await axiosClient.delete(`/ScientificResearch/Delete?id=${item.id}`);
            }
            const updated = researches.filter((_, i) => i !== index);
            setResearches(updated);
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Xóa thất bại!");
        }
    };

    return {
        researches,
        setResearches,
        handleResearchChange,
        addResearch,
        removeResearch,
    };
};

export default useScientificResearchesData;