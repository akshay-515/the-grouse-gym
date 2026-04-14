import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./topnavbar.css";

const TopNavbar = () => {

  const navigate = useNavigate();
  const[showModal, setShowModal] = useState<boolean>(false);

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
        <button className="logout-trigger"  onClick={() => setShowModal(true)}>Logout</button> 
      </div> 

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Logout</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to log out of <strong>The Grouse Gym</strong>? You will need to login again to manage your members.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </div>
      )}    
    </div>   
  );
};

export default TopNavbar;