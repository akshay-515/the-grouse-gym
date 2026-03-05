import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"
import TopNavbar from "./topnavbar"

const AdminLayout = () => {
    return(
        <div className="admin-container">
            <Sidebar />
            <div className="main-section">
                <TopNavbar />
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;