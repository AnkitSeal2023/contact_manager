"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    showIcon?: boolean;
    className?: string;
}

export default function SignOutButton({ 
    variant = "outline", 
    showIcon = true,
    className = "" 
}: SignOutButtonProps) {
    const { data: session } = useSession();

    if (!session) {
        return null;
    }

    return (
        <Button
            type="button"
            variant={variant}
            className={`gap-2 text-sm font-semibold ${className}`}
            onClick={() => signOut({ callbackUrl: "/signup" })}
        >
            {showIcon && <LogOut className="h-4 w-4" />}
            Sign out
        </Button>
    );
}
