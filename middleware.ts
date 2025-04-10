import { withAuth } from "next-auth/middleware"

export default withAuth((req) => { }, {
  callbacks: {
    authorized: ({ req, token }) => {
      if ((req.nextUrl.pathname.startsWith('/medlem') && token === null)
        && (new URL(req.url).searchParams.get('secret') !== process.env.DATOCMS_PREVIEW_SECRET)) {
        return false
      }
      return true
    }
  }
})

export const config = {
  matcher: ["/medlem", '/medlem/:path*']
};