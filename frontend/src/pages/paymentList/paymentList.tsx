import { useEffect, useState } from "react";
import "./paymentList.css"
import api from "../../api/axios";


const PaymentList = () => {
    const [paymentList, setPaymentList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchPaymentList = async () => {
          try {
            setLoading(true);
            const response = await api.get("/dashboard");
            const data = response.data?.data?.paymentList || response.data?.data?.recentPayments;
            if (data) {
                setPaymentList(data);
            } 
          } catch (error) {
            console.error("Fetch error:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchPaymentList();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <div className="section-header">
                <h3>Payment History</h3>
            </div>
            <div className="table-container">
                <div className="modern-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th> 
                                <th>Member</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentList.length > 0 ? (
                               paymentList.map((payment: any) => (
                              <tr key={payment.id}>
                                <td className="id-cell">#{payment.id}</td>
                                <td className="member-cell">{payment.member_name}</td>
                                <td className="amount-cell">₹{parseFloat(payment.amount).toLocaleString()}</td>
                                <td><span className="mode-badge">{payment.payment_mode}</span></td>
                                <td>{new Date(payment.payment_date).toLocaleDateString('en-IN')}</td>
                                <td>
                                    <div className="status-wrapper">
                                        <span className="status-dot success"></span> Paid
                                    </div>
                                </td>
                              </tr> 
                              )) 
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{textAlign: 'center', padding: '40px'}}>
                                        {loading ? "Fetching records..." : "No payment records found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentList;     