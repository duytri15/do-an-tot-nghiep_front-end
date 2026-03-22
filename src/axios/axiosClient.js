// api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5276",
    headers: {
        "Content-Type": "application/json",
    },
});
// Lớp chặn GỬI ĐI: Tự động đính kèm Token
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Lớp chặn NHẬN VỀ: Xử lý lỗi từ Backend
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu Backend trả về 401 (Chìa khóa sai/hết hạn)
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            // Dùng window.location để load lại trang Login cho sạch bộ nhớ
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
export default axiosClient;
