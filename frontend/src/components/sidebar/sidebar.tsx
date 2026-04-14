import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import "./sidebar.css";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <div className="mobile-topbar">
        <button className="menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
        <h2 className="mobile-logo">GYM ADMIN</h2>
      </div>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMenu}></div>
      )}

      <div className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">GYM ADMIN</h2>
          <button className="close-btn" onClick={closeMenu}>
            <X size={22} />
          </button>
        </div>

        <nav>
          <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/members/add" onClick={closeMenu}>Add Members</NavLink>
          <NavLink to="/members" end onClick={closeMenu}>Members List</NavLink>
          <NavLink to="/payments" onClick={closeMenu}>Payments</NavLink>
          <NavLink to="/memberships" onClick={closeMenu}>Memberships</NavLink>
          <NavLink to="/payments-list" onClick={closeMenu}>Payment List</NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;