import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useEducationDetail = (id) => {
    const [edu, setEdu] = useState(null);   // dữ liệu 1 văn bằng
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchEdu = async () => {
            try {
                setLoading(true);

                const res = await axiosClient.get(
                    `/EduHistory/Get?id=${id}`
                );

                setEdu(res.data.data); // backend trả về data

            } catch (err) {
                console.error(err);
                setError("Lỗi load dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchEdu();
    }, [id]);

    return { edu, loading, error };
};