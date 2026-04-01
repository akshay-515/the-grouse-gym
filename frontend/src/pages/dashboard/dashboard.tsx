import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./dashboard.css"
import { Link, useNavigate } from "react-router-dom";

interface DashboardSummary {
  totalMembers: number;
  activeMemberships: number;
  expiredMemberships: number;
  todayRevenue: number;
  monthlyRevenue: number;
  expiringSoon: number;
  totalRevenue: number;
  recentPayments: any[];
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
             const token = localStorage.getItem("token");
             if(!token) {
              setError("Unauthorized. Please login again.");
              setLoading(false);
              return;
             }
            const response = await api.get("/dashboard");
            setData(response.data.data);
          } catch (err: any) {
            setError("Failed to load dashboard data.");
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    }, []);

    if(loading) return <div className="loading-state">Loading Dashboard...</div>;
    if(error) return <div className="error-container"><p className="error-text">{error}</p></div>;
    if(!data) return null;

    return (
      <div className="dashboard-wrapper">


      <div className="stats-grid">
        <Link to="/members" className="stat-card">
            <div className="stat-info">
                <h3>Total Members</h3>
                <p className="stat-value">{data.totalMembers}</p>
                <span className="stat-subtext">{data.activeMemberships} Active</span>
            </div>
            <div className="stat-icon members-icon">👤</div>
        </Link>

        <div className="stat-card">
            <div className="membership-stat-info">
                <h3>Membership Status</h3>
                <div className="status-mini-flex">
                    <p className="stat-value">{data.activeMemberships}</p>
                    <span className="status-tag active">Active</span>
                </div>
                <span className="stat-subtext text-red">{data.expiredMemberships} Expired</span>
            </div>
            <div className="progress-ring-placeholder">
                <div className="percentage">90%</div>
            </div>
        </div>

        <div className="stat-card warning">
            <div className="stat-info">
                <h3>Expiring Soon</h3>
                <p className="stat-value">{data.expiringSoon}</p>
                <span className="stat-subtext">Within 7 days</span>
            </div>
            <div className="stat-icon clock-icon">🕒</div>
        </div>

        <div className="stat-card revenue">
            <div className="revenue-content">
                <div className="rev-item">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{data.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="rev-item">
                    <h3>Monthly</h3>
                    <p className="stat-value small">₹{data.monthlyRevenue.toLocaleString()}</p>
                </div>
            </div>
            <div className="visual-trend">
                <div className="sparkline"></div>
                <span className="trend-label">↑ 12%</span>
            </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
            <h3>Recent Payments</h3>
            <button className="view-all-btn" onClick={() => navigate("/payments-list")}>View All</button>
        </div>

        <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Mode</th> 
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((payment: any) => (
                  <tr key={payment.id}>
                    <td className="member-cell">
                        <div className="avatar-alt">{payment.member_name.charAt(0)}</div>
                        {payment.member_name}
                    </td>
                    <td className="amount-cell">₹{payment.amount.toLocaleString()}</td>
                    <td><span className="mode-badge">{payment.payment_mode}</span></td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td><span className="status-dot"></span> Paid</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
    ); 
}

export default Dashboard;