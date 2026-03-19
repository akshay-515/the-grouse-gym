import { useNavigate, useParams } from "react-router-dom"
import "./updatemember.css"
import { useEffect, useState } from "react";
import api from "../../../api/axios";

const EditMember = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        age: "",
        gender: "",
        joined_date: "",
    });

    const [loading, setLoading] = useState(false);
    
    const {id} = useParams();

    useEffect(() => {
        const fetchMember = async () => {
            try{
                setLoading(true);
                const existing = await api.get(`/members/${id}`);
                if(existing.data) {
                    const memberData = existing.data.data;
                    if(memberData.joined_date) {
                        memberData.joined_date = memberData.joined_date.split('T')[0];
                    }
                    setForm(existing.data.data);
                }
                console.log("the members", existing.data)
                
            } catch (error){
                console.error("Coundn't find member", error);
            } finally {
                setLoading(false)
            }
        }
        if(id) {
         fetchMember();   
        }  
    }, [id]);


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            const response = await api.put(`/members/${id}`, form);
            if(response.data){
                alert("Member updated succesfully");
            }
            console.log("the updated members :",response.data);
            navigate("/members")
        } catch (error){
            console.error("couldn't updated members", error)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setForm({
            ...form,
            [name]: value
        });
    }

    return(
        <div className="member-container">
            <div className="member-header">
                <h2>Update Member</h2>
                <p className="sub-text">Modify member details</p>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit} className="member-form">

                <div className="form-group">
                    <label>Name</label>
                    <input 
                    name="name"
                    placeholder="Enter member name"
                    value={form.name}
                    onChange={handleChange} 
                    />
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input 
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
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
                    />
                    </div>

                    <div className="form-group">
                    <label>Gender</label>
                    <select 
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
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
                    />
                </div>
                <button type="submit" className="submit-btn update-btn">
                    {loading ? "Updating..." : "Update Member"}
                </button>
                </form>
            </div>
        </div>
    )
}

export default EditMember;