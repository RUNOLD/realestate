export const dynamic = 'force-dynamic';

import { auth } from "@/auth";
// Removed at-runtime import to prevent build crashes
// import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Dynamic import to avoid build-time issues with environment variables
    const { pusherServer } = await import("@/lib/pusher");

    const data = await req.text();
    const [socketId, channelName] = data.split("&").map((str) => str.split("=")[1]);

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
        user_id: session.user.id,
        user_info: {
            name: session.user.name,
            role: (session.user as any).role,
        },
    });

    return new Response(JSON.stringify(authResponse));
}
