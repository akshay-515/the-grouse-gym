import { useNavigate } from "react-router-dom"

const TopNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="topnavbar">
            <h3 className="navbar-heading">Welcome Admin</h3>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default TopNavbar;