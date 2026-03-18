import React, { useState } from "react"
import { createMember } from "../../../api/member.api";
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

    setForm({
        ...form,
        [name]: value
    });
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
    <div className="member-container">
      <div className="member-header">
        <h2>Add New Member</h2>
        <p className="sub-text">Enter member details to register</p>
      </div>

      <div className="form-card">
        <form className="member-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>
            <input 
              name="name"
              placeholder="Enter member name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input 
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input 
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select 
                name="gender" 
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Joining Date</label>
            <input 
              name="joined_date"
              type="date"
              value={form.joined_date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {loading ? "Adding..." : "Add Member"}
          </button>

        </form>
      </div>

    </div>
    );
};

export default AddMember;