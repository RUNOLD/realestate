import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';
// import type { User } from '@/lib/definitions';

// Creating a schema for input validation
const LoginSchema = z.object({
    identifier: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(6),
});

async function getUser(identifier: string): Promise<any> {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier },
                ],
            },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    debug: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = LoginSchema.safeParse(credentials);

                if (parsedCredentials.success) {
                    const { identifier, password } = parsedCredentials.data;
                    const user = await getUser(identifier);
                    if (!user) {
                        console.log('Login Failed: User not found for identifier:', identifier);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password || '');

                    if (passwordsMatch) {
                        console.log('Login Success: User authenticated:', user.email);
                        return user;
                    } else {
                        console.log('Login Failed: Password mismatch for user:', user.email);
                    }
                } else {
                    console.log('Login Failed: Invalid input format');
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    events: {
        async signIn({ user }) {
            if (user) {
                const { createActivityLog, ActionType, EntityType } = await import('@/lib/logger');
                try {
                    await createActivityLog(
                        user.id as string,
                        ActionType.LOGIN,
                        EntityType.USER,
                        user.id as string,
                        { method: 'credentials', role: (user as any).role }
                    );
                } catch (e) {
                    console.error("Failed to log activity:", e);
                }
            }
        }
    },
});
