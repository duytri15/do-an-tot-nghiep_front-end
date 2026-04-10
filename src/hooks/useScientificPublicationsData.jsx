import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useScientificPublicationsData = (initialData = [], staffId) => {
    const [publications, setPublications] = useState([]);

    // 1. Đồng bộ dữ liệu từ API khi initialData thay đổi
    useEffect(() => {
        if (Array.isArray(initialData) && initialData.length > 0) {
            setPublications(initialData);
        }
    }, [initialData]);

    // 2. Logic Thay đổi Input (Xử lý cả Event và Object giả từ Select/DatePicker)
    const handlePubChange = (index, e) => {
        const name = e.target ? e.target.name : e.name;
        const value = e.target ? e.target.value : e.value;

        const updated = [...publications];
        let val = value;

        // Ép kiểu số cho các trường ID, Năm để Backend C# không bị lỗi validation
        if (val !== "" && val !== null) {
            if (name.endsWith("Id") || name.endsWith("Year") || name === "status") {
                val = Number(val); 
            }
        } else {
            val = null;
        }

        updated[index] = { ...updated[index], [name]: val };
        setPublications(updated);
    };

    // 3. Logic Thêm dòng mới (Khởi tạo object rỗng khớp với DB)
    const addPublication = () => {
        const newPublication = {
            id: 0, 
            staffId: Number(staffId),
            publicationName: "",     // Tên bài báo/công trình
            publicationYear: new Date().getFullYear(), // Năm công bố
            journalName: "",         // Tên tạp chí/hội thảo
            notes: null,             // Ghi chú
            status: 1,
        };
        setPublications([...publications, newPublication]);
    };

    // 4. Logic Xóa bài báo
    const removePublication = async (index) => {
        const item = publications[index];
        if (!window.confirm("Bạn có chắc chắn muốn xóa công trình khoa học này?")) return;

        try {
            // Nếu item đã có ID (đã tồn tại trong DB) thì gọi API xóa hẳn
            if (item.id && item.id !== 0) {
                await axiosClient.delete(`/ScientificPublication/Delete?id=${item.id}`);
            }
            // Cập nhật lại UI
            const updated = publications.filter((_, i) => i !== index);
            setPublications(updated);
        } catch (error) {
            console.error("Lỗi khi xóa công trình:", error);
            alert("Xóa thất bại!");
        }
    };

    return {
        publications,
        setPublications,
        handlePubChange,
        addPublication,
        removePublication,
    };
};

export default useScientificPublicationsData;