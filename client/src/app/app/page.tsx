'use client';

import { useEffect, useState } from "react";
import { Contact, Users, UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface DashboardStats {
    totalContacts: number;
}

export default function Page() {
    const [stats, setStats] = useState<DashboardStats>({ totalContacts: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
                    credentials: 'include',
                });
                
                if (!res.ok) throw new Error('Failed to fetch contacts');
                
                const contacts = await res.json();
                setStats({ totalContacts: contacts.length });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <div className="text-lg text-neutral-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                    Welcome back, {session?.user?.name || 'User'}
                </p>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Total Contacts Card */}
                <div className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900 dark:to-sky-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Total Contacts
                            </p>
                            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                                {stats.totalContacts}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                All saved contacts
                            </p>
                        </div>
                        <div className="rounded-full bg-blue-500/20 p-3">
                            <Contact className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900 dark:to-violet-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200 dark:border-purple-700 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                Your Account
                            </p>
                            <p className="text-lg font-semibold text-purple-900 dark:text-purple-100 truncate max-w-[180px]">
                                {session?.user?.email || 'Not logged in'}
                            </p>
                            <p className="text-xs text-purple-600 dark:text-purple-400">
                                Active session
                            </p>
                        </div>
                        <div className="rounded-full bg-purple-500/20 p-3">
                            <UserCircle className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                        </div>
                    </div>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 dark:border-green-700 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                Status
                            </p>
                            <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                                {stats.totalContacts > 0 ? 'Active' : 'No contacts yet'}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                                {stats.totalContacts > 0 ? 'Managing contacts' : 'Start adding contacts'}
                            </p>
                        </div>
                        <div className="rounded-full bg-green-500/20 p-3">
                            <Users className="h-6 w-6 text-green-700 dark:text-green-300" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-3 sm:mb-4">
                    Quick Actions
                </h2>
                <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <a
                        href="/app/allcontacts"
                        className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
                    >
                        <Contact className="h-5 w-5 text-sky-600" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            View All Contacts
                        </span>
                    </a>
                    <button
                        onClick={() => window.location.href = '/app/allcontacts'}
                        className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
                    >
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Add Contact
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
