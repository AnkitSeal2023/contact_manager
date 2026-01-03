"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface session {
    user?:
        | {
              name?: string | null | undefined;
              email?: string | null | undefined;
              image?: string | null | undefined;
          }
        | undefined;
    expires: string;
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M22.48 12.27c0-.74-.06-1.28-.19-1.84H12v3.34h5.99c-.12.83-.77 2.08-2.22 2.92l-.02.14 3.22 2.5.22.02c2.02-1.86 3.19-4.6 3.19-7.98z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.9 0 5.34-.96 7.12-2.62l-3.39-2.64c-.9.56-2.1.95-3.73.95-2.85 0-5.26-1.86-6.12-4.43l-.13.01-3.31 2.57-.04.12C4.28 20.7 7.82 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.88 14.26A6.82 6.82 0 015.5 12c0-.78.14-1.54.36-2.26l-.01-.15-3.34-2.6-.11.05A10.94 10.94 0 001 12c0 1.77.43 3.44 1.2 4.95l3.67-2.69z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.39c2.02 0 3.39.86 4.17 1.58l3.05-2.97C17.31 1.89 14.9 1 12 1 7.82 1 4.28 3.3 2.2 6.75l3.66 2.59C4.75 8.25 7.16 5.39 12 5.39z"
                fill="#EA4335"
            />
        </svg>
    );
}

function handleSignedNewUser(
    session: session | null,
    status: "authenticated" | "loading" | "unauthenticated",
    router: ReturnType<typeof useRouter>,
) {
    console.log("status:", status);
    console.log("session:", session);
    if (status === "authenticated" && session?.user) {
        console.log("status in check:", status);
        // Send user info to backend
        fetch("http://localhost:5000/api/newuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Backend response:", data);
                router.push("/");
            })
            .catch((err) => console.error(err));
    }
}

export default function SignupPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [isClicked, setIsClicked] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        setIsMounted(true);
        if (isClicked && status === "authenticated") {
            console.log("Status in check:", status);
            handleSignedNewUser(session, status, router);
            setIsClicked(false);
        }
    }, [status, session, isClicked, isMounted, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:py-10">
            <div className="w-full max-w-md space-y-6 sm:space-y-8 rounded-2xl border border-neutral-300 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/90">
                <div className="space-y-3 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Welcome to ContactMgr
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Sign in with your Google account to get started
                    </p>
                </div>

                <div className="space-y-4">
                    {session ? (
                        <>
                            <p className="text-center text-sm text-foreground">
                                Signed in as {session.user?.email}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full text-sm font-semibold"
                                onClick={() => signOut()}
                            >
                                Sign out
                            </Button>
                        </>
                    ) : (
                        isMounted && (
                            <Button
                                type="button"
                                variant="default"
                                className="w-full gap-2 text-base font-semibold py-6"
                                onClick={() => {
                                    console.log("clicked");
                                    signIn("google");
                                    handleSignedNewUser(
                                        session,
                                        status,
                                        router,
                                    );
                                }}
                            >
                                <GoogleIcon className="h-5 w-5" />
                                Sign in with Google
                            </Button>
                        )
                    )}
                </div>

                <p className="text-center text-xs sm:text-sm text-muted-foreground">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
