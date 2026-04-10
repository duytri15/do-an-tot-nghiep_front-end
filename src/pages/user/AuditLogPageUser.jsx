import React, { useEffect, useState } from "react";
import axiosClient from "../../axios/axiosClient";
import { Table, Tag, Pagination, Card } from "antd"; // Hoặc dùng table thuần tùy Trí

const AuditLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            // Gọi đúng route [controller]/[action] mà Trí đã đặt
            const res = await axiosClient.get(`/AuditLog/GetList`, {
                params: { page, pageSize: 10 },
            });
            if (res.status === 200) {
                setLogs(res.data.data.data);
                setTotal(res.data.data.total);
            }
        } catch (error) {
            console.error("Lỗi lấy nhật ký:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(currentPage);
    }, [currentPage]);

    const columns = [
        {
            title: "Thời gian",
            dataIndex: "changedAt",
            key: "changedAt",
            render: (text) => new Date(text).toLocaleString("vi-VN"),
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (action) => {
                let color =
                    action === "Create"
                        ? "green"
                        : action === "Update"
                          ? "blue"
                          : "red";
                return <Tag color={color}>{action.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Hồ sơ của", // Cột này cực kỳ quan trọng cho Manager
            dataIndex: "staffName",
            key: "staffName",
        },
        {
            title: "Nội dung thay đổi",
            key: "detail",
            render: (_, record) => (
                <div>
                    <strong>{record.fieldName}:</strong> <br />
                    <small style={{ color: "red" }}>
                        Cũ: {record.oldValue}
                    </small>{" "}
                    <br />
                    <small style={{ color: "green" }}>
                        Mới: {record.newValue}
                    </small>
                </div>
            ),
        },
        {
            title: "Người thực hiện",
            dataIndex: "changedBy",
            key: "changedBy",
        },
    ];

    return (
        <div className="mx-auto max-w-full mt-10">
            <Card
                title={
                    <span className="font-bold text-lg text-blue-700">
                        Nhật ký hoạt động hệ thống
                    </span>
                }
                className="shadow-md rounded-xl border-none" // Làm card đẹp hơn, mất viền thô
            >
                <Table
                    dataSource={logs}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    // Thêm scroll nếu bảng quá dài để không bị vỡ layout main
                    scroll={{ x: "max-content" }}
                    pagination={{
                        current: currentPage,
                        total: total,
                        pageSize: 10,
                        onChange: (page) => setCurrentPage(page),
                        showSizeChanger: false,
                    }}
                />
            </Card>
        </div>
    );
};

export default AuditLogPage;
