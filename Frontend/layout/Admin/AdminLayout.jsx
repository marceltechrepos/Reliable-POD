import { Outlet } from "react-router-dom";
import Sidebar from "../../src/components/Sidebar";
import Topbar from "../../src/components/Topbar";

const AdminLayout = () => {
    return (
        <>
            {/* Admin Header / Sidebar */}


            <Topbar />
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>



        </>
    );
};

export default AdminLayout;
