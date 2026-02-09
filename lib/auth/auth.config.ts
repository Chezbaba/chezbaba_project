import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configuration minimale pour le middleware (Edge Runtime compatible)
// Ne pas utiliser PrismaAdapter ici car il n'est pas compatible avec Edge Runtime
export const authConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // La vraie autorisation se fait dans lib/auth/index.ts
            // Ici on retourne null car le middleware n'a besoin que de vérifier la session
            async authorize() {
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.nom = (token.nom as string) || "";
                session.user.prenom = (token.prenom as string) || "";
                session.user.role = token.role as "ADMIN" | "VENDEUR" | "CLIENT";
                session.user.emailVerifie = token.emailVerifie as boolean;
                session.user.imagePublicId = (token.imagePublicId as string) || null;
                session.user.tel = (token.tel as string) || null;
            }
            return session;
        },
        async jwt({ token, user, trigger }: { token: any; user?: any; trigger?: string }) {
            if (trigger === "signIn" && user) {
                token.id = user.id!;
                token.email = user.email!;
                token.nom = user.nom;
                token.prenom = user.prenom;
                token.role = user.role;
                token.emailVerifie = user.emailVerifie;
                token.imagePublicId = user.imagePublicId;
                token.tel = user.tel;
            }
            return token;
        },
    },
} satisfies NextAuthConfig;
