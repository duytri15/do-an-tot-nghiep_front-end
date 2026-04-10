import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "../../axios/axiosClient";
import { Table, Button, Modal, Form, Input, message, Space, Tooltip } from "antd";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaLanguage } from "react-icons/fa";
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const LanguageManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    // ====================== 1. LOAD DỮ LIỆU ======================
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const url = searchText.trim()
                ? `/Language/Search?search=${encodeURIComponent(searchText.trim())}`
                : `/Language/GetList?page=${currentPage}&pageSize=${pageSize}`;

            const res = await axiosClient.get(url);
            if (res.status === 200) {
                // Đọc đúng cấu trúc: res.data.data.items
                const result = res.data.data;
                const items = result?.items || [];
                setData(items);
                setTotal(result?.totalCount || items.length);
            }
        } catch (error) {
            message.error("Không thể tải danh sách ngôn ngữ");
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchText, pageSize]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ====================== 2. XỬ LÝ THÊM & CẬP NHẬT ======================
    const handleSubmit = async (values) => {
        try {
            let payload = { ...values };

            if (editingItem) {
                // Trường hợp Cập nhật: Gửi kèm ID của item đang sửa
                payload.id = editingItem.id;
                await axiosClient.put(`/Language/Update`, payload);
                message.success("Cập nhật ngôn ngữ thành công");
            } else {
                // Trường hợp Thêm mới: 
                // Thường API C# yêu cầu ID = 0 hoặc null khi tạo mới để tránh lỗi Mapper
                payload.id = 0; 
                await axiosClient.post(`/Language/Create`, payload);
                message.success("Thêm ngôn ngữ mới thành công");
            }

            // Chỉ khi API chạy thành công mới thực hiện các bước dưới
            setIsModalOpen(false);
            form.resetFields();
            loadData(); // Load lại bảng để thấy dữ liệu mới
        } catch (error) {
            console.error("Lỗi API:", error);
            // Hiện thông báo lỗi từ Server nếu có (ví dụ: Trùng tên ngôn ngữ)
            message.error(error.response?.data?.message || "Thao tác thất bại!");
        }
    };

    // ====================== 3. XỬ LÝ XÓA ======================
    const handleDelete = (record) => {
        confirm({
            title: 'Xác nhận xóa?',
            icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
            content: `Bạn có chắc muốn xóa "${record.name}"?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            centered: true,
            async onOk() {
                try {
                    await axiosClient.delete(`/Language/Delete?id=${record.id}`);
                    message.success("Đã xóa ngôn ngữ");
                    loadData();
                } catch (error) {
                    message.error("Lỗi khi xóa dữ liệu");
                }
            },
        });
    };

    // ====================== 4. CẤU HÌNH BẢNG ======================
    const columns = [
        {
            title: "STT",
            key: "index",
            width: 70,
            align: 'center',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Tên ngôn ngữ",
            dataIndex: "name",
            key: "name",
            render: (text) => <b className="text-gray-800">{text}</b>
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            align: 'center',
            width: 100,
        },
        {
            title: "Thao tác",
            key: "action",
            align: 'center',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            className="text-blue-600 hover:bg-blue-50"
                            icon={<FaEdit />}
                            onClick={() => {
                                setEditingItem(record);
                                form.setFieldsValue(record);
                                setIsModalOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            danger
                            className="hover:bg-red-50"
                            icon={<FaTrash />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="mt-15 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                             <h1 className="text-2xl font-black text-gray-800 uppercase">
                    Danh mục ngôn ngữ
                </h1>
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    onClick={() => {
                        setEditingItem(null);
                        form.resetFields();
                        setIsModalOpen(true);
                    }}
                >
                    Thêm ngôn ngữ
                </Button>
            </div>

            <div className="mb-6 max-w-sm">
                <Input
                    prefix={<FaSearch className="text-gray-400" />}
                    placeholder="Tìm nhanh ngôn ngữ..."
                    allowClear
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    total: total,
                    pageSize: pageSize,
                    onChange: (page) => setCurrentPage(page),
                    position: ['bottomCenter'],
                }}
            />

            <Modal
                title={editingItem ? "Cập nhật ngôn ngữ" : "Thêm ngôn ngữ mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên ngôn ngữ"
                        rules={[{ required: true, message: 'Không được để trống tên!' }]}
                    >
                        <Input placeholder="Ví dụ: Tiếng Pháp, Tiếng Đức..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LanguageManagement;