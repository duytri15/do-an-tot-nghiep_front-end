import React, { useEffect, useState, useCallback } from "react";
import axiosClient from "../../axios/axiosClient";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Space,
    Select,
    Tag,
} from "antd";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

const { Option } = Select;

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [parentOptions, setParentOptions] = useState([]); // 1. Thêm state lưu danh mục gốc
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const { confirm } = Modal; // Khai báo confirm từ Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    // ====================== LOAD DATA CHO BẢNG ======================
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const url = searchText.trim()
                ? `/Category/Search?search=${encodeURIComponent(searchText.trim())}`
                : `/Category/GetList?page=${currentPage}&pageSize=${pageSize}`;

            const res = await axiosClient.get(url);
            if (res.status === 200) {
                const result = res.data.data;
                const items = result?.items || result || [];
                setCategories(items);
                setTotal(result?.totalCount || items.length);
            }
        } catch (error) {
            message.error("Không thể tải dữ liệu");
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchText, pageSize]);

    const showDeleteConfirm = (record) => {
        confirm({
            title: "Xác nhận xóa danh mục?",
            icon: <FaTrash style={{ color: "#ff4d4f", marginRight: "8px" }} />,
            content: (
                <div>
                    Bạn có chắc chắn muốn xóa danh mục <b>{record.name}</b>{" "}
                    không?
                    <p className="text-red-500 text-xs mt-2">
                        * Hành động này không thể hoàn tác.
                    </p>
                </div>
            ),
            okText: "Xóa ngay",
            okType: "danger",
            cancelText: "Hủy bỏ",
            centered: true, // Hiện giữa màn hình cho đẹp
            async onOk() {
                try {
                    const res = await axiosClient.delete(
                        `/Category/Delete?id=${record.id}`,
                    );
                    if (res.status === 200) {
                        message.success(
                            `Đã xóa thành công danh mục ${record.name}`,
                        );
                        loadData(); // Load lại bảng
                    }
                } catch (error) {
                    message.error("Không thể xóa dữ liệu này!");
                }
            },
            onCancel() {
                console.log("Hủy xóa");
            },
        });
    };
    // ====================== LOAD DATA CHO SELECT (PARENTS) ======================
    const loadParentOptions = async () => {
        try {
            // 2. Gọi API GetOnlyParents mà bạn vừa viết ở Controller/Service
            const res = await axiosClient.get("/Category/GetOnlyParents");
            if (res.status === 200) {
                setParentOptions(res.data.data || []);
            }
        } catch (error) {
            console.error("Lỗi load danh mục cha:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    // 3. Khi mở Modal thì load lại danh sách cha để đảm bảo dữ liệu mới nhất
    useEffect(() => {
        if (isModalOpen) {
            loadParentOptions();
        }
    }, [isModalOpen]);

    const handleSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                ParentId: values.ParentId || null,
            };

            if (editingCategory) {
                await axiosClient.put(`/Category/Update`, {
                    ...payload,
                    id: editingCategory.id,
                });
                message.success("Cập nhật thành công!");
            } else {
                await axiosClient.post(`/Category/Create`, payload);
                message.success("Thêm mới thành công!");
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            message.error("Thao tác thất bại!");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 70 },
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <span>
                    <b className="text-blue-600">{text}</b>
                    {/* Danh mục gốc là khi ko có ParentId */}
                    {!(record.ParentId || record.parentId) && (
                        <Tag color="green" className="ml-2">
                            Gốc
                        </Tag>
                    )}
                </span>
            ),
        },
        { title: "Mã loại", dataIndex: "categoryType", key: "categoryType" },
        { title: "Mã (Code)", dataIndex: "code", key: "code" },
        {
            title: "Hành động",
            key: "action",
            align: "center",
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    {/* Nút Sửa giữ nguyên */}
                    <Button
                        type="text"
                        className="flex items-center justify-center hover:bg-blue-50"
                        icon={<FaEdit className="text-blue-500" />}
                        onClick={() => {
                            setEditingCategory(record);
                            form.setFieldsValue({
                                ...record,
                                ParentId: record.ParentId || record.parentId,
                            });
                            setIsModalOpen(true);
                        }}
                    />

                    {/* Nút Xóa Đã Nâng Cấp */}
                    <Button
                        type="text"
                        danger
                        className="flex items-center justify-center hover:bg-red-50"
                        icon={<FaTrash />}
                        onClick={() => showDeleteConfirm(record)} // Gọi hàm xác nhận mới
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="mt-15 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-black text-gray-800 uppercase">
                    Quản lý danh mục
                </h1>
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    onClick={() => {
                        setEditingCategory(null);
                        form.resetFields();
                        setIsModalOpen(true);
                    }}
                >
                    Thêm mới
                </Button>
            </div>

            <Input
                className="mb-4 max-w-sm"
                prefix={<FaSearch />}
                placeholder="Tìm kiếm..."
                onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                }}
            />

            <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    total: total,
                    pageSize: pageSize,
                    onChange: (p) => setCurrentPage(p),
                }}
            />

            <Modal
                title={editingCategory ? "Sửa danh mục" : "Tạo danh mục mới"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Tên danh mục"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="ParentId" label="Thuộc danh mục cha">
                        {/* 4. Sử dụng parentOptions thay vì lọc từ categories */}
                        <Select
                            placeholder="--- Chọn danh mục cha ---"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {parentOptions
                                .filter(
                                    (item) => item.id !== editingCategory?.id,
                                ) // Chặn chọn chính mình làm cha
                                .map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="categoryType" label="Mã loại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="Mã định danh">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoriesManagement;
