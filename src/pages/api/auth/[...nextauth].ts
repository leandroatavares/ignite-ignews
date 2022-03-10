import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import { query as q, Update } from 'faunadb';
import { fauna } from '../../../services/fauna'

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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {
                data: {
                  email: user.email,
                  lastLogin: Date.now()
                }
              }
            ),
            q.Update(
              q.Select("ref", q.Get(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )),
              {
                data: {
                  lastLogin: Date.now()
                }
              }
            )
          )
        )

        return true;
      } catch {
        return false;
      }

     
    },
  }

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL, //old but possible
})