// app/api/pusher/auth/route.ts
import Pusher from "pusher";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// 1. Force the route to be dynamic to prevent build-time static generation crashes
export const dynamic = 'force-dynamic';

// 2. Specify the Node.js runtime for compatibility with the Pusher SDK
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    // --- Security Check: Add Session Authentication ---
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    // 3. Destructure variables with fallback defaults (using actual .env variable names)
    const {
        PUSHER_APP_ID = "",
        NEXT_PUBLIC_PUSHER_KEY = "",
        PUSHER_SECRET = "",
        NEXT_PUBLIC_PUSHER_CLUSTER = "mt1",
    } = process.env;

    // 4. Validate variables ONLY at runtime
    if (!PUSHER_APP_ID || !NEXT_PUBLIC_PUSHER_KEY || !PUSHER_SECRET) {
        console.error("Pusher environment variables are missing.");
        return new Response("Configuration Error", { status: 500 });
    }

    try {
        const pusher = new Pusher({
            appId: PUSHER_APP_ID,
            key: NEXT_PUBLIC_PUSHER_KEY,
            secret: PUSHER_SECRET,
            cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
            useTLS: true,
        });

        // 5. Handle both JSON and URL-encoded data
        const contentType = req.headers.get("content-type");
        let socketId: string | null = null;
        let channelName: string | null = null;

        if (contentType?.includes("application/json")) {
            const body = await req.json();
            socketId = body.socket_id;
            channelName = body.channel_name;
        } else {
            const formData = await req.text();
            const params = new URLSearchParams(formData);
            socketId = params.get("socket_id");
            channelName = params.get("channel_name");
        }

        if (!socketId || !channelName) {
            return new Response("Invalid request body", { status: 400 });
        }

        // 6. Perform Authorization using session data
        const authResponse = pusher.authorizeChannel(socketId, channelName, {
            user_id: session.user.id,
            user_info: {
                name: session.user.name,
                role: (session.user as any).role,
            },
        });

        return NextResponse.json(authResponse);
    } catch (error) {
        console.error("Pusher Auth Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
