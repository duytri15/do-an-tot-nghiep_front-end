import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useStaffData from "../../hooks/useStaffData"; // Đảm bảo đúng đường dẫn file hook
import {
    FaEdit,
    FaGraduationCap,
    FaBriefcase,
    FaIdCard,
    FaMapMarkerAlt,
    FaUniversity,
    FaMicroscope,
} from "react-icons/fa";

const Profile = () => {
    const navigate = useNavigate();

    // --- THAY ĐỔI QUAN TRỌNG NHẤT Ở ĐÂY ---
    // Gọi hook và lấy toàn bộ dữ liệu + trạng thái loading
    const {
        staff,
        education,
        languages,
        employment,
        loading,
        publications,
        error,
        researches,
    } = useStaffData();
    console.log(researches);
    const [openSections, setOpenSections] = useState({
        section1: true,
        section2: false,
        section3: false,
        section4: false,
        section5: true, // <--- Cho hiện mặc định hoặc ẩn tùy Trí
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const formatDate = (dateString) => {
        if (!dateString) return "Nay";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };
    if (loading)
        return (
            <div className="text-center p-20 text-blue-700 font-bold italic animate-pulse">
                Đang tải hồ sơ..
            </div>
        );
    if (!staff || error)
        return (
            <div className="text-center p-20 italic text-red-500">
                Dữ liệu nhân viên không tồn tại.
            </div>
        );

    return (
        <div className=" max-w-6xl mx-auto my-10 px-4 font-sans text-slate-900">
            {/* 1. HEADER */}
            {/* --- 1. HEADER - Toàn bộ phần Header (Thu nhỏ mb-8 thành mb-6) --- */}
            <div className=" relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                {/* Một chút màu sắc trang trí ở nền (Giảm chiều cao h-24 thành h-16) */}
                <div className=" absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10 z-0"></div>

                {/* Giảm padding (px-8 py-12 thành px-6 py-8) */}
                <div className="relative px-6 py-8 flex flex-col md:flex-row items-center gap-6 z-10">
                    {/* Avatar Squircle (Thu nhỏ w-32 h-32 thành w-20 h-20, text-4xl thành text-3xl) */}
                    <div className="relative group shrink-0">
                        <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <span className="-rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                {staff.fullName?.charAt(0)}
                            </span>
                        </div>
                        {/* Chấm trạng thái online (Thu nhỏ size) */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    {/* Thông tin chính (Giảm font chữ) */}
                    <div className="flex-1 text-center md:text-left space-y-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            {/* Giảm text-4xl thành text-2xl */}
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {staff.fullName}
                            </h1>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500">
                            {/* Giảm font-bold text-sm thành text-xs font-semibold */}
                            <div className="flex items-center gap-1.5 font-semibold text-xs">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                {staff.positionName}
                            </div>

                            {staff.departmentName && (
                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <span className="text-slate-200">|</span>
                                    <FaUniversity className="text-slate-400" />
                                    {staff.departmentName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút bấm: Chuyển sang dạng Solid Bold để tạo điểm nhấn */}
                    <div className="shrink-0">
                        <button
                            onClick={() =>
                                navigate(`/user/edit-staff/${staff.id}`)
                            }
                            className="flex items-center gap-2.5 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all duration-300 active:scale-95"
                        >
                            <FaEdit size={14} />
                            Chỉnh sửa hồ sơ
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                {/* PHẦN I: LÝ LỊCH SƠ LƯỢC */}
                <CardSection
                    title="I. LÝ LỊCH SƠ LƯỢC"
                    icon={<FaIdCard />}
                    isOpen={openSections.section1}
                    onToggle={() => toggleSection("section1")}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
                        <InfoBox label="Họ và tên" value={staff.fullName} />
                        <InfoBox
                            label="Ngày sinh"
                            value={formatDate(staff.dateOfBirth)}
                        />
                        <InfoBox label="Giới tính" value={staff.genderName} />
                        <InfoBox label="Nơi sinh" value={staff.placeOfBirth} />
                        <InfoBox label="Quê quán" value={staff.nativeVillage} />
                        <InfoBox label="Dân tộc" value={staff.ethnicityName} />
                        <InfoBox label="Chức vụ" value={staff.positionName} />
                        <InfoBox
                            label="Đơn vị công tác"
                            value={staff.departmentName}
                        />
                        <InfoBox label="Fax" value={staff.fax} />
                        <InfoBox
                            label="Chức danh khoa học"
                            value={staff.academicRankName}
                        />
                        <InfoBox label="Năm bổ nhiệm" value={staff.rankYear} />
                        <InfoBox
                            label="Học vị cao nhất"
                            value={staff.highestDegreeName}
                        />
                        <InfoBox
                            label="Năm nhận học vị"
                            value={staff.degreeYear}
                        />
                        <InfoBox
                            label="Nước nhận học vị"
                            value={staff.degreeCountry}
                        />
                        <InfoBox label="Số CCCD" value={staff.cccdNumber} />
                        <InfoBox
                            label="Ngày cấp"
                            value={formatDate(staff.cccdDate)}
                        />
                        <InfoBox label="Nơi cấp" value={staff.cccdPlace} />
                        <InfoBox
                            label="Địa chỉ liên lạc"
                            value={staff.address}
                            className="md:col-span-3"
                        />
                        <InfoBox
                            label="Điện thoại di động"
                            value={staff.phoneMobile}
                        />
                        <InfoBox label="E-mail" value={staff.email} />
                    </div>
                </CardSection>

                {/* PHẦN II: QUÁ TRÌNH ĐÀO TẠO */}
                <CardSection
                    title="II. QUÁ TRÌNH ĐÀO TẠO"
                    icon={<FaGraduationCap />}
                    isOpen={openSections.section2}
                    onToggle={() => toggleSection("section2")}
                >
                    <div className="space-y-12">
                        {/* 1. Đào tạo đại học và sau đại học */}
                        <div>
                            <h4 className="text-blue-800 font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>{" "}
                                1. Đào tạo đại học và sau đại học
                            </h4>
                            <div className="space-y-6">
                                {education?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <h4 className="text-blue-800 font-black text-base flex items-center gap-3 uppercase">
                                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>{" "}
                                                Bằng{" "}
                                                {item.degreeLevelName ||
                                                    "Đang cập nhật"}
                                            </h4>
                                            <span className="bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                                Năm tốt nghiệp:{" "}
                                                {item.graduationYear}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <InfoBox
                                                label="Chuyên ngành"
                                                value={item.major}
                                            />
                                            <InfoBox
                                                label="Hình thức đào tạo"
                                                value={item.trainingFormName}
                                            />
                                            <InfoBox
                                                label="Cơ sở đào tạo"
                                                value={item.institution}
                                            />
                                            <InfoBox
                                                label="Quốc gia đào tạo"
                                                value={item.countryName}
                                            />
                                        </div>
                                        {item.thesisName && (
                                            <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                                                <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100">
                                                    <InfoBox
                                                        label="Tên luận án / Luận văn"
                                                        value={item.thesisName}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Ngoại ngữ */}
                        <div>
                            <h4 className="text-blue-800 font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>{" "}
                                2. Ngoại ngữ
                            </h4>
                            <div className="space-y-4">
                                {languages?.map((lang, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 shadow-sm transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <h4 className="text-blue-800 font-black text-base flex items-center gap-3 uppercase">
                                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>{" "}
                                                {lang.languageName}
                                            </h4>
                                            <span className="bg-blue-50 px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-wider">
                                                Trình độ
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                            <InfoBox
                                                label="Mức độ thành thạo"
                                                value={
                                                    lang.notes ||
                                                    "Giao tiếp cơ bản"
                                                }
                                            />
                                            <InfoBox
                                                label="Ghi chú / Chứng chỉ"
                                                value={
                                                    lang.proficiencyLevel ||
                                                    "---"
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardSection>

                {/* PHẦN III: QUÁ TRÌNH CÔNG TÁC */}
                <CardSection
                    title="III. QUÁ TRÌNH CÔNG TÁC"
                    icon={<FaBriefcase />}
                    isOpen={openSections.section3}
                    onToggle={() => toggleSection("section3")}
                >
                    <div className="space-y-0">
                        {employment && employment.length > 0 ? (
                            employment.map((item, index) => (
                                <div key={index} className="flex group">
                                    {/* CỘT THỜI GIAN (Bên trái) */}
                                    <div className="w-24 md:w-32 flex-shrink-0 flex flex-col items-center">
                                        {/* Nhãn thời gian nổi bật */}
                                        <div className="text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            {formatDate(item.fromDate)}
                                        </div>
                                        {/* Đường kẻ nối giữa các mốc */}
                                        <div className="w-0.5 h-full bg-slate-100 group-last:bg-transparent my-2"></div>
                                    </div>

                                    {/* NỘI DUNG (Bên phải) */}
                                    <div className="flex-1 pb-10 pl-4 md:pl-8">
                                        <div className="relative p-6 rounded-3xl bg-slate-50 border border-transparent group-hover:bg-white group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-500/5 transition-all duration-300">
                                            {/* Mũi tên trỏ sang trái (Tùy chọn) */}
                                            <div className="absolute -left-2 top-3 w-4 h-4 bg-inherit border-l border-t border-inherit rotate-45 hidden md:block"></div>

                                            <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                                                <div className="space-y-1">
                                                    <h5 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                                        {item.position ||
                                                            "Cán bộ / Giảng viên"}
                                                    </h5>
                                                    <p className="text-sm font-bold text-blue-600">
                                                        {item.organizationName ||
                                                            item.organization}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                        Đến:{" "}
                                                        {formatDate(
                                                            item.toDate,
                                                        ) || "Hiện tại"}
                                                    </span>
                                                </div>
                                            </div>

                                            {item.description && (
                                                <p className="mt-4 text-sm text-slate-500 leading-relaxed font-medium border-t border-slate-200 pt-4">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                <FaMapMarkerAlt className="text-blue-500" />{" "}
                                                {item.address || "Việt Nam"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                                <p className="text-slate-400 font-black italic">
                                    Hồ sơ công tác trống
                                </p>
                            </div>
                        )}
                    </div>
                </CardSection>
                {/* PHẦN IV: QUÁ TRÌNH NGHIÊN CỨU KHOA HỌC */}
                <CardSection
                    title="IV. QUÁ TRÌNH NGHIÊN CỨU KHOA HỌC"
                    icon={<FaMicroscope />}
                    isOpen={openSections.section4}
                    onToggle={() => toggleSection("section4")}
                >
                    <div className="space-y-12">
                        {/* 1. Các đề tài nghiên cứu khoa học */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-blue-800 font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-wider">
                                    <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                    1. Các đề tài nghiên cứu khoa học đã và đang
                                    tham gia
                                </h4>
                                <div className="flex items-center justify-between mb-6">
                                    {researches?.length > 0 && (
                                        <span className="text-[10px] font-black px-3 py-1.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-200 uppercase">
                                            {researches.length} đề tài
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-6">
                                {/* HEADER */}

                                {/* LIST */}
                                <div className="space-y-4">
                                    {researches && researches.length > 0 ? (
                                        researches.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                                            >
                                                {/* LEFT: STT + LINE */}
                                                <div className="flex flex-col items-center w-12">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1 w-[2px] bg-slate-100 mt-2"></div>
                                                </div>

                                                {/* RIGHT: CONTENT */}
                                                <div className="flex-1 space-y-3">
                                                    {/* TITLE + TIME */}
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                        <h5 className="text-base font-bold text-slate-800 group-hover:text-blue-700">
                                                            {item.researchName}
                                                        </h5>

                                                        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-lg w-fit">
                                                            {item.startYear} -{" "}
                                                            {item.endYear ||
                                                                "Nay"}
                                                        </span>
                                                    </div>

                                                    {/* INFO GRID */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-slate-400 text-xs font-medium">
                                                                Cấp đề tài
                                                            </p>
                                                            <p className="text-slate-700 font-semibold">
                                                                {item.researchLevel ||
                                                                    "Không rõ"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-slate-400 text-xs font-medium">
                                                                Vai trò
                                                            </p>
                                                            <p className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                                                                {item.roleInResearchName ||
                                                                    "Thành viên"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            <p className="text-slate-400 italic">
                                                Chưa có dữ liệu đề tài nghiên
                                                cứu
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Các công trình khoa học đã công bố */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                {/* TIÊU ĐỀ NẰM ĐẦU (BÊN TRÁI) */}
                                <h4 className="text-blue-800 font-black text-sm flex items-center gap-2 uppercase tracking-wider mb-0">
                                    <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                    2. Các công trình khoa học đã công bố
                                </h4>

                                {/* BADGE NẰM CUỐI (BÊN PHẢI) */}
                                {publications?.length > 0 && (
                                    <span className="text-[10px] font-black px-3 py-1.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-200 uppercase">
                                        {publications.length} công trình
                                    </span>
                                )}
                            </div>
                            <div>
                                {/* LIST */}
                                <div className="space-y-4">
                                    {publications && publications.length > 0 ? (
                                        publications.map((item, index) => (
                                            <div
                                                key={index}
                                                className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group"
                                            >
                                                <div className="flex gap-4">
                                                    {/* INDEX */}
                                                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                                                        {index + 1}
                                                    </div>

                                                    {/* CONTENT */}
                                                    <div className="flex-1 space-y-3">
                                                        {/* TITLE */}
                                                        <h5 className="font-bold text-slate-800 text-base leading-snug group-hover:text-blue-700 transition">
                                                            {item.publicationName ||
                                                                "—"}
                                                        </h5>

                                                        {/* META */}
                                                        <div className="flex flex-wrap gap-2 text-xs">
                                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-semibold">
                                                                📅{" "}
                                                                {item.publicationYear ||
                                                                    "---"}
                                                            </span>

                                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">
                                                                📚{" "}
                                                                {item.journalName ||
                                                                    "Không rõ"}
                                                            </span>
                                                        </div>

                                                        {/* NOTES */}
                                                        {item.notes && (
                                                            <div className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-3">
                                                                {item.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        /* EMPTY STATE */
                                        <div className="p-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center text-center">
                                            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                                📄
                                            </div>

                                            <p className="text-slate-500 font-semibold">
                                                Chưa có công trình khoa học nào
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1 italic">
                                                Dữ liệu sẽ hiển thị khi có bài
                                                báo được thêm
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardSection>
            </div>
        </div>
    );
};

// UI Components giữ nguyên như của bạn...
const CardSection = ({
    title,
    description,
    icon,
    children,
    isOpen,
    onToggle,
}) => (
    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md mb-4">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-5 md:p-6 focus:outline-none group hover:bg-slate-50/50 transition-colors"
        >
            <div className="flex items-center gap-4">
                {/* Icon nhỏ gọn và tinh tế hơn */}
                <div
                    className={`p-3 rounded-xl transition-all duration-500 ${isOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
                >
                    <span className="text-xl">{icon}</span>
                </div>
                <div className="text-left">
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight">
                        {title}
                    </h3>
                    {/* Thêm dòng mô tả nhỏ để nhìn chuyên nghiệp hơn */}
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                        {description}
                    </p>
                </div>
            </div>

            <div
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 ${isOpen ? "rotate-180 bg-blue-50 text-blue-600" : "text-slate-300"}`}
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </button>

        <div
            className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
            <div className="overflow-hidden">
                <div className="px-6 pb-8 pt-2 border-t border-slate-50 bg-white">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const InfoBox = ({ label, value, className = "" }) => (
    <div className={`space-y-1 ${className}`}>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            {label}
        </p>
        <p className="text-[15px] font-bold text-slate-800 break-words">
            {value || "---"}
        </p>
    </div>
);

export default Profile;
