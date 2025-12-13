import { BsBoxArrowRight } from "react-icons/bs";
import { logoutUser } from "../../auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/");
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
