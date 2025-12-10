import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    secret: process.env.AUTH_SECRET || 'any-secret-string-for-dev-mode',
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const userRole = (auth?.user as any)?.role;

            console.log(`[Middleware] Path: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}, Role: ${userRole}`);

            if (isOnAdmin) {
                if (isLoggedIn) {
                    // Strict Role Check for Admin Routes
                    const allowed = userRole === 'ADMIN' || userRole === 'STAFF';
                    console.log(`[Middleware] Admin Access: ${allowed ? 'GRANTED' : 'DENIED'}`);
                    return allowed;
                }
                console.log(`[Middleware] Admin Access: DENIED (Not Logged In)`);
                return false; // Redirect unauthenticated users to login page
            }

            if (isOnDashboard) {
                if (isLoggedIn) {
                    // Strict Role Check for Tenant Dashboard
                    // Ideally only TENANTs should use /dashboard. 
                    // Staff/Admins have /admin.
                    return userRole === 'TENANT';
                }
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        // We need to extend session to include role
        async session({ session, token }) {
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
