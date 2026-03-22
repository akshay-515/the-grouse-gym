import React, { useEffect, useState } from "react";
import "./payments.css"
import api from "../../api/axios";
import { data } from "react-router-dom";

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
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        member_id: "",
        amount: PLAN_PRICES["MONTHLY"].toString(),
        payment_mode: "CASH",
        payment_date: "",
        plan_type: "MONTHLY"
    });

    const fetchMembers = async () => {
        setLoading(true);
        try{
            console.log("Submitting member_id:", form.member_id);
            const res =await api.get("/members/eligible");
            setMembers(res.data.data);

            if(res.data.data.length > 0) {
                setForm(prev => ({
                    ...prev,
                    // member_id: res.data.data[0].id.toString()
                    member_id: prev.member_id || res.data.data[0].id.toString()
                }));
            }
        } catch (error) {
            console.error("failed to load members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    },[]);

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

        console.log("member_id raw:", form.member_id);
        console.log("member_id number:", Number(form.member_id));
        console.log("i created", memberIdNumber)

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

            alert("Payment recorded successfully");

            await fetchMembers();

            setForm(prev => ({
                ...prev,
                amount: PLAN_PRICES["MONTHLY"].toString(),
                payment_date: ""
            }));

        } catch (error) {
            alert("Failed to record Payment");
        }
    };

    return(
        <div className="payments-container">
            <div className="payment-header">
                <h2>Record Payment</h2>
                <p className="sub-text">Create payment and activate membership</p>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit} className="payment-form">

                <div className="form-group">
                    <label>Member</label>
                    <select 
                    name="member_id"
                    value={form.member_id}
                    onChange={handleChange}
                    required
                    >
                    <option value="" hidden>Select Member</option>
                    {members.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
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

                    <div className="form-group">
                    <label>Amount</label>
                    <input 
                        type="number"
                        name="amount"
                        value={form.amount}
                        placeholder="Enter amount"
                        onChange={handleChange}
                        required
                    />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
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
                    </select>
                    </div>

                    <div className="form-group">
                    <label>Payment Date</label>
                    <input 
                        type="date" 
                        name="payment_date" 
                        value={form.payment_date} 
                        onChange={handleChange} 
                        required 
                    />
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Record Payment
                </button>

                </form>
            </div>

            </div>
    );
};

export default Payments;