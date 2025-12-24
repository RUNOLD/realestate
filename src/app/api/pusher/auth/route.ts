// app/api/pusher/auth/route.ts
import Pusher from "pusher";
import { NextRequest, NextResponse } from "next/server";

// 1. Force the route to be dynamic to prevent build-time static generation crashes
export const dynamic = 'force-dynamic'; 

// 2. Specify the Node.js runtime for compatibility with the Pusher SDK
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 3. Destructure variables with fallback defaults to prevent "must provide a cluster" errors
  const {
    PUSHER_APP_ID = "",
    PUSHER_APP_KEY = "",
    PUSHER_APP_SECRET = "",
    PUSHER_CLUSTER = "mt1", // Fallback cluster prevents build-time crash
  } = process.env;

  // 4. Validate variables ONLY at runtime
  if (!PUSHER_APP_ID || !PUSHER_APP_KEY || !PUSHER_APP_SECRET) {
    console.error("Pusher environment variables are missing.");
    return new Response("Configuration Error", { status: 500 });
  }

  try {
    const pusher = new Pusher({
      appId: PUSHER_APP_ID,
      key: PUSHER_APP_KEY,
      secret: PUSHER_APP_SECRET,
      cluster: PUSHER_CLUSTER,
      useTLS: true,
    });

    // 5. Handle both JSON and URL-encoded data (standard for Pusher client auth)
    const contentType = req.headers.get("content-type");
    let socketId, channelName;

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

    // 6. Perform Authorization
    // In production, verify user session here before authorizing
    const authResponse = pusher.authorizeChannel(socketId, channelName);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher Auth Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}