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
            <h2 className="updatemember-heading">Update Member</h2>
            <form onSubmit={handleSubmit} className="member-form">
                <input 
                  name="name"
                  placeholder="New Member Name"
                  value={form.name}
                  onChange={handleChange} 
                />

                <input 
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />

                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}  
                />

                <select 
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
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
                />

                <button type="submit">
                    {loading ? "Updating..." : "Update Member"}
                </button>
            </form>
        </div>
    )
}

export default EditMember;