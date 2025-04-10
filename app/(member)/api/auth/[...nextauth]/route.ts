import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 365 * (24 * 60 * 60), // 365 days
  },
  pages: {
    signIn: '/logga-in',
    //signOut: '/medlem/logga-ut',
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
    async session({ session, token }) {
      return session;
    }
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
          if (password !== process.env.NEXTAUTH_URL_STATIC_PASSWORD) return null

          const session = {
            id: email,
            email: email as string,
            image: null
          }
          console.log('session', session)
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