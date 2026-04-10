import { NavLink } from "react-router-dom";
import {
    FaThLarge,
    FaUserEdit,
    FaFileExport,
    FaUsers,
    FaCheckDouble,
    FaCogs,
    FaChartBar,
    FaHistory,
    FaUsersCog,       // Cho Quản lý tài khoản
    FaSitemap,        // Cho Quản lý danh mục
    FaBuilding,       // Cho Quản lý khoa (Phòng ban)
    FaGlobeAmericas,   // Cho Quản lý ngoại ngữ
    FaUserPlus,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
    const token = localStorage.getItem("accessToken");

    let userRole = "";
    let userData = {};

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userData = decoded;

            userRole =
                decoded[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                ] ||
                decoded.role ||
                "";
        } catch (error) {
            console.error("Token decode error", error);
        }
    }

    // Chuẩn hóa role về chữ thường để làm prefix cho path (admin hoặc manager)
    const rolePrefix = userRole?.toLowerCase();

    const allMenuItems = [
        // --- NHÓM CÁ NHÂN ---
        {
            path: "/user/",
            name: "Tổng quan",
            icon: <FaThLarge />,
            roles: ["User"],
        },
        {
            path: "/user/profile/",
            name: "Lý lịch cá nhân",
            icon: <FaUserEdit />,
            roles: ["User"],
        },
        {
            path: "/user/export",
            name: "Xuất file lý lịch",
            icon: <FaFileExport />,
            roles: ["User"],
        },

        // --- NHÓM QUẢN LÝ (ADMIN) ---
        {
            path: "/admin",
            name: "Thống kê hệ thống",
            icon: <FaChartBar />,
            roles: ["Admin"],
        },
        {
            path: "/admin/staff-list",
            name: "Quản lý cán bộ",
            icon: <FaUsers />,
            roles: ["Admin"],
        },
        {
            path: "/admin/approve",
            name: "Duyệt hồ sơ",
            icon: <FaCheckDouble />,
            roles: ["Admin"],
        },
      {
        path: "/admin/accounts-management",
        name: "Quản lý tài khoản",
        // FaUsersCog: Icon 2 người và cái bánh răng, thể hiện Quản lý người dùng hệ thống
        icon: <FaUsersCog />, 
        roles: ["Admin"],
    },
    {
        path: "/admin/categories-management",
        name: "Quản lý danh mục",
        // FaSitemap: Icon sơ đồ cấu trúc, thể hiện sự phân loại, danh mục
        icon: <FaSitemap />, 
        roles: ["Admin"],
    },
    {
        path: "/admin/departments-management",
        name: "Quản lý khoa",
        // FaBuilding: Icon tòa nhà, phù hợp để đại diện cho Khoa/Phòng ban
        icon: <FaBuilding />, 
        roles: ["Admin"],
    },
    {
        path: "/admin/languages-management",
        name: "Quản lý ngoại ngữ",
        // FaGlobeAmericas: Icon quả địa cầu, đại diện cho ngôn ngữ, thế giới
        icon: <FaGlobeAmericas />, 
        roles: ["Admin"],
    },
    {
        path: "/admin/register-management",
        name: "Đăng kí tài khoản",
        // FaUserPlus: Icon người và dấu cộng, thể hiện hành động Đăng ký/Thêm mới
        icon: <FaUserPlus />, 
        roles: ["Admin"],
    },
        // --- NHÓM MANAGER ---
        {
            path: "/manager/dashboard",
            name: "Tổng quan Manager",
            icon: <FaThLarge />,
            roles: ["Manager"],
        },
        {
            path: "/manager/staff-list",
            name: "Quản lý cán bộ",
            icon: <FaUsers />,
            roles: ["Manager"],
        },
        {
            path: "/manager/approve",
            name: "Duyệt hồ sơ",
            icon: <FaCheckDouble />,
            roles: ["Manager"],
            requiresPermission: "canApprove",
        },

        // 🔥 CẬP NHẬT: Nhật ký hệ thống với PATH ĐỘNG
        {
            // Tự động nhận /user/logs, /admin/logs hoặc /manager/logs
            path: `/${rolePrefix}/logs`,
            name:
                rolePrefix === "user" ? "Nhật ký của tôi" : "Nhật ký hệ thống",
            icon: <FaHistory />,
            // Cho phép cả 3 Role
            roles: ["Admin", "Manager", "User"],
            // Chỉ Admin/Manager mới cần check quyền canViewLog, User thì mặc định được xem của mình
            requiresPermission: userRole === "User" ? null : "canViewLog",
        },
    ];

    // 1. Lọc menu theo Role và Permission (Giữ nguyên logic của Trí)
    const filteredMenu = allMenuItems.filter((item) => {
        const hasRole = item.roles.includes(userRole);

        // 1. Nếu không đúng Role thì loại ngay
        if (!hasRole) return false;

        // 2. Admin thì cho qua hết
        if (userRole === "Admin") return true;

        // 3. Nếu có yêu cầu quyền (Dành cho Manager hoặc User đặc biệt)
        if (item.requiresPermission) {
            const permissionKey =
                item.requiresPermission === "canApprove"
                    ? "CanApprove"
                    : "CanViewLog";
            const permissionValue = userData[permissionKey];

            // Trí nhớ check kỹ key trong Token là "CanViewLog" hay "canViewLog" nhé
            return permissionValue?.toString().toLowerCase() === "true";
        }

        // 4. Các mục không yêu cầu quyền (như Profile, Home, logs của User) -> Cho qua
        return true;
    });

    // 2. Tách danh sách menu cá nhân
    const personalMenu =
        userRole === "Admin"
            ? []
            : filteredMenu.filter((item) => item.path.startsWith("/user"));

    // 3. Tách danh sách menu quản lý
    const managementMenu = filteredMenu.filter(
        (item) => !item.path.startsWith("/user"),
    );

    return (
        <aside className="fixed top-0 left-0 z-20 w-64 h-screen pt-15 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 shadow-sm">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                <ul className="space-y-1.5 font-medium">
                    {/* Nhóm CÁ NHÂN */}
                    {personalMenu.length > 0 && (
                        <>
                            <div className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 mt-4 tracking-wider">
                                Cá nhân
                            </div>
                            {personalMenu.map((item, index) => (
                                <MenuItem key={index} item={item} />
                            ))}
                        </>
                    )}

                    {/* Nhóm QUẢN LÝ */}
                    {managementMenu.length > 0 && (
                        <>
                            <div className="text-[10px] font-bold text-gray-400 uppercase px-3 mb-2 tracking-wider pt-4 border-t border-gray-100 mt-4">
                                Quản lý hệ thống
                            </div>
                            {managementMenu.map((item, index) => (
                                <MenuItem key={index} item={item} />
                            ))}
                        </>
                    )}
                </ul>
            </div>
        </aside>
    );
};

const MenuItem = ({ item }) => (
    <li>
        <NavLink
            to={item.path}
            end
            className={({ isActive }) =>
                `flex items-center p-2.5 rounded-xl group transition-all duration-200 ${
                    isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={`text-lg transition-colors ${
                            isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-blue-600"
                        }`}
                    >
                        {item.icon}
                    </span>
                    <span className="ml-3 text-sm">{item.name}</span>
                </>
            )}
        </NavLink>
    </li>
);

export default Sidebar;
