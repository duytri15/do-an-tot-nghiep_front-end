import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useStaffData from "../hooks/useStaffData";
import { FaSignOutAlt, FaUser, FaBell, FaGlobe, FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();
    const { staff, loading } = useStaffData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    };

    return (
        // fixed: Đè lên toàn bộ các thành phần khác
        // w-full: Chạy dài hết màn hình
        // z-[100]: Đảm bảo nằm trên cùng (đè cả Sidebar)
        <nav className="fixed top-0 left-0 w-full h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 z-[100] shadow-sm">
            
            {/* --- GÓC TRÁI: LOGO & CHỮ DNTU --- */}
            <div className="flex items-center gap-3 w-64 shrink-0">
                <Link to="/user" className="flex items-center gap-2">
                    {/* Thay đường dẫn ảnh logo của Trí vào đây */}
                    <img 
                        src="/images/DNTU.jpg" 
                        alt="Logo" 
                        className="h-10 w-auto object-contain"
                    />
                    <span className="text-2xl font-black text-[#be1e2d] tracking-tighter">
                        DNTU
                    </span>
                </Link>
            </div>

            {/* --- GIỮA: THANH TÌM KIẾM --- */}
            <div className="flex-1 max-w-2xl hidden lg:block px-8">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <FaSearch size={14} />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm thông tin..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>
            </div>

            {/* --- PHẢI: USER INFO --- */}
            <div className="flex items-center gap-4">
                <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hidden sm:block">
                    <FaGlobe size={18} />
                </button>
                <button className="text-slate-400 hover:text-blue-600 p-2 rounded-lg relative">
                    <FaBell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative ml-2">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 group"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-800 leading-none">
                                {loading ? "..." : (staff?.fullName || "Giảng viên")}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                Online
                            </p>
                        </div>
                        <div className="text-blue-600 group-hover:scale-105 transition-transform">
                            <FaUserCircle size={38} />
                        </div>
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
                                <button 
                                    onClick={() => { navigate("/user/profile"); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-semibold"
                                >
                                    <FaUser size={14} /> Hồ sơ cá nhân
                                </button>
                                <hr className="my-1 border-slate-50" />
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold"
                                >
                                    <FaSignOutAlt size={14} /> Đăng xuất
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;