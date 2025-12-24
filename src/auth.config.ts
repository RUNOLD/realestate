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

            // Get role safely from session or token (if available)
            const userRole = (auth?.user as any)?.role;

            console.log(`[Middleware Check] Path: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}, Role: ${userRole}`);

            if (isOnAdmin) {
                if (!isLoggedIn) return false;

                // Admins and Staff can access Admin routes
                const hasAdminAccess = userRole === 'ADMIN' || userRole === 'STAFF';
                if (!hasAdminAccess) {
                    console.log(`[Middleware Check] Admin Access Denied for role: ${userRole}`);
                }
                return hasAdminAccess;
            }

            if (isOnDashboard) {
                if (!isLoggedIn) return false;

                // Allow TENANT, STAFF, and ADMIN for the dashboard
                // This prevents Admins from being locked out of tenant-style pages
                const hasDashboardAccess = userRole === 'TENANT' || userRole === 'ADMIN' || userRole === 'STAFF';
                if (!hasDashboardAccess) {
                    console.log(`[Middleware Check] Dashboard Access Denied for role: ${userRole}`);
                }
                return hasDashboardAccess;
            }

            return true;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        }
    },
    providers: [],
} satisfies NextAuthConfig;
