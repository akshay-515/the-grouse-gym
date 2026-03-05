import { Link } from "react-router-dom"

const Sidebar = () => {
    return(
        <div className="sidebar">
            <h2 className="logo">GYM ADMIN</h2>

            <nav>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/members">Members</Link>
                <Link to="/payments">Payments</Link>
            </nav>
        </div>
    );
};

export default Sidebar;