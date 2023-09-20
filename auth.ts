import NextAuth, {NextAuthConfig} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {SignInCredentials} from "./types/SigninCredential";

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        // Define your expected credentials here
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      authorize: async (credentials, request) => {
        const {email, password} = credentials as SignInCredentials;
        console.log(email, password);

        try {
          const response = await fetch(
            "http://localhost:3000/api/users/signin",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({email, password}),
            }
          );

          const data = await response.json();
          console.log("WEeeeeeeeeeeeeeeee herrrrrreeeeeeeeeeeeee");

          if (data.error) {
            throw new Error(data.error);
          }

          return {id: data.user.id};
        } catch (error: any) {
          console.error(error.message);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
};

export const {
  auth,
  handlers: {GET, POST},
} = NextAuth(authConfig);
