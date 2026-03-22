import { NavLink } from "react-router-dom";
import { FaThLarge, FaUserEdit, FaFileExport } from "react-icons/fa";

const Sidebar = () => {
    // Danh sách các mục menu để Duy Trí dễ quản lý/thêm bớt
    const menuItems = [
        { path: "/user/home/", name: "Tổng quan", icon: <FaThLarge /> },
        {
            path: "/user/profile/",
            name: "Lý lịch cá nhân",
            icon: <FaUserEdit />,
        },
        {
            path: "/user/export",
            name: "Xuất file lý lịch",
            icon: <FaFileExport />,
        },
    ];

    return (
        <aside className="fixed top-0 left-0 z-20 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                <ul className="space-y-2 font-medium">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-lg group transition-colors ${
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-900 hover:bg-gray-100"
                                    }`
                                }
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="ml-3">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
