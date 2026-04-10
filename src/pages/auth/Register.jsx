import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import axiosClient from "../../axios/axiosClient";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userName: "",
        passwordHash: "",
        email: "",
        fullName: "", // 1. Thêm trường này để đồng bộ với modal.FullName ở Backend
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
            // Tạo một object mới chứa dữ liệu từ form + các giá trị mặc định
            const dataSubmit = {
                ...form,
                roleId: 2, // Mặc định là Staff
                departmentId: null, // Mặc định chưa có khoa
            };

            console.log("Dữ liệu gửi đi:", dataSubmit); // Trí bật F12 lên xem thử nhé

            const res = await axiosClient.post(
                "/User/Resgiter",
                dataSubmit, // Gửi object đã được thêm roleId
            );

            // Kiểm tra đúng cấu trúc Response mà mình đã viết ở Backend
            if (res.data.status === 201) {
                alert("Đăng ký thành công!");
                navigate("/login");
            } else {
                // Hiển thị lỗi từ Backend (Ví dụ: "Tên đăng nhập đã tồn tại")
                alert(res.data.message);
            }
        } catch (err) {
            console.error(err);
            // Hiển thị lỗi InnerException nếu có từ Backend
            const errorMsg =
                err.response?.data?.message ||
                "Lỗi đăng ký! Vui lòng kiểm tra server.";
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
            <div className="flex flex-col md:flex-row max-w-7xl w-full p-4 md:p-12 items-center">
                {/* CỘT TRÁI - Giữ nguyên */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-16 mb-8 md:mb-0 space-y-4">
                    <img
                        src="./public/images/DNTU.jpg"
                        className="h-24 mr-6"
                        alt="DNTU Logo"
                    />
                    <h1 className="text-xl md:text-2xl font-bold uppercase text-[#be1e2d] tracking-wider">
                        TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI
                    </h1>
                    <h2 className="text-lg md:text-xl font-medium uppercase text-[#5a24aa] tracking-wide">
                        DONG NAI TECHNOLOGY UNIVERSITY
                    </h2>
                    <h3 className="text-sm md:text-base font-normal uppercase text-gray-700 tracking-wide mt-2">
                        Hệ thống thông tin
                    </h3>
                    <h4 className="text-lg md:text-2xl font-semibold uppercase text-gray-800 tracking-wider">
                        Quản lý lý lịch khoa học giảng viên
                    </h4>
                </div>

                {/* CỘT PHẢI - Form Đăng ký */}
                <div className="flex-1 max-w-md w-full">
                    <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-100">
                        <div className="text-center mb-10 pb-4 border-b border-gray-100">
                            <h2 className="text-3xl font-bold uppercase text-gray-800 tracking-wide">
                                ĐĂNG KÝ
                            </h2>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* Họ và tên - MỚI THÊM */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="fullName" // Trùng với key trong state
                                    placeholder="Họ và tên"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
                                />
                            </div>

                            {/* Username */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Tên đăng nhập"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-md border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
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
                                    className="w-full px-4 py-3 rounded-md border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
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
                                    className="w-full px-4 py-3 rounded-md border border-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-[#5d8df1] hover:bg-[#467ae1] text-white font-semibold py-3.5 rounded-md shadow-md transition-colors duration-200 uppercase"
                                >
                                    Đăng ký ngay
                                </button>
                            </div>
                        </form>

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
