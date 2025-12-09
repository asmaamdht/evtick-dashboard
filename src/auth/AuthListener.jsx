import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import { setUser, setRole, setLoading } from "./authSlice";
//import { useNavigate } from "react-router-dom";

export default function AuthListener({ children }) {  //without it, app won't know user is logged in after refresh.
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // if no user logged in (on logout, clears redux and localStorage)
      if (!user) {
        dispatch(setUser(null));
        dispatch(setRole(null));
        dispatch(setLoading(false));
        return;
      }

      // get user data from Firestore
      const snap = await getDoc(doc(db, "users", user.uid));
      //const role = snap.exists() ? snap.data().role : "user";

      // Build light user object to store in Redux + localStorage
      const userData = {
        uid: user.uid,
        email: user.email ?? null,
        // phoneNumber: user.phoneNumber ?? null,
        fullName: snap.exists() ? snap.data().fullName : null,
        ...snap.data()
      };

      dispatch(setUser(userData)); // saves to/updates redux and localStorage (make it available anywhere)
      dispatch(setRole(snap.exists() ? snap.data().role : null));
      dispatch(setLoading(false));

     
    });

    return unsubscribe;
  }, [dispatch]);

  return children;
}