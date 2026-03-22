import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaLock } from "react-icons/fa";

const ErrorPage = ({ type = "404" }) => {
    const navigate = useNavigate();

    const is403 = type === "403";

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            {/* Icon cảnh báo */}
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg rotate-3 
                ${is403 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                {is403 ? <FaLock size={32} /> : <FaExclamationTriangle size={32} />}
            </div>

            <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
                {is403 ? "403" : "404"}
            </h1>
            
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight mb-4">
                {is403 ? "Truy cập bị từ chối!" : "Không tìm thấy trang!"}
            </h2>

            <p className="max-w-md text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                {is403 
                    ? "Rất tiếc, bạn không có quyền truy cập vào khu vực này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi."
                    : "Đường link bạn nhập không tồn tại hoặc đã bị di chuyển sang vị trí khác."}
            </p>

            <button
                onClick={() => navigate("/user")}
                className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
            >
                <FaHome size={16} /> Quay về trang chủ
            </button>
            
            <div className="mt-12 opacity-30">
                <img src="/images/DNTU.jpg" alt="DNTU" className="h-15  mx-auto" />
            </div>
        </div>
    );
};

export default ErrorPage;