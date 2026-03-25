import React, { useState } from "react"
import { createMember } from "../../../api/member.api";
import { UserPlus, Phone, Calendar, User, Hash } from "lucide-react";
import "./addmember.css"

const AddMember = () => {
    const [form, setForm] = useState({
      name: "",
      phone: "",
      age: "",
      gender: "",
      joined_date: "",
    });

const [loading , setLoading] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;

    if(name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      const truncateValue = numericValue.slice(0,10);

      setForm({
        ...form,
        [name]: truncateValue
      });
    } else if (name === "age") {
      const numericAge = value.slice(0,2);
        if(parseInt(numericAge) > 0) {
          setForm({
          ...form,
          [name]: numericAge
        })
      }    
    } else {
        setForm({
          ...form,
          [name]: value,
      });
    }
};

const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        setLoading(true);
        await createMember(form);
        alert("member created successfully");
        setForm({
          name: "",
          phone: "",
          age: "",
          gender: "",
          joined_date: "", 
        });
    } catch (error) {
        console.error(error);
        alert("failed to create member");
    } finally {
        setLoading(false);
    };
}; 

return (
  <div className="admin-page-wrapper">
    <div className="page-header">
      <div className="header-text">
        <h1>Add New Member</h1>
        <p className="subtitle">Enter member details to register them in the system</p>
      </div>
      <div className="header-icon-box">
        <UserPlus size={24} color="var(--accent-blue)" />
      </div>
    </div>

    <div className="glass-form-card">
      <form className="elite-form" onSubmit={handleSubmit}>
        <div className="add-member-form-section">
          <div className="input-container">
            <label><User size={14} /> Full Name</label>
            <input 
              name="name"
              placeholder="Enter Name..."
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <label><Phone size={14} /> Phone Number</label>
            <input 
              type="number"
              name="phone"
              placeholder="Enter Phone..."
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-container flex-1">
            <label><Hash size={14} /> Age</label>
            <input 
              name="age"
              type="number"
              placeholder="Enter Age..."
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container flex-1">
            <label>Gender</label>
            <select 
              name="gender" 
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="" hidden>Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="input-container">
          <label><Calendar size={14} /> Joining Date</label>
          <div className="date-input-wrapper">
            <input 
              className="elite-date-picker"
              name="joined_date"
              type="date"
              value={form.joined_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="elite-submit-btn" disabled={loading}>
            {loading ? (
              <span className="loader-text">Processing...</span>
            ) : (
              <>Register Member <UserPlus size={18} /></>
            )}
          </button>
        </div>

      </form>
    </div>
  </div>
);
};

export default AddMember;