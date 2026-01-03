import Link from "next/link";

export default function Page() {
    return (
    <div className="h-screen w-full flex items-center justify-center px-4">
        <Link href={'/app'} className="rounded bg-blue-500 p-4 dark:text-white text-neutral-800 text-center text-sm sm:text-base hover:bg-blue-600 transition">Open Contact Manager App</Link>
    </div>
    );
}
