
"use client";

import { useState, useEffect } from "react";
import { Download, Search, Trash2, Upload, Plus, X } from "lucide-react";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import { useSession } from "next-auth/react";

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
}

let selectedIds: Set<string> = new Set();

function CreateContactModal({ isOpen, onClose, onContactCreated }: { isOpen: boolean; onClose: () => void; onContactCreated: (contact: Contact) => void }) {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            setError("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/createContact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create contact");

            const newContact = await res.json();
            onContactCreated(newContact);
            setFormData({ name: "", email: "", phone: "", message: "" });
            onClose();
            toast.success("Contact created successfully!", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Create New Contact</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-neutral-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="555-1234"
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Add a note..."
                            rows={3}
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50"
                        >
                            {isLoading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ContactTable({ items }: { items: Contact[] }) {
    const [, setSelectedIds] = useState<Set<string>>(selectedIds);
    const [lastIndex, setLastIndex] = useState<number | null>(null);

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, index: number, id: string) => {
        const { shiftKey } = event.nativeEvent as unknown as { shiftKey: boolean };
        const checked = event.target.checked;

        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (shiftKey && lastIndex !== null) {
                const start = Math.min(lastIndex, index);
                const end = Math.max(lastIndex, index);
                for (let i = start; i <= end; i += 1) {
                    const contactId = items[i]?.id;
                    if (contactId === undefined) continue;
                    checked ? next.add(contactId) : next.delete(contactId);
                }
            } else {
                checked ? next.add(id) : next.delete(id);
            }

            console.log(selectedIds)
            selectedIds = next; // Update the external selectedIds for consistency
            return next;
        });

        setLastIndex(index);
    };

    return (
        <div className="my-2 sm:my-4 w-full rounded-lg sm:rounded-2xl border border-neutral-200 shadow-sm overflow-x-auto">
            <div className="max-h-[70vh] sm:max-h-[80vh] lg:max-h-[90vh] pb-20 overflow-y-auto">
                <table className="min-w-[900px] w-full text-left text-sm">
                    <thead className="bg-neutral-100 text-xs uppercase tracking-wide text-neutral-600 sticky top-0 z-10">
                        <tr>
                            <th className="w-12 px-4 py-3">Select</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((contact, index) => {
                            const isSelected = selectedIds.has(contact.id);
                            return (
                                <tr
                                    key={contact.id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-neutral-50"} hover:bg-amber-50 transition-colors`}
                                >
                                    <td className="px-4 py-3 align-middle">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 cursor-pointer accent-sky-500"
                                            checked={isSelected}
                                            onChange={(event) => handleSelect(event, index, contact.id)}
                                            aria-label={`Select ${contact.name}`}
                                        />
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-neutral-900">{contact.name}</td>
                                    <td className="px-4 py-3 text-neutral-700">{contact.email}</td>
                                    <td className="px-4 py-3 text-neutral-700">{contact.phone}</td>
                                    <td className="px-4 py-3 text-neutral-600">{contact.message ?? "—"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
function Navbar() {
    const { data: session } = useSession();
    
    return (
        <nav className="border-b-2 w-full py-3 sm:py-4 px-2 sm:px-4 items-center justify-between flex flex-wrap gap-3 sm:gap-0">
            <div className="text-lg sm:text-xl font-semibold">All Contacts</div>
            <div className="flex gap-2 sm:gap-5 items-center">
                <div className="hidden sm:flex border border-neutral-300 hover:border-neutral-400 bg-neutral-200 rounded-2xl items-center px-2 py-1">
                    <Search size={16} />
                    <input type="text" placeholder="Search contacts" className="bg-transparent outline-none px-2 py-1 w-32 lg:w-auto" />
                </div>
                <div className="items-center flex gap-1 sm:gap-2">
                    {session?.user?.image && (
                        <Image 
                            src={session.user.image} 
                            width={32} 
                            height={32} 
                            alt="User Avatar" 
                            className="rounded-full" 
                        />
                    )}
                    <div className="hidden sm:flex flex-col text-sm">{session?.user?.name || session?.user?.email}</div>
                </div>
            </div>
        </nav>
    )
}
async function handleDelete(onDeleted: () => void) {
    try {
        if (selectedIds.size === 0) {
            alert("No contacts selected for deletion.");
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deleteContacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ ids: Array.from(selectedIds) }),
        })
        await res.json();
        console.log(res);
        if (res.ok) {
            toast.success("Selected contacts deleted successfully.", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            selectedIds.clear();
            onDeleted();
        } else {
            throw new Error("Failed to delete contacts");
        }
    } catch (error) {
        toast.error("An error occurred while deleting contacts.", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        console.log("An error occurred while deleting contacts.:", error);
    }

    console.log("Deleting contacts with IDs:", Array.from(selectedIds));
}
export default function Page() {
    const [showModal, setShowModal] = useState(false);
    const [contactsList, setContactsList] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch contacts');
            const data = await res.json();
            setContactsList(data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.csv')) {
            toast.error("Please select a CSV file.", {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
            });
            event.target.value = ''; // Reset input
            return;
        }

        // Validate file size (5MB = 5 * 1024 * 1024 bytes)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File size must be less than 5MB.", {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
            });
            event.target.value = ''; // Reset input
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/users-file`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to upload file');
            }

            const data = await res.json();
            
            toast.success(data.message || "File uploaded successfully!", {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
            });

            // Refresh contacts list after successful upload
            await fetchContacts();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to upload file.", {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
            });
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
            event.target.value = ''; // Reset input
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleContactCreated = (newContact: Contact) => {
        setContactsList((prev) => [...prev, newContact]);
    };

    const handleExportContacts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts/export`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to export contacts');
            }

            // Get the CSV content as blob
            const blob = await res.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contacts_${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Contacts exported successfully!", {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to export contacts.", {
                position: "top-right",
                autoClose: 3000,
                theme: "light",
            });
            console.error('Export error:', error);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading contacts...</div>;
    }

    return (
        <div className="pb-6">
            <Navbar />
            <ToastContainer/>
            <div className="text-xs sm:text-sm gap-2 sm:gap-2 w-full flex flex-wrap items-center justify-start p-2 sm:p-3">
                <button onClick={() => setShowModal(true)} className="flex gap-1 sm:gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 sm:py-1 items-center shadow-sm cursor-pointer hover:bg-sky-100 transition bg-sky-50">
                    <Plus size={16} className="text-sky-600" />
                    <div className="text-sky-600 font-medium">Create</div>
                </button>
                <button onClick={() => handleDelete(fetchContacts)} className="flex gap-1 sm:gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 sm:py-1 items-center shadow-sm cursor-pointer hover:bg-neutral-100 transition">
                    <Trash2 size={16} color="red" />
                    <div>Delete</div>
                </button>
                <label className="flex gap-1 sm:gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 sm:py-1 items-center shadow-sm cursor-pointer hover:bg-neutral-100 transition">
                    <input 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                    />
                    <Download size={16} className="text-slate-800" />
                    <div>{isUploading ? 'Uploading...' : 'Import'}</div>
                </label>
                <button onClick={handleExportContacts} className="flex gap-1 sm:gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 sm:py-1 items-center shadow-sm cursor-pointer hover:bg-neutral-100 transition">
                    <Upload size={16} className="text-slate-900" />
                    <div>Export</div>
                </button>
            </div>
            <div className="overflow-auto min-h-0 min-w-0 flex-1">
                <ContactTable items={contactsList} />
            </div>
            <CreateContactModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onContactCreated={handleContactCreated}
            />
        </div>
    )
}
