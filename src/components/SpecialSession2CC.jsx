import { useState, useRef, useEffect } from 'react';
import { getEmbedUrl } from './BootcampPlayer';

export default function SpecialSession2CC({ config = {}, userEmail = '', userName = '' }) {
    const videoUrl = config?.videoUrl || '';
    const title = config?.title || 'Special Session: 2CC Fast-Track Blueprint';
    const description = config?.description || 'Exclusive masterclass detailing the exact roadmap to achieve your 2CC milestone, maximize leadership profit-sharing, and scale your digital assets.';
    const resourceLink = config?.resourceLink || '';
    const duration = config?.duration || 'Special Session';

    const [isCompleted, setIsCompleted] = useState(() => {
        const savedEmail = userEmail || localStorage.getItem('user_email');
        if (savedEmail && localStorage.getItem(`special_2cc_completed_${savedEmail}`) === 'true') {
            return true;
        }
        return localStorage.getItem('special_2cc_completed') === 'true';
    });

    const [showSkipWarning, setShowSkipWarning] = useState(false);
    const [canComplete, setCanComplete] = useState(false);

    const videoRef = useRef(null);
    const maxWatchedRef = useRef(0);
    const ytPlayerRef = useRef(null);
    const ytContainerRef = useRef(null);

    const embed = getEmbedUrl(videoUrl);
    const storageKey = `special_2cc_watch_sec_${userEmail || 'guest'}`;

    // Mark completed
    const handleMarkComplete = () => {
        setIsCompleted(true);
        try {
            localStorage.setItem('special_2cc_completed', 'true');
            if (userEmail) {
                localStorage.setItem(`special_2cc_completed_${userEmail}`, 'true');
            }
        } catch (e) { }
    };

    // Load saved position
    useEffect(() => {
        const savedTime = parseFloat(localStorage.getItem(storageKey) || '0');
        const validTime = !isNaN(savedTime) && savedTime > 0 ? savedTime : 0;
        maxWatchedRef.current = validTime;

        if (videoRef.current && validTime > 2) {
            videoRef.current.currentTime = validTime;
        }
    }, [storageKey, videoUrl]);

    // Save watch progress
    const saveProgress = (currentTime) => {
        if (currentTime > maxWatchedRef.current) {
            maxWatchedRef.current = currentTime;
        }
        if (currentTime > 2) {
            try {
                localStorage.setItem(storageKey, currentTime.toString());
            } catch (e) { }
        }
    };

    // Direct Video Handlers
    const handleTimeUpdate = () => {
        if (!videoRef.current || isCompleted) return;
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;

        if (total && total - current <= 10) {
            setCanComplete(true);
        }
        if (total && current >= total - 0.5) {
            handleMarkComplete();
        }

        if (current > maxWatchedRef.current + 1.5) {
            videoRef.current.currentTime = maxWatchedRef.current;
            setShowSkipWarning(true);
        } else {
            saveProgress(current);
        }
    };

    const handleSeeking = () => {
        if (!videoRef.current || isCompleted) return;
        const current = videoRef.current.currentTime;
        if (current > maxWatchedRef.current + 0.5) {
            videoRef.current.currentTime = maxWatchedRef.current;
            setShowSkipWarning(true);
        }
    };

    const handleVideoEnded = () => {
        setCanComplete(true);
        handleMarkComplete();
    };

    // YouTube API Setup
    useEffect(() => {
        if (!embed || embed.type !== 'youtube') return;

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        let interval = null;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player || !ytContainerRef.current) return;

            if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
                ytPlayerRef.current.destroy();
            }

            const savedTime = parseFloat(localStorage.getItem(storageKey) || '0');
            const resumeAt = !isNaN(savedTime) && savedTime > 2 ? Math.floor(savedTime) : 0;

            ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
                videoId: embed.id,
                width: '100%',
                height: '100%',
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                    start: resumeAt
                },
                events: {
                    onReady: (e) => {
                        if (resumeAt > 0 && e.target && typeof e.target.seekTo === 'function') {
                            e.target.seekTo(resumeAt, true);
                        }
                    },
                    onStateChange: (event) => {
                        if (event.data === 0) {
                            setCanComplete(true);
                            handleMarkComplete();
                        }
                    }
                }
            });

            interval = setInterval(() => {
                if (!ytPlayerRef.current || typeof ytPlayerRef.current.getCurrentTime !== 'function') return;
                try {
                    const current = ytPlayerRef.current.getCurrentTime();
                    const total = ytPlayerRef.current.getDuration();
                    if (!current || !total) return;

                    if (total - current <= 10) {
                        setCanComplete(true);
                    }

                    if (!isCompleted) {
                        if (current > maxWatchedRef.current + 2.5) {
                            ytPlayerRef.current.seekTo(maxWatchedRef.current, true);
                            setShowSkipWarning(true);
                        } else {
                            saveProgress(current);
                        }
                    }
                } catch (e) { }
            }, 500);
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (interval) clearInterval(interval);
            if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
                try {
                    ytPlayerRef.current.destroy();
                } catch (e) { }
            }
        };
    }, [embed?.id, isCompleted, storageKey]);

    const whatsappMessage = encodeURIComponent(
        `Hi Harsh! ${userName ? `I am ${userName}. ` : ''}I have successfully completed all Bootcamp Training Modules and the Special 2CC Session! I am ready to discuss the 2CC execution blueprint and get started.`
    );

    return (
        <section className="relative w-full pt-12 pb-10 border-t border-amber-500/30 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Ambient Gold Glow Backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-96 bg-amber-500/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>

            {/* Header / Unlocked Banner */}
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.25)] animate-pulse">
                    <span className="material-symbols-outlined text-base">workspace_premium</span>
                    VIP Milestone Unlocked • 2CC Special Masterclass
                </div>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-200 tracking-tight drop-shadow-[0_4px_20px_rgba(245,158,11,0.3)]">
                    Special Session: 2CC Acceleration
                </h2>

                <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                    Congratulations on completing all curriculum modules! You have unlocked this exclusive, restricted-access session to accelerate your 2CC achievement.
                </p>
            </div>

            {/* 2CC Video Player Box */}
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden floral-glass-heavy border-2 border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-black/80 flex items-center justify-center">
                    {embed ? (
                        embed.type === 'youtube' ? (
                            <div key={embed.id} className="absolute inset-0 w-full h-full overflow-hidden [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:max-w-full">
                                <div ref={ytContainerRef}></div>
                            </div>
                        ) : embed.type === 'direct' ? (
                            <video
                                ref={videoRef}
                                key={embed.src}
                                src={embed.src}
                                controls
                                playsInline
                                onTimeUpdate={handleTimeUpdate}
                                onSeeking={handleSeeking}
                                onEnded={handleVideoEnded}
                                controlsList={isCompleted ? '' : 'nodownload noplaybackrate'}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <iframe
                                key={embed.src}
                                src={embed.src}
                                title={title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full border-0"
                            ></iframe>
                        )
                    ) : (
                        <div className="p-8 text-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-5xl mb-2 text-amber-400">lock_open</span>
                            <p className="text-sm">The 2CC Special Video stream is currently being processed by your instructor.</p>
                        </div>
                    )}
                </div>

                {/* Session Card Info */}
                <div className="floral-glass-heavy rounded-3xl p-6 sm:p-8 border border-amber-500/25 space-y-5 bg-gradient-to-b from-amber-500/[0.04] to-black/40">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block mb-1">
                                Executive VIP Session • {duration}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                                {title}
                            </h3>
                        </div>

                        {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <span className="material-symbols-outlined text-base">verified</span>
                                2CC Session Completed
                            </span>
                        ) : canComplete ? (
                            <button
                                onClick={handleMarkComplete}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.5)] animate-bounce hover:scale-105"
                            >
                                <span className="material-symbols-outlined text-base font-bold">task_alt</span>
                                Complete 2CC Masterclass
                            </button>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-on-surface-variant text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                Watch Session to Finish
                            </span>
                        )}
                    </div>

                    <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                        {description}
                    </p>

                    {resourceLink && (
                        <div className="pt-2">
                            <a
                                href={resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">file_download</span>
                                Download 2CC Blueprint & Checklist
                            </a>
                        </div>
                    )}

                    {/* VIP Next Steps Call to Action */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
                        <p className="text-white font-medium text-sm">
                            Ready to implement your 2CC Plan? Connect directly for priority 1-on-1 execution.
                        </p>
                        <a
                            href={`https://wa.me/918650991949?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Connect for 2CC Onboarding & Action Plan
                        </a>
                    </div>
                </div>
            </div>

            {/* Anti-Skip Warning Modal */}
            {showSkipWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="floral-glass-heavy border border-amber-500/40 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_60px_rgba(245,158,11,0.3)]">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/40">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white mb-2">Skipping Video Not Allowed</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                            This 2CC VIP Masterclass must be viewed completely to ensure full understanding of the business mechanics.
                        </p>
                        <button
                            onClick={() => setShowSkipWarning(false)}
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg"
                        >
                            Continue Watching
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
