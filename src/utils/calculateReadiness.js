export const calculateReadiness = (
    staff,
    education = [],
    employment = [],
    languages = [],
) => {
    let score = 0;
    const missingFields = [];

    // 1. Kiểm tra thông tin cá nhân (Tổng 40 điểm)
    // Mỗi trường hợp lệ cộng 2 điểm. Danh sách này Trí có thể thêm tùy ý.
    const fields = [
        "fullName",
        "email",
        "phoneMobile",
        "address",
        "dateOfBirth",

        "genderName",
        "placeOfBirth",
        "nativeVillage",
        "ethnicityName",

        "positionName",
        "departmentName",
        "fax",
        "academicRankName",

        "rankYear",
        "highestDegreeName",
        "degreeYear",
        "degreeCountry",

        "cccdNumber",
        "cccdDate",
        "cccdPlace",
    ];

    fields.forEach((field) => {
        if (staff && staff[field]) {
            score += 2;
        } else {
            // Lưu lại tên trường bị thiếu để nhắc user (optional)
            missingFields.push(field);
        }
    });

    // 2. Kiểm tra Học vấn (20 điểm)
    if (education?.length > 0) score += 20;

    // 3. Kiểm tra Kinh nghiệm làm việc (20 điểm)
    if (employment?.length > 0) score += 20;

    // 4. Kiểm tra Ngoại ngữ (20 điểm)
    if (languages?.length > 0) score += 20;

    // Đảm bảo score không vượt quá 100 (đề phòng Trí thêm quá nhiều fields)
    return {
        score: Math.min(score, 100),
        missingFields: missingFields,
    };
};
