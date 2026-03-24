import { useNavigate } from "react-router-dom"

const TopNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="topnavbar">
            <div className="topnavbar-a">
              <h3 className="navbar-heading">Dashboard Overview</h3>
            </div>
            <div className="topnavbar-b">
              <header className="dashboard-header">
                <span className="date-display">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </header>
              <button onClick={handleLogout}>Logout</button> 
            </div>   
        </div>
        

    );
};

export default TopNavbar;