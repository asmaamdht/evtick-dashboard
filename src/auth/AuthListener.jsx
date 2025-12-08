import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { setUser, setRole, setLoading } from "./authSlice";
//import { useNavigate } from "react-router-dom";

export default function AuthListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // if NO user logged in
      if (!user) {
        dispatch(setUser(null));
        dispatch(setRole(null));
        dispatch(setLoading(false));
        return;
      }

      // get extra user data from Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      //const role = snap.exists() ? snap.data().role : "user";

      // Build light user object to store in Redux + localStorage
      const userData = {
        uid: user.uid,
        email: user.email ?? null,
        phoneNumber: user.phone  ?? null,
        fullName: snap.exists() ? snap.data().fullName : null,
      };

      dispatch(setUser(userData)); // saves to redux and localStorage
      dispatch(setRole(snap.exists() ? snap.data().role : null));
      dispatch(setLoading(false));

     
    });

    return unsubscribe;
  }, [dispatch]);

  return children;
}