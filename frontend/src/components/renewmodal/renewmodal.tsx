import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Props {
  member: {
    member_id: number;
    member_name: string;
  }
  onClose: () => void;
  onSuccess: () => void;
}

const PLAN_PRICES: Record<string, number> = {
  MONTHLY: 1500,
  QUARTERLY: 4000,
  HALF_YEARLY: 7500,
  YEARLY: 14000
};

const RenewModal = ({member, onClose, onSuccess}: Props) => {
  const [form, setForm] = useState({
    plan_type: "MONTHLY",
    amount: PLAN_PRICES["MONTHLY"].toString(),
    payment_mode: "CASH",
    payment_date: ""
  });

const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    const payload = {
      member_id    : member.member_id,
      amount       : Number(form.amount),
      payment_mode : form.payment_mode,
      payment_Date : form.payment_date,
      plan_type    : form.plan_type
    }
    await api.post("/payments", payload);
    toast.success("Memberships Renewed Successfully")
    onSuccess();
    onClose();
  } catch (error: any) {
    console.log("Error:", error.response?.data || error.message);
    toast.error(error.response?.data || "Renew Failed")
  }
} 

return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Renew Membership</h2>

        <p><strong>Member:</strong> {member.member_name}</p>

        <form onSubmit={handleSubmit}>

          <label>Plan Type</label>
          <select name="plan_type" value={form.plan_type} onChange={handleChange}>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="HALF_YEARLY">Half Yearly</option>
            <option value="YEARLY">Yearly</option>
          </select>

          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
          />

          <label>Payment Mode</label>
          <select name="payment_mode" value={form.payment_mode} onChange={handleChange}>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="GPAY">GPay</option>
          </select>

          <label>Payment Date</label>
          <input
            type="date"
            name="payment_date"
            value={form.payment_date}
            onChange={handleChange}
            required
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button type="submit">Confirm</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default RenewModal;