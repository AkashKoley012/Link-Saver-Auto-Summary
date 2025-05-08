"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
// import Link from "next/link";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const googleProvider = new GoogleAuthProvider();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (err) {
            setError("Failed to create account");
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push("/dashboard");
        } catch (err) {
            setError("Failed to sign up with Google");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl text-gray-600 font-bold mb-6">Sign Up</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-gray-400 p-2 border rounded" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-gray-400 p-2 border rounded" required />
                    </div>
                    <button type="submit" className="w-full cursor-pointer bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Sign Up
                    </button>
                </form>
                <button onClick={handleGoogleSignup} className="w-full mt-4 cursor-pointer bg-gray-800 text-white p-2 rounded hover:bg-gray-900 flex items-center justify-center gap-2">
                    <img src="https://www.google.com/favicon.ico" alt="Google Logo" className="w-6 h-6" />
                    Sign up with Google
                </button>
            </div>
        </div>
    );
}
