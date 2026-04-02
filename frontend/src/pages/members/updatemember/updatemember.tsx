import { useNavigate, useParams } from "react-router-dom"
import "./updatemember.css"
import { useEffect, useState } from "react";
import { User, Phone, Hash, Calendar, RefreshCw } from "lucide-react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

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
                toast.success("Member updated succesfully")
            }
            console.log("the updated members :",response.data);
            navigate("/members")
        } catch (error: any){
            toast.error(error)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target

        if(name === "phone") {
            const numericValue = value.replace(/\D/g, "");
            const truncated = numericValue.slice(0,10);

            setForm({
                ...form,
                [name]: truncated
            })
        } else if (name === "age") {
            const numericAge = value.replace(/\D/g, "")
            const truncatedAge = numericAge.slice(0,2);
                if(truncatedAge === "" || Number(truncatedAge) >=0) {
                setForm({
                    ...form,
                    [name]: truncatedAge
                });
          }
        } else {
            setForm({
            ...form,
            [name]: value
        }); 
        }
    }

return (
    <div className="admin-page-wrapper">
        <div className="page-header">
            <div className="header-text">
                <h1>Update Member</h1>
                <p className="subtitle">Modify member details for ID: {id}</p>
            </div>
            <div className="header-icon-box">
                <RefreshCw size={24} color="var(--accent-orange)" />
            </div>
        </div>

        <div className="glass-form-card">
            <form onSubmit={handleSubmit} className="elite-form">
                
                <div className="input-container">
                    <label><User size={14} /> Full Name</label>
                    <input 
                        name="name"
                        placeholder="Enter member name"
                        value={form.name}
                        onChange={handleChange} 
                    />
                </div>

                <div className="input-container">
                    <label><Phone size={14} /> Phone Number</label>
                    <input 
                        type="text"
                        inputMode="numeric"
                        name="phone"
                        placeholder="Enter phone number"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="input-container flex-1">
                        <label><Hash size={14} /> Age</label>
                        <input
                            name="age"
                            type="text"
                            inputMode="numeric"
                            placeholder="Age"
                            value={form.age}
                            onChange={handleChange}  
                        />
                    </div>

                    <div className="input-container flex-1">
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

                <div className="input-container">
                    <label><Calendar size={14} /> Joining Date</label>
                    <input 
                        className="elite-date-picker"
                        name="joined_date" 
                        type="date"
                        value={form.joined_date}
                        onChange={handleChange} 
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="elite-submit-btn update-accent" disabled={loading}>
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}

export default EditMember;