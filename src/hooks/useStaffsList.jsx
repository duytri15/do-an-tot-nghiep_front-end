import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useStaffsList = (initialPage = 1, pageSize = 10) => {
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(initialPage); // Thêm state quản lý trang

    const fetchStaffs = async (targetPage) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            // API của Trí dùng query params page và pageSize
            const url = `/Staff/GetList?page=${targetPage}&pageSize=${pageSize}`;
            const response = await axiosClient.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = response.data.data;
            setData(result.data || []);
            setTotalItems(result.total || 0);
        } catch (error) {
            console.error("Lỗi fetch danh sách:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Tự động fetch khi page thay đổi
    useEffect(() => {
        fetchStaffs(page);
    }, [page]);

    return { 
        data, 
        loading, 
        totalItems, 
        currentPage: page, 
        setPage, // Trả về hàm này để bên ngoài đổi trang
        refresh: () => fetchStaffs(page) 
    };
};