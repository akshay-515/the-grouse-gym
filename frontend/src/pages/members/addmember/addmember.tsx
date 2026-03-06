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

const handleSubmit = async (e: React.FormEvent) => {
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
        <h2>Add New Member</h2>
        <form className="member-form" onSubmit={handleSubmit}>
            <input 
              name="name"
              placeholder="Member Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input 
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input 
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />

            <select 
              name="gender" 
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input 
              name="joined_date"
              type="date"
              value={form.joined_date}
              onChange={handleChange}
              required
            />

            <button type="submit">
                {loading ? "Adding..." : "Add Memeber"}
            </button>
        </form>
    </div>
    );
};

export default AddMember;