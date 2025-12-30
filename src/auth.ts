import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(identifier: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ identifier: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { identifier, password } = parsedCredentials.data;
                    const user = await getUser(identifier);
                    if (!user) return null;

                    let passwordsMatch = false;
                    if (user.password?.startsWith('$2')) {
                        passwordsMatch = await bcrypt.compare(password, user.password);
                    } else {
                        passwordsMatch = password === user.password;
                    }

                    if (passwordsMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        };
                    }
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 2 * 60 * 60, // 2 hours
        updateAge: 15 * 60, // 15 minutes
    },
});
