import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../../firebase/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getOrganizerCheckouts = createAsyncThunk(
    "checkouts/getOrganizerCheckouts",
    async (organizerId) => {
        try {
            const getCheckouts = query(
                collection(db, "checkouts"),
                where("organizerId", "==", organizerId)
            );

            const querySnapshot = await getDocs(getCheckouts);

            const checkouts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return checkouts;
        } catch (error) {
            return (error.message);
        }
    }
);