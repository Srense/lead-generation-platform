import { supabase } from './supabase';

/**
 * Persists learner progress to Supabase Cloud & LocalStorage
 * Ensures cross-device and cross-browser synchronization
 */
export const saveUserCloudProgress = async (email, progressUpdate) => {
    if (!email) return;
    const normalizedEmail = email.trim().toLowerCase();

    try {
        // 1. Update localStorage
        const currentSaved = JSON.parse(localStorage.getItem(`cloud_progress_${normalizedEmail}`) || '{}');
        const merged = { ...currentSaved, ...progressUpdate, updatedAt: new Date().toISOString() };
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
 * Fetches learner progress from Supabase Cloud on login / new browser
 */
export const fetchUserCloudProgress = async (email) => {
    if (!email) return null;
    const normalizedEmail = email.trim().toLowerCase();
    let mergedProgress = {};

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
                    mergedProgress = { ...mergedProgress, ...user.user_metadata.progress };
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
                    mergedProgress = { ...mergedProgress, ...parsed };
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
        }
    } catch (e) {
        console.error("Error retrieving cloud progress:", e);
    }

    return mergedProgress;
};
