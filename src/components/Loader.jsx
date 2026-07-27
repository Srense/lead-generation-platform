export default function Loader({ size = "md", text = "" }) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-20 w-20"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500">
            <div className="relative flex items-center justify-center">
                {/* Glowing Plasma Ring behind the logo */}
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-ping opacity-50" style={{ animationDuration: '2s' }}></div>

                {/* Core Branding Logo pulsing */}
                <img
                    src="/favicon.png"
                    alt="Loading..."
                    className={`${sizeClasses[size] || sizeClasses.md} object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(107,216,203,0.5)]`}
                    style={{ animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                />
            </div>
            {text && (
                <div className="font-label-caps text-label-caps text-primary animate-pulse tracking-widest opacity-80">
                    {text}
                </div>
            )}
        </div>
    );
}
