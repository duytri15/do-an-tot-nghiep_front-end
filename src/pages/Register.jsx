import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userName: "",
        passwordHash: "",
        email: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5276/User/Resgiter",
                form,
            );

            if (res.data.status === 201) {
                alert("Đăng ký thành công!");
                navigate("/login");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi đăng ký! Vui lòng kiểm tra lại kết nối server.");
        }
    };

    return (
        // Wrapper chính: Toàn màn hình, nền xám nhạt (theo mẫu)
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            {/* Container chính: 2 cột (DNTU và Form Đăng ký) */}
            <div className="flex flex-col md:flex-row max-w-7xl w-full p-4 md:p-12 items-center">
                {/* CỘT TRÁI - Thông tin DNTU (Theo mẫu) */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-16 mb-8 md:mb-0 space-y-4">
                    {/* 👇 BẠN THAY ĐƯỜNG DẪN ẢNH TẠI ĐÂY */}
                    <img
                        src="./public/images/DNTU.jpg"
                        className="h-24 mr-6"
                        alt="DNTU Logo"
                    />

                    {/* Phần chữ DNTU (Theo mẫu) */}
                    <h1 className="text-xl md:text-2xl font-bold uppercase text-[#be1e2d] tracking-wider">
                        TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI
                    </h1>
                    <h2 className="text-lg md:text-xl font-medium uppercase text-[#5a24aa] tracking-wide">
                        DONG NAI TECHNOLOGY UNIVERSITY
                    </h2>

                    {/* 👇 Nội dung thay đổi (Quản lý lý lịch khoa học giảng viên) */}
                    <h3 className="text-sm md:text-base font-normal uppercase text-gray-700 tracking-wide mt-2">
                        Hệ thống thông tin
                    </h3>
                    <h4 className="text-lg md:text-2xl font-semibold uppercase text-gray-800 tracking-wider">
                        Quản lý lý lịch khoa học giảng viên
                    </h4>
                </div>

                {/* CỘT PHẢI - Form Đăng ký (Dựa trên mẫu Login) */}
                <div className="flex-1 max-w-md w-full">
                    <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-100">
                        {/* Tiêu đề ĐĂNG KÝ (Theo mẫu) */}
                        <div className="text-center mb-10 pb-4 border-b border-gray-100">
                            <h2 className="text-3xl font-bold uppercase text-gray-800 tracking-wide">
                                ĐĂNG KÝ
                            </h2>
                        </div>

                        {/* Form Đăng ký (Nhiều ô hơn Login) */}
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* Username */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Tên đăng nhập"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Địa chỉ Email"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
                                />
                            </div>

                            {/* Mật khẩu */}
                            <div className="relative">
                                <input
                                    type="password"
                                    name="passwordHash"
                                    placeholder="Mật khẩu"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
                                />
                            </div>

                            {/* Nút Đăng ký (Màu xanh theo mẫu) */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#5d8df1] hover:bg-[#467ae1] text-white font-semibold py-3.5 rounded-md shadow-md transition-colors duration-200 uppercase"
                                >
                                    Đăng ký ngay
                                </button>
                            </div>
                        </form>

                        {/* Link chuyển sang Đăng nhập (Thay cho "Quên mật khẩu") */}
                        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                Đã có tài khoản?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    Đăng nhập
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
