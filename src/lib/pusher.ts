import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Helper to get env with fallback
const getEnv = (name: string, fallback: string) => {
    const val = process.env[name];
    if (!val || val.length === 0) return fallback;
    return val;
};

export const pusherServer = new PusherServer({
    appId: getEnv('PUSHER_APP_ID', '12345'),
    key: getEnv('NEXT_PUBLIC_PUSHER_KEY', getEnv('NEXT_PUBLIC_PUSHER_APP_KEY', 'dummy-key')),
    secret: getEnv('PUSHER_SECRET', getEnv('PUSHER_APP_SECRET', 'dummy-secret')),
    cluster: getEnv('NEXT_PUBLIC_PUSHER_CLUSTER', 'mt1'),
    useTLS: true,
});

export const pusherClient = new PusherClient(
    getEnv('NEXT_PUBLIC_PUSHER_KEY', getEnv('NEXT_PUBLIC_PUSHER_APP_KEY', 'dummy-key')),
    {
        cluster: getEnv('NEXT_PUBLIC_PUSHER_CLUSTER', 'mt1'),
    }
);
