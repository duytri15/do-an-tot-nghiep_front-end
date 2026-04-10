import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

export const useEmploymentDetail = (staffId) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!staffId) return;

        const fetchJobs = async () => {
            try {
                setLoading(true);

                const res = await axiosClient.get(
                    `/EmpHistory/Get?id=${staffId}`
                );

                setJobs(res.data.data || []);

            } catch (err) {
                console.error(err);
                setError("Lỗi load lịch sử công tác");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [staffId]);

    return { jobs, loading, error };
};