import { useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import AuthLayout from "../components/AuthLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
//   const oobCode = params.get("oobCode"); // get the oobCode from url
const oobCode = new URLSearchParams(window.location.search).get("oobCode");

  // password rules
  const passwordRules = [
    { check: password.length >= 6, text: "please enter at least 6 characters" },
    { check: /[0-9]/.test(password), text: "please enter at least one number" },
    { check: /[!@#$%^&*]/.test(password), text: "please enter at least one special character" },
  ];

  const isValidPassword = passwordRules.every(rule => rule.check);
  const failedRules = passwordRules.filter(rule => !rule.check);
  const isConfirmed = password === confirm;

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPassword) {
      setError(
      <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
        {failedRules.map((rule, index) => (
        <li key={index}>{rule.text}</li>
        ))}
      </ul>
      );
      return;
    }

    if (!isConfirmed) {
      return setError("Passwords do not match.");
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess("Password reset successful! Redirecting...");
      setTimeout(() => navigate("http://localhost:5173/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
        <div className="relative w-full">
    <img 
      src="/ticket.png"   
      alt="ticket" 
      className="absolute -top-8 left-1/2 -translate-x-1/2 w-25 "
    />
  </div>
      <h2 className="text-xl font-bold font-serif text-center mb-4 mt-6">Reset Password</h2>
      {/* <div className="absolute top-1 -right-12 bg-[#aa7e61] text-white font-bold w-80 py-3 shadow-md text-center text-xl rotate-[20deg]">
        <div className="ml-9">Set New Password</div>
      </div> */}

      <form onSubmit={handleReset} className="space-y-4">

        {/* New Password */}
         <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="auth-input"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="eye-btn" onClick={() => setShow(!show)}>
          {show ?<FaEye /> : <FaEyeSlash />}
           </span>
        </div>
        {/* Password Requirements UI */}
        {/* <ul className="text-sm space-y-1">
          {passwordRules.map((item, i) => (
            <li key={i} className={item.check ? "text-green-600" : "text-gray-600"}>
              {item.text}
            </li>
          ))}
        </ul> */}

        {/* Confirm Password */}
         <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="auth-input"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <span className="eye-btn" onClick={() => setShow(!show)}>
          {show ?<FaEye /> : <FaEyeSlash />}
           </span>
        </div>
        {!isConfirmed && confirm.length > 0 && (
          <p className="text-red-600 text-sm">Passwords do not match</p>
        )}

        {/* error / success messages */}
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        
        <button className="w-full py-3 text-white rounded font-semibold mt-4"
          style={{ background: "#0f9386" }}
        >
          Reset Password
        </button>
      </form>
    </AuthLayout>
  );
}