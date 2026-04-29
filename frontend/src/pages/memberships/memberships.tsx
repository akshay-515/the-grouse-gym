import { useEffect, useState } from "react"
import api from "../../api/axios";
import { ChevronLeft, ChevronRight, ShieldCheck, User } from "lucide-react";
import "./memberships.css"
import { useNavigate } from "react-router-dom";
import RenewModal from "../../components/renewmodal/renewmodal";

interface Membership {
    id: number;
    member_id: number;
    member_name: string;
    plan_type: string;
    start_date: string;
    end_date: string;
}

const Memberships = () => {
    const [memberships, setMemberships] = useState<Membership[]>([])
    const [statusFilter, setStatusFilter] = useState("STATUS");
    const [page, setPage] = useState(1);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [showmodal, setShowModal] = useState(false);

    const rowsPerPage = 8;
    const navigate = useNavigate();
 
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
        const today = new Date();
        today.setHours(0,0,0,0);

        const end = new Date(end_date);
        end.setHours(0,0,0,0);

        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000*60*60*24));

        if(diffDays < 0) return {label: "Expired", type: "expired"};

        if(diffDays <= 7) {
            return {label: `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`, type: "expiring"};
        }

        return {label: "Active", type: "active"};
    };

    const filteredMemberships = memberships.filter((m) => {
        const status = getStatus(m.end_date);

        if(statusFilter === "ACTIVE") return status.type === "active";
        if(statusFilter === "EXPIRED") return status.type === "expired";
        if(statusFilter === "EXPIRING") return status.type === "expiring";

        return true;
    })

    const sortedMemberships = [...filteredMemberships].sort((a, b) => {
        return b.id - a.id;
    });

    const paginatedMemberships = sortedMemberships.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const totalPages = Math.max(1, Math.ceil(filteredMemberships.length / rowsPerPage));

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [filteredMemberships, totalPages]);

    const handleRenew = (member: Membership) => {
       setSelectedMember(member);
       setShowModal(true);
    }

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
            <div className="membership-table-wrapper">
               <table className="elite-members-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Member</th>
                        <th>Plan Type</th>
                        <th>Start Date</th>
                        <th>Expiry Date</th>
                        <th className="table-header-cell">
                        <select 
                            value={statusFilter}
                            onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                            }}
                            className="status-filter" 
                        >
                            <option value="STATUS" hidden>Status</option>
                            <option value="ALL">All Members</option>
                            <option value="ACTIVE">Active</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="EXPIRING">Expiring (7 days)</option>
                        </select>
                        </th>                        
                    </tr>
                </thead>

                <tbody className="membership-table-body">
                    {paginatedMemberships.map((m, index) => {
                        const status = getStatus(m.end_date);   

                        return (
                        <tr key={m.id}>
                            <td className="index-col">{(page - 1) * rowsPerPage + index + 1}</td>

                            <td className="member-name-cell">
                            <User size={14} className="cell-icon" /> {m.member_name}
                            </td>

                            <td>
                            <span className="plan-tag">{m.plan_type}</span>
                            </td>

                            <td className="date-cell">
                            {new Date(m.start_date).toLocaleDateString()}
                            </td>

                            <td className="date-cell">
                            <span className={status.type === "expired" ? "text-red" : ""}>
                                {new Date(m.end_date).toLocaleDateString()}
                            </span>
                            </td>
                            <td className="date-cell">
                            <div className="membership-status" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                
                                <span className={`elite-status-badge ${status.type}`}>
                                <span className="dot"></span>
                                {status.label}
                                </span>

                                {(status.type === "expiring" || status.type === "expired") && (
                                <button
                                    className="renew-btn"
                                    onClick={() => handleRenew(m)}
                                >
                                    Renew
                                </button>
                                )}

                            </div>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
            </table> 
            </div>
            
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
        
        {showmodal && selectedMember && (
          <RenewModal 
            member={selectedMember}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              window.location.reload();
            }}
          /> 
        )}
    </div>
    );
};

export default Memberships;