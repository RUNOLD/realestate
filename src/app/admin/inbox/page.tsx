
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Mail, Trash2, CheckCircle, Clock, User, Phone } from "lucide-react";
import { markMessageAsRead, deleteMessage } from "@/app/lib/actions";
import { Button } from "@/components/ui/Button";

export default async function InboxPage() {
    const session = await auth();
    // Allow ADMIN and STAFF
    if (!session?.user?.id || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'STAFF')) {
        redirect("/dashboard"); // Or login
    }

    const messages = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
                    <p className="text-muted-foreground mt-1">Manage inquiries from the contact form.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed text-muted-foreground">
                        <Mail className="mx-auto h-12 w-12 opacity-20 mb-4" />
                        <p>No messages found.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-6 rounded-xl border transition-all ${msg.status === 'NEW'
                                    ? 'bg-white border-blue-200 shadow-sm border-l-4 border-l-blue-500'
                                    : 'bg-gray-50/50 border-gray-100 opacity-80 hover:opacity-100'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${msg.status === 'NEW' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                                            {msg.status}
                                        </span>
                                        <span>•</span>
                                        <Clock size={14} />
                                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            {msg.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                                            <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-blue-600">
                                                <Mail size={14} /> {msg.email}
                                            </a>
                                            {msg.phone && (
                                                <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                                                    <Phone size={14} /> {msg.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg text-gray-800 text-sm leading-relaxed border border-gray-100">
                                        {msg.message}
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2 min-w-[140px]">
                                    {msg.status === 'NEW' && (
                                        <form action={markMessageAsRead.bind(null, msg.id)}>
                                            <Button type="submit" variant="outline" className="w-full justify-start gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                                                <CheckCircle size={16} /> Mark Read
                                            </Button>
                                        </form>
                                    )}

                                    {(session.user as any).role === 'ADMIN' && (
                                        <form action={deleteMessage.bind(null, msg.id)}>
                                            <Button type="submit" variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                <Trash2 size={16} /> Delete
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
