import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useStaffSearch = (searchTerm) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Nếu chưa nhập gì thì không gọi API
        if (!searchTerm || searchTerm.trim() === "") {
            setData([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 500); // debounce 0.5s (rất quan trọng)

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axiosClient.get(
                `/Staff/Search?search=${searchTerm}`,
            );

            setData(res.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Lỗi tìm kiếm");
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error };
};
