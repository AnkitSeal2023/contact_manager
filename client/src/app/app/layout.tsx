import Sidebar from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center  overflow-hidden">
            <div className="h-screen w-full">
                <div className="w-full h-full min-h-0 flex-1 dark:bg-neutral-900 bg-neutral-50">
                    <div className="h-full grid sm:grid-cols-[1fr_5fr]">
                        <Sidebar />
                        <div className="bg-neutral-50">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
