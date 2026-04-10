import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "../../axios/axiosClient";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Space,
    Tag,
    Tooltip,
} from "antd";
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaBuilding,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = Modal;

const DepartmentManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    // ====================== 1. LOAD DATA ======================
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const url = searchText.trim()
                ? `/Department/Search?search=${encodeURIComponent(searchText.trim())}`
                : `/Department/GetList?page=${currentPage}&pageSize=${pageSize}`;

            const res = await axiosClient.get(url);
            if (res.status === 200) {
                const result = res.data.data;
                const items = result?.items || result || [];
                setData(items);
                setTotal(result?.totalCount || items.length);
            }
        } catch (error) {
            message.error("Không thể tải danh sách phòng ban");
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchText, pageSize]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ====================== 2. XỬ LÝ THÊM/SỬA ======================
    const handleSubmit = async (values) => {
        try {
            if (editingItem) {
                await axiosClient.put(`/Department/Update`, {
                    ...values,
                    id: editingItem.id,
                });
                message.success("Cập nhật thành công");
            } else {
                await axiosClient.post(`/Department/Create`, values);
                message.success("Thêm mới thành công");
            }
            setIsModalOpen(false);
            form.resetFields();
            loadData();
        } catch (error) {
            message.error("Thao tác thất bại");
        }
    };

    // ====================== 3. XỬ LÝ XÓA ======================
    const handleDelete = (record) => {
        confirm({
            title: "Xác nhận xóa phòng ban?",
            icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
            content: `Bạn có chắc muốn xóa "${record.name}" không?`,
            okText: "Xóa ngay",
            okType: "danger",
            cancelText: "Hủy",
            centered: true,
            async onOk() {
                try {
                    await axiosClient.delete(
                        `/Department/Delete?id=${record.id}`,
                    );
                    message.success("Đã xóa");
                    loadData();
                } catch (error) {
                    message.error("Lỗi khi xóa");
                }
            },
        });
    };

    // ====================== 4. ĐỊNH NGHĨA CỘT BẢNG ======================
    const columns = [
        {
            title: "STT",
            key: "index",
            width: 60,
            align: "center",
            render: (text, record, index) =>
                (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Tên phòng ban",
            dataIndex: "name",
            key: "name",
            render: (text) => <b className="text-blue-600">{text}</b>,
        },
        {
            title: "Mã",
            dataIndex: "code",
            key: "code",
            align: "center",
            render: (code) => <Tag color="geekblue">{code}</Tag>,
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (phone) => (
                <span>
                    <FaPhoneAlt className="inline mr-2 text-gray-400 text-xs" />
                    {phone || "---"}
                </span>
            ),
        },
        {
            title: "Văn phòng",
            dataIndex: "office",
            key: "office",
            render: (office) => (
                <span>
                    <FaMapMarkerAlt className="inline mr-2 text-red-400 text-xs" />
                    {office || "---"}
                </span>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<FaEdit className="text-blue-500" />}
                        onClick={() => {
                            setEditingItem(record);
                            form.setFieldsValue(record);
                            setIsModalOpen(true);
                        }}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<FaTrash />}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="mt-15 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black text-gray-800 uppercase">
                    Quản lý Phòng ban
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
                    Thêm mới
                </Button>
            </div>

            <div className="mb-4 max-w-sm">
                <Input
                    prefix={<FaSearch className="text-gray-400" />}
                    placeholder="Tìm kiếm phòng ban..."
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
                    position: ["bottomCenter"],
                }}
            />

            <Modal
                title={editingItem ? "Sửa phòng ban" : "Thêm phòng ban"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                centered
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label="Tên phòng ban"
                            rules={[{ required: true, message: "Nhập tên!" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="code"
                            label="Mã phòng ban"
                            rules={[{ required: true, message: "Nhập mã!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="phone" label="Số điện thoại">
                            <Input
                                prefix={
                                    <FaPhoneAlt className="text-gray-300" />
                                }
                                placeholder="0251..."
                            />
                        </Form.Item>
                        <Form.Item name="office" label="Văn phòng (Vị trí)">
                            <Input
                                prefix={
                                    <FaMapMarkerAlt className="text-gray-300" />
                                }
                                placeholder="Khu A, Tầng 2..."
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DepartmentManagement;
