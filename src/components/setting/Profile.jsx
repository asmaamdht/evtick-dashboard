import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, logoutUser } from "../../auth/authSlice"; 

import { auth, db } from "../../firebase/firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  updateProfile 
} from "firebase/auth";

import Swal from "sweetalert2";
const PREDEFINED_AVATARS = [
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140047.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
  "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
  "https://cdn-icons-png.flaticon.com/512/4128/4128176.png",
  "https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
  "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
];

// Icons
const EyeIcon = () => (
  <svg className="w-5 h-5 text-gray-500 hover:text-[#0f9386] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);
const EyeSlashIcon = () => (
  <svg className="w-5 h-5 text-gray-500 hover:text-[#0f9386] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
);

export default function SettingPage() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarTab, setAvatarTab] = useState("select");

  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePic: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        profilePic: currentUser.profilePic || "", 
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid) return Swal.fire( "User not found!", "error");

    try {
      const updatedFields = {};

      if (formData.fullName !== currentUser.fullName) updatedFields.fullName = formData.fullName;
      if (formData.phone !== currentUser.phone) updatedFields.phone = formData.phone;
      if (formData.profilePic !== currentUser.profilePic) updatedFields.profilePic = formData.profilePic;

      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Passwords do not match!",
            confirmButtonColor: "#0f9386",
          });
        }
        if (!formData.oldPassword) {
          return Swal.fire({
            icon: "warning",
            title: "Old Password Required",
            text: "Please enter your current password to confirm changes.",
            confirmButtonColor: "#0f9386",
          });
        }

        const credential = EmailAuthProvider.credential(auth.currentUser.email, formData.oldPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, formData.password);
        
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Password updated successfully!",
          timer: 1500,
          showConfirmButton: false
        });
      }

      if (Object.keys(updatedFields).length > 0) {
        Swal.fire({
          title: 'Saving...',
          didOpen: () => {
            Swal.showLoading()
          }
        });

        // Update Firestore
        await updateDoc(doc(db, "users", currentUser.uid), updatedFields);
        
        // Update Firebase Auth Profile
        if (updatedFields.profilePic || updatedFields.fullName) {
            await updateProfile(auth.currentUser, {
                displayName: updatedFields.fullName || currentUser.fullName,
                photoURL: updatedFields.profilePic || currentUser.profilePic
            });
        }

        // Update Redux
        const updatedUserObj = { ...currentUser, ...updatedFields };
        dispatch(setUser(updatedUserObj));
        
        // Success Alert
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Profile updated successfully!",
          confirmButtonColor: "#0f9386",
          timer: 2000
        });
      }

      setIsEditing(false);
      setFormData(prev => ({ ...prev, oldPassword: "", password: "", confirmPassword: "" }));

    } catch (error) {
      console.error(error);
      let errorMsg = error.message;
      if (error.code === "auth/wrong-password") errorMsg = "Incorrect Old Password!";
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#d33",
      });
    }
  };

  // const handleLogout = () => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You will be logged out!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#0f9386',
  //     confirmButtonText: 'Yes, Logout!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       dispatch(logoutUser());
  //     }
  //   })
  // };

  return (
    <div className="w-full  mx-auto relative">
      
      {/* Header */}
      <div className=" justify-between flex-column md:flex items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Profile Settings</h2>
          <p className="text-gray-600 text-sm">Manage your account info</p>
        </div>
        <div className="flex gap-3 mt-3 md:mt-0">
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#0f9386] text-white px-5 py-2 w-full rounded-lg hover:bg-[#0b6e64] transition shadow-sm font-medium"
            >
              Edit Profile
            </button>
          )}
        
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible relative">
        <div className="h-32 bg-gradient-to-r from-[#0f9386] to-[#085f56] rounded-t-2xl"></div>
        
        <div className="px-8 pb-8">
          
          {/* Avatar Section */}
          <div className="relative -mt-12 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative group">
              <img 
                src={formData.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                className="w-32 h-40 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
                alt="Profile"
              />
              
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full hover:bg-[#0f9386] transition shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              )}
            </div>

            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{formData.fullName || "User Name"}</h1>
              <p className="text-gray-500 font-medium">{formData.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold bg-white text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl bg-white text-gray-700  border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-[#0f9386]' : 'border-gray-100 bg-gray-50 text-gray-600'} transition-all outline-none`}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl bg-white text-gray-700 border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-[#0f9386]' : 'border-gray-100 bg-gray-50 text-gray-600'} transition-all outline-none`}
                />
              </div>

              {/* Email  */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full p-3 rounded-xl border border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Password Section */}
              {isEditing && (
                <div className="md:col-span-2 mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     
                     {/* New Password */}
                     <div className="relative">
                      <label className="text-xs font-semibold  text-gray-500">New Password</label>
                      <input 
                        type={showPass.new ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="w-full mt-1 p-2 rounded-lg bg-white text-gray-700 border border-gray-300 focus:border-[#0f9386] outline-none bg-white pr-10" 
                      />
                      <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-3 top-8">
                        {showPass.new ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <label className="text-xs font-semibold text-gray-500">Confirm Password</label>
                      <input 
                        type={showPass.confirm ? "text" : "password"} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        className="w-full mt-1 p-2 rounded-lg bg-white text-gray-700 border border-gray-300 focus:border-[#0f9386] outline-none bg-white pr-10" 
                      />
                      <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-3 top-8">
                        {showPass.confirm ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {/* Old Password */}
                    <div className="md:col-span-2 relative">
                      <label className="text-xs font-bold text-red-500">Old Password (Required to save changes)</label>
                      <input 
                        type={showPass.old ? "text" : "password"} 
                        name="oldPassword" 
                        value={formData.oldPassword} 
                        onChange={handleChange} 
                        className="w-full mt-1 p-2 rounded-lg bg-white text-gray-700 border border-red-200 focus:border-red-500 bg-white outline-none pr-10" 
                        placeholder="Enter current password..." 
                      />
                      <button type="button" onClick={() => setShowPass({...showPass, old: !showPass.old})} className="absolute right-3 top-8">
                        {showPass.old ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="mt-8 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(prev => ({...prev, fullName: currentUser.fullName, phone: currentUser.phone, profilePic: currentUser.profilePic}));
                  }}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#0f9386] text-white hover:bg-[#0b6e64] shadow-md font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-[#0f9386] p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Choose Avatar</h3>
              <button onClick={() => setShowAvatarModal(false)} className="hover:bg-white/20 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                <button onClick={() => setAvatarTab("select")} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${avatarTab === "select" ? "bg-white shadow text-[#0f9386]" : "text-gray-500 hover:text-gray-700"}`}>Select Avatar</button>
                <button onClick={() => setAvatarTab("link")} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${avatarTab === "link" ? "bg-white shadow text-[#0f9386]" : "text-gray-500 hover:text-gray-700"}`}>Use Link</button>
              </div>
              <div className="min-h-[200px]">
                {avatarTab === "select" ? (
                  <div className="grid grid-cols-4 gap-4">
                    {PREDEFINED_AVATARS.map((av, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => { setFormData({...formData, profilePic: av}); setShowAvatarModal(false); }}
                        className={`border-2 rounded-xl p-1 hover:border-[#0f9386] hover:bg-teal-50 transition ${formData.profilePic === av ? 'border-[#0f9386] bg-teal-50' : 'border-transparent'}`}
                      >
                        <img src={av} alt="avatar" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 mt-6">
                    <label className="text-sm text-gray-600 font-medium">Paste Image URL</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com/image.png"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#0f9386] outline-none"
                      onChange={(e) => setFormData({...formData, profilePic: e.target.value})}
                    />
                    <button onClick={() => setShowAvatarModal(false)} className="mt-2 bg-[#0f9386] text-white py-2 rounded-lg">Confirm URL</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}