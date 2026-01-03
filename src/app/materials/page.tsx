import Link from "next/link";
import { Hammer } from "lucide-react";

export default function MaterialsPage() {
    return (
        <main className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-4">
                    <Hammer size={40} className="text-accent animate-pulse" />
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight">
                    Coming <span className="text-accent">Soon</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                    Our premium construction materials marketplace is currently undergoing maintenance.
                    <br className="hidden md:block" />
                    Thank you for your patience.
                </p>

                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>

            {/* Subtle background decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
        </main>
    );
}
