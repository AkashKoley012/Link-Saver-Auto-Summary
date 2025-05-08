import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/mongodb";
import axios from "axios";

export async function POST(req) {
    try {
        const { url, userId } = await req.json();
        const { db } = await connectToDatabase();

        // Fetch title and favicon
        let title = "";
        let favicon = "";
        try {
            const response = await axios.get(url);
            const html = response.data;
            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            title = titleMatch ? titleMatch[1] : url;

            const faviconMatch = html.match(/<link[^>]*rel=["']?(shortcut icon|icon)["']?[^>]*href=["']([^"']+)["'][^>]*>/i);
            favicon = faviconMatch ? faviconMatch[2] : url;
            favicon = new URL("/favicon.ico", url).href;
        } catch (err) {
            title = url;
            favicon = "";
        }

        // Fetch summary from Jina AI
        let summary = "";
        try {
            const encodedUrl = encodeURIComponent(url);
            const response = await axios.get(`https://r.jina.ai/${encodedUrl}`);
            summary = response.data.slice(0, 200); // Trim to 200 chars
        } catch (err) {
            summary = "Summary temporarily unavailable.";
        }

        // Save to MongoDB
        const bookmark = {
            userId,
            url,
            title,
            favicon,
            summary,
            createdAt: new Date(),
        };
        await db.collection("bookmarks").insertOne(bookmark);

        return new Response(JSON.stringify(bookmark), { status: 201 });
    } catch (err) {
        return new Response("Error saving bookmark", { status: 500 });
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    try {
        const { db } = await connectToDatabase();
        const bookmarks = await db.collection("bookmarks").find({ userId }).sort({ createdAt: -1 }).toArray();
        return new Response(JSON.stringify(bookmarks), { status: 200 });
    } catch (err) {
        return new Response("Error fetching bookmarks", { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id, userId } = await req.json();
        console.log(id, userId);

        const { db } = await connectToDatabase();
        // await db.collection("bookmarks").deleteOne({ _id: id, userId });
        await db.collection("bookmarks").deleteOne({
            _id: new ObjectId(id),
            userId,
        });
        return new Response("Bookmark deleted", { status: 200 });
    } catch (err) {
        return new Response("Error deleting bookmark", { status: 500 });
    }
}
