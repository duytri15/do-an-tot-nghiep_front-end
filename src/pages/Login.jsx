import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../axios/axiosClient";


export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userName: "",
        passwordHash: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post(
                "/User/Login",
                form,
            );

            if (res.data.status === 200) {
                const { accessToken, refreshToken } = res.data.data.token;
                // Lấy staffId từ Backend trả về
                const staffId = res.data.data.staffId;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);

                // Nếu có staffId, điều hướng thẳng vào trang profile của người đó
                if (staffId) {
                    navigate(`/user/profile/`);
                } else {
                    // Trường hợp user mới chưa có staff (nếu có lỗi logic)
                    alert("Tài khoản này chưa có thông tin giảng viên!");
                }
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        // Wrapper: Nền xám nhạt toàn màn hình
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            <div className="flex flex-col md:flex-row max-w-7xl w-full p-4 md:p-12 items-center">
                {/* CỘT TRÁI - Thông tin DNTU */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-16 mb-8 md:mb-0 space-y-4">
                    {/* Logo kích thước lớn hơn như bạn yêu cầu (h-24 ~ 96px) */}
                    <img
                        src="./public/images/DNTU.jpg"
                        className="h-24 mr-6"
                        alt="DNTU Logo"
                    />
                    <h1 className="text-xl md:text-2xl font-bold uppercase text-[#be1e2d] tracking-wider leading-tight">
                        TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI
                    </h1>
                    <h2 className="text-lg md:text-xl font-medium uppercase text-[#5a24aa] tracking-wide">
                        DONG NAI TECHNOLOGY UNIVERSITY
                    </h2>

                    <div className="pt-4">
                        <h3 className="text-sm md:text-base font-normal uppercase text-gray-700 tracking-wide mb-3">
                            Hệ thống thông tin
                        </h3>
                        <h4 className="text-lg md:text-2xl font-semibold uppercase text-gray-800 tracking-wider">
                            Quản lý lý lịch khoa học giảng viên
                        </h4>
                    </div>
                </div>

                {/* CỘT PHẢI - Form Đăng nhập */}
                <div className="flex-1 max-w-md w-full">
                    <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-100">
                        {/* Tiêu đề ĐĂNG NHẬP (Theo mẫu ảnh) */}
                        <div className="text-center mb-10 pb-4 border-b border-gray-100">
                            <h2 className="text-3xl font-bold uppercase text-gray-800 tracking-wide">
                                ĐĂNG NHẬP
                            </h2>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Username */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Tên đăng nhập"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 text-gray-700"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type="password"
                                    name="passwordHash"
                                    placeholder="Mật khẩu"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 text-gray-700"
                                />
                            </div>

                            {/* Link Quên mật khẩu & Hướng dẫn (Theo mẫu ảnh) */}
                            <div className="text-center space-y-1">
                                <p className="text-xs text-red-600">
                                    Bạn quên mật khẩu?{" "}
                                    <span className="text-blue-700 font-bold cursor-pointer hover:underline">
                                        Quên mật khẩu
                                    </span>
                                </p>
                                <p className="text-xs text-red-600">
                                    Hướng dẫn quên mật khẩu?{" "}
                                    <span className="text-blue-700 font-bold cursor-pointer hover:underline">
                                        Xem hướng dẫn
                                    </span>
                                </p>
                            </div>

                            {/* Nút Đăng nhập */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#5d8df1] hover:bg-[#467ae1] text-white font-semibold py-3.5 rounded-md shadow-md transition-colors duration-200 uppercase tracking-wider"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </form>

                        {/* Link chuyển sang Đăng ký */}
                        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Đăng ký tại đây
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
