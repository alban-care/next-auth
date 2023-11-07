# Next-auth

how to use next-auth in a nxt-js 13.2 or above project

## Requirements and installation

- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io/)
- [next-auth](https://next-auth.js.org/)
- Githut account and OAuth App in

### Create a GitHub OAuth App

[docs](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps)

1. Go to the Github page for creating a new OAuth App: [Github Apps](https://github.com/settings/developers)
2. Click on the button "Register a new application" if you don't have any OAuth App yet. Otherwise, click on the button "New OAuth App".
3. Fill the form with the following values:
   - Application name: `next-auth` (or any name you want)
   - Homepage URL: `http://localhost:3000` (used for the development, change it when you deploy your app with a real domain)
   - Application description (optional): `Next.js authentication with next-auth`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github` (used for the development, change it when you deploy your app with a real domain)
4. Click on the button "Register application"

Don't close the page, you will need the Client ID and Client Secret for the next step.

### Create a new Next.js project

```bash
$ npx create-next-app@latest --ts --use-pnpm
$ cd next-auth
$ pnpm add next-auth #https://next-auth.js.org/getting-started/example
```

## Getting Started

### Create a random string used to hash tokens, sign/encrypt cookies and generate cryptographic keys.

[docs](https://next-auth.js.org/configuration/options#secret)

```bash
$ NEXTAUTH_SECRET=$(openssl rand -base64 32)
$ echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.local
```

> Create a good value on the command line via this openssl command :
>
> ```bash
> $ openssl rand -base64 32
> ```

### Adding the OAuth App credentials to the environment variables (ex : GitHub)

[docs](https://next-auth.js.org/configuration/providers/oauth#github)

```bash
# .env.local
$ GITHUB_ID= # Paste your GitHub Client ID here
$ GITHUB_SECRET= # Paste your GitHub Client Secret here
```

### Route Handler for Next.js 13.2 or above

```bash
$ mkdir -p ./app/api/auth/[...nextauth]/
$ touch ./app/api/auth/[...nextauth]/route.ts
$ touch ./app/api/auth/[...nextauth]/options.ts
```

[docs](https://next-auth.js.org/configuration/options#options)

```ts
// ./app/api/auth/[...nextauth]/options.ts
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"; //optional

const GITHUB = GithubProvider({
  clientId: process.env.GITHUB_ID as string,
  clientSecret: process.env.GITHUB_SECRET as string,
});

//optional
const CREDENTIALS = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email", placeholder: "Email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    // In production, call an external API endpoint to validate credentials
    // Docs: https://next-auth.js.org/configuration/providers/credentials
    const user = {
      id: "1", // id must be a string
      name: "John Doe",
      email: "john.doe@email.com",
      password: "password",
    };

    if (
      credentials.email === user.email &&
      credentials.password === user.password
    ) {
      return Promise.resolve(user);
    } else {
      return Promise.resolve(null);
      // You can also Reject this callback with an Error or with a URL:
      // return Promise.reject(new Error('error message')) // Redirect to error page
      // return Promise.reject('/path/to/redirect')        // Redirect to a URL
    }
  },
});

export const options: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GITHUB,
    CREDENTIALS, //optional
  ], //https://next-auth.js.org/configuration/providers/oauth
  pages: {},
};
```

[docs](https://next-auth.js.org/configuration/initialization#route-handlers-app)

```ts
// ./app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { options } from "./options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };
```

## Test the authentication

### Start the development server

```bash
$ pnpm dev
```

Get the list of the providers :

- Method : GET
- URL : http://localhost:3000/api/auth/providers
