import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ account, profile }) {
      // Solo aceptamos mails que Google marca como verificados
      return account?.provider === "google" && profile?.email_verified === true;
    },
  },
});
