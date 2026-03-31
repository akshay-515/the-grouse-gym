import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ChevronLeft, ChevronRight, CreditCard, User, IndianRupee } from "lucide-react";
import "./paymentList.css";

const PaymentList = () => {
    const [paymentList, setPaymentList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowsPerPage = 7;

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

    const paginatedPayments = paymentList.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const totalPages = Math.max(1, Math.ceil(paymentList.length / rowsPerPage));

    return (
        <div className="admin-page-wrapper">
            <div className="membership-page-header">
                <div className="header-text">
                    <h1>Payment History</h1>
                    <p className="membership-subtitle">Monitor recent transactions and revenue flow</p>
                </div>
                <div className="header-icon-box">
                    <CreditCard size={24} color="var(--accent-blue)" />
                </div>
            </div>

            <div className="glass-table-container">
                <table className="elite-members-table">
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
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                    Fetching records...
                                </td>
                            </tr>
                        ) : paginatedPayments.length > 0 ? (
                            paginatedPayments.map((payment: any) => (
                                <tr key={payment.id}>
                                    <td className="index-col">{payment.id}</td>
                                    <td className="member-name-cell">
                                        <User size={14} className="cell-icon" /> {payment.member_name}
                                    </td>
                                    <td className="amount-cell">
                                        <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                                            ₹{parseFloat(payment.amount).toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="plan-tag">{payment.payment_mode}</span>
                                    </td>
                                    <td className="date-cell">
                                        {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                                    </td>
                                    <td>
                                        <span className="elite-status-badge active">
                                            <span className="dot"></span>
                                            Paid
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                    No payment records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="elite-pagination">
                    <button
                        className="pag-btn"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="pag-info">
                        Page <span>{page}</span> of {totalPages}
                    </div>
                    <button
                        className="pag-btn"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentList;