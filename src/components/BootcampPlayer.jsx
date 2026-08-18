import { useState, useRef, useEffect } from 'react';

// Helper to extract YouTube video ID
export const getYouTubeVideoId = (rawUrl) => {
    if (!rawUrl) return null;
    const match = rawUrl.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
    return match ? match[1] : null;
};

// Helper to convert standard video URLs to embeddable URLs
export const getEmbedUrl = (rawUrl) => {
    if (!rawUrl) return null;
    const url = rawUrl.trim();

    const ytId = getYouTubeVideoId(url);
    if (ytId) {
        return {
            type: 'youtube',
            id: ytId,
            src: `https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&rel=0&modestbranding=1`
        };
    }

    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
    if (vimeoMatch && vimeoMatch[3]) {
        return {
            type: 'vimeo',
            id: vimeoMatch[3],
            src: `https://player.vimeo.com/video/${vimeoMatch[3]}?badge=0&autopause=0&player_id=0`
        };
    }

    return {
        type: 'direct',
        src: url
    };
};

// Helper to create a unique fingerprint for a module and its specific video URL
const getModuleCompletionKey = (moduleId, videoUrl) => {
    if (!moduleId) return '';
    try {
        const urlHash = videoUrl ? btoa(encodeURIComponent(videoUrl)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16) : 'nourl';
        return `${moduleId}_${urlHash}`;
    } catch {
        return `${moduleId}_${(videoUrl || '').length}`;
    }
};

export default function BootcampPlayer({ modules = [], userEmail = '' }) {
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [completedModuleKeys, setCompletedModuleKeys] = useState(() => {
        try {
            const saved = localStorage.getItem(`bootcamp_completed_keys_${userEmail}`) || localStorage.getItem('bootcamp_completed_keys');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showModuleSkipWarning, setShowModuleSkipWarning] = useState(false);
    const [newlyUnlockedIndex, setNewlyUnlockedIndex] = useState(null);
    const [canCompleteCurrentModule, setCanCompleteCurrentModule] = useState(false);

    const videoRef = useRef(null);
    const maxWatchedRef = useRef(0);
    const ytPlayerRef = useRef(null);
    const ytContainerRef = useRef(null);

    const activeModule = modules[activeModuleIndex] || modules[0];
    const activeModuleKey = activeModule ? getModuleCompletionKey(activeModule.id, activeModule.videoUrl) : null;
    const isCurrentModuleCompleted = Boolean(activeModuleKey && completedModuleKeys.includes(activeModuleKey));

    // Save completed modules keyed by both ID and video URL
    const handleModuleCompleted = (moduleObj) => {
        const target = moduleObj || activeModule;
        if (!target) return;
        const key = getModuleCompletionKey(target.id, target.videoUrl);
        setCompletedModuleKeys((prev) => {
            if (prev.includes(key)) return prev;
            const updated = [...prev, key];
            try {
                localStorage.setItem(`bootcamp_completed_keys_${userEmail}`, JSON.stringify(updated));
                localStorage.setItem('bootcamp_completed_keys', JSON.stringify(updated));
            } catch (e) { }

            // Trigger animation for next module
            const nextIdx = activeModuleIndex + 1;
            if (nextIdx < modules.length) {
                setNewlyUnlockedIndex(nextIdx);
                setTimeout(() => setNewlyUnlockedIndex(null), 3000);
            }

            return updated;
        });
    };

    // Helper to get watch time storage key
    const getWatchStorageKey = (key) => key ? `watched_sec_${key}_${userEmail}` : null;

    // Reset / load module watch progress on module switch
    useEffect(() => {
        if (!activeModuleKey) {
            maxWatchedRef.current = 0;
            setCanCompleteCurrentModule(false);
            return;
        }

        const sKey = getWatchStorageKey(activeModuleKey);
        const savedTime = sKey ? parseFloat(localStorage.getItem(sKey) || '0') : 0;
        const validSaved = !isNaN(savedTime) && savedTime > 0 ? savedTime : 0;
        maxWatchedRef.current = validSaved;
        setCanCompleteCurrentModule(false);

        // Resume HTML5 video if exists
        if (videoRef.current && validSaved > 2) {
            videoRef.current.currentTime = validSaved;
        }
    }, [activeModuleIndex, activeModuleKey]);

    // Save furthest watched progress helper
    const updateProgressTime = (currentTime) => {
        if (currentTime > maxWatchedRef.current) {
            maxWatchedRef.current = currentTime;
            if (activeModuleKey) {
                const sKey = getWatchStorageKey(activeModuleKey);
                if (sKey) {
                    try {
                        localStorage.setItem(sKey, currentTime.toString());
                    } catch (e) { }
                }
            }
        }
    };

    // --- Direct Video Anti-Skip Handlers ---
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const duration = videoRef.current.duration;

        if (duration && duration - current <= 10) {
            setCanCompleteCurrentModule(true);
        }

        if (duration && current >= duration - 0.5) {
            handleModuleCompleted(activeModule);
        }

        if (!isCurrentModuleCompleted) {
            // If user attempts to skip ahead of their furthest watched time
            if (current > maxWatchedRef.current + 1.5) {
                videoRef.current.currentTime = maxWatchedRef.current;
                setShowModuleSkipWarning(true);
            } else {
                updateProgressTime(current);
            }
        }
    };

    const handleSeeking = () => {
        if (!videoRef.current || isCurrentModuleCompleted) return;
        const current = videoRef.current.currentTime;
        if (current > maxWatchedRef.current + 0.5) {
            videoRef.current.currentTime = maxWatchedRef.current;
            setShowModuleSkipWarning(true);
        }
    };

    const handleVideoEnded = () => {
        setCanCompleteCurrentModule(true);
        handleModuleCompleted(activeModule);
    };

    // --- YouTube IFrame API Anti-Skip & Tracking ---
    const embed = getEmbedUrl(activeModule?.videoUrl);

    useEffect(() => {
        if (!embed || embed.type !== 'youtube') return;

        // Load YouTube IFrame API script if not already present
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        let interval = null;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player || !ytContainerRef.current) return;

            // Destroy previous player instance if any
            if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
                ytPlayerRef.current.destroy();
            }

            const sKey = getWatchStorageKey(activeModuleKey);
            const savedTime = sKey ? parseFloat(localStorage.getItem(sKey) || '0') : 0;
            const resumeAt = !isNaN(savedTime) && savedTime > 2 ? Math.floor(savedTime) : 0;

            ytPlayerRef.current = new window.YT.Player(ytContainerRef.current, {
                videoId: embed.id,
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                    start: resumeAt
                },
                events: {
                    onReady: () => {
                        if (resumeAt > 0 && ytPlayerRef.current?.seekTo) {
                            ytPlayerRef.current.seekTo(resumeAt, true);
                        }
                    },
                    onStateChange: (event) => {
                        // Ended state = 0
                        if (event.data === 0) {
                            setCanCompleteCurrentModule(true);
                            handleModuleCompleted(activeModule);
                        }
                    }
                }
            });

            // Anti-skip interval polling for YouTube
            interval = setInterval(() => {
                if (!ytPlayerRef.current || typeof ytPlayerRef.current.getCurrentTime !== 'function') return;

                try {
                    const current = ytPlayerRef.current.getCurrentTime();
                    const duration = ytPlayerRef.current.getDuration();

                    if (!current || !duration) return;

                    // Last 10 seconds check
                    if (duration - current <= 10) {
                        setCanCompleteCurrentModule(true);
                    }

                    // Anti-skip if not completed
                    if (!isCurrentModuleCompleted) {
                        // User tried to jump forward beyond furthest watched point
                        if (current > maxWatchedRef.current + 2.5) {
                            ytPlayerRef.current.seekTo(maxWatchedRef.current, true);
                            setShowModuleSkipWarning(true);
                        } else {
                            // User is playing naturally or rewound and playing up to furthest watched point
                            updateProgressTime(current);
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
    }, [activeModuleIndex, activeModuleKey, isCurrentModuleCompleted]);

    if (!modules || modules.length === 0) {
        return null;
    }

    const isModDone = (mod) => mod && completedModuleKeys.includes(getModuleCompletionKey(mod.id, mod.videoUrl));
    const completedCount = modules.filter(isModDone).length;
    const progressPercent = Math.round((completedCount / modules.length) * 100);

    return (
        <div className="w-full">
            {/* Overall Curriculum Progress Bar */}
            <div className="floral-glass rounded-2xl p-6 mb-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        <h3 className="font-display font-bold text-white text-lg">Your Bootcamp Progression</h3>
                    </div>
                    <p className="text-on-surface-variant text-xs font-sans">
                        Complete videos sequentially to unlock upcoming advanced modules.
                    </p>
                </div>
                <div className="w-full md:w-64 space-y-2 text-right">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className="text-on-surface-variant">{completedCount} of {modules.length} Completed</span>
                        <span className="text-primary font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Active Video Player Screen */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left 2 Cols: Main Player & Active Module Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden floral-glass-heavy border border-primary/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-black/60 flex items-center justify-center">
                        {embed ? (
                            embed.type === 'youtube' ? (
                                <div className="w-full h-full">
                                    <div ref={ytContainerRef} className="w-full h-full"></div>
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
                                    controlsList={isCurrentModuleCompleted ? '' : 'nodownload noplaybackrate'}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <iframe
                                    key={embed.src}
                                    src={embed.src}
                                    title={activeModule?.title || 'Bootcamp Video'}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full border-0"
                                ></iframe>
                            )
                        ) : (
                            <div className="p-8 text-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-5xl mb-2 text-primary">videocam_off</span>
                                <p className="text-sm">Video streaming link is being prepared by your instructor.</p>
                            </div>
                        )}
                    </div>

                    {/* Active Module Header & Actions */}
                    <div className="floral-glass rounded-2xl p-6 border border-white/10 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <span className="text-xs text-primary font-bold uppercase tracking-wider block mb-1">
                                    Module 0{activeModuleIndex + 1}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold font-display text-white">
                                    {activeModule?.title}
                                </h3>
                            </div>
                            {isCurrentModuleCompleted ? (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    Session Completed
                                </span>
                            ) : canCompleteCurrentModule ? (
                                <button
                                    onClick={() => handleModuleCompleted(activeModule?.id)}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-primary text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce hover:scale-105 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-base font-bold">task_alt</span>
                                    Complete & Unlock Next Module
                                </button>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-on-surface-variant text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                    Watch to End to Unlock Next
                                </span>
                            )}
                        </div>

                        <p className="text-on-surface-variant text-sm leading-relaxed">
                            {activeModule?.description}
                        </p>

                        {/* Resource links if available */}
                        {activeModule?.resourceLink && (
                            <div className="pt-2">
                                <a
                                    href={activeModule.resourceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-400 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">attachment</span>
                                    Download Module Resource / PDF
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right 1 Col: Sequential Modules Sidebar */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/80">
                            Curriculum Modules
                        </span>
                        <span className="text-xs text-primary font-mono font-bold">
                            {modules.length} Sessions
                        </span>
                    </div>

                    {modules.map((mod, idx) => {
                        const isCompleted = isModDone(mod);
                        // Module 0 is unlocked by default; subsequent modules unlock if previous is completed
                        const isUnlocked = idx === 0 || isModDone(modules[idx - 1]);
                        const isActive = idx === activeModuleIndex;
                        const isJustUnlocked = newlyUnlockedIndex === idx;

                        return (
                            <button
                                key={mod.id || idx}
                                onClick={() => {
                                    if (isUnlocked) {
                                        setActiveModuleIndex(idx);
                                    }
                                }}
                                disabled={!isUnlocked}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 relative flex items-start gap-3 border ${
                                    isActive
                                        ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-primary/30'
                                        : isUnlocked
                                        ? 'floral-glass border-white/5 hover:border-white/20 text-on-surface'
                                        : 'bg-black/30 border-white/5 opacity-50 cursor-not-allowed text-on-surface-variant'
                                } ${isJustUnlocked ? 'animate-bounce border-primary' : ''}`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                        isCompleted
                                            ? 'bg-primary text-black'
                                            : isUnlocked
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : 'bg-white/5 text-on-surface-variant border border-white/10'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                                    ) : isUnlocked ? (
                                        `0${idx + 1}`
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                        <h4 className={`text-xs font-bold truncate ${isActive ? 'text-primary' : 'text-white'}`}>
                                            {mod.title}
                                        </h4>
                                        <span className="text-[10px] text-on-surface-variant/70 flex-shrink-0 font-mono">
                                            {mod.duration || 'Video'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant line-clamp-1">
                                        {isUnlocked ? mod.description : `Locked: Complete Module 0${idx} first`}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Anti-Skip Warning Modal */}
            {showModuleSkipWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="floral-glass-heavy border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/30">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white mb-2">Skipping Video Not Allowed</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                            You must watch this training module completely to unlock the next session in your curriculum.
                        </p>
                        <button
                            onClick={() => setShowModuleSkipWarning(false)}
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg"
                        >
                            Continue Watching
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
