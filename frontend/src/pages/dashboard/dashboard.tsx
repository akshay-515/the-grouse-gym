import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./dashboard.css"
import { Link } from "react-router-dom";

// interface RecentPayment {
//   id: number;
//   member_name: string;
//   amount: number;
//   payment_date: string;
//   payment_mode: string;
// }

interface DashboardSummary {
  totalMembers: number;
  activeMemberships: number;
  expiredMemberships: number;
  todayRevenue: number;
  monthlyRevenue: number;
  expiringSoon: number;
  totalRevenue: number;
  recentPayments: any;
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardSummary | null> (null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("")

    useEffect (() => {
        const fetchData = async () => {
          try {
             const token = localStorage.getItem("token");

             if(!token) {
              setError("unauthorized. Please login again.");
              setLoading(false);
              return;
             }

            const response = await api.get("/dashboard");
            setData(response.data.data)
            console.log(response.data.data)
          } catch (err: any) {
            console.error("Dashboard fetch error:", err);
            setError("Failed to load dashboard data.");
          }finally {
            setLoading(false);
          }}
          fetchData();
    }, []);
    if(loading) return <p>Loading Dashboard...</p>;
    if(error) return <p className="error-text">{error}</p>
    if(!data) return <p>Loading...</p>

    return(
      <div className="dashboard-container">
        <h2>Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="cards">
        <Link to="/members">
          <div className="card" >
            <h3>Total Members</h3>
            <p>{data.totalMembers}</p>
          </div>
        </Link>

        <Link to="/memberships">
          <div className="card">
            <h3>Active Memberships</h3>
            <p>{data.activeMemberships}</p>
          </div>
        </Link>

        <div className="card">
          <h3>Expired Memberships</h3>
          <p>{data.expiredMemberships}</p>
        </div>

        <div className="card warning-card">
          <h3>Expiring Soon</h3>
          <p>{data.expiringSoon}</p>
        </div>

        <div className="card revenue-card">
          <h3>Total Revenue</h3>
          <p>₹{data.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="card revenue-card">
          <h3>Monthly Revenue</h3>
          <p>₹{data.monthlyRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Payments Section */}
      <div className="recent-section">
        <h3>Recent Payments</h3>

        {data.recentPayments &&  data.recentPayments.length === 0 ? (
          <p>No recent payments found.</p>
        ) : (
          <div className="recent-table-wrapper">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((payment:any) => (
                  <tr key={payment.id}>
                    <td>{payment.member_name}</td>
                    <td>₹{payment.amount.toLocaleString()}</td>
                    <td>{payment.payment_mode}</td>
                    <td>
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>   
        )}
      </div>
    </div>
    ); 
} 

export default Dashboard;