import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
    // 1. Nhận thêm danh sách các Role được phép vào
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Kiểm tra hết hạn
        if (decoded.exp < currentTime) {
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }

        // 2. LẤY ROLE TỪ TOKEN
        const userRole =
            decoded[
                "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] || decoded.role;

        // 3. KIỂM TRA QUYỀN TRUY CẬP
        // Nếu trang này yêu cầu Role cụ thể mà User không có -> Đá về trang "Không có quyền" hoặc Home
        if (allowedRoles && !allowedRoles.includes(userRole)) {
            if (userRole === "Admin") return <Navigate to="/admin" replace />;
            // Nếu là Manager mà đi lạc vào trang Admin, đẩy về /manager/dashboard
            if (userRole === "Manager")
                return <Navigate to="/manager/dashboard" replace />;

            return <Navigate to="/404" replace />;
        }

        return <Outlet />;
    } catch (error) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
