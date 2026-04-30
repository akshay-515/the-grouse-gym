import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "./renewmodal.css";

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

const PLAN_DURATION: Record<string, number> = {
  MONTHLY: 1,
  QUARTERLY: 3,
  HALF_YEARLY: 6,
  YEARLY: 12
};

const RenewModal = ({member, onClose, onSuccess}: Props) => {
  const [form, setForm] = useState({
    plan_type: "MONTHLY",
    amount: PLAN_PRICES["MONTHLY"].toString(),
    payment_mode: "CASH",
    payment_date: new Date().toISOString().split("T")[0]
  });

  const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const minDate = lastWeek.toISOString().split("T")[0];

const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      [name]: value
    });
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      member_id    : member.member_id,
      amount       : Number(form.amount),
      payment_mode : form.payment_mode,
      payment_date : form.payment_date,
      plan_type    : form.plan_type
    }
    await api.post("/payments", payload);
    toast.success("Membership Renewed Successfully")
    onSuccess();
    onClose();
  } catch (error: any) {
    console.log("Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Renew Failed")
  }
} 

const calculateEndDate = () => {
  if (!form.payment_date) return "";

  const start = new Date(form.payment_date);
  const months = PLAN_DURATION[form.plan_type];

  const end = new Date(start);
  end.setMonth(end.getMonth() + months);

  return end.toLocaleDateString("en-IN");
};

return (
    <div className="modal-overlay">
      <div className="modal-card ">
        <h2>Renew Membership</h2>

        <p style={{ color: "#8a8aa0" }}>
          Renewing membership for <strong style={{ color: "white" }}>{member.member_name}</strong>
        </p>

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
            min={minDate}
            defaultValue={new Date().toISOString().split("T")[0]} 
            required
          />

          <p style={{ marginTop: "10px", color: "#00e676" }}>
            New Expiry Date: <strong>{calculateEndDate()}</strong>
          </p>

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