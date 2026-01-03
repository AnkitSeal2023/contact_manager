import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };


// import { useEffect } from "react";
// import { useSession, signIn } from "next-auth/react";

// export default function Page() {
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === "authenticated" && session?.user) {
//       // Send user info to backend
//       fetch("http://localhost:5000/api/user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: session.user.name,
//           email: session.user.email,
//         }),
//       }).then(res => res.json())
//         .then(data => console.log("Backend response:", data))
//         .catch(err => console.error(err));
//     }
//   }, [status, session]);

//   if (status === "loading") return <p>Loading...</p>;
//   if (!session) return <button onClick={() => signIn("google")}>Sign in with Google</button>;

//   return <p>Welcome, {session.user.name}</p>;
// }
