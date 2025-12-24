import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID || '12345',
    key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'dummy-key',
    secret: process.env.PUSHER_SECRET || 'dummy-secret',
    // This 'mt1' fallback is what stops the "provide a cluster" error
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
    useTLS: true,
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || 'dummy-key', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
});
