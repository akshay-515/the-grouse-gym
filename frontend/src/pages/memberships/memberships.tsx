import { useEffect, useState } from "react"
import api from "../../api/axios";
import { ChevronLeft, ChevronRight, ShieldCheck, User } from "lucide-react";
import "./memberships.css"

interface Membership {
    id: number;
    member_name: string;
    plan_type: string;
    start_date: string;
    end_date: string;
}

const Memberships = () => {
    const[memberships, setMemberships] = useState<Membership[]>([])
    const [page, setPage] = useState(1);

    const rowsPerPage = 8;

    useEffect(() => {
        const fetchmemberships = async() => {
            try{
                const res = await api.get("/memberships");
                setMemberships(res.data.data);
            } catch (err) {
                console.error("failed to load Memberships");
            }
        };
        fetchmemberships();
    }, []);

    const getStatus = (end_date: string) => {
        const today = new Date;
        const end = new Date(end_date);
        return end >= today ? "Active" : "Expired";
    };

    const paginatedMemberships = memberships.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const totalPages = Math.max(1, Math.ceil(memberships.length / rowsPerPage));

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [memberships, totalPages]);

return (
    <div className="admin-page-wrapper">
        <div className="membership-page-header">
            <div className="header-text">
                <h1>Memberships</h1>
                <p className="membership-subtitle">Track all active and expired membership cycles</p>
            </div>
            <div className="header-icon-box">
                <ShieldCheck size={24} color="var(--accent-blue)" />
            </div>
        </div>

        <div className="glass-table-container">
            <table className="elite-members-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Member</th>
                        <th>Plan Type</th>
                        <th>Start Date</th>
                        <th>Expiry Date</th>
                        <th>Status</th>                        
                    </tr>
                </thead>

                <tbody>
                    {paginatedMemberships.map((m, index) => (
                        <tr key={m.id}>
                            <td className="index-col">{(page - 1) * rowsPerPage + index + 1}</td>
                            <td className="member-name-cell">
                                <User size={14} className="cell-icon" /> {m.member_name}
                            </td>
                            <td>
                                <span className="plan-tag">{m.plan_type}</span>
                            </td>
                            <td className="date-cell">{new Date(m.start_date).toLocaleDateString()}</td>
                            <td className="date-cell">
                                <span className={getStatus(m.end_date) === "Expired" ? "text-red" : ""}>
                                    {new Date(m.end_date).toLocaleDateString()}
                                </span>
                            </td>

                            <td>
                                <span className={`elite-status-badge ${getStatus(m.end_date).toLowerCase()}`}>
                                    <span className="dot"></span>
                                    {getStatus(m.end_date)}
                                </span>
                            </td>
                        </tr>
                    ))}
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

export default Memberships;