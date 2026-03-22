import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useStaffData from "../hooks/useStaffData";
import axiosClient from "../axios/axiosClient";
import { useCategories } from "../hooks/useCategories";
import { useWorkData } from "../hooks/useWorkData";
import { useLanguageData } from "../hooks/useLanguageData";

import {
    FaSave,
    FaArrowLeft,
    FaIdCard,
    FaGraduationCap,
    FaBriefcase,
    FaPlus,
    FaUserCircle,
    FaTrash,
} from "react-icons/fa";
import { useEducationData } from "../hooks/useEducationData";

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Load dữ liệu từ categories
    const { categories, loading } = useCategories();
    // 1. Lấy dữ liệu gốc từ Hook
    const { staff, employment, education, languages } = useStaffData(id || 1);
    // 2. State quản lý Form và Danh mục
    const [formData, setFormData] = useState({});
    const {
        workHistories,
        handleWorkChange,
        addWorkHistory,
        removeWorkHistory,
    } = useWorkData(employment, id);
    // Thay vì dùng useState lẻ tẻ
    const {
        languages: languageList, // Đổi tên từ 'language' thành 'languages' cho đúng số nhiều
        handleLanguageChange,
        addLanguage,
        removeLanguage,
    } = useLanguageData(languages, id); // initialLanguages lấy từ useStaffData
    // Đóng mở modal
    const [openSections, setOpenSections] = useState({
        section1: true,
        section2: false,
        section3: false,
    });

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    // Thêm sửa xoá Education History
    const { eduHistories, handleEduChange, addEduHistory, removeEduHistory } =
        useEducationData(education, id);

    // 4. Đồng bộ dữ liệu Staff vào Form (Xử lý format Date)
    useEffect(() => {
        if (staff) {
            setFormData({
                ...staff,
                dateOfBirth: staff.dateOfBirth?.split("T")[0] || "",
                cccdDate: staff.cccdDate?.split("T")[0] || "",
            });
        }
    }, [staff]);
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        let val = value === "" ? null : value;

        // Ép kiểu số cho các trường ID hoặc Năm để Backend nhận đúng kiểu dữ liệu
        if (val !== null && (name.endsWith("Id") || name.endsWith("Year"))) {
            val = parseInt(value) || 0;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Cập nhật thông tin cá nhân trước
            await axiosClient.put("/Staff/Update", formData);

            // 2. Lưu danh sách Học vấn (Xử lý từng thằng để tránh lỗi ID: 0)
            for (const item of eduHistories) {
                const payload = { ...item, staffId: parseInt(id) };
                if (item.id === 0 || !item.id) {
                    delete payload.id; // Xóa id: 0 để Backend tự sinh ID mới
                    await axiosClient.post("/EduHistory/Create", payload);
                } else {
                    await axiosClient.put("/EduHistory/Update", payload);
                }
            }

            // 3. Lưu danh sách Quá trình công tác
            for (const item of workHistories) {
                const payload = { ...item, staffId: parseInt(id) };
                if (item.id === 0 || !item.id) {
                    delete payload.id;
                    await axiosClient.post("/EmpHistory/Create", payload);
                } else {
                    await axiosClient.put("/EmpHistory/Update", payload);
                }
            }

            // 4. Lưu danh sách Ngoại ngữ
            for (const item of languageList) {
                const payload = { ...item, staffId: parseInt(id) };
                if (item.id === 0 || !item.id) {
                    delete payload.id;
                    await axiosClient.post("/Language/Create", payload);
                } else {
                    await axiosClient.put("/Language/Update", payload);
                }
            }

            alert("✅ Cập nhật thành công toàn bộ dữ liệu!");
            navigate(-1);
        } catch (err) {
            console.error("Lỗi chi tiết:", err.response?.data || err.message);
            alert(
                `❌ Lỗi: ${err.response?.data?.message || "Kiểm tra lại kết nối Backend"}`,
            );
        }
    };

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-blue-600 font-bold">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                Đang tải dữ liệu giảng viên...
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto my-10 px-4 font-sans text-slate-800">
            {/* --- HEADER TOOLBAR --- */}
            {/* --- HEADER TỐI GIẢN (STICKY & GLASS) --- */}
            <div className="sticky top-15 z-30 -mx-4 px-4 sm:-mx-8 sm:px-8 py-5 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* BÊN TRÁI: Chỉ giữ Icon quay lại */}
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all active:scale-90"
                        title="Quay lại"
                    >
                        <FaArrowLeft
                            size={18}
                            className="group-hover:-translate-x-0.5 transition-transform"
                        />
                    </button>

                    {/* BÊN PHẢI: Nút Lưu thông tin (Thu gọn size, font đậm chất) */}
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                    >
                        <FaSave size={14} className="opacity-80" />
                        Lưu thay đổi
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* --- PHẦN I: THÔNG TIN CÁ NHÂN --- */}
                <SectionCard
                    title="I. Thông tin cá nhân"
                    icon={<FaIdCard />}
                    isOpen={openSections.section1}
                    onToggle={() => toggleSection("section1")}
                >
                    {/* Hàng 1: Họ tên - Ngày sinh - Giới tính */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <InputField
                            label="Họ và tên"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="Ngày sinh"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleFormChange}
                        />
                        <SelectField
                            label="Giới tính"
                            name="genderId"
                            value={formData.genderId}
                            options={categories.genders}
                            onChange={handleFormChange}
                        />
                    </div>

                    {/* Hàng 2: Nơi sinh - Quê quán - Dân tộc */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <InputField
                            label="Nơi sinh"
                            name="placeOfBirth"
                            value={formData.placeOfBirth}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="Quê quán"
                            name="nativeVillage"
                            value={formData.nativeVillage}
                            onChange={handleFormChange}
                        />
                        <SelectField
                            label="Dân tộc"
                            name="ethnicityId"
                            value={formData.ethnicityId}
                            options={categories.ethnicities}
                            onChange={handleFormChange}
                        />
                    </div>

                    {/* Hàng 3: Chức vụ - Đơn vị công tác - Fax (Giống ảnh mẫu) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <SelectField
                            label="Chức vụ"
                            name="positionId"
                            value={formData.positionId}
                            options={categories.positions}
                            onChange={handleFormChange}
                        />
                        <SelectField
                            label="Đơn vị công tác"
                            name="departmentId"
                            value={formData.departmentId}
                            options={categories.departments}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="Fax"
                            name="fax"
                            value={formData.fax}
                            onChange={handleFormChange}
                        />
                    </div>

                    <hr className="my-8 border-slate-100" />

                    {/* Hàng 4: Chức danh khoa học - Năm bổ nhiệm - Học vị cao nhất */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <SelectField
                            label="Chức danh khoa học"
                            name="academicRankId"
                            value={formData.academicRankId}
                            options={categories.ranks}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="Năm bổ nhiệm"
                            name="rankYear"
                            value={formData.rankYear}
                            onChange={handleFormChange}
                        />
                        <SelectField
                            label="Học vị cao nhất"
                            name="highestDegreeId"
                            value={formData.highestDegreeId}
                            options={categories.degrees}
                            onChange={handleFormChange}
                        />
                    </div>

                    {/* Hàng 5: Năm nhận học vị - Nước nhận học vị - Số CCCD */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <InputField
                            label="Năm nhận học vị"
                            name="degreeYear"
                            type="number"
                            value={formData.degreeYear}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="Nước nhận học vị"
                            name="degreeCountry"
                            value={formData.degreeCountry}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="Số CCCD"
                            name="cccdNumber"
                            value={formData.cccdNumber}
                            onChange={handleFormChange}
                        />
                    </div>

                    {/* Hàng 6: Ngày cấp - Nơi cấp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <InputField
                            label="Ngày cấp"
                            name="cccdDate"
                            type="date"
                            value={formData.cccdDate}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="Nơi cấp"
                            name="cccdPlace"
                            value={formData.cccdPlace}
                            onChange={handleFormChange}
                        />
                    </div>

                    <hr className="my-8 border-slate-100" />

                    {/* Hàng 7: Địa chỉ liên lạc (Full width) */}
                    <div className="grid grid-cols-1 gap-5 mb-5">
                        <InputField
                            label="Địa chỉ liên lạc"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                        />
                    </div>

                    {/* Hàng 8: Điện thoại di động - E-mail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label="Điện thoại di động"
                            name="phoneMobile"
                            value={formData.phoneMobile}
                            onChange={handleFormChange}
                        />
                        <InputField
                            label="E-mail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleFormChange}
                        />
                    </div>
                </SectionCard>

                {/* --- PHẦN II: TRÌNH ĐỘ HỌC VẤN --- */}
                <SectionCard
                    title="II. Trình độ học vấn (Đào tạo)"
                    icon={<FaGraduationCap />}
                    isOpen={openSections.section2}
                    onToggle={() => toggleSection("section2")}
                >
                    {eduHistories.length > 0 ? (
                        eduHistories.map((edu, index) => (
                            <div
                                key={edu.id || index}
                                className="mb-10 p-6 border border-slate-100 rounded-3xl bg-slate-50/30 relative"
                            >
                                <button
                                    type="button"
                                    onClick={() => removeEduHistory(index)}
                                    className="absolute top-4 right-4 flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-sm"
                                >
                                    <FaTrash size={12} />
                                    Xóa
                                </button>
                                <div className="absolute -top-3 left-6 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                                    Văn bằng {index + 1}
                                </div>

                                {/* Hàng 1: Bậc đào tạo & Hình thức đào tạo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 mt-2">
                                    <SelectField
                                        label="Bậc đào tạo"
                                        name="degreeLevelId"
                                        value={edu.degreeLevelId}
                                        options={categories.degrees} // Dùng danh mục học vị đã load
                                        onChange={(e) =>
                                            handleEduChange(index, e)
                                        }
                                    />
                                    <SelectField
                                        label="Hình thức đào tạo"
                                        name="trainingFormId" // Nên dùng Id để đồng bộ với Backend
                                        value={edu.trainingFormId}
                                        options={categories.training} // Danh sách vừa load ở trên
                                        onChange={(e) =>
                                            handleEduChange(index, e)
                                        }
                                    />
                                </div>

                                {/* Hàng 2: Ngành học & Trường/Cơ sở đào tạo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <InputField
                                        label="Chuyên ngành"
                                        name="major"
                                        value={edu.major}
                                        onChange={(e) =>
                                            handleEduChange(index, e)
                                        }
                                        placeholder="VD: Công nghệ thông tin"
                                    />
                                    <InputField
                                        label="Cơ sở đào tạo"
                                        name="institution"
                                        value={edu.institution}
                                        onChange={(e) =>
                                            handleEduChange(index, e)
                                        }
                                        placeholder="VD: Đại học Bách Khoa"
                                    />
                                </div>

                                {/* Hàng 3: Năm tốt nghiệp & Quốc gia */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <InputField
                                        label="Năm tốt nghiệp"
                                        name="graduationYear"
                                        type="number"
                                        value={edu.graduationYear}
                                        onChange={(e) =>
                                            handleEduChange(index, e)
                                        }
                                        placeholder="VD: 2025"
                                    />
                                    <InputField
                                        label="Nước đào tạo"
                                        name="countryName"
                                        value={edu.countryName}
                                        onChange={(e) =>
                                            handleEduChange(index, e)
                                        }
                                        placeholder="VD: Việt Nam"
                                    />
                                </div>

                                {/* Hàng 4: Tên luận án/Đề tài tốt nghiệp (Dòng này chiếm hết chiều ngang) */}
                                {/* Chỉ hiện ô Luận án nếu degreeLevelId tương ứng với "Tiến sĩ" (ví dụ ID là 31) */}
                                {edu.degreeLevelId !== 11 && (
                                    <div className="grid grid-cols-1 gap-5 transition-all">
                                        <InputField
                                            label="Tên luận án / Đề tài tốt nghiệp"
                                            name="thesisName"
                                            value={edu.thesisName}
                                            onChange={(e) =>
                                                handleEduChange(index, e)
                                            }
                                            placeholder="Nhập tên luận án..."
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400 font-bold italic">
                            Chưa có dữ liệu quá trình đào tạo.
                        </div>
                    )}
                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={addEduHistory}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700"
                        >
                            + Thêm văn bằng
                        </button>
                    </div>
                    {/* --- PHẦN NGOẠI NGỮ (Bổ sung vào cuối Section II) --- */}
                    <div className="mt-10 pt-8 border-t-2 border-dashed border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                                <h4 className="text-md font-black text-slate-700 uppercase tracking-wider">
                                    3. Trình độ ngoại ngữ
                                </h4>
                            </div>
                        </div>

                        {languageList.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {languageList.map((lang, index) => (
                                    <div
                                        key={lang.id || index}
                                        className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm relative group transition-all hover:border-indigo-200"
                                    >
                                        {/* Nút xóa ngoại ngữ */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeLanguage(index)
                                            }
                                            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <FaTrash size={12} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                                            <InputField
                                                label="Tên ngoại ngữ"
                                                name="languageName"
                                                value={lang.languageName || ""}
                                                onChange={(e) =>
                                                    handleLanguageChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                placeholder="VD: Tiếng Anh, Tiếng Nhật..."
                                            />
                                            <InputField
                                                label="Mức độ sử dụng (Chứng chỉ)"
                                                name="proficiencyLevel"
                                                value={
                                                    lang.proficiencyLevel || ""
                                                }
                                                onChange={(e) =>
                                                    handleLanguageChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                placeholder="VD: IELTS 7.0, N3..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1">
                                            <InputField
                                                label="Ghi chú"
                                                name="notes"
                                                value={lang.notes || ""}
                                                onChange={(e) =>
                                                    handleLanguageChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                placeholder="VD: Sử dụng tốt trong giao tiếp chuyên môn..."
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Nút Thêm khi đã có danh sách - Căn trái cho đẹp */}
                                <div className="flex justify-start">
                                    <button
                                        type="button"
                                        onClick={addLanguage}
                                        className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
                                    >
                                        <FaPlus size={12} />
                                        THÊM NGOẠI NGỮ MỚI
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-bold italic mb-4">
                                    Chưa có thông tin ngoại ngữ.
                                </p>
                                {/* Nút Thêm khi danh sách rỗng - Hiện to ở giữa để mời gọi người dùng */}
                                <button
                                    type="button"
                                    onClick={addLanguage}
                                    className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <FaPlus size={12} />
                                    BỔ SUNG NGOẠI NGỮ
                                </button>
                            </div>
                        )}
                    </div>
                </SectionCard>

                {/* --- PHẦN III: ĐƠN VỊ CÔNG TÁC --- */}
                <SectionCard
                    title="III. Quá trình công tác"
                    icon={<FaBriefcase />}
                    isOpen={openSections.section3}
                    onToggle={() => toggleSection("section3")}
                >
                    {workHistories.length > 0 ? (
                        workHistories.map((work, index) => (
                            <div
                                key={work.id || index}
                                className="mb-10 p-6 border border-slate-100 rounded-3xl bg-slate-50/50 relative group"
                            >
                                {/* Badge đánh số thứ tự */}
                                <div className="absolute -top-3 left-6 bg-emerald-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                                    Giai đoạn {index + 1}
                                </div>

                                {/* NÚT XÓA: Nằm ở góc trên bên phải của thẻ */}
                                <button
                                    type="button"
                                    onClick={() => removeWorkHistory(index)}
                                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Xóa giai đoạn này"
                                >
                                    <FaTrash size={12} />
                                </button>

                                {/* Dòng 1: Chức vụ và Tổ chức */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 mt-2">
                                    <InputField
                                        label="Chức vụ"
                                        name="position"
                                        value={work.position || ""}
                                        onChange={(e) =>
                                            handleWorkChange(index, e)
                                        }
                                        placeholder="VD: Phó Hiệu trưởng"
                                    />
                                    <InputField
                                        label="Cơ quan / Tổ chức"
                                        name="organization"
                                        value={work.organization || ""}
                                        onChange={(e) =>
                                            handleWorkChange(index, e)
                                        }
                                        placeholder="VD: Trường Đại học Công nghệ Đồng Nai"
                                    />
                                </div>

                                {/* Dòng 2: Thời gian */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <InputField
                                        label="Từ ngày"
                                        name="fromDate"
                                        type="date"
                                        value={
                                            work.fromDate?.split("T")[0] || ""
                                        }
                                        onChange={(e) =>
                                            handleWorkChange(index, e)
                                        }
                                    />
                                    <InputField
                                        label="Đến ngày"
                                        name="toDate"
                                        type="date"
                                        value={work.toDate?.split("T")[0] || ""}
                                        onChange={(e) =>
                                            handleWorkChange(index, e)
                                        }
                                    />
                                </div>

                                {/* Dòng 3: Địa chỉ */}
                                <div className="grid grid-cols-1 gap-5">
                                    <InputField
                                        label="Địa chỉ công tác"
                                        name="address"
                                        value={work.address || ""}
                                        onChange={(e) =>
                                            handleWorkChange(index, e)
                                        }
                                        placeholder="VD: Nguyễn Khuyến, Trảng Dài, Biên Hòa..."
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400 font-bold italic">
                            Chưa có dữ liệu quá trình công tác.
                        </div>
                    )}

                    {/* NÚT THÊM: Nằm ở cuối SectionCard */}
                    <div className="flex justify-center mt-5">
                        <button
                            type="button"
                            onClick={addWorkHistory}
                            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-2 rounded-2xl border-2 border-dashed border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all font-bold text-sm"
                        >
                            <FaPlus size={14} />
                            Thêm quá trình công tác
                        </button>
                    </div>
                </SectionCard>
            </div>
        </div>
    );
};

// --- CÁC COMPONENT GIAO DIỆN NHỎ (UI COMPONENTS) ---

const SectionCard = ({ title, icon, children, isOpen, onToggle }) => (
    <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md mb-4">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-5 md:p-6 focus:outline-none group hover:bg-slate-50/50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div
                    className={`p-3 rounded-xl transition-all duration-500 ${
                        isOpen
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 text-blue-600"
                    }`}
                >
                    <span className="text-xl">{icon}</span>
                </div>

                <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight">
                    {title}
                </h3>
            </div>

            <div
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
                    isOpen
                        ? "rotate-180 bg-blue-50 text-blue-600"
                        : "text-slate-300"
                }`}
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
            className={`grid transition-all duration-500 ease-in-out ${
                isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
            }`}
        >
            <div className="overflow-hidden">
                <div className="px-6 mt-4 pb-8 pt-2 border-t border-slate-50 bg-white">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const InputField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    className = "",
}) => (
    <div className={`flex flex-col gap-2 ${className}`}>
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white font-bold text-slate-700 transition-all placeholder:text-slate-300 shadow-sm"
        />
    </div>
);

const SelectField = ({ label, name, value, options, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">
            {label}
        </label>
        <div className="relative">
            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className="w-full border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white font-bold text-slate-700 appearance-none cursor-pointer transition-all shadow-sm"
            >
                <option value="">-- Chọn {label} --</option>
                {options &&
                    options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                            {opt.name}
                        </option>
                    ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    </div>
);

export default Update;
