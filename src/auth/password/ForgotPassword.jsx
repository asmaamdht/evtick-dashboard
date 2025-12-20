import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { db } from "../../firebase/firebase.config"; 
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

   const normalizedEmail = email.trim().toLowerCase();

    try {
      //check if email exists in Firestore
      const q = query(
        collection(db, "users"),
        where("email", "==", normalizedEmail)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setMessage("Wrong Email.");
        return;
      }

      // If exists in Firestore, send reset email via Firebase Auth
      await sendPasswordResetEmail(auth, normalizedEmail, {
        url: "http://localhost:5173/reset-password",
        handleCodeInApp: true,
      });

      setMessage("Password reset link sent! Check your email.");
    } catch (error) {
      const code = error?.code || "";
      if (code === "auth/invalid-email") setMessage("Invalid email address.");
      else setMessage(error.message);
    } finally {
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
         disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition mt-4
        ${loading ? "bg-[#0f9386]/70 cursor-not-allowed" : "bg-[#0f9386] hover:opacity-90"}
      `}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
            Sending Link...
          </div>
        ) : (
          "Send Reset Link"
        )}
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
