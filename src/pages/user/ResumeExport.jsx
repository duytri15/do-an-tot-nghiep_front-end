import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios/axiosClient";
import { useReactToPrint } from "react-to-print";

const ResumeExport = () => {
    const { id } = useParams();
    const [staff, setStaff] = useState(null);
    const [education, setEducation] = useState(null);
    const [employment, setEmployment] = useState(null);
    const [languages, setLanguages] = useState(null); // Thêm state này
    const [researches, setResearches] = useState(null); // Thêm state này
    const [loading, setLoading] = useState(true);

    const componentRef = useRef();

    const formatDate = (dateString) => {
        if (!dateString) return "Nay";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    // Sử dụng trong code của bạn:
    <p>Ngày sinh: {formatDate(staff?.dateOfBirth)}</p>;

    // Khởi tạo logic in ấn
    const handlePrint = useReactToPrint({
        contentRef: componentRef, // Sử dụng contentRef thay vì content
        documentTitle: `LyLichKhoaHoc_${staff?.fullName || id}`,
    });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Bước 1: Lấy thông tin Profile của chính mình từ Token
                const staffRes = await axiosClient.get(`/Staff/GetMyProfile`);
                const staffData =
                    staffRes.data.status === 200 ? staffRes.data.data : {};

                setStaff(staffData);

                // Bước 2: Kiểm tra xem có ID không rồi mới gọi các API còn lại
                if (staffData.id) {
                    // Bây giờ mới gọi 3 cái này cùng lúc bằng ID vừa lấy được
                    const [eduRes, empRes, langRes, resRes] = await Promise.all(
                        [
                            axiosClient.get(
                                `/EduHistory/Get?id=${staffData.id}`,
                            ),
                            axiosClient.get(
                                `/EmpHistory/Get?id=${staffData.id}`,
                            ),
                            axiosClient.get(
                                `/StaffLanguage/Get?id=${staffData.id}`,
                            ),
                            axiosClient.get(
                                `/ScientificResearch/Get?id=${staffData.id}`,
                            ), // Thêm line này
                        ],
                    );

                    // Bước 3: Đổ dữ liệu vào State
                    if (eduRes.data.status === 200)
                        setEducation(eduRes.data.data || []);
                    if (empRes.data.status === 200)
                        setEmployment(empRes.data.data || []);
                    if (langRes.data.status === 200)
                        setLanguages(langRes.data.data || []);
                    if (resRes.data.status === 200)
                        setResearches(resRes.data.data || []);
                    console.log("Đã lấy đủ dữ liệu học vấn & công tác");
                } else {
                    console.warn(
                        "Không tìm thấy Staff ID để lấy dữ liệu liên quan!",
                    );
                }
            } catch (err) {
                console.error("Lỗi hệ thống khi fetch dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Chạy 1 lần khi load trang
    if (loading)
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                Đang khởi tạo biểu mẫu...
            </div>
        );

    return (
        <div
            style={{
                backgroundColor: "#f1f5f9",
                minHeight: "100vh",
                padding: "40px 0",
            }}
        >
            {/* CSS QUY ĐỊNH VIỆC NGẮT TRANG KHI IN */}
            <style>
                {`
   @media print {
  /* 1. Ép buộc ẩn Header/Footer ở mức độ trình duyệt */
  @page {
    size: A4;
    margin: 0; /* Xóa sạch lề để dòng localhost không có chỗ hiển thị */
  }

  /* 2. Tạo lề giả bằng Padding cho nội dung */
  body {
    margin: 0 !important;
    padding: 15mm 15mm 15mm 15mm !important; /* Tạo lề thực tế cho văn bản */
    -webkit-print-color-adjust: exact;
  }

  /* 3. Ẩn các thành phần thừa */
  .no-print {
    display: none !important;
  }
}
    `}
            </style>

            <div
                style={{
                    maxWidth: "210mm",
                    margin: "0 auto 20px",
                    textAlign: "right",
                }}
            >
                <button
                    onClick={handlePrint}
                    className="no-print"
                    style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    XUẤT FILE PDF
                </button>
            </div>

            <div
                ref={componentRef}
                style={{
                    maxWidth: "210mm",
                    margin: "0 auto",
                    backgroundColor: "white",
                    padding: "20mm 15mm",
                    fontFamily: '"Times New Roman", Times, serif',
                    color: "#000000",
                    lineHeight: "1.5",
                    fontSize: "13pt",
                }}
            >
                {/* TIÊU NGỮ VÀ TIÊU ĐỀ  */}
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div
                        style={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                        }}
                    >
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </div>
                    <div
                        style={{
                            fontWeight: "bold",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                        }}
                    >
                        Độc lập – Tự do – Hạnh phúc
                    </div>
                    <h1
                        style={{
                            fontSize: "16pt",
                            fontWeight: "bold",
                            marginTop: "30px",
                            textTransform: "uppercase",
                            marginBottom: "5px",
                        }}
                    >
                        LÝ LỊCH KHOA HỌC
                    </h1>
                    <p style={{ fontSize: "10pt", fontStyle: "italic" }}>
                        (Theo mẫu tại Thông tư số 08/2011/TT-BGDĐT ngày
                        17/02/2011 của Bộ trưởng Bộ GDĐT – Phụ lục V)
                    </p>
                </div>

                {/* I. LÝ LỊCH SƠ LƯỢC  */}
                <div
                    className="resume-section"
                    style={{ marginBottom: "15px" }}
                >
                    <h3
                        style={{
                            fontWeight: "bold",
                            fontSize: "13pt",
                            marginBottom: "5px",
                        }}
                    >
                        I. LÝ LỊCH SƠ LƯỢC
                    </h3>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1fr",
                            gap: "5px",
                        }}
                    >
                        <p>Họ và tên: {staff?.fullName}</p>
                        <p>Giới tính: {staff?.genderName}</p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1fr",
                            gap: "5px",
                        }}
                    >
                        <p>
                            Ngày, tháng, năm sinh:{" "}
                            {formatDate(staff?.dateOfBirth)}
                        </p>
                        <p>Nơi sinh: {staff?.placeOfBirth}</p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1fr",
                            gap: "5px",
                        }}
                    >
                        <p>Quê quán: {staff?.nativeVillage}</p>
                        <p>Dân tộc: {staff?.ethnicityName}</p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1fr",
                            gap: "5px",
                        }}
                    >
                        <p>Học vị cao nhất: {staff?.highestDegreeName}</p>
                        <p>
                            Năm, nước nhận học vị: {staff?.degreeYear},{" "}
                            {staff?.degreeCountry}
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1fr",
                            gap: "5px",
                        }}
                    >
                        <p>
                            Chức danh khoa học cao nhất:{" "}
                            {staff?.academicRankName}
                        </p>
                        <p>Năm bổ nhiệm: {staff?.rankYear}</p>
                    </div>
                    <p>
                        Chức vụ (hiện tại hoặc trước khi nghỉ hưu):{" "}
                        {staff?.positionName}
                    </p>
                    <p>Đơn vị công tác: {staff?.departmentName}</p>
                    <p>Chỗ ở riêng hoặc địa chỉ liên lạc: {staff?.address}</p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1.5fr",
                            gap: "5px",
                        }}
                    >
                        <p>Số CCCD: {staff?.cccdNumber}</p>
                        <p>Ngày cấp: {staff?.cccdDate}</p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: "5px",
                        }}
                    >
                        <p>Nơi cấp: {staff?.cccdPlace}</p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1.5fr 1fr",
                            gap: "5px",
                        }}
                    >
                        <p>Fax: {staff?.fax}</p>
                        <p>Email: {staff?.email}</p>
                        <p>Điện thoại: {staff?.phoneMobile}</p>
                    </div>
                </div>

                {/* II. QUÁ TRÌNH ĐÀO TẠO */}
                <div
                    className="resume-section"
                    style={{ marginBottom: "15px" }}
                >
                    <h3
                        style={{
                            fontWeight: "bold",
                            fontSize: "13pt",
                            marginBottom: "5px",
                        }}
                    >
                        II. QUÁ TRÌNH ĐÀO TẠO
                    </h3>
                    <p
                        style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                        }}
                    >
                        1. Đại học:
                    </p>
                    {education
                        ?.filter((e) => e.degreeLevelId === 11)
                        .map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    marginLeft: "10px",
                                    marginBottom: "5px",
                                }}
                            >
                                <p>
                                    Hệ đào tạo: {item.trainingFormName} | Nơi
                                    đào tạo: {item.institution}
                                </p>
                                <p>
                                    Ngành học: {item.major} | Năm tốt nghiệp:{" "}
                                    {item.graduationYear}
                                </p>
                            </div>
                        ))}

                    <p
                        style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            marginTop: "5px",
                        }}
                    >
                        2. Sau đại học:
                    </p>
                    {education
                        ?.filter(
                            (e) =>
                                !e.degreeLevelName
                                    ?.toLowerCase()
                                    .includes("đại học"),
                        )
                        .map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    marginLeft: "10px",
                                    marginBottom: "5px",
                                }}
                            >
                                <p>
                                    {item.degreeLevelName} chuyên ngành:{" "}
                                    {item.major} | Năm cấp bằng:{" "}
                                    {item.graduationYear}
                                </p>
                                <p>Nơi đào tạo: {item.institution}</p>
                            </div>
                        ))}
                    {/* 3. Ngoại ngữ */}
                    <p
                        style={{
                            fontWeight: "bold",
                            textDecoration: "underline",
                            marginTop: "10px",
                        }}
                    >
                        3. Ngoại ngữ:
                    </p>
                    {languages && languages.length > 0 ? (
                        languages.map((lang, index) => (
                            <div
                                key={index}
                                style={{
                                    marginLeft: "10px",
                                    marginBottom: "5px",
                                }}
                            >
                                <p>
                                    - {lang.languageName}: Mức độ sử dụng:{" "}
                                    {lang.languageLevel}
                                    {lang.notes ? ` (${lang.notes})` : ""}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p style={{ marginLeft: "10px", fontStyle: "italic" }}>
                            (Không có thông tin ngoại ngữ)
                        </p>
                    )}
                </div>

                {/* III. QUÁ TRÌNH CÔNG TÁC CHUYÊN MÔN */}
                <div
                    className="resume-section"
                    style={{ marginBottom: "25px" }}
                >
                    <h3
                        style={{
                            fontWeight: "bold",
                            fontSize: "13pt",
                            marginBottom: "10px",
                            textTransform: "uppercase",
                        }}
                    >
                        III. QUÁ TRÌNH CÔNG TÁC CHUYÊN MÔN
                    </h3>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "11pt",
                            border: "1px solid black",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#ffffff" }}>
                                <th
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        width: "25%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Thời gian
                                </th>
                                <th
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        width: "40%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Nơi công tác
                                </th>
                                <th
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        width: "35%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Công việc đảm nhiệm
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employment && employment.length > 0 ? (
                                employment.map((item, index) => (
                                    <tr key={index}>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                textAlign: "center",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {formatDate(item.fromDate)} -{" "}
                                            {formatDate(item.toDate) || "nay"}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                textAlign: "left",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {item.organization}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                textAlign: "left",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            {item.position}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="3"
                                        style={{
                                            border: "1px solid black",
                                            padding: "20px",
                                            textAlign: "center",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Chưa có dữ liệu công tác
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* IV. CÁC ĐỀ TÀI, DỰ ÁN NGHIÊN CỨU KHOA HỌC */}
                <div
                    className="resume-section"
                    style={{ marginBottom: "25px" }}
                >
                    <h3
                        style={{
                            fontWeight: "bold",
                            fontSize: "13pt",
                            marginBottom: "10px",
                            textTransform: "uppercase",
                        }}
                    >
                        IV. CÁC ĐỀ TÀI, DỰ ÁN NGHIÊN CỨU KHOA HỌC
                    </h3>
                    <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                        1. Các đề tài nghiên cứu khoa học đã và đang tham gia:
                    </p>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "11pt",
                            border: "1px solid black",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#f8fafc" }}>
                                <th
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        width: "40%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Tên đề tài, dự án, nhiệm vụ đã chủ trì hoặc
                                    tham gia
                                </th>
                                <th
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        width: "15%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Thời gian (BĐ - KT)
                                </th>
                                <th
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        width: "20%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Cấp quản lý
                                </th>
                                <th
                                    style={{
                                        border: "1px solid black",
                                        padding: "8px",
                                        width: "25%",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Trách nhiệm tham gia
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {researches && researches.length > 0 ? (
                                researches.map((item, index) => (
                                    <tr key={index}>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                textAlign: "left",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            {item.researchName}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                textAlign: "center",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            {item.startYear} -{" "}
                                            {item.endYear || "Nay"}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                textAlign: "center",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            {item.researchLevel}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                textAlign: "left",
                                                verticalAlign: "top",
                                            }}
                                        >
                                            {/* Hiển thị tên vai trò từ API (roleInResearchName hoặc tương tự) */}
                                            {item.roleInResearchName ||
                                                "Thành viên"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        style={{
                                            border: "1px solid black",
                                            padding: "15px",
                                            textAlign: "center",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Chưa có dữ liệu nghiên cứu khoa học
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* CHỮ KÝ */}
                <div
                    className="resume-section"
                    style={{
                        marginTop: "30px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontWeight: "bold" }}>
                            Xác nhận của cơ quan
                        </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontStyle: "italic" }}>
                            Đồng Nai, ngày {new Date().getDate()} tháng{" "}
                            {new Date().getMonth() + 1} năm{" "}
                            {new Date().getFullYear()}
                        </p>
                        <p style={{ fontWeight: "bold" }}>Người khai ký tên</p>
                        <div style={{ height: "80px" }}></div>
                        <p style={{ fontWeight: "bold" }}>{staff?.fullName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeExport;
