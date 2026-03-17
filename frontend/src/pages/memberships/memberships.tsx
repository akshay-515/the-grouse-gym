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

    return (
        <div className="membership-container">
            <h2 className="membership-heading">Memberships</h2>
            <table className="membership-table">
                <thead>
                    <tr>
                        <th>Member</th>
                        <th>Plan</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>                        
                    </tr>
                </thead>

                <tbody>
                    {memberships.map((m) => (
                        <tr key={m.id}>
                            <td>{m.member_name}</td>
                            <td>{m.plan_type}</td>
                            <td>{new Date(m.start_date).toLocaleDateString()}</td>
                            <td>{new Date(m.end_date).toLocaleDateString()}</td>
                            <td className={getStatus(m.end_date) === "Active" ? "active" : "expired"}>
                                {getStatus(m.end_date)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Memberships;