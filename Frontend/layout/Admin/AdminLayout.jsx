import { Outlet } from "react-router-dom";
import Sidebar from "../../src/components/Sidebar";
import Topbar from "../../src/components/Topbar";

const AdminLayout = () => {
    return (
        <>
            {/* Admin Header / Sidebar */}


            <Topbar />
            <div className='flex bg-slate-100'>
                <Sidebar />
                <Outlet />

            </div>


        </>
    );
};

export default AdminLayout;
