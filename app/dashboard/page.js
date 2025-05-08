"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [url, setUrl] = useState("");
    const [bookmarks, setBookmarks] = useState([]);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            } else {
                fetchBookmarks(user.uid);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchBookmarks = async (userId) => {
        const res = await fetch(`/api/bookmarks?userId=${userId}`);
        const data = await res.json();
        setBookmarks(data);
    };

    const handleSaveBookmark = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, userId: auth.currentUser.uid }),
            });
            if (res.ok) {
                setUrl("");
                fetchBookmarks(auth.currentUser.uid);
            } else {
                setError("Failed to save bookmark");
            }
        } catch (err) {
            setError("Error saving bookmark");
        }
    };

    const handleDeleteBookmark = async (id) => {
        try {
            await fetch("/api/bookmarks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, userId: auth.currentUser.uid }),
            });
            fetchBookmarks(auth.currentUser.uid);
        } catch (err) {
            setError("Error deleting bookmark");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl text-gray-400 font-bold">Bookmark Dashboard</h1>
                    <button onClick={() => auth.signOut()} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                        Sign Out
                    </button>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSaveBookmark} className="mb-8">
                    <div className="flex gap-4">
                        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a URL (e.g., https://example.com)" className="flex-1 p-2 border text-gray-700 rounded" required />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer">
                            Save Bookmark
                        </button>
                    </div>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarks.map((bookmark) => (
                        <div key={bookmark._id} className="bg-white p-4 rounded shadow-md flex gap-4">
                            {bookmark.favicon && <img src={bookmark.favicon} alt="Favicon" className="w-6 h-6" onError={(e) => (e.target.style.display = "none")} />}
                            <div className="flex-1">
                                <h2 className="text-lg text-black font-semibold">{bookmark.title}</h2>
                                <p className="text-gray-600 text-sm mb-2">
                                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                                        {bookmark.url}
                                    </a>
                                </p>
                                <p className="text-gray-700">{bookmark.summary}</p>
                                <button onClick={() => handleDeleteBookmark(bookmark._id)} className="mt-2 text-red-500 hover:text-red-700 cursor-pointer">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
