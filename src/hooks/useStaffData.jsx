import { useState, useEffect } from "react";
import axiosClient from "../axios/axiosClient";

const useStaffData = (id) => {
    const [data, setData] = useState({
        staff: {},
        education: [],
        languages: [],
        employment: [],
        researches: [], // <--- Thêm trường này để lưu danh sách NCKH
        publications: [], // <--- 1. Thêm trường này
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Lấy profile trước để có ID của chính người đang đăng nhập
                const staffRes = await axiosClient.get(`/Staff/GetMyProfile`);
                const staffData =
                    staffRes.data.status === 200 ? staffRes.data.data : {};

                // 2. Nếu có ID rồi mới đi lấy các dữ liệu liên quan
                if (staffData.id) {
                    const [eduRes, languageRes, empRes, researchRes,pubRes] =
                        await Promise.all([
                            axiosClient.get(
                                `/EduHistory/Get?id=${staffData.id}`,
                            ),
                            axiosClient.get(
                                `/StaffLanguage/Get?id=${staffData.id}`,
                            ),
                            axiosClient.get(
                                `/EmpHistory/Get?id=${staffData.id}`,
                            ),
                            // Thêm API Nghiên cứu khoa học ở đây
                            axiosClient.get(
                                `/ScientificResearch/Get?id=${staffData.id}`,
                            ),
                            axiosClient.get(
                                `/ScientificPublication/Get?id=${staffData.id}`,
                            ), // <--- API mới của Trí
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
                        // Lưu dữ liệu NCKH vào state
                        researches:
                            researchRes.data.status === 200
                                ? researchRes.data.data
                                : [],
                        publications:
                            pubRes.data.status === 200 ? pubRes.data.data : [],
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

    // Trả về dữ liệu để UI sử dụng
    return { ...data, loading, error };
};

export default useStaffData;
