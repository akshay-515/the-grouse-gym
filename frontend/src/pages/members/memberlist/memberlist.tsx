import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "./memberlist.css"

interface Member {
  id: number;
  name: string;
  phone: string;
  age: number;
  gender: string;
  joined_date: string;
}

const MemberList = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch]   = useState("");
  const [page , setPage]      = useState(1);
  
  const rowsPerPage = 7;

  const fetchMembers = async () => {
    try {
      const response = await api.get("/members");
      setMembers(response.data.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const deleteMember = async (id: number) => {
    if(!confirm("delete this member?")) return;

    try{
      await api.delete(`/members/${id}`);
      fetchMembers();
    } catch (error) {
      console.error("Delete Failed", error);
    }
  };

  // const editMember = async (id: number) => {
  //   try{
  //     await api.put(`/members/${id}`);
  //   } catch (error) {
  //     console.error("Unable to edit members", error);
  //   }
  // }

  const filteredMembers = members.filter((m) => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedMembers = filteredMembers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / rowsPerPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredMembers, totalPages]);

  return (
    <div className="members-container">
      <div className="members-header">
        <div className="header-left">
          <h3>Members</h3>
          <p className="sub-text">Manage all gym members</p>
        </div>

        <div className="header-right">
          <input 
            className="search-input"
            placeholder="Search member..."
            value={search}
            onChange={(e) =>{
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button 
            className="add-btn"
            onClick={() => navigate("/members/add")}
          >
            + Add Member
          </button>
        </div>
      </div>

      <div className="table-wrapper">
                <table className="members-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                  No members found
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.phone}</td>
                  <td>{member.age}</td>
                  <td>
                    {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}
                  </td>
                  <td>{new Date(member.joined_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/members/edit/${member.id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteMember(member.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled = {page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            next
          </button>
        </div>
    </div>
  );
};

export default MemberList;