import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useCategories = () => {
    const [categories, setCategories] = useState({
        genders: [],
        ethnicities: [],
        degrees: [],
        ranks: [],
        positions: [],
        departments: [],
        training: [],
        roleInResearch: [], // <--- Thêm khởi tạo mảng này
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Định nghĩa cấu trúc dữ liệu mong muốn
                const apiConfig = {
                    genders: "/Category/GetParentId?parentId=29",
                    ethnicities: "/Category/GetParentId?parentId=30",
                    degrees: "/Category/GetParentId?parentId=31",
                    ranks: "/Category/GetParentId?parentId=32",
                    positions: "/Category/GetParentId?parentId=33",
                    departments: "/Department/GetAll",
                    training: "/Category/GetParentId?parentId=34",
                    roleInResearch: "/Category/GetParentId?parentId=36", // <--- Thêm dòng này ở đây
                };

                const keys = Object.keys(apiConfig);

                // Gọi API song song
                const responses = await Promise.all(
                    Object.values(apiConfig).map((url) =>
                        axiosClient
                            .get(url)
                            .catch(() => ({ data: { data: [] } })),
                    ),
                );

                // Map kết quả trả về vào Object theo đúng Key
                const result = {};
                keys.forEach((key, index) => {
                    result[key] = responses[index]?.data?.data || [];
                });

                setCategories(result);
            } catch (err) {
                console.error("Lỗi tải danh mục:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, loading };
};
