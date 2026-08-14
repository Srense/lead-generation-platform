export default function Loader({ size = "md", text = "" }) {
    const sizeClasses = {
        sm: "h-2 w-2",
        md: "h-3 w-3",
        lg: "h-4 w-4"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
            <div className="flex items-center gap-2">
                <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-primary/80 shadow-[0_0_10px_rgba(217,140,140,0.4)] animate-pulse-slow`} style={{ animationDelay: '0ms' }}></div>
                <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-primary/80 shadow-[0_0_10px_rgba(217,140,140,0.4)] animate-pulse-slow`} style={{ animationDelay: '300ms' }}></div>
                <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-primary/80 shadow-[0_0_10px_rgba(217,140,140,0.4)] animate-pulse-slow`} style={{ animationDelay: '600ms' }}></div>
            </div>
            {text && (
                <div className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant animate-pulse-slow opacity-80 mt-2">
                    {text}
                </div>
            )}
        </div>
    );
}
