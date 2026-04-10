import React from "react";
import { useNavigate } from "react-router-dom";
import ResumeExport from "../user/ResumeExport"; // Import vào
import {
    FaGraduationCap,
    FaBriefcase,
    FaAward,
    FaFilePdf,
    FaEdit,
    FaCheckCircle,
    FaUniversity,
    FaHistory,
} from "react-icons/fa";
import useStaffData from "../../hooks/useStaffData"; // Đảm bảo đúng đường dẫn file hook
import { calculateReadiness } from "../../utils/calculateReadiness";
import { useWorkData } from "../../hooks/useWorkData";
// Hoặc đường dẫn tương ứng của Trí
const Home = () => {
    const navigate = useNavigate(); // <--- Thêm dòng này vào đây
    // 1. Giao diện Thẻ thống kê (Academic Assets)
    const { staff, education, employment, languages } = useStaffData();
    console.log(staff);
    const fieldLabels = {
        fullName: "Họ và tên",
        email: "Email liên lạc",
        phoneMobile: "Số điện thoại",
        address: "Địa chỉ liên hệ",
        dateOfBirth: "Ngày sinh",
        genderName: "Giới tính",
        placeOfBirth: "Nơi sinh",
        nativeVillage: "Quê quán",
        ethnicityName: "Dân tộc",
        positionName: "Chức vụ hiện tại",
        departmentName: "Đơn vị công tác",
        fax: "Số Fax",
        academicRankName: "Học hàm",
        rankYear: "Năm bổ nhiệm học hàm",
        highestDegreeName: "Học vị cao nhất",
        degreeYear: "Năm đạt học vị",
        degreeCountry: "Nước cấp bằng",
        cccdNumber: "Số CCCD",
        cccdDate: "Ngày cấp CCCD",
        cccdPlace: "Nơi cấp CCCD",
        education: "Thông tin học vấn",
        employment: "Quá trình công tác",
        languages: "Trình độ ngoại ngữ",
    };

    const timelineData = (employment || [])
        // 1. Lọc bỏ những mục thiếu ngày bắt đầu để tránh lỗi
        .filter((job) => job.fromDate)
        // 2. Chuyển đổi sang định dạng Timeline
        .map((job) => ({
            year: new Date(job.fromDate).getFullYear(),
            title: job.position || "Chức vụ chưa cập nhật",
            desc: job.organization || "Đơn vị chưa cập nhật",
            // Nếu đang làm (toDate null) thì hiện icon tên lửa cho "máu"
            color: job.toDate ? "bg-slate-300" : "bg-blue-500", // Đang làm thì màu xanh nổi bật
            timestamp: new Date(job.fromDate).getTime(), // Dùng để sắp xếp
        }))
        // 3. Sắp xếp: Mới nhất đẩy lên đầu
        .sort((a, b) => b.timestamp - a.timestamp)
        // 4. CHỐT: Chỉ lấy đúng 4 mục mới nhất
        .slice(0, 4);
    const handleDownload = () => {
        const fileUrl = "/files/Mau_Ly_Lich.pdf";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = "Mau_Ly_Lich_DNTU.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Trong JSX:
    <button
        onClick={handleDownload}
        className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-white/10 active:scale-95"
    >
        <FaFilePdf className="text-red-400" /> Tải PDF (Mẫu chuẩn)
    </button>;
    // 1. Gọi hàm để lấy kết quả (Destructuring lấy score)
    const { score, missingFields } = calculateReadiness(
        staff,
        education,
        employment,
        languages,
    );
    const totalYears = (employment || []).reduce((sum, job) => {
        // 1. CHỐT CHẶN: Nếu không có ngày bắt đầu, bỏ qua công việc này
        if (!job.fromDate) return sum;

        const startDate = new Date(job.fromDate);
        const endDate = job.toDate ? new Date(job.toDate) : new Date();

        // 2. KIỂM TRA TÍNH HỢP LỆ: Đảm bảo ngày tháng chuyển đổi thành công
        // (Dùng isNaN để check xem đối tượng Date có hợp lệ không)
        if (isNaN(startDate.getTime())) return sum;

        const diff = endDate - startDate;

        // 3. TRÁNH SỐ ÂM: Nếu lỡ nhập ngày kết thúc trước ngày bắt đầu
        const validDiff = diff > 0 ? diff : 0;

        return sum + validDiff / (1000 * 60 * 60 * 24 * 365.25);
    }, 0);
    // 2. Tính toán strokeDashoffset cho SVG
    // Chu vi vòng tròn (C = 2 * PI * r) với r=48 là xấp xỉ 301.6
    const strokeColor =
        score < 50
            ? "text-red-500"
            : score < 80
              ? "text-amber-500"
              : "text-blue-600";
    // Sau đó thay class "text-blue-600" trong SVG thành {strokeColor}
    const strokeDasharray = 301.59;
    const strokeDashoffset = strokeDasharray - (score / 100) * strokeDasharray;
    const StatCard = ({ label, value, icon, color, bg }) => (
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
            <div
                className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center text-xl shadow-inner`}
            >
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {label}
                </p>
                <p className="text-lg font-black text-slate-900 leading-none mt-1">
                    {value}
                </p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* --- 2. THỐNG KÊ TÀI SẢN KHOA HỌC (ACADEMIC ASSETS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-15">
                <StatCard
                    label="Học vị"
                    value={staff.highestDegreeName}
                    icon={<FaGraduationCap />}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    label="Kinh nghiệm"
                    value={`${Math.floor(totalYears)} Năm`}
                    icon={<FaBriefcase />}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <StatCard
                    label="Khoa"
                    value={staff.departmentName || "DNTU"}
                    icon={<FaUniversity />} // Icon trường học/tòa nhà
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    label="Cơ quan"
                    value="Đại học Công nghệ Đồng Nai"
                    icon={<FaUniversity />}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- CỘT TRÁI (TIẾN ĐỘ & TIMELINE) --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. CHỈ SỐ SỨC KHỎE HỒ SƠ (PROFILE READINESS) */}
                    <div
                        className={`bg-white p-8 rounded-[2.5rem] border shadow-sm relative
                        ${staff.isApproved === 1 ? "border-green-500" : "border-orange-500"}`}
                    >
                        {" "}
                        {/* --- BADGE TRẠNG THÁI (CẮT NGANG BORDER) --- */}
                        {/* --- BADGE TRẠNG THÁI NẰM ĐÈ LÊN BORDER TOP --- */}
                        <div className="absolute -top-3.5 right-10 z-30">
                            {/* -top-3.5 (~14px) là khoảng cách để tâm Badge đè đúng vào đường line border */}
                            {staff.isApproved === 1 ? (
                                <div className="group relative flex items-center gap-2 px-4 py-1 bg-white text-green-600 border border-green-200 rounded-full shadow-sm transition-all hover:bg-green-600 hover:text-white cursor-help">
                                    <i className="fa-solid fa-circle-check text-[10px]"></i>
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Đã duyệt
                                    </span>

                                    {/* Tooltip (Vẫn giữ nguyên) */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
                                        Hồ sơ đã được xác thực bởi DNTU.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative flex items-center gap-2 px-4 py-1 bg-white text-amber-600 border border-amber-200 rounded-full shadow-sm transition-all hover:bg-amber-500 hover:text-white cursor-help">
                                    <i className="fa-solid fa-clock text-[10px] animate-pulse"></i>
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Đang chờ duyệt
                                    </span>

                                    {/* Tooltip (Vẫn giữ nguyên) */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
                                        Hồ sơ đang trong hàng đợi phê duyệt.
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-30"></div>
                        <div className="relative flex flex-col md:flex-row items-center gap-10">
                            {/* Progress */}
                            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="56"
                                        cy="56"
                                        r="48"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="56"
                                        cy="56"
                                        r="48"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={48 * 2 * Math.PI}
                                        strokeDashoffset={
                                            48 * 2 * Math.PI * (1 - score / 100)
                                        }
                                        strokeLinecap="round"
                                        className={`${score === 100 ? "text-green-500" : "text-blue-600"} transition-all duration-1000 ease-out`}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span
                                        className={`text-2xl font-black ${score === 100 ? "text-green-600" : "text-blue-600"} leading-none`}
                                    >
                                        {score}%
                                    </span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                        Hoàn thiện
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                                        {score === 100
                                            ? "Hồ sơ hoàn hảo!"
                                            : "Nâng cấp hồ sơ của bạn"}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {score < 100
                                            ? `Bạn còn thiếu một vài thông tin quan trọng.`
                                            : "Lý lịch của bạn đã sẵn sàng để xuất file và lưu hành nội bộ."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {missingFields
                                        .slice(0, 4)
                                        .map((field, index) => (
                                            <span
                                                key={index}
                                                className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 shadow-sm"
                                            >
                                                • {fieldLabels[field] || field}
                                            </span>
                                        ))}
                                    {missingFields.length > 4 && (
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100">
                                            + {missingFields.length - 4} mục
                                            khác
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {score < 100 ? (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/user/edit-staff/${staff.id}`,
                                                )
                                            }
                                            className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg border border-amber-100 flex items-center gap-1 hover:bg-amber-100 transition-colors"
                                        >
                                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                                            CẦN CẬP NHẬT THÊM →
                                        </button>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg border border-green-100 flex items-center gap-2">
                                            <i className="fa-solid fa-circle-check"></i>{" "}
                                            ĐÃ SẴN SÀNG XUẤT FILE
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. BIỂU ĐỒ DÒNG THỜI GIAN (CAREER TIMELINE) */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                <i className="fa-solid fa-timeline text-xs"></i>
                            </div>
                            <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em]">
                                Lộ trình phát triển
                            </h3>
                        </div>

                        <div className="relative pl-8 space-y-10 before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-100">
                            {timelineData && timelineData.length > 0 ? (
                                timelineData.map((item, idx) => (
                                    <div key={idx} className="relative">
                                        <div
                                            className={`absolute -left-[25px] w-4 h-4 ${item.color || "bg-blue-500"} rounded-full border-4 border-white shadow-sm z-10`}
                                        ></div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                                {item.year}
                                            </span>
                                            <h4 className="text-sm font-black text-slate-800">
                                                💼 {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-5 text-center">
                                    <p className="text-xs text-slate-400 italic">
                                        Chưa có dữ liệu lộ trình công tác.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* --- CỘT PHẢI (QUICK ACTIONS & EXPORT) --- */}
                <div className="space-y-6">
                    {/* 4. LỐI TẮT XUẤT FILE (QUICK EXPORT) */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                        {/* Hiệu ứng tia sáng chạy qua */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
                                    Hành động nhanh
                                </p>
                                <h3 className="text-xl font-black tracking-tight uppercase">
                                    Xuất Lý Lịch
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() =>
                                        window.open("/user/export", "_blank")
                                    }
                                    className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-white/10 active:scale-95"
                                >
                                    <FaFilePdf className="text-red-400" /> Tải
                                    PDF (Mẫu chuẩn)
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(`/user/edit-staff/${staff.id}`)
                                    }
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900 active:scale-95"
                                >
                                    <FaEdit /> Chỉnh sửa ngay
                                </button>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                    Lưu ý: Kiểm tra kỹ thông tin trước khi xuất
                                    file để nộp cho Phòng Đào tạo/KHCN.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Widget nhỏ trang trí hoặc thông báo */}
                    {/* <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                        <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest mb-2">
                            Thông báo DNTU
                        </h4>
                        <p className="text-[11px] text-blue-600/80 font-semibold leading-relaxed">
                            Vui lòng hoàn thiện hồ sơ trước kỳ đánh giá giảng
                            viên cuối học kỳ 2 (Năm học 2025-2026).
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Home;
