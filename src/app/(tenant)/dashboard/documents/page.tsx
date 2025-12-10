import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FileText, Download, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DocumentsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const documents = await prisma.document.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    // Helper to format category
    const formatCategory = (cat: string) => {
        return cat.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-primary">Documents</h1>
                    <p className="text-muted-foreground">Access your tenancy agreements and other important files.</p>
                </div>
            </div>

            {/* Documents List */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {documents.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <FolderOpen className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1">No Documents Available</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Your tenancy documents will appear here once they are generated or uploaded by the administrator.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {documents.map((doc) => (
                            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <FileText className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded uppercase">
                                                {formatCategory(doc.category || "")}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={doc.url}
                                    download={doc.name}
                                    className="h-10 w-10 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download size={18} />
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <FileText className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="font-semibold text-blue-800 text-sm">Need a specific document?</h4>
                    <p className="text-sm text-blue-600 mt-1">
                        If you need a reference letter or receipt that isn't listed here, please submit a request via the <a href="/dashboard/maintenance" className="underline font-medium hover:text-blue-800">Maintenance/Support</a> page.
                    </p>
                </div>
            </div>
        </div>
    );
}
