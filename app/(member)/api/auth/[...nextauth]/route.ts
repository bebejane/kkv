import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import client from '@/lib/client';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 365 * (24 * 60 * 60), // 365 days
  },
  pages: {
    signIn: '/logga-in',
    signOut: '/logga-ut',
    //error: '/medlem/logga-in?type=error', // Error code passed in query string as ?error=    
    //verifyRequest: '/auth/verify-request', // (used for check email message)    
    //newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)  }
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

          return session
        } catch (err) {
          console.error(err)
          return null
        }
      }
    })
  ]
}

const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);
export { handler as GET, handler as POST }