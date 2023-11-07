import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const GITHUB = GithubProvider({
  clientId: process.env.GITHUB_ID as string,
  clientSecret: process.env.GITHUB_SECRET as string,
});

const CREDENTIALS = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email", placeholder: "Email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const user = {
      id: "1", // id must be a string
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password",
    };

    if (
      credentials?.email === user.email &&
      credentials?.password === user.password
    ) {
      return Promise.resolve(user);
    } else {
      return Promise.resolve(null);
    }
  },
});

export const options: NextAuthOptions = {
  providers: [GITHUB, CREDENTIALS],
  pages: {},
};
