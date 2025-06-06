
import CredentialsProvider from 'next-auth/providers/credentials'
import client from '@/lib/client';
import { getServerSession } from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 365 * (24 * 60 * 60), // 365 days
  },
  pages: {
    signIn: '/logga-in',
    signOut: '/logga-ut',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async jwt({ token, user }) {
      return token
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        try {
          const { username: email, password } = credentials

          const user = (await client.items.list({
            filter: {
              type: "workshop",
              fields: {
                email: {
                  eq: email,
                },
                password: {
                  eq: password,
                },
              },
            },
          }))?.[0]

          if (!user) {
            return null
          }

          const session = {
            id: user.id,
            email: email as string,
            image: null
          }
          revalidatePath('/', 'layout')
          return session
        } catch (err) {
          console.error(err)
          return null
        }
      }
    })
  ]
}

export const getSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
};