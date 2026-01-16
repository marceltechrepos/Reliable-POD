import { Outlet } from "react-router-dom";
import Sidebar from "../../src/components/Sidebar.jsx";
import Topbar from "../../src/components/Topbar";
import { useState } from "react";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Topbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex min-h-screen bg-slate-100">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main
          className="
            flex-1 bg-gray-50 p-4
            md:ml-[20px]
            lg:ml-[20px]
            xl:ml-[10px]
            mt-12
          "
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default UserLayout;

