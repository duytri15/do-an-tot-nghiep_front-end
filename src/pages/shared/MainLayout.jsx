import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const MainLayout = () => {
    return (
        // flex: cho Sidebar và Nội dung nằm ngang hàng
        // min-h-screen: đảm bảo nền luôn phủ kín màn hình
        <div className="flex min-h-screen bg-gray-50">
            {/* 1. Sidebar cố định bên trái */}
            <Sidebar />

            {/* 2. Phần nội dung chính (Navbar + Profile) */}
            <div className="flex-1 flex flex-col ml-64 min-h-screen bg-gray-50">
                <Navbar />
                <main className="p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
