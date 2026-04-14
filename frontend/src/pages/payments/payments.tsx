import React, { useEffect, useState } from "react";
import "./payments.css"
import api from "../../api/axios";
import { User, CreditCard, DollarSign, Calendar, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

interface Member {
    id: number;
    name: string;
}

const PLAN_PRICES: Record<string, number> = {
    MONTHLY: 1500,
    QUARTERLY: 4000,
    HALF_YEARLY: 7500,
    YEARLY: 14000
};

const Payments = () => {
    const [members , setMembers] = useState<Member[]>([]);
    const [_loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        member_id: "",
        amount: PLAN_PRICES["MONTHLY"].toString(),
        payment_mode: "CASH",
        payment_date: "",
        plan_type: "MONTHLY"
    });

    const location = useLocation();

    const fetchMembers = async () => {
        setLoading(true);
        try{
            console.log("Submitting member_id:", form.member_id);
            const params = new URLSearchParams(location.search);
            const memberIdFromURL = params.get("memberId");

            const res = await api.get("/members/eligible", {
                params: {
                    memberId: memberIdFromURL
                }
            });
            setMembers(res.data.data);
        } catch (error) {
            console.error("failed to load members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            const params = new URLSearchParams(location.search);
            const memberIdFromURL = params.get("memberId");

            const res = await api.get("/members/eligible", {
                params: {
                    memberId: memberIdFromURL
                }
            });
            setMembers(res.data.data);
        };

        fetch();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const memberIdFromURL = params.get("memberId");

        if (members.length === 0) return;

        if (memberIdFromURL) {
            setForm(prev => ({
                ...prev,
                member_id: memberIdFromURL
            }));
        } else {
            setForm(prev => ({
                ...prev,
                member_id: members[0].id.toString()
            }));
        }
      console.log("URL memberId:", memberIdFromURL);
      console.log("Form member_id:", form.member_id);

    }, [members]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        
        if(name === "plan_type") {
            const price = PLAN_PRICES[value];
            setForm({
                ...form,
                plan_type: value,
                amount: price.toString()
            });
            return;
        }

        setForm({
            ...form,
            [name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const memberIdNumber = Number(form.member_id);
        const amountNumber = Number(form.amount);

        if (!form.member_id || isNaN(memberIdNumber)) {
            alert("Please select a valid member");
            return;
        }

        if(isNaN(amountNumber) || amountNumber <= 0) {
            alert("plesae enter a valid payment amount");
            return;
        }

        try {
            await api.post("/payments", {
                ...form,
                member_id: memberIdNumber,
                amount: amountNumber
            });

            toast.success("payment recored Succesfully")

            await fetchMembers();

            setForm(prev => ({
                ...prev,
                amount: PLAN_PRICES["MONTHLY"].toString(),
                payment_date: ""
            }));

        } catch (error) {
            toast.error("Failed to record Payment");
        }
    };

return (
    <div className="admin-page-wrapper">
        <div className="page-header">
            <div className="header-text">
                <h1>Record Payment</h1>
                <p className="subtitle">Create payment and activate membership</p>
            </div>
            <div className="header-icon-box payment-icon">
                <CreditCard size={24} color="var(--accent-green)" />
            </div>
        </div>

        <div className="glass-form-card">
            <form onSubmit={handleSubmit} className="elite-form">

                <div className="input-container">
                    <label><User size={14} /> Select Member</label>
                    <select 
                        name="member_id"
                        value={form.member_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="" hidden>Choose a member...</option>
                        {members.map((m) => (
                            <option key={m.id} value={m.id.toString()}>{m.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="input-container flex-1">
                        <label>Plan Type</label>
                        <select 
                            name="plan_type" 
                            value={form.plan_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="MONTHLY">Monthly</option>
                            <option value="QUARTERLY">Quarterly</option>
                            <option value="HALF_YEARLY">Half Yearly</option>
                            <option value="YEARLY">Yearly</option>
                        </select>
                    </div>

                    <div className="input-container flex-1">
                        <label><DollarSign size={14} /> Amount</label>
                        <input 
                            type="number"
                            name="amount"
                            value={form.amount}
                            placeholder="0.00"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-container flex-1">
                        <label>Payment Mode</label>
                        <select 
                            name="payment_mode" 
                            value={form.payment_mode} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Card</option>
                            <option value="GPAY">GPay</option>
                        </select>
                    </div>

                    <div className="input-container flex-1">
                        <label><Calendar size={14} /> Payment Date</label>
                        <input 
                            className="elite-date-picker"
                            type="date" 
                            name="payment_date" 
                            value={form.payment_date} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="elite-submit-btn payment-accent">
                        Record Payment <CheckCircle size={18} style={{marginLeft: '8px'}}/>
                    </button>
                </div>

            </form>
        </div>
    </div>
);
};

export default Payments;