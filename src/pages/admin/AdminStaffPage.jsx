import { useStaffsList } from "../../hooks/useStaffsList";
import StaffTable from "../../components/StaffTable";

const AdminStaffPage = () => {
    const role = localStorage.getItem("role");
    // Hook giờ đây trả về đủ thông tin để phân trang
    const { data, loading, totalItems, currentPage, setPage } = useStaffsList(
        1,
        10,
    );

    return (
        <div className="space-y-4 p-6 mt-15">
            <h1 className="text-2xl font-black mb-6 text-gray-800 uppercase">
                Danh sách cán bộ
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <StaffTable
                    data={data}
                    role={role}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    setPage={setPage}
                    pageSize={10}
                />
            )}
        </div>
    );
};

export default AdminStaffPage;
