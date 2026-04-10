import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useStaffDetail = (id) => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStaff = async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            // Gọi đúng API GetAsync(id) Trí vừa viết
            const response = await axiosClient.get(`/Staff/Get?id=${id}`);
            
            if (response.data.status === 200) {
                setStaff(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Lỗi lấy chi tiết:", err);
            setError(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [id]); // Khi ID thay đổi thì fetch lại

    return { staff, loading, error, refresh: fetchStaff };
};