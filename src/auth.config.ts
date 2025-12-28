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
            const isOnTenant = nextUrl.pathname.startsWith('/tenant');
            const isOnStaff = nextUrl.pathname.startsWith('/staff');

            // Get role safely from session or token (if available)
            const userRole = (auth?.user as any)?.role;



            // 1. Protection for Admin Routes
            if (isOnAdmin) {
                if (!isLoggedIn) return false; // Redirect to login

                // STRICT RBAC: Only ADMIN and STAFF can access /admin
                const hasAdminAccess = userRole === 'ADMIN' || userRole === 'STAFF';
                if (!hasAdminAccess) {
                    console.warn(`[Middleware Block] User with role '${userRole}' attempted to access ADMIN route.`);
                    // Redirect unauthorized users to their appropriate dashboard or home
                    // Returning false redirects to login, but since they are logged in, we might want to redirect to dashboard.
                    // However, NextAuth middleware 'authorized' returning pure false redirects to login? 
                    // Let's create a Response.redirect if we want custom behavior, but returning false is the standard "Access Denied" behavior which triggers signin.
                    // For better UX, if they are logged in but wrong role, maybe we let them fall through to a 403 page?
                    // Standard NextAuth pattern: return false -> redirect to signIn.
                    return false;
                }
                return true;
            }

            // 2. Protection for Staff Routes (Future Proofing)
            if (isOnStaff) {
                if (!isLoggedIn) return false;
                const hasStaffAccess = userRole === 'ADMIN' || userRole === 'STAFF';
                if (!hasStaffAccess) {
                    console.warn(`[Middleware Block] User with role '${userRole}' attempted to access STAFF route.`);
                    return false;
                }
                return true;
            }

            // 3. Protection for Tenant/Dashboard Routes
            // Assuming /dashboard is the main tenant area, but also covering /tenant just in case.
            if (isOnDashboard || isOnTenant) {
                if (!isLoggedIn) return false;

                // Allow TENANT, STAFF, and ADMIN. 
                const hasDashboardAccess = userRole === 'TENANT' || userRole === 'ADMIN' || userRole === 'STAFF';

                if (!hasDashboardAccess) {
                    console.warn(`[Middleware Block] User with role '${userRole}' attempted to access DASHBOARD/TENANT route.`);
                    return false;
                }
                return true;
            }

            // 4. Protection for Landlord Routes
            const isOnLandlord = nextUrl.pathname.startsWith('/landlord');
            if (isOnLandlord) {
                if (!isLoggedIn) return false;

                const hasLandlordAccess = userRole === 'LANDLORD' || userRole === 'ADMIN'; // Admin can likely view
                if (!hasLandlordAccess) {
                    console.warn(`[Middleware Block] User with role '${userRole}' attempted to access LANDLORD route.`);
                    return false;
                }
                return true;
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
