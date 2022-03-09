import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),
  ],

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL, //old but possible
})