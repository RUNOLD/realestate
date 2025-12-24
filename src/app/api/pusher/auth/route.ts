import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

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
