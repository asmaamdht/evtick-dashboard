import React, { useState } from 'react';
import { collection, addDoc} from 'firebase/firestore';
import { db } from '../../../firebase/firebase.config';

const ModelUploader = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const generateMediumSeats = () => {
        const rows = ["A", "B", "C", "D", "E", "F", "G"];
        const seatsPerRow = 12;
        const seats = [];

        rows.forEach(row => {
            for (let i = 1; i <= seatsPerRow; i++) {
                seats.push({
                    id: `${row}${i}`,
                    row: row,
                    number: i,
                    status: 'available'
                });
            }
        });
        return seats;
    };

    const generateSmallSeats = () => {
        const seats = [];

        // Helper to generate section seats
        const generateSection = (rows, countPer, prefix, sectionName) => {
            let globalCounter = 1;
            rows.forEach(() => {
                for (let i = 1; i <= countPer; i++) {
                    seats.push({
                        id: `${prefix}${globalCounter}`,
                        row: prefix, // Using prefix as row identifier (L, C, R) matching the consumption logic
                        number: globalCounter,
                        section: sectionName,
                        status: 'available'
                    });
                    globalCounter++;
                }
            });
        };

        // Configuration from SmallData.jsx
        const leftRows = [1, 2, 3, 4, 5];
        const centerRows = [1, 2, 3, 4, 5, 6];
        const rightRows = [1, 2, 3, 4, 5];

        generateSection(leftRows, 4, "L", "Left");
        generateSection(centerRows, 10, "C", "Center");
        generateSection(rightRows, 4, "R", "Right");

        return seats;
    };

    const uploadModels = async () => {
        setLoading(true);
        setMessage('Uploading...');

        try {
            const collectionRef = collection(db, 'seatModel');

            // 1. Medium Model
            const mediumSeats = generateMediumSeats();
            await addDoc(collectionRef, {
                name: 'Medium',
                seats: mediumSeats,
                createdAt: new Date()
            });

            // 2. Small Model
            const smallSeats = generateSmallSeats();
            await addDoc(collectionRef, {
                name: 'Small',
                seats: smallSeats,
                createdAt: new Date()
            });

            setMessage('Success! "Medium" and "Small" models uploaded to "seatModel" collection.');
        } catch (error) {
            console.error("Error uploading models: ", error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow-md bg-white">
            <h3 className="text-lg font-bold mb-4">Seat Model Uploader</h3>
            <p className="mb-4 text-sm text-gray-600">
                Click below to generate and upload "Small" and "Medium" seat models to Firestore.
            </p>

            <button
                onClick={uploadModels}
                disabled={loading}
                className={`px-4 py-2 rounded text-white font-medium transition-colors ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {loading ? 'Uploading...' : 'Upload Models'}
            </button>

            {message && (
                <div className={`mt-4 p-2 rounded text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default ModelUploader;
