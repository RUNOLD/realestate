import Link from "next/link";
import NextImage from "next/image";

export function Hero() {
    return (
        <div className="relative bg-primary h-[80vh] min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Placeholder for high-quality hero image */}
                <NextImage
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2666&auto=format&fit=crop"
                    alt="Luxury Home"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-20">
                <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent border border-accent/20 text-sm font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm">
                    Premium Real Estate Services
                </span>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white mb-8 tracking-tight leading-tight">
                    Find Your Place of <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Luxury & Comfort</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                    Discover a curated selection of Nigeria's finest properties.
                    From exclusive sourcing to seamless management, we redefine excellence.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <Link
                        href="/properties"
                        className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-accent/20 ring-2 ring-accent ring-offset-2 ring-offset-transparent"
                    >
                        Explore Listings
                    </Link>
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
                    >
                        Contact an Agent
                    </Link>
                </div>
            </div>
        </div>
    );
}

