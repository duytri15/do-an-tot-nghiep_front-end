import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
    const token = localStorage.getItem("accessToken");

    // 1. Nếu không có Token -> Đá về Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // 2. Giải mã Token để xem thời gian hết hạn (exp)
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Đổi sang giây

        // 3. Nếu Token hết hạn -> Xóa sạch và đá về Login
        if (decoded.exp < currentTime) {
            console.warn("Token đã hết hạn!");
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }

        // 4. Mọi thứ OK -> Cho phép vào (Outlet đại diện cho các trang con)
        return <Outlet />;
    } catch (error) {
        // Token lỗi/không đúng định dạng
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;