import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useStaffData from "../../hooks/useStaffData";
import axiosClient from "../../axios/axiosClient";
import { useCategories } from "../../hooks/useCategories";
import { useWorkData } from "../../hooks/useWorkData";
import { useLanguageData } from "../../hooks/useLanguageData";
import useScientificResearchesData from "../../hooks/useScientificResearchesData";
import useScientificPublicationsData from "../../hooks/useScientificPublicationsData";

import {
    FaSave,
    FaArrowLeft,
    FaTrashAlt,
    FaIdCard,
    FaMicroscope,
    FaPlusCircle,
    FaGraduationCap,
    FaBriefcase,
    FaPlus,
    FaUserCircle,
    FaTrash,
} from "react-icons/fa";
import { useEducationData } from "../../hooks/useEducationData";

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Load dữ liệu từ categories
    const { categories, loading } = useCategories();
    // 1. Lấy dữ liệu gốc từ Hook
    const {
        staff,
        employment,
        education,
        languages,
        researches,
        publications,
    } = useStaffData(id || 1);
    // 2. State quản lý Form và Danh mục
    const [formData, setFormData] = useState({});
    const {
        workHistories,
        handleWorkChange,
        addWorkHistory,
        removeWorkHistory,
    } = useWorkData(employment, id);
    const {
        publications: managedPublications,
        handlePubChange,
        addPublication,
        removePublication,
    } = useScientificPublicationsData(publications || [], id);
    const {
        researches: managedResearches,
        handleResearchChange,
        addResearch,
        removeResearch,
    } = useScientificResearchesData(researches || [], id);
    console.log(researches);
    // Thay vì dùng useState lẻ tẻ
    const {
        allLanguages,
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
        section4: false, // Thêm cái này
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
        const { name, value, type } = e.target;

        // 1. Xử lý mặc định: Chuỗi rỗng "" thì biến thành null
        let val = value === "" ? null : value;

        // 2. Ép kiểu số cho các trường ID, Năm hoặc các trường Number
        // Chỉ ép kiểu khi giá trị KHÔNG PHẢI null
        if (val !== null) {
            if (
                name.endsWith("Id") ||
                name.endsWith("Year") ||
                type === "number"
            ) {
                const parsed = parseInt(value, 10);
                val = isNaN(parsed) ? null : parsed;
            }
        }

        // 3. Cập nhật State
        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // --- BƯỚC QUAN TRỌNG: LÀM SẠCH DỮ LIỆU CÁ NHÂN (Staff) ---
            const cleanStaffData = { ...formData };

            // Quét qua tất cả các trường, cái nào trống thì ép về null
            Object.keys(cleanStaffData).forEach((key) => {
                if (
                    cleanStaffData[key] === "" ||
                    cleanStaffData[key] === undefined
                ) {
                    cleanStaffData[key] = null;
                }
            });

            // 1. Cập nhật thông tin cá nhân (Gửi cleanStaffData thay vì formData)
            await axiosClient.put("/Staff/Update", cleanStaffData);

            // --- HÀM TIỆN ÍCH ĐỂ LÀM SẠCH CÁC DANH SÁCH PHỤ ---
            const cleanItem = (item) => {
                const newItem = { ...item, staffId: parseInt(id) };
                Object.keys(newItem).forEach((k) => {
                    if (newItem[k] === "" || newItem[k] === undefined)
                        newItem[k] = null;
                });
                return newItem;
            };

            // 2. Lưu danh sách Học vấn
            for (const item of eduHistories) {
                const payload = cleanItem(item);
                if (!payload.id || payload.id === 0) {
                    const { id, ...createPayload } = payload; // Bóc tách để bỏ id
                    await axiosClient.post("/EduHistory/Create", createPayload);
                } else {
                    await axiosClient.put("/EduHistory/Update", payload);
                }
            }

            // 3. Lưu danh sách Quá trình công tác
            for (const item of workHistories) {
                const payload = cleanItem(item);
                if (!payload.id || payload.id === 0) {
                    const { id, ...createPayload } = payload;
                    await axiosClient.post("/EmpHistory/Create", createPayload);
                } else {
                    await axiosClient.put("/EmpHistory/Update", payload);
                }
            }
            // 5. Lưu danh sách CÁC CÔNG TRÌNH KHOA HỌC ĐÃ CÔNG BỐ
            for (const item of managedPublications) {
                const payload = cleanItem(item);

                // Nếu không có ID hoặc ID = 0 thì gọi API Create
                if (!payload.id || payload.id === 0) {
                    const { id, ...createPayload } = payload; // Bỏ id ra khỏi payload khi tạo mới
                    await axiosClient.post(
                        "/ScientificPublication/Create",
                        createPayload,
                    );
                }
                // Ngược lại gọi API Update
                else {
                    await axiosClient.put(
                        "/ScientificPublication/Update",
                        payload,
                    );
                }
            }
            // 4. Lưu danh sách Ngoại ngữ
            for (const item of languageList) {
                const payload = cleanItem(item);
                if (!payload.id || payload.id === 0) {
                    const { id, ...createPayload } = payload;
                    await axiosClient.post(
                        "/StaffLanguage/Create",
                        createPayload,
                    );
                } else {
                    await axiosClient.put("/StaffLanguage/Update", payload);
                }
            }
            for (const item of managedResearches) {
                const payload = cleanItem(item);
                if (!payload.id || payload.id === 0) {
                    // Tạo mới
                    const { id, ...createPayload } = payload;
                    await axiosClient.post(
                        "/ScientificResearch/Create",
                        createPayload,
                    );
                } else {
                    // Cập nhật
                    await axiosClient.put(
                        "/ScientificResearch/Update",
                        payload,
                    );
                }
            }
            alert("✅ Cập nhật thành công toàn bộ dữ liệu!");
            navigate(-1);
        } catch (err) {
            console.error(
                "Lỗi chi tiết:",
                err.response?.data?.errors || err.response?.data || err.message,
            );
            // Hiện lỗi cụ thể từ Server để Trí biết field nào đang bị 'chửi'
            const validationErrors = err.response?.data?.errors;
            let errorMsg = "Kiểm tra lại dữ liệu nhập vào";
            if (validationErrors) {
                errorMsg = Object.values(validationErrors).flat().join("\n");
            }
            alert(`❌ Lỗi:\n${errorMsg}`);
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

                        {languageList.map((lang, index) => (
                            <div
                                key={lang.id || index}
                                className="p-6 border border-slate-100 rounded-3xl bg-white shadow-sm relative group transition-all hover:border-indigo-200"
                            >
                                {/* Nút xóa */}
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(index)}
                                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-20"
                                >
                                    <FaTrash size={12} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                                    {/* DROPDOWN CHỌN NGÔN NGỮ */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            Tên ngoại ngữ
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="languageId"
                                                value={lang.languageId || ""}
                                                onChange={(e) =>
                                                    handleLanguageChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                className="w-full pl-4 pr-10 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all duration-300 font-medium text-slate-700 shadow-sm appearance-none cursor-pointer"
                                            >
                                                <option value="">
                                                    -- Chọn ngôn ngữ --
                                                </option>
                                                {allLanguages.map((cat) => (
                                                    <option
                                                        key={cat.id}
                                                        value={cat.id}
                                                    >
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Icon mũi tên cho dropdown */}
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TRÌNH ĐỘ (Vẫn nhập tay) */}
                                    <InputField
                                        label="Mức độ sử dụng (Chứng chỉ)"
                                        name="proficiencyLevel"
                                        value={lang.proficiencyLevel || ""}
                                        onChange={(e) =>
                                            handleLanguageChange(index, e)
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
                                            handleLanguageChange(index, e)
                                        }
                                        placeholder="VD: Sử dụng tốt trong giao tiếp chuyên môn..."
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addLanguage}
                            className="mt-10 bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700"
                        >
                            + Thêm ngoại ngữ
                        </button>
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

                <SectionCard
                    title="IV. NGHIÊN CỨU KHOA HỌC"
                    icon={<FaMicroscope className="text-blue-500" />}
                    isOpen={openSections.section4}
                    onToggle={() => toggleSection("section4")}
                >
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-blue-800 font-black text-sm flex items-center gap-2 uppercase tracking-wider">
                                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                                1. Các đề tài nghiên cứu khoa học đã và đang
                                tham gia
                            </h4>
                            <button
                                type="button"
                                onClick={addResearch}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 uppercase"
                            >
                                + Thêm đề tài
                            </button>
                        </div>

                        {managedResearches.length > 0 ? (
                            managedResearches.map((item, index) => (
                                <div
                                    key={index}
                                    className="group relative p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300 space-y-5"
                                >
                                    {/* NÚT XÓA: Luôn hiển thị, không cần hover */}
                                    <button
                                        type="button"
                                        onClick={() => removeResearch(index)}
                                        // className="absolute top-4 right-4 w-9 h-9 flex items-center  justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl z-20"
                                        title="Xóa đề tài"
                                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>

                                    {/* TITLE */}
                                    <div className="flex items-center">
                                        <h5 className="text-[11px] font-black text-blue-600  uppercase tracking-[0.2em]">
                                            Đề tài nghiên cứu #{index + 1}
                                        </h5>
                                    </div>

                                    {/* TÊN ĐỀ TÀI */}
                                    <div className="space-y-1 relative z-10">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                            Tên đề tài nghiên cứu
                                        </label>
                                        <textarea
                                            rows="2"
                                            name="researchName"
                                            value={item.researchName || ""}
                                            onChange={(e) =>
                                                handleResearchChange(index, e)
                                            }
                                            className="w-full px-5 py-3 text-sm font-bold bg-slate-50 border border-transparent rounded-[1.2rem] 
                        focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
                                            placeholder="Nhập tên đề tài đầy đủ..."
                                        />
                                    </div>

                                    {/* GRID THÔNG TIN */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                                Cấp đề tài
                                            </label>
                                            <input
                                                type="text"
                                                name="researchLevel"
                                                value={item.researchLevel || ""}
                                                onChange={(e) =>
                                                    handleResearchChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                className="w-full px-5 py-2.5 text-sm font-bold bg-slate-50 border border-transparent rounded-xl 
                            focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="VD: Cấp Trường, Cấp Bộ..."
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                                Vai trò
                                            </label>
                                            <select
                                                name="roleInResearchId"
                                                value={
                                                    item.roleInResearchId?.toString() ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleResearchChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                className="w-full px-5 py-2.5 text-sm font-bold bg-blue-50/50 border border-transparent rounded-xl 
                            text-blue-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
                                            >
                                                <option value="">
                                                    -- Chọn vai trò --
                                                </option>
                                                {categories.roleInResearch?.map(
                                                    (cat) => (
                                                        <option
                                                            key={cat.id}
                                                            value={cat.id.toString()}
                                                        >
                                                            {cat.name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {/* THỜI GIAN */}
                                    <div className="space-y-1 relative z-10">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                            Thời gian thực hiện
                                        </label>
                                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl w-fit border border-slate-100">
                                            <input
                                                type="number"
                                                name="startYear"
                                                value={item.startYear || ""}
                                                onChange={(e) =>
                                                    handleResearchChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                className="w-24 px-3 py-1.5 text-sm text-center font-bold bg-white border border-slate-200 rounded-lg 
                            focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                                placeholder="Bắt đầu"
                                            />
                                            <span className="text-slate-300 font-black">
                                                →
                                            </span>
                                            <input
                                                type="number"
                                                name="endYear"
                                                value={item.endYear || ""}
                                                onChange={(e) =>
                                                    handleResearchChange(
                                                        index,
                                                        e,
                                                    )
                                                }
                                                className="w-24 px-3 py-1.5 text-sm text-center font-bold bg-white border border-slate-200 rounded-lg 
                            focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                                placeholder="Kết thúc"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm font-black italic">
                                    Chưa có dữ liệu nghiên cứu khoa học.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-6 mt-15">
                        {/* TIÊU ĐỀ MỤC */}
                        <div className="flex items-center justify-between">
                            <h4 className="text-blue-800 font-black text-sm flex items-center gap-2 uppercase tracking-wider">
                                <div className=" w-2 h-6 bg-blue-600 rounded-full"></div>
                                2. Các công trình khoa học đã công bố
                            </h4>
                            <button
                                type="button"
                                onClick={addPublication}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 uppercase"
                            >
                                + Thêm công trình
                            </button>
                        </div>

                        {/* DANH SÁCH FORM NHẬP */}
                        <div className="grid grid-cols-1 gap-6">
                            {managedPublications.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm space-y-5 relative overflow-hidden group"
                                >
                                    {/* HEADER CỦA CARD */}
                                    <div className="flex items-center justify-between relative z-10">
                                        <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">
                                            Công trình khoa học #{index + 1}
                                        </h5>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removePublication(index)
                                            }
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs"
                                            title="Xóa công trình này"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>

                                    {/* TÊN CÔNG TRÌNH / BÀI BÁO */}
                                    <div className="space-y-1 relative z-10">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                            Tên công trình, bài báo đã công bố
                                        </label>
                                        <textarea
                                            rows="2"
                                            name="publicationName"
                                            value={item.publicationName || ""}
                                            onChange={(e) =>
                                                handlePubChange(index, e)
                                            }
                                            className="w-full px-5 py-3 text-sm font-bold bg-slate-50 border border-transparent rounded-[1.2rem] 
                        focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
                                            placeholder="VD: Nghiên cứu ứng dụng AI trong quản lý đào tạo tại DNTU..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                                        {/* NĂM CÔNG BỐ */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                                Năm công bố
                                            </label>
                                            <input
                                                type="number"
                                                name="publicationYear"
                                                value={
                                                    item.publicationYear || ""
                                                }
                                                onChange={(e) =>
                                                    handlePubChange(index, e)
                                                }
                                                className="w-full px-5 py-2.5 text-sm font-bold bg-slate-50 border border-transparent rounded-xl 
                            focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="Năm (VD: 2024)"
                                            />
                                        </div>

                                        {/* TÊN TẠP CHÍ / HỘI THẢO */}
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                                Tên tạp chí, nhà xuất bản, hội
                                                thảo
                                            </label>
                                            <input
                                                type="text"
                                                name="journalName"
                                                value={item.journalName || ""}
                                                onChange={(e) =>
                                                    handlePubChange(index, e)
                                                }
                                                className="w-full px-5 py-2.5 text-sm font-bold bg-slate-50 border border-transparent rounded-xl 
                            focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="VD: Tạp chí Khoa học & Công nghệ, Kỷ yếu hội thảo quốc tế..."
                                            />
                                        </div>
                                    </div>

                                    {/* GHI CHÚ THÊM */}
                                    <div className="space-y-1 relative z-10">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                                            Ghi chú (Số hiệu, trang, link bài
                                            báo...)
                                        </label>
                                        <input
                                            type="text"
                                            name="notes"
                                            value={item.notes || ""}
                                            onChange={(e) =>
                                                handlePubChange(index, e)
                                            }
                                            className="w-full px-5 py-2.5 text-sm bg-slate-50 border border-transparent rounded-xl 
                        focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all italic text-slate-500"
                                            placeholder="Không bắt buộc..."
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* NẾU CHƯA CÓ DỮ LIỆU */}
                            {managedPublications.length === 0 && (
                                <div className="py-12 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center bg-slate-50/50">
                                    <p className="text-slate-400 text-sm font-bold italic mb-4">
                                        Chưa có công trình khoa học nào được
                                        thêm
                                    </p>
                                    <button
                                        type="button"
                                        onClick={addPublication}
                                        className="text-blue-600 font-black text-xs uppercase hover:underline"
                                    >
                                        + Nhấp vào đây để thêm mới
                                    </button>
                                </div>
                            )}
                        </div>
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
