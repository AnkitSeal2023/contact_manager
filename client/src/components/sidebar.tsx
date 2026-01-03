import { Contact, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import SignOutButton from "./sign-out-button";

export default function Sidebar() {
    return (
        <div className="p-2 bg-blue-300 h-full flex flex-col items-center justify-between">
            <div className="w-full">
                <h1 className="mb-9 text-3xl font-bold dark:text-white text-blue-800 text-center">LOGO</h1>
                <div className="w-full space-y-3 px-4">
                    <Link
                        href="/app"
                        className="px-2 flex items-center justify-center space-x-1 w-full rounded text-neutral-100 bg-sky-500 py-3 hover:bg-sky-600"
                    >
                        <LayoutDashboard className="text-neutral-100" size={18} />
                        <div>Dashboard</div>
                    </Link>

                    <Link
                        href="/app/allcontacts"
                        className="px-2 flex items-center justify-center space-x-1 w-full rounded bg-sky-500 hover:bg-sky-600 py-3"
                    >
                        <Contact className="text-neutral-100" size={18}/>
                        <div className="text-neutral-100">All Contacts</div>
                    </Link>
                </div>
            </div>

            {/* Sign out button at the bottom */}
            <div className="w-full px-4 pb-4">
                <SignOutButton 
                    variant="destructive" 
                    className="w-full" 
                />
            </div>
        </div>
    )
}
