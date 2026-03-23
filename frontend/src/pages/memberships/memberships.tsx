import { useEffect, useState } from "react"
import api from "../../api/axios";
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

    const rowsPerPage = 7;

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
        <div className="membership-container">
            <div className="membership-header">
                <div>
                <h2>Memberships</h2>
                <p className="sub-text">Track all active and expired memberships</p>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="membership-table">
                <thead>
                    <tr>
                    <th>S.No</th>
                    <th>Member</th>
                    <th>Plan</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>                        
                    </tr>
                </thead>

                <tbody>
                    {paginatedMemberships.map((m, index) => (
                    <tr key={m.id}>
                        <td>{(page - 1) * rowsPerPage + index + 1}</td>
                        <td>{m.member_name}</td>
                        <td>{m.plan_type}</td>
                        <td>{new Date(m.start_date).toLocaleDateString()}</td>
                        <td>{new Date(m.end_date).toLocaleDateString()}</td>

                        <td>
                        <span className={`status-badge ${getStatus(m.end_date) === "Active" ? "active" : "expired"}`}>
                            {getStatus(m.end_date)}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                  </button>

                  <span>Page {page} of {totalPages}</span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>   
            )}


        </div>
    );
};

export default Memberships;