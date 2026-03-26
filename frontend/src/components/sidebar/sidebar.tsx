import { NavLink } from "react-router-dom"
import "./sidebar.css"

const Sidebar = () => {
    return(
        <div className="sidebar">
            <h2 className="logo">GYM ADMIN</h2>
            <nav>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/members/add">Add Members</NavLink>
                <NavLink to="/members" end>Members List</NavLink>
                <NavLink to="/payments">Payments</NavLink>
                <NavLink to="/memberships">Memberships</NavLink>
                <NavLink to="/payments-list">Payment List</NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;