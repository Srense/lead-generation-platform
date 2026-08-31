import { supabase } from './supabase';

let timestampSyncTimeouts = {};

export const VIP_UNRESTRICTED_EMAILS = [
    'sohelrizwan36@gmail.com'
];

/**
 * Check if the given email has VIP unrestricted access (no locks, full skipping, all content unlocked)
 */
export const isVipEmail = (email) => {
    if (!email) {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null;
        if (stored) return isVipEmail(stored);
        return false;
    }
    const clean = email.trim().toLowerCase();
    return VIP_UNRESTRICTED_EMAILS.some(vip => vip.toLowerCase() === clean);
};

/**
 * Persists learner progress to Supabase Cloud & LocalStorage
 * Ensures cross-device and cross-browser synchronization
 */
export const saveUserCloudProgress = async (email, progressUpdate) => {
    if (!email) return;
    const normalizedEmail = email.trim().toLowerCase();

    try {
        // 1. Update localStorage
        let currentSaved = {};
        try {
            const raw = localStorage.getItem(`cloud_progress_${normalizedEmail}`);
            if (raw) currentSaved = JSON.parse(raw);
        } catch (e) { }

        // Deep merge timestamps so they aren't overwritten
        const merged = {
            ...currentSaved,
            ...progressUpdate,
            hero_timestamps: {
                ...(currentSaved.hero_timestamps || {}),
                ...(progressUpdate.hero_timestamps || {})
            },
            why_timestamps: {
                ...(currentSaved.why_timestamps || {}),
                ...(progressUpdate.why_timestamps || {})
            },
            bootcamp_timestamps: {
                ...(currentSaved.bootcamp_timestamps || {}),
                ...(progressUpdate.bootcamp_timestamps || {})
            },
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(`cloud_progress_${normalizedEmail}`, JSON.stringify(merged));

        // Sync individual local storage keys for instant backwards compatibility
        if (merged.first_video_completed) {
            localStorage.setItem('first_video_completed', 'true');
            localStorage.setItem(`first_video_completed_${normalizedEmail}`, 'true');
        }
        if (merged.bootcamp_unlocked) {
            localStorage.setItem('bootcamp_unlocked', 'true');
            localStorage.setItem(`bootcamp_unlocked_${normalizedEmail}`, 'true');
        }
        if (merged.bootcamp_completed_keys && Array.isArray(merged.bootcamp_completed_keys)) {
            localStorage.setItem('bootcamp_completed_keys', JSON.stringify(merged.bootcamp_completed_keys));
            localStorage.setItem(`bootcamp_completed_keys_${normalizedEmail}`, JSON.stringify(merged.bootcamp_completed_keys));
        }
        if (merged.bootcamp_all_completed) {
            localStorage.setItem('bootcamp_all_completed', 'true');
            localStorage.setItem(`bootcamp_all_completed_${normalizedEmail}`, 'true');
        }
        if (merged.special_2cc_completed) {
            localStorage.setItem('special_2cc_completed', 'true');
            localStorage.setItem(`special_2cc_completed_${normalizedEmail}`, 'true');
        }

        // Hydrate timestamp keys
        if (merged.hero_timestamps) {
            Object.entries(merged.hero_timestamps).forEach(([vKey, sec]) => {
                localStorage.setItem(`hero_watch_sec_${vKey}`, sec.toString());
                localStorage.setItem(`hero_watch_sec_${vKey}_${normalizedEmail}`, sec.toString());
            });
        }
        if (merged.why_timestamps) {
            Object.entries(merged.why_timestamps).forEach(([wKey, sec]) => {
                localStorage.setItem(`why_watch_sec_${wKey}`, sec.toString());
                localStorage.setItem(`why_watch_sec_${wKey}_${normalizedEmail}`, sec.toString());
            });
        }
        if (merged.bootcamp_timestamps) {
            Object.entries(merged.bootcamp_timestamps).forEach(([mKey, sec]) => {
                localStorage.setItem(`watch_sec_${mKey}_${normalizedEmail}`, sec.toString());
            });
        }
        if (merged.special_2cc_timestamp) {
            localStorage.setItem(`special_2cc_watch_sec_${normalizedEmail}`, merged.special_2cc_timestamp.toString());
        }

        // 2. Cloud Sync to Supabase Auth user_metadata
        if (supabase) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user && user.email?.toLowerCase() === normalizedEmail) {
                    await supabase.auth.updateUser({
                        data: {
                            progress: merged
                        }
                    });
                }
            } catch (authErr) {
                console.warn("Supabase Auth progress sync notice:", authErr);
            }

            // 3. Cloud Sync to Config table as resilient key-value backup
            try {
                await supabase.from('config').upsert({
                    key: `user_progress_${normalizedEmail}`,
                    value: JSON.stringify(merged)
                });
            } catch (cfgErr) {
                console.warn("Supabase Config progress sync notice:", cfgErr);
            }
        }
    } catch (e) {
        console.error("Failed to save cloud progress:", e);
    }
};

/**
 * Throttled live watch timestamp sync helper
 * Saves exact video watch position to cloud every 3 seconds while playing
 */
export const syncWatchTimestamp = (email, type, videoKey, seconds) => {
    if (!email || !seconds || isNaN(seconds)) return;
    const normalizedEmail = email.trim().toLowerCase();
    const sec = parseFloat(seconds);
    if (sec <= 0) return;

    // 1. Immediately update localStorage for instant playback continuity
    if (type === 'hero' && videoKey) {
        localStorage.setItem(`hero_watch_sec_${videoKey}`, sec.toString());
        localStorage.setItem(`hero_watch_sec_${videoKey}_${normalizedEmail}`, sec.toString());
    } else if (type === 'why' && videoKey) {
        localStorage.setItem(`why_watch_sec_${videoKey}`, sec.toString());
        localStorage.setItem(`why_watch_sec_${videoKey}_${normalizedEmail}`, sec.toString());
    } else if (type === 'bootcamp' && videoKey) {
        localStorage.setItem(`watch_sec_${videoKey}_${normalizedEmail}`, sec.toString());
    } else if (type === 'special_2cc') {
        localStorage.setItem(`special_2cc_watch_sec_${normalizedEmail}`, sec.toString());
    }

    // 2. Debounce cloud update
    const timeoutKey = `${normalizedEmail}_${type}_${videoKey || 'def'}`;
    if (timestampSyncTimeouts[timeoutKey]) {
        clearTimeout(timestampSyncTimeouts[timeoutKey]);
    }

    timestampSyncTimeouts[timeoutKey] = setTimeout(() => {
        const updatePayload = {};
        if (type === 'hero' && videoKey) {
            updatePayload.hero_timestamps = { [videoKey]: sec };
        } else if (type === 'why' && videoKey) {
            updatePayload.why_timestamps = { [videoKey]: sec };
        } else if (type === 'bootcamp' && videoKey) {
            updatePayload.bootcamp_timestamps = { [videoKey]: sec };
        } else if (type === 'special_2cc') {
            updatePayload.special_2cc_timestamp = sec;
        }

        saveUserCloudProgress(normalizedEmail, updatePayload);
    }, 2500);
};

/**
 * Fetches learner progress from Supabase Cloud on login / new browser
 */
export const fetchUserCloudProgress = async (email) => {
    if (!email) return null;
    const normalizedEmail = email.trim().toLowerCase();
    let mergedProgress = {};

    if (isVipEmail(normalizedEmail)) {
        const special2ccDone =
            localStorage.getItem('special_2cc_completed') === 'true' ||
            localStorage.getItem(`special_2cc_completed_${normalizedEmail}`) === 'true';

        mergedProgress = {
            first_video_completed: true,
            bootcamp_unlocked: true,
            bootcamp_all_completed: true,
            special_2cc_completed: special2ccDone,
            vip_unrestricted: true
        };
        localStorage.setItem('first_video_completed', 'true');
        localStorage.setItem(`first_video_completed_${normalizedEmail}`, 'true');
        localStorage.setItem('bootcamp_unlocked', 'true');
        localStorage.setItem(`bootcamp_unlocked_${normalizedEmail}`, 'true');
        localStorage.setItem('bootcamp_all_completed', 'true');
        localStorage.setItem(`bootcamp_all_completed_${normalizedEmail}`, 'true');
        if (special2ccDone) {
            localStorage.setItem('special_2cc_completed', 'true');
            localStorage.setItem(`special_2cc_completed_${normalizedEmail}`, 'true');
        }
        localStorage.setItem(`cloud_progress_${normalizedEmail}`, JSON.stringify(mergedProgress));
        return mergedProgress;
    }

    try {
        // 1. Try local storage cache
        const local = localStorage.getItem(`cloud_progress_${normalizedEmail}`);
        if (local) {
            try {
                mergedProgress = { ...mergedProgress, ...JSON.parse(local) };
            } catch (e) { }
        }

        if (supabase) {
            // 2. Try Supabase Auth user_metadata
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user && user.user_metadata?.progress) {
                    const authProgress = user.user_metadata.progress;
                    mergedProgress = {
                        ...mergedProgress,
                        ...authProgress,
                        hero_timestamps: { ...(mergedProgress.hero_timestamps || {}), ...(authProgress.hero_timestamps || {}) },
                        why_timestamps: { ...(mergedProgress.why_timestamps || {}), ...(authProgress.why_timestamps || {}) },
                        bootcamp_timestamps: { ...(mergedProgress.bootcamp_timestamps || {}), ...(authProgress.bootcamp_timestamps || {}) }
                    };
                }
            } catch (e) { }

            // 3. Try Supabase Config table backup
            try {
                const { data } = await supabase
                    .from('config')
                    .select('value')
                    .eq('key', `user_progress_${normalizedEmail}`)
                    .maybeSingle();

                if (data && data.value) {
                    const parsed = JSON.parse(data.value);
                    mergedProgress = {
                        ...mergedProgress,
                        ...parsed,
                        hero_timestamps: { ...(mergedProgress.hero_timestamps || {}), ...(parsed.hero_timestamps || {}) },
                        why_timestamps: { ...(mergedProgress.why_timestamps || {}), ...(parsed.why_timestamps || {}) },
                        bootcamp_timestamps: { ...(mergedProgress.bootcamp_timestamps || {}), ...(parsed.bootcamp_timestamps || {}) }
                    };
                }
            } catch (e) { }
        }

        // Hydrate local storage for offline / quick access
        if (mergedProgress && Object.keys(mergedProgress).length > 0) {
            localStorage.setItem(`cloud_progress_${normalizedEmail}`, JSON.stringify(mergedProgress));

            if (mergedProgress.first_video_completed) {
                localStorage.setItem('first_video_completed', 'true');
                localStorage.setItem(`first_video_completed_${normalizedEmail}`, 'true');
            }
            if (mergedProgress.bootcamp_unlocked) {
                localStorage.setItem('bootcamp_unlocked', 'true');
                localStorage.setItem(`bootcamp_unlocked_${normalizedEmail}`, 'true');
            }
            if (mergedProgress.bootcamp_completed_keys && Array.isArray(mergedProgress.bootcamp_completed_keys)) {
                localStorage.setItem('bootcamp_completed_keys', JSON.stringify(mergedProgress.bootcamp_completed_keys));
                localStorage.setItem(`bootcamp_completed_keys_${normalizedEmail}`, JSON.stringify(mergedProgress.bootcamp_completed_keys));
            }
            if (mergedProgress.bootcamp_all_completed) {
                localStorage.setItem('bootcamp_all_completed', 'true');
                localStorage.setItem(`bootcamp_all_completed_${normalizedEmail}`, 'true');
            }
            if (mergedProgress.special_2cc_completed) {
                localStorage.setItem('special_2cc_completed', 'true');
                localStorage.setItem(`special_2cc_completed_${normalizedEmail}`, 'true');
            }

            // Hydrate exact watch timestamps to local storage
            if (mergedProgress.hero_timestamps) {
                Object.entries(mergedProgress.hero_timestamps).forEach(([vKey, sec]) => {
                    localStorage.setItem(`hero_watch_sec_${vKey}`, sec.toString());
                    localStorage.setItem(`hero_watch_sec_${vKey}_${normalizedEmail}`, sec.toString());
                });
            }
            if (mergedProgress.why_timestamps) {
                Object.entries(mergedProgress.why_timestamps).forEach(([wKey, sec]) => {
                    localStorage.setItem(`why_watch_sec_${wKey}`, sec.toString());
                    localStorage.setItem(`why_watch_sec_${wKey}_${normalizedEmail}`, sec.toString());
                });
            }
            if (mergedProgress.bootcamp_timestamps) {
                Object.entries(mergedProgress.bootcamp_timestamps).forEach(([mKey, sec]) => {
                    localStorage.setItem(`watch_sec_${mKey}_${normalizedEmail}`, sec.toString());
                });
            }
            if (mergedProgress.special_2cc_timestamp) {
                localStorage.setItem(`special_2cc_watch_sec_${normalizedEmail}`, mergedProgress.special_2cc_timestamp.toString());
            }
        }
    } catch (e) {
        console.error("Error retrieving cloud progress:", e);
    }

    return mergedProgress;
};
