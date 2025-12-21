import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebase.config"; 
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth"; 
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaPhoneAlt, FaUserTag, FaUser, FaEnvelope, FaKey } from "react-icons/fa";

export default function UsersPageAD() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullName: "", role: "user", phone: "" });
  
  const [phoneError, setPhoneError] = useState("");

  // 1. Fetch Data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const validateEgyptianPhone = (phone) => {
    const regex = /^01[0125][0-9]{8}$/;
    return regex.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });

    if (name === "phone") {
        if (value && !validateEgyptianPhone(value)) {
            setPhoneError("Invalid number (must be 11 digits starting with 01)");
        } else {
            setPhoneError(""); 
        }
    }
  };

  const handleSendResetPassword = async () => {
    if (!editingUser?.email) return;
  
    try {
      await sendPasswordResetEmail(auth, editingUser.email);
      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: `A password reset link has been sent to ${editingUser.email}`,
        confirmButtonColor: "#0f9386",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send reset email. (User may not have a valid auth record)",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Handlers
  const handleEditClick = (user) => {
    setEditingUser(user);
    setPhoneError(""); 
    setEditFormData({
      fullName: user.fullName || user.name || "",
      role: user.role || "user",
      phone: user.phone || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

     if (!editFormData.fullName || !editFormData.fullName.trim()) {
      return Swal.fire({
        icon: 'error',
        text: 'Full Name cannot be empty.',
        confirmButtonColor: '#d33'
      });
    }

    // Validate Phone (Required)
    if (!editFormData.phone || !editFormData.phone.trim()) {
      return Swal.fire({
        icon: 'error',
        text: 'Phone Number cannot be empty.',
        confirmButtonColor: '#d33'
      });
    }

    // Validate Phone Format
    if (!validateEgyptianPhone(editFormData.phone)) {
        return Swal.fire({
            icon: 'error',
            title: 'Invalid Phone',
            text: 'Please enter a valid Egyptian number.',
            confirmButtonColor: '#d33'
        });
    }




    
    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, editFormData);
      
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === editingUser.id ? { ...user, ...editFormData } : user
      ));
      
      Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false });
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#0f9386",
      confirmButtonText: "Confirm"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "users", id));
          setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
          Swal.fire("Deleted!", "User removed.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };

  // Filtering & Pagination
  const filteredUsers = users.filter((user) => {
    if (!["user", "organizer"].includes(user.role)) return false;
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    
    const term = searchTerm.toLowerCase();
    return (
      (user.fullName || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term) ||
      (user.phone || "").includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, roleFilter]);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f9386]"></div></div>;

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50/50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          
          <p className="text-gray-500 text-xs md:text-lg mt-1">Manage user access and roles.</p>
        </div>
        <div className="bg-teal-500 px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 self-end md:self-auto">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-white  font-medium text-xs md:text-sm">Total: {filteredUsers.length}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email or phone.." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-[#0f9386] focus:ring-2 focus:ring-[#0f9386]/20 outline-none transition-all text-sm"
          />
        </div>
        
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
            <FaFilter className="text-[#0f9386] text-sm" />
            <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent outline-none text-gray-700 text-sm font-medium cursor-pointer w-full"
            >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="organizer">Organizers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-teal-600 text-white uppercase text-xx font-semibold">
            <tr>
              <th className="p-4 pl-6">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-teal-50/30 transition duration-200">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="avatar" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-800 text-md">{user.fullName || "Unknown"}</p>
                        <p className="text-md text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[13px] font-bold uppercase tracking-wide border
                      ${user.role === 'organizer' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-teal-50 text-teal-600 border-teal-100'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-semibold">{user.phone || "---"}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditClick(user)} className="p-2 rounded-lg text-teal-500 hover:bg-blue-50 transition"><FaEdit size={16} /></button>
                      <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"><FaTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="p-8 text-center text-gray-400 text-sm">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="avatar" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{user.fullName || "Unknown"}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${user.role === 'organizer' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-teal-50 text-teal-600 border-teal-100'}`}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs bg-gray-50 p-2 rounded-lg">
                <FaPhoneAlt size={10} /> <span className="font-mono">{user.phone || "No Phone"}</span>
              </div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => handleEditClick(user)} className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="flex-1 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8 text-sm">No users found.</div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-8 gap-3">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0f9386] disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
          >
            <FaChevronLeft size={14} />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm
                  ${currentPage === i + 1 
                    ? 'bg-[#0f9386] text-white shadow-md shadow-teal-200' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0f9386] hover:text-[#0f9386]'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0f9386] disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm md:max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-[#0f9386] px-6 py-5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaEdit className="opacity-80"/> Edit User Details
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition">✕</button>
            </div>
            
            <div className="p-8 space-y-5">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <FaUser size={10} /> Full Name
                </label>
                <input 
                    type="text" 
                    name="fullName"
                    value={editFormData.fullName} 
                    onChange={handleInputChange} 
                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0f9386] focus:ring-4 focus:ring-[#0f9386]/10 outline-none transition-all font-medium text-gray-700" 
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <FaUserTag size={10} /> Role
                </label>
                <div className="relative">
                    <select 
                        name="role"
                        value={editFormData.role} 
                        onChange={handleInputChange} 
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0f9386] focus:ring-4 focus:ring-[#0f9386]/10 outline-none transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                    >
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              {/* Phone + Live Validation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <FaPhoneAlt size={10} /> Phone Number
                </label>
                <input 
                    type="text" 
                    name="phone"
                    value={editFormData.phone} 
                    onChange={handleInputChange} 
                    className={`w-full p-3.5 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-all font-medium text-gray-700
                        ${phoneError ? 'border-red-500 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-[#0f9386] focus:ring-4 focus:ring-[#0f9386]/10'}
                    `}
                    placeholder="01xxxxxxxxx"
                />
                
                {phoneError ? (
                    <p className="text-xs text-red-500 font-bold animate-pulse mt-1 ml-1">{phoneError}</p>
                ) : (
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">* Must be a valid Egyptian number (11 digits)</p>
                )}
              </div>

              {/* ✅ 4. Password Reset Button */}
              <div className="pt-2 border-t border-gray-100 mt-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                    <FaKey size={10} /> Password Management
                </label>
                <button
                    type="button"
                    onClick={handleSendResetPassword}
                    className="w-full py-3 rounded-xl border border-dashed border-[#0f9386] text-[#0f9386] bg-teal-50 hover:bg-teal-100 transition-all font-bold text-sm flex items-center justify-center gap-2"
                >
                    <FaEnvelope /> Send Reset Email
                </button>
                <p className="text-[10px] text-gray-400 mt-1.5 text-center">* Sends an email to user to reset their password safely.</p>
              </div>

            </div>

            <div className="px-8 pb-8 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit} 
                className="px-8 py-2.5 rounded-xl bg-[#0f9386] text-white font-semibold shadow-lg shadow-teal-200 hover:bg-[#0b6e64] hover:shadow-teal-300 transition-all transform active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}