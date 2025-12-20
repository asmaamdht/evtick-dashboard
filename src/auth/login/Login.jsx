import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../authSlice";
 import { showLoginSuccess } from "../../admin/components/events/SweetAlert.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);


  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firebase: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "", firebase: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

const handleLogin = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (!snap.exists()) throw new Error("User profile not found!");

    const userData = snap.data();

    // role validation
    if (!userData.role || !["admin", "organizer"].includes(userData.role)) {
      setErrors((prev) => ({
        ...prev,
        firebase: "Invalid email and password.",
      }));

      // Logout
      await auth.signOut();
      localStorage.removeItem("user");
      return;
    }

    
    const safeUser = {
      uid: cred.user.uid,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      profilePic: userData.profilePic,
      eventOwner: userData.eventOwner,
      role: userData.role,
    };

    localStorage.setItem("user", JSON.stringify(safeUser));
    dispatch(setUser(safeUser));
      showLoginSuccess("You Have Successfully logged in!", userData.fullName || "User");
    // redirect based on role
    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }

   }catch (err) {
  let msg = "";

  switch (err.code) {
    case "auth/invalid-email":
      msg = "Invalid email address.";
      break;
    case "auth/user-not-found":
    case "auth/wrong-password":
      case "auth/invalid-credential":
      msg = "Wrong email or password.";
      break;
    case "auth/too-many-requests":
      msg = "Too many attempts. Try again later.";
      break;
    default:
      msg = "Something went wrong. Please try again later.";
  }
    setErrors((prev) => ({ ...prev, firebase: msg }));
  }finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="relative w-full">
        <img 
          src="/ticket.png"
          alt="ticket"
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-24"
        />
      </div>

      <h2 className="font-serif text-xl font-bold mb-4 text-center mt-6">
        Log in
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">

        {/* email */}
        <div>
          <input
            type="email"
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#0f9386] focus:ring-1 focus:ring-[#0f9386] transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* pass*/}
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#0f9386] focus:ring-1 focus:ring-[#0f9386] transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 cursor-pointer"
            onClick={() => setShow(!show)}
          >
            {show ? <FaEye /> : <FaEyeSlash />}
          </span>

          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.firebase && (
          <p className="text-red-400 text-sm text-center">{errors.firebase}</p>
        )}

        {/* forgot pass */}
        <p className="text-sm font-medium mt-2 text-right text-[#0f9386]">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        {/* submit btn*/}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#0f9386] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
        >
           {loading ? (
    <div className="flex items-center justify-center gap-2">
      <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
      Signing in...
    </div>
  ) : (
    "Sign in"
  )}
          {/* Sign in */}
        </button>

      </form>

      
    </>
  );
}