import React, { useState } from "react";
import axiosClient from "../../axios/axiosClient";
import { useNavigate } from "react-router-dom";
import { FaKey, FaShieldAlt, FaLock } from "react-icons/fa";
function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Mật khẩu mới và xác nhận không khớp!");
            return;
        }

        try {
            // Lấy chuỗi JSON từ localStorage
            const rawUser = localStorage.getItem("user");

            // KIỂM TRA: Nếu không có dữ liệu user thì dừng lại luôn
            if (!rawUser) {
                console.error("LocalStorage 'user' is empty!");
                alert(
                    "Phiên làm việc hết hạn hoặc không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!",
                );
                navigate("/login");
                return;
            }

            const userStored = JSON.parse(rawUser);

            // THAY ĐỔI: Kiểm tra cả 'id' (thường) và 'Id' (hoa) cho chắc ăn
            const userId = userStored?.id || userStored?.Id;

            if (!userId) {
                alert("Không tìm thấy ID người dùng trong hệ thống!");
                return;
            }

            const dataSubmit = {
                userId: userId,
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            };

            const res = await axiosClient.post(
                "/User/ChangePassword",
                dataSubmit,
            );

            if (res.data.status === 200) {
                alert("Chúc mừng bạn! Đổi mật khẩu thành công.");
                // Xóa sạch để bảo mật
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                navigate("/login");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error("Lỗi API:", err);
            alert(
                err.response?.data?.message ||
                    "Mật khẩu cũ không chính xác hoặc lỗi Server!",
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
            {/* Background trang trí phía sau (tạo hiệu ứng chiều sâu) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-8 md:p-12 relative z-10 backdrop-blur-sm">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 text-blue-600 shadow-inner">
                        <FaShieldAlt size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                        Bảo mật tài khoản
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                        Cập nhật mật khẩu định kỳ để bảo vệ dữ liệu nghiên cứu
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Field: Mật khẩu hiện tại */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                            Mật khẩu hiện tại
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <FaLock size={16} />
                            </div>
                            <input
                                type="password"
                                name="oldPassword"
                                required
                                placeholder="••••••••"
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Input Field: Mật khẩu mới */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Mật khẩu mới
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <FaKey size={16} />
                                </div>
                                <input
                                    type="password"
                                    name="newPassword"
                                    required
                                    placeholder="Mật khẩu mới"
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Input Field: Xác nhận mật khẩu */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                Xác nhận
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <FaKey size={16} />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    placeholder="Xác nhận lại"
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Hint Section */}
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                        <ul className="text-[11px] text-blue-600/80 font-semibold space-y-1">
                            <li>• Mật khẩu nên có ít nhất 8 ký tự</li>
                            <li>
                                • Bao gồm chữ hoa, chữ thường và ký hiệu đặc
                                biệt
                            </li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)] hover:shadow-blue-500/50 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 uppercase tracking-wider"
                    >
                        Xác nhận thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
