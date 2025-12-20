import { BsBoxArrowRight } from "react-icons/bs";
import { logoutUser } from "../../../auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase.config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LogoutButtonAD() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

 const logout = async () => {
     
     const result = await Swal.fire({
       title: "Are you sure?",
       text: "You will be logged out from your account.",
       icon: "question",
       showCancelButton: true,
       confirmButtonColor: "#0F9386",
       cancelButtonColor: "gray",
       confirmButtonText: "Yes, log out",
       cancelButtonText: "Cancel",
     });
 
     if (result.isConfirmed) {
       
       await signOut(auth);
       dispatch(logoutUser());
       navigate("/"); 
     }
   };

  return (
    <button
      onClick={logout}
      className="
        w-9 h-9 grid place-items-center rounded-lg mb-6 text-xl transition duration-300
        bg-[#353839] text-[#F2F3F4] hover:text-white
      "
    >
      <BsBoxArrowRight />
    </button>
  );
}
