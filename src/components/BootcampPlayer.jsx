import { useState, useRef, useEffect } from 'react';
import { saveUserCloudProgress, fetchUserCloudProgress, syncWatchTimestamp, isVipEmail } from '../lib/userProgressSync';

// Helper to extract YouTube video ID from links, shorts, or iframe embed code
export const getYouTubeVideoId = (rawUrl) => {
    if (!rawUrl) return null;
    let url = rawUrl.trim();
    // If an iframe snippet was pasted, extract src
    const iframeSrc = url.match(/src=["']([^"']+)["']/i);
    if (iframeSrc && iframeSrc[1]) {
        url = iframeSrc[1];
    }
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([\w-]{11})/i);
    return match ? match[1] : null;
};

// Helper to convert standard video URLs/embed codes to embeddable URLs
export const getEmbedUrl = (rawUrl) => {
    if (!rawUrl) return null;
    let url = rawUrl.trim();

    // If full iframe tag pasted
    const iframeSrc = url.match(/src=["']([^"']+)["']/i);
    if (iframeSrc && iframeSrc[1]) {
        url = iframeSrc[1];
    }

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

    // Google Drive Preview URL
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    if (driveMatch && driveMatch[1]) {
        return {
            type: 'iframe',
            src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`
        };
    }

    // Generic iframe embed URL (e.g. iframes from Loom, Wistia, etc.)
    if (url.includes('/embed/') || url.includes('/preview')) {
        return {
            type: 'iframe',
            src: url
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

export default function BootcampPlayer({ modules = [], userEmail = '', onAllModulesCompleted }) {
    const isVip = isVipEmail(userEmail || localStorage.getItem('user_email'));
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);
    const [completedModuleKeys, setCompletedModuleKeys] = useState(() => {
        if (isVip) {
            return (modules || []).map((m) => getModuleCompletionKey(m.id, m.videoUrl));
        }
        try {
            const saved = localStorage.getItem(`bootcamp_completed_keys_${userEmail}`) || localStorage.getItem('bootcamp_completed_keys');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showModuleSkipWarning, setShowModuleSkipWarning] = useState(false);
    const [newlyUnlockedIndex, setNewlyUnlockedIndex] = useState(null);
    const [canCompleteCurrentModule, setCanCompleteCurrentModule] = useState(() => isVip);

    const videoRef = useRef(null);
    const maxWatchedRef = useRef(0);
    const ytPlayerRef = useRef(null);
    const ytContainerRef = useRef(null);

    const activeModule = modules[activeModuleIndex] || modules[0];
    const activeModuleKey = activeModule ? getModuleCompletionKey(activeModule.id, activeModule.videoUrl) : null;
    const isCurrentModuleCompleted = Boolean(isVip || (activeModuleKey && completedModuleKeys.includes(activeModuleKey)));

    // Fetch & hydrate cloud progress when userEmail is supplied
    useEffect(() => {
        if (userEmail) {
            fetchUserCloudProgress(userEmail).then((cloud) => {
                if (cloud && Array.isArray(cloud.bootcamp_completed_keys)) {
                    setCompletedModuleKeys((prev) => {
                        const merged = Array.from(new Set([...prev, ...cloud.bootcamp_completed_keys]));
                        return merged;
                    });
                }
            });
        }
    }, [userEmail]);

    // Check overall completion of all modules in curriculum
    useEffect(() => {
        if (modules && modules.length > 0) {
            const allDone = modules.every((m) =>
                completedModuleKeys.includes(getModuleCompletionKey(m.id, m.videoUrl))
            );
            if (allDone) {
                try {
                    localStorage.setItem(`bootcamp_all_completed_${userEmail}`, 'true');
                    localStorage.setItem('bootcamp_all_completed', 'true');
                } catch (e) { }
                if (typeof onAllModulesCompleted === 'function') {
                    onAllModulesCompleted(true);
                }
            } else {
                if (typeof onAllModulesCompleted === 'function') {
                    onAllModulesCompleted(false);
                }
            }
        }
    }, [completedModuleKeys, modules, userEmail, onAllModulesCompleted]);

    // Save completed modules keyed by both ID and video URL
    const handleModuleCompleted = (moduleOrId) => {
        let target = activeModule;
        if (typeof moduleOrId === 'object' && moduleOrId !== null) {
            target = moduleOrId;
        } else if (typeof moduleOrId === 'string') {
            target = modules.find((m) => m.id === moduleOrId) || activeModule;
        }
        if (!target) return;
        const key = getModuleCompletionKey(target.id, target.videoUrl);
        setCompletedModuleKeys((prev) => {
            if (prev.includes(key)) return prev;
            const updated = [...prev, key];
            try {
                localStorage.setItem(`bootcamp_completed_keys_${userEmail}`, JSON.stringify(updated));
                localStorage.setItem('bootcamp_completed_keys', JSON.stringify(updated));
            } catch (e) { }

            // Sync to Supabase cloud across all browsers and devices
            if (userEmail) {
                const allDone = modules.every((m) =>
                    updated.includes(getModuleCompletionKey(m.id, m.videoUrl))
                );
                saveUserCloudProgress(userEmail, {
                    bootcamp_completed_keys: updated,
                    bootcamp_all_completed: allDone,
                    bootcamp_unlocked: true,
                    first_video_completed: true
                });
            }

            // Trigger animation for next module
            const nextIdx = activeModuleIndex + 1;
            if (nextIdx < modules.length) {
                setNewlyUnlockedIndex(nextIdx);
                setTimeout(() => setNewlyUnlockedIndex(null), 3000);
            }

            return updated;
        });
    };

    // Helper for watch progress storage key
    const getWatchStorageKey = (key) => key ? `watch_sec_${key}_${userEmail}` : null;

    // Load saved watch position and resume video on module switch
    useEffect(() => {
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
    const saveWatchProgress = (currentTime) => {
        if (currentTime > maxWatchedRef.current) {
            maxWatchedRef.current = currentTime;
        }
        if (activeModuleKey && currentTime > 2) {
            const sKey = getWatchStorageKey(activeModuleKey);
            if (sKey) {
                try {
                    localStorage.setItem(sKey, currentTime.toString());
                } catch (e) { }
            }
            if (userEmail) {
                syncWatchTimestamp(userEmail, 'bootcamp', activeModuleKey, currentTime);
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

        // If user already completed module or is VIP, allow free seeking & skipping
        if (isCurrentModuleCompleted || isVip) return;

        if (current > maxWatchedRef.current + 1.5) {
            videoRef.current.currentTime = maxWatchedRef.current;
            setShowModuleSkipWarning(true);
        } else {
            saveWatchProgress(current);
        }
    };

    const handleSeeking = () => {
        if (!videoRef.current || isCurrentModuleCompleted || isVip) return;
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

                    // Anti-skip if not completed and not VIP
                    if (!isCurrentModuleCompleted && !isVip) {
                        if (current > maxWatchedRef.current + 2.5) {
                            ytPlayerRef.current.seekTo(maxWatchedRef.current, true);
                            setShowModuleSkipWarning(true);
                        } else {
                            saveWatchProgress(current);
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
    }, [activeModuleIndex, activeModuleKey, isCurrentModuleCompleted, isVip]);

    if (!modules || modules.length === 0) {
        return null;
    }

    const isModDone = (mod) => isVip || (mod && completedModuleKeys.includes(getModuleCompletionKey(mod.id, mod.videoUrl)));
    const completedCount = isVip ? modules.length : modules.filter(isModDone).length;
    const progressPercent = Math.round((completedCount / modules.length) * 100);

    // Progressive Tier/Phase reveal: Modules appear in batches of 3.
    // VIP gets all phases unlocked immediately!
    const isPhaseUnlockedForIndex = (idx) => {
        if (isVip || idx < 3) return true;
        const requiredBatchEnd = Math.floor(idx / 3) * 3;
        for (let i = 0; i < requiredBatchEnd; i++) {
            if (!isModDone(modules[i])) {
                return false;
            }
        }
        return true;
    };

    const visibleModulesWithIndex = modules
        .map((mod, idx) => ({ ...mod, originalIndex: idx }))
        .filter((mod) => isPhaseUnlockedForIndex(mod.originalIndex));

    const totalHiddenModules = modules.length - visibleModulesWithIndex.length;
    const currentPhase = Math.floor(activeModuleIndex / 3) + 1;
    const totalPhases = Math.ceil(modules.length / 3);
    const nextPhaseNumber = Math.floor(visibleModulesWithIndex.length / 3) + 1;
    const nextPhaseBatchCount = Math.min(3, totalHiddenModules);

    return (
        <div className="w-full max-w-full overflow-hidden">
            {/* Overall Curriculum Progress Bar */}
            <div className="floral-glass rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                <div className="w-full min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">analytics</span>
                        <h3 className="font-display font-bold text-white text-base sm:text-lg truncate">Your Bootcamp Progression</h3>
                        {totalPhases > 1 && (
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold">
                                Phase {currentPhase} of {totalPhases}
                            </span>
                        )}
                    </div>
                    <p className="text-on-surface-variant text-xs font-sans">
                        Complete videos sequentially to unlock upcoming advanced modules.
                    </p>
                </div>
                <div className="w-full md:w-64 space-y-2 text-left md:text-right flex-shrink-0">
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
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start w-full">
                {/* Left 2 Cols: Main Player & Active Module Info */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full min-w-0">
                    <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden floral-glass-heavy border border-primary/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-black/60 flex items-center justify-center">
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
                                    className="absolute inset-0 w-full h-full border-0"
                                ></iframe>
                            )
                        ) : (
                            <div className="p-6 sm:p-8 text-center text-on-surface-variant">
                                <span className="material-symbols-outlined text-4xl sm:text-5xl mb-2 text-primary">videocam_off</span>
                                <p className="text-xs sm:text-sm">Video streaming link is being prepared by your instructor.</p>
                            </div>
                        )}
                    </div>

                    {/* Active Module Header & Actions */}
                    <div className="floral-glass rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4 w-full min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <span className="text-xs text-primary font-bold uppercase tracking-wider block mb-1">
                                    Module 0{activeModuleIndex + 1}
                                </span>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-white">
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
                                    onClick={() => handleModuleCompleted(activeModule)}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-primary text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce hover:scale-105 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-base font-bold">task_alt</span>
                                    Complete & Unlock Next Module
                                </button>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-on-surface-variant text-[11px] sm:text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                    Watch to End to Unlock Next
                                </span>
                            )}
                        </div>

                        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
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
                <div className="space-y-3 w-full min-w-0">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/80">
                            Curriculum Modules
                        </span>
                        <span className="text-xs text-primary font-mono font-bold">
                            {visibleModulesWithIndex.length} of {modules.length} Visible
                        </span>
                    </div>

                    {visibleModulesWithIndex.map((mod) => {
                        const originalIdx = mod.originalIndex;
                        const isCompleted = isModDone(mod);
                        // Module 0 is unlocked by default; subsequent modules unlock if previous is completed
                        const isUnlocked = originalIdx === 0 || isModDone(modules[originalIdx - 1]);
                        const isActive = originalIdx === activeModuleIndex;
                        const isJustUnlocked = newlyUnlockedIndex === originalIdx;

                        return (
                            <button
                                key={mod.id || originalIdx}
                                onClick={() => {
                                    if (isUnlocked) {
                                        setActiveModuleIndex(originalIdx);
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
                                        `0${originalIdx + 1}`
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
                                        {isUnlocked ? mod.description : `Locked: Complete Module 0${originalIdx} first`}
                                    </p>
                                </div>
                            </button>
                        );
                    })}

                    {/* Locked Next Phase Card */}
                    {totalHiddenModules > 0 && (
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-dashed border-white/15 text-center space-y-1.5 mt-2 shadow-inner">
                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
                                <span className="material-symbols-outlined text-sm">lock</span>
                                Phase {nextPhaseNumber} Masterclass ({nextPhaseBatchCount} More Sessions)
                            </div>
                            <p className="text-[11px] text-on-surface-variant/70 leading-snug">
                                Complete all sessions in Phase {nextPhaseNumber - 1} to unlock Phase {nextPhaseNumber}.
                            </p>
                        </div>
                    )}
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
