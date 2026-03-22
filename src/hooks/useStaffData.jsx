import { useState, useEffect } from "react";
import axios from "axios";
import axiosClient from "../axios/axiosClient";

const useStaffData = (id) => {
    const [data, setData] = useState({
        staff: {},
        education: [],
        languages: [],
        employment: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Sửa lại cách gọi trong useEffect
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Lấy profile trước để có ID
                const staffRes = await axiosClient.get(`/Staff/GetMyProfile`);
                const staffData =
                    staffRes.data.status === 200 ? staffRes.data.data : {};
                // Nếu có ID rồi mới đi lấy mấy cái kia
                if (staffData.id) {
                    const [eduRes, languageRes, empRes] = await Promise.all([
                        // Truyền ID vào params nếu Backend yêu cầu
                        axiosClient.get(`/EduHistory/Get?id=${staffData.id}`),
                        axiosClient.get(`/Language/Get?id=${staffData.id}`),
                        axiosClient.get(`/EmpHistory/Get?id=${staffData.id}`),
                    ]);

                    setData({
                        staff: staffData,
                        education:
                            eduRes.data.status === 200 ? eduRes.data.data : [],
                        languages:
                            languageRes.data.status === 200
                                ? languageRes.data.data
                                : [],
                        employment:
                            empRes.data.status === 200 ? empRes.data.data : [],
                    });
                } else {
                    setData((prev) => ({ ...prev, staff: staffData }));
                }
            } catch (err) {
                console.error("Lỗi fetch:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Trả về dữ liệu và các trạng thái để UI sử dụng
    return { ...data, loading, error };
};

export default useStaffData;
