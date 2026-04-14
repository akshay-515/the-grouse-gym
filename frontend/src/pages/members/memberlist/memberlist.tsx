import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import "./memberlist.css";
import { Search, UserPlus, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Popconfirm, message } from "antd";
import toast from "react-hot-toast";

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
      console.log("the members:", response.data.data);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const deleteMember = async (id: number) => {
    try{
      await api.delete(`/members/${id}`);
      fetchMembers();
      message.success("Member deleted successfully");
    } catch (error) {
      console.error("Delete Failed", error);
      toast.error("Could delete member");
    }
  };

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
  <div className="members-view-wrapper">
    <div className="members-header-section">
      <div className="header-text">
        <h1>Members</h1>
        <p className="sub-subtitle">Manage and monitor all gym members</p>
      </div>

      <div className="header-controls">
        <div className="elite-search-bar">
          <Search size={18} className="s-icon" />
          <input 
            placeholder="Search member..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <button className="elite-add-btn" onClick={() => navigate("/members/add")}>
          <UserPlus size={18} /> + Add Member
        </button>
      </div>
    </div>

    <div className="elite-table-card">
      <table className="original-structure-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Joined Date</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.length === 0 ? (
            <tr><td colSpan={8} className="no-data">No members found</td></tr>
          ) : (
            paginatedMembers.map((member, index) => (
              <tr key={member.id}>
                <td>{(page - 1) * rowsPerPage + index + 1}</td>
                <td className="id-cell">{member.id}</td>
                <td className="name-cell">{member.name}</td>
                <td>{member.phone}</td>
                <td>{member.age}</td>
                <td className="gender-cell">
                  {member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}
                </td>
                <td>{new Date(member.joined_date).toLocaleDateString()}</td>
                <td className="actions-flex-cell">
                  <button
                    className="action-icon-btn edit-v"
                    onClick={() => navigate(`/members/edit/${member.id}`)}
                  >
                    <Edit3 size={16} /> <span>Edit</span>
                  </button>
                  <Popconfirm
                    title="Delete the member"
                    description="Are you sure to delete this member?"
                    onConfirm={() => deleteMember(member.id)}
                    okText="yes"
                    cancelText="No"
                  >
                    <button
                      className="action-icon-btn delete-v"
                      // onClick={() => deleteMember(member.id)}
                    >
                      <Trash2 size={16} /> <span>Delete</span>
                  </button>
                  </Popconfirm>
                  
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {totalPages > 1 && (
      <div className="elite-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-btn">
          <ChevronLeft size={18} /> Prev
        </button>
        <span className="p-info">Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-btn">
          Next <ChevronRight size={18} />
        </button>
      </div>
    )}
  </div>
);
};

export default MemberList;