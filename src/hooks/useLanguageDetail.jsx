import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useLanguageDetail = (staffId) => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!staffId) return;

        const fetchLanguages = async () => {
            try {
                setLoading(true);

                const res = await axiosClient.get(
                    `/Language/Get?id=${staffId}`
                );

                // ⚠️ tuỳ backend trả về
                setLanguages(res.data.data || []);

            } catch (err) {
                console.error(err);
                setError("Lỗi load dữ liệu ngoại ngữ");
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, [staffId]);

    return { languages, loading, error };
};