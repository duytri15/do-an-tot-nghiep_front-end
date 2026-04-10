import React, { useState } from "react";
import axiosClient from "../../axios/axiosClient";
import { Form, Input, Button, Select, message, Switch } from "antd";
import {
    FaUserPlus,
    FaUserShield,
    FaUserEdit,
    FaLock,
    FaUser,
    FaEnvelope,
    FaEye,
    FaCheckCircle,
} from "react-icons/fa";

const { Option } = Select;

const RegisterManagement = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);

        try {
            const payload = {
                id: values.roleId,
                userName: values.userName,
                fullName: values.fullName,
                passwordHash: values.passwordHash,
                email: values.email,
                roleId: values.roleId,
                roleName: values.roleId === 1 ? "Admin" : "Manager",
                canViewLog: Boolean(values.canViewLog),
                canApprove: Boolean(values.canApprove),
            };

            const res = await axiosClient.post("/User/Resgiter", payload);

            if (res.status === 201 || res.data.status === 201) {
                message.success("Tạo tài khoản thành công!");
                form.resetFields();
            } else {
                message.error(res.data.message);
            }
        } catch (err) {
            message.error(
                err.response?.data?.message || "Không thể tạo tài khoản!",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-15 min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-800 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-300">
                            <FaUserPlus size={20} />
                        </div>
                        Cấp tài khoản hệ thống
                    </h1>
                    <p className="text-slate-500 mt-2 ml-[72px]">
                        Tạo tài khoản Admin / Manager và cấu hình quyền chi tiết
                    </p>
                </div>

                {/* MAIN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT INFO PANEL */}
                    <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 shadow-2xl">
                        <h3 className="text-xl font-black mb-6">
                            Vai trò hệ thống
                        </h3>

                        <div className="space-y-5">
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaUserShield className="text-red-300" />
                                    <span className="font-bold">Admin</span>
                                </div>
                                <p className="text-sm text-blue-100 leading-relaxed">
                                    Toàn quyền quản trị hệ thống, phê duyệt hồ
                                    sơ, xem audit logs, quản lý tài khoản và dữ
                                    liệu.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaUserEdit className="text-green-300" />
                                    <span className="font-bold">Manager</span>
                                </div>
                                <p className="text-sm text-blue-100 leading-relaxed">
                                    Quản lý dữ liệu chuyên môn, có thể được cấp
                                    thêm quyền phê duyệt và xem nhật ký thay
                                    đổi.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FORM PANEL */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                roleId: 3,
                                canViewLog: false,
                                canApprove: false,
                            }}
                        >
                            {/* SECTION 1 */}
                            <div className="mb-8">
                                <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-4">
                                    Thông tin tài khoản
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Form.Item
                                        label="Tên đăng nhập"
                                        name="userName"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            size="large"
                                            prefix={<FaUser />}
                                            placeholder="username..."
                                            className="rounded-xl"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Họ và tên"
                                        name="fullName"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            size="large"
                                            prefix={<FaUser />}
                                            placeholder="Nguyễn Văn A"
                                            className="rounded-xl"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email công việc"
                                        name="email"
                                        rules={[{ type: "email" }]}
                                    >
                                        <Input
                                            size="large"
                                            prefix={<FaEnvelope />}
                                            placeholder="admin@dntu.edu.vn"
                                            className="rounded-xl"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Mật khẩu ban đầu"
                                        name="passwordHash"
                                        rules={[{ required: true }, { min: 6 }]}
                                    >
                                        <Input.Password
                                            size="large"
                                            prefix={<FaLock />}
                                            placeholder="••••••"
                                            className="rounded-xl"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Xác nhận mật khẩu"
                                        name="confirmPassword"
                                        dependencies={["passwordHash"]}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Vui lòng xác nhận mật khẩu!",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue(
                                                            "passwordHash",
                                                        ) === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            "Mật khẩu xác nhận không khớp!",
                                                        ),
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            size="large"
                                            prefix={<FaLock />}
                                            placeholder="Nhập lại mật khẩu..."
                                            className="rounded-xl"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Vai trò hệ thống"
                                        name="roleId"
                                        rules={[{ required: true }]}
                                        className="md:col-span-2"
                                    >
                                        <Select
                                            size="large"
                                            className="rounded-xl"
                                        >
                                            <Option value={1}>Admin</Option>
                                            <Option value={3}>Manager</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>

                            {/* SECTION 2 */}
                            <div>
                                <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-4">
                                    Quyền nâng cao
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-2xl p-5 flex justify-between items-center bg-slate-50 hover:bg-blue-50 transition">
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                Xem Audit Logs
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Cho phép xem nhật ký hệ thống
                                            </p>
                                        </div>

                                        <Form.Item
                                            name="canViewLog"
                                            valuePropName="checked"
                                            className="mb-0"
                                        >
                                            <Switch
                                                checkedChildren={<FaEye />}
                                                unCheckedChildren={<FaEye />}
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="border rounded-2xl p-5 flex justify-between items-center bg-slate-50 hover:bg-blue-50 transition">
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                Quyền Phê Duyệt
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Cho phép duyệt hồ sơ / dữ liệu
                                            </p>
                                        </div>

                                        <Form.Item
                                            name="canApprove"
                                            valuePropName="checked"
                                            className="mb-0"
                                        >
                                            <Switch
                                                checkedChildren={
                                                    <FaCheckCircle />
                                                }
                                                unCheckedChildren={
                                                    <FaCheckCircle />
                                                }
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <div className="mt-10 flex justify-end">
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    loading={loading}
                                    size="large"
                                    className="h-12 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 border-none font-bold shadow-lg shadow-blue-200"
                                >
                                    TẠO TÀI KHOẢN
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterManagement;
