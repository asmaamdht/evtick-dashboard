import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:5173/reset-password",
        handleCodeInApp: true,
      });
      setMessage("Password reset link sent! Check your email.");
    } catch (error) {
      setMessage(error.message);
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

      <h2 className="text-xl font-serif font-bold mb-4 text-center mt-6">
        Reset Password
      </h2>

      <form onSubmit={handleReset} className="space-y-4">

        {/* INPUT */}
        <input
          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg 
                     text-white placeholder-white/60 
                     focus:outline-none focus:border-[#0f9386] 
                     focus:ring-1 focus:ring-[#0f9386] transition"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* MESSAGE */}
        {message && (
          <p className="mt-1 text-sm text-center text-teal-400">
            {message}
          </p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 bg-[#0f9386] text-white font-semibold rounded-lg shadow-md 
                     hover:opacity-90 transition"
        >
          Send Reset Link
        </button>
      </form>

      {/* BACK TO LOGIN */}
      <p className="mt-4 text-sm text-center text-white/90">
        Back to{" "}
        <Link to="/" className="text-[#0f9386] font-bold">
          Login
        </Link>
      </p>
    </>
  );
}
