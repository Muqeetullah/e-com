import NextAuth, {NextAuthConfig} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {SignInCredentials} from "./types/SigninCredential";
const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {},
      async authorize(credentials, request) {
        const {email, password} = credentials as SignInCredentials;
        const {user, error} = await fetch(
          "http://localhost:3000/api/users/signin",
          {
            method: "POST",
            body: JSON.stringify({email, password}),
          }
        ).then(async res => await res.json());

        if (error) throw new Error(error);
        return {id: user.id};
      },
    }),
  ],
};
export const {
  auth,
  handlers: {GET, POST},
} = NextAuth(authConfig);
