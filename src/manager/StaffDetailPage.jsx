import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStaffDetail } from "../hooks/useStaffDetail";
import { useEducationDetail } from "../hooks/useEducationDetail";
import { useLanguageDetail } from "../hooks/useLanguageDetail";
import { useEmploymentDetail } from "../hooks/useEmploymentDetail";
import { jwtDecode } from "jwt-decode"; // 1. Import thư viện giải mã
const StaffDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { staff, loading, error } = useStaffDetail(id);
    const { edu, loading: eduLoading } = useEducationDetail(id);
    const { languages, loading: langLoading } = useLanguageDetail(staff?.id);
    const { jobs, loading: jobLoading } = useEmploymentDetail(staff?.id);
    const [activeTab, setActiveTab] = useState(1);
    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
            </div>
        );

    if (error || !staff)
        return (
            <div className="p-10 text-center bg-gray-50 min-h-screen">
                <div className="bg-white p-8 rounded-2xl shadow-sm inline-block">
                    <p className="text-red-500 font-bold">
                        Lỗi: {error || "Không tìm thấy dữ liệu"}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-blue-600 underline"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );

    return (
        <div className="mt-15 min-h-screen bg-[#f8fafc] pb-12">
            {/* 1. TOP HEADER PROFILE */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Trở về danh sách
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        {/* Avatar lớn */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                                {staff.fullName?.charAt(0)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                        </div>

                        {/* Thông tin chính */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-3xl font-black text-gray-900">
                                    {staff.fullName}
                                </h1>
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                                    {staff.staffCode}
                                </span>
                            </div>
                            <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {staff.departmentName} • {staff.positionName}
                            </p>
                        </div>

                        {/* Nút thao tác */}
                        <div className="flex gap-3">
                            <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
                                In PDF
                            </button>
                            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md">
                                Chỉnh sửa
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BODY CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* CỘT TRÁI (4 phần): THÔNG TIN PHỤ */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-gray-900 font-bold mb-5 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Liên hệ & Cá nhân
                            </h3>
                            <div className="space-y-4">
                                <SideInfo label="Email" value={staff.email} />
                                <SideInfo
                                    label="Số điện thoại"
                                    value={staff.phoneMobile}
                                />
                                <SideInfo
                                    label="Ngày sinh"
                                    value={
                                        staff.dateOfBirth
                                            ? new Date(
                                                  staff.dateOfBirth,
                                              ).toLocaleDateString("vi-VN")
                                            : "---"
                                    }
                                />
                                <SideInfo
                                    label="Giới tính"
                                    value={staff.genderName}
                                />
                                <SideInfo
                                    label="Dân tộc"
                                    value={staff.ethnicityName}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI (8 phần): TABS NỘI DUNG CHÍNH */}
                    <div className="lg:col-span-8">
                        {/* Thanh Tab chuyên nghiệp */}
                        <div className="flex border-b border-gray-200 mb-6 gap-8">
                            <TabTitle
                                active={activeTab === 1}
                                onClick={() => setActiveTab(1)}
                                title="I. Thông tin chung"
                            />
                            <TabTitle
                                active={activeTab === 2}
                                onClick={() => setActiveTab(2)}
                                title="II. Đào tạo"
                            />
                            <TabTitle
                                active={activeTab === 3}
                                onClick={() => setActiveTab(3)}
                                title="III. Công tác"
                            />
                        </div>

                        {/* Nội dung Tab */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                            {activeTab === 1 && (
                                <div className="space-y-10 animate-fadeIn">
                                    {/* NHÓM 1: THÔNG TIN CƠ BẢN */}
                                    <section>
                                        <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                            1. Thông tin cơ bản & Quê quán
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <DetailBox
                                                label="Họ và tên"
                                                value={staff.fullName}
                                                highlight
                                            />
                                            <DetailBox
                                                label="Ngày sinh"
                                                value={
                                                    staff.dateOfBirth
                                                        ? new Date(
                                                              staff.dateOfBirth,
                                                          ).toLocaleDateString(
                                                              "vi-VN",
                                                          )
                                                        : "---"
                                                }
                                            />
                                            <DetailBox
                                                label="Giới tính"
                                                value={staff.genderName}
                                            />
                                            <DetailBox
                                                label="Nơi sinh"
                                                value={staff.placeOfBirth}
                                            />
                                            <DetailBox
                                                label="Quê quán"
                                                value={staff.nativeVillage}
                                            />
                                            <DetailBox
                                                label="Dân tộc"
                                                value={staff.ethnicityName}
                                            />
                                        </div>
                                    </section>

                                    {/* NHÓM 2: CHỨC DANH & HỌC VỊ (Dành cho Manager soi trình độ) */}
                                    <section className="pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                            2. Chức danh & Học vị chuyên môn
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <DetailBox
                                                label="Chức vụ"
                                                value={staff.positionName}
                                            />
                                            <DetailBox
                                                label="Đơn vị công tác"
                                                value={staff.departmentName}
                                                highlight
                                            />
                                            <DetailBox
                                                label="Fax"
                                                value={staff.fax}
                                            />
                                            <DetailBox
                                                label="Chức danh khoa học"
                                                value={staff.academicRankName}
                                            />
                                            <DetailBox
                                                label="Năm bổ nhiệm"
                                                value={staff.rankYear}
                                            />
                                            <div className="hidden md:block"></div>{" "}
                                            {/* Giữ khoảng trống cho đẹp */}
                                            <DetailBox
                                                label="Học vị cao nhất"
                                                value={staff.highestDegreeName}
                                            />
                                            <DetailBox
                                                label="Năm nhận học vị"
                                                value={staff.degreeYear}
                                            />
                                            <DetailBox
                                                label="Nước nhận học vị"
                                                value={staff.degreeCountry}
                                            />
                                        </div>
                                    </section>

                                    {/* NHÓM 3: ĐỊNH DANH & LIÊN HỆ (Bảo mật) */}
                                    <section className="pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                            3. Định danh & Thông tin liên lạc
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <DetailBox
                                                label="Số CCCD"
                                                value={staff.cccdNumber}
                                            />
                                            <DetailBox
                                                label="Ngày cấp"
                                                value={
                                                    staff.cccdDate
                                                        ? new Date(
                                                              staff.cccdDate,
                                                          ).toLocaleDateString(
                                                              "vi-VN",
                                                          )
                                                        : "---"
                                                }
                                            />
                                            <DetailBox
                                                label="Nơi cấp"
                                                value={staff.cccdPlace}
                                            />

                                            <div className="md:col-span-3">
                                                <DetailBox
                                                    label="Địa chỉ liên lạc"
                                                    value={staff.address}
                                                />
                                            </div>

                                            <DetailBox
                                                label="Điện thoại di động"
                                                value={staff.phoneMobile}
                                                highlight
                                            />
                                            <DetailBox
                                                label="E-mail"
                                                value={staff.email}
                                                highlight
                                            />
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 2 && (
                                <div className="animate-fadeIn">
                                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                        1. Quá trình đào tạo
                                    </h3>

                                    {eduLoading ? (
                                        <div className="text-center py-10 text-gray-400 italic">
                                            Đang tải dữ liệu...
                                        </div>
                                    ) : !edu || edu.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400 italic">
                                            Chưa có dữ liệu đào tạo
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {edu.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <DetailBox
                                                            label="Trình độ"
                                                            value={
                                                                item.degreeLevelName
                                                            }
                                                        />
                                                        <DetailBox
                                                            label="Hình thức đào tạo"
                                                            value={
                                                                item.trainingFormName
                                                            }
                                                        />
                                                        <DetailBox
                                                            label="Năm tốt nghiệp"
                                                            value={
                                                                item.graduationYear
                                                            }
                                                        />

                                                        <DetailBox
                                                            label="Chuyên ngành"
                                                            value={item.major}
                                                        />
                                                        <DetailBox
                                                            label="Trường đào tạo"
                                                            value={
                                                                item.institution
                                                            }
                                                        />
                                                        <DetailBox
                                                            label="Quốc gia"
                                                            value={
                                                                item.countryName
                                                            }
                                                        />

                                                        <div className="md:col-span-3">
                                                            <DetailBox
                                                                label="Tên luận văn"
                                                                value={
                                                                    item.thesisName
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-10">
                                        <h3 className="text-sm font-black text-green-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                            2. Ngoại ngữ
                                        </h3>

                                        {langLoading ? (
                                            <div className="text-center text-gray-400 italic">
                                                Đang tải dữ liệu...
                                            </div>
                                        ) : !languages ||
                                          languages.length === 0 ? (
                                            <div className="text-center text-gray-400 italic">
                                                Chưa có dữ liệu ngoại ngữ
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {languages.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="border border-gray-100 rounded-xl p-4 shadow-sm"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <DetailBox
                                                                    label="Ngôn ngữ"
                                                                    value={
                                                                        item.languageName
                                                                    }
                                                                />
                                                                <DetailBox
                                                                    label="Trình độ"
                                                                    value={
                                                                        item.level
                                                                    }
                                                                />
                                                                <DetailBox
                                                                    label="Ghi chú"
                                                                    value={
                                                                        item.note
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {activeTab === 3 && (
                                <div className="animate-fadeIn">
                                    <h3 className="text-sm font-black text-green-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                        III. Lịch sử công tác
                                    </h3>

                                    {jobLoading ? (
                                        <div className="text-center py-10 text-gray-400 italic">
                                            Đang tải dữ liệu...
                                        </div>
                                    ) : !jobs || jobs.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400 italic">
                                            Chưa có dữ liệu công tác
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {jobs.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <DetailBox
                                                            label="Đơn vị công tác"
                                                            value={
                                                                item.organization
                                                            }
                                                        />

                                                        <DetailBox
                                                            label="Chức vụ"
                                                            value={
                                                                item.position
                                                            }
                                                        />

                                                        <DetailBox
                                                            label="Từ năm"
                                                            value={
                                                                item.fromDate
                                                            }
                                                        />

                                                        <DetailBox
                                                            label="Đến năm"
                                                            value={
                                                                item.toDate ||
                                                                "Hiện tại"
                                                            }
                                                        />

                                                        <DetailBox
                                                            label="Địa điểm"
                                                            value={item.address}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CÁC COMPONENT PHỤ TRỢ (HELPER) ---

const TabTitle = ({ active, onClick, title }) => (
    <button
        onClick={onClick}
        className={`pb-4 text-sm font-bold transition-all relative ${
            active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
        }`}
    >
        {title}
        {active && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>
        )}
    </button>
);

const SideInfo = ({ label, value }) => (
    <div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
            {label}
        </p>
        <p className="text-sm font-bold text-gray-700 break-words">
            {value || "---"}
        </p>
    </div>
);

const DetailBox = ({ label, value, isStatus = false }) => (
    <div className="border-b border-gray-50 pb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            {label}
        </p>
        <p
            className={`text-base font-extrabold ${isStatus ? "text-green-600" : "text-gray-800"}`}
        >
            {value || "---"}
        </p>
    </div>
);

export default StaffDetailPage;
