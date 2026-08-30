import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLead, checkLeadStatus } from '../lib/submitLead';
import Loader from '../components/Loader';
import BootcampPlayer, { getEmbedUrl } from '../components/BootcampPlayer';
import SpecialSession2CC from '../components/SpecialSession2CC';
import AuthGate from '../components/AuthGate';
import { useUserAuth } from '../context/UserAuthContext';
import { saveUserCloudProgress, fetchUserCloudProgress } from '../lib/userProgressSync';

// Helper to create a consistent storage key from video URL
const getVideoKey = (url) => {
    if (!url) return 'default_video';
    try {
        return 'video_' + btoa(encodeURIComponent(url)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
    } catch {
        return 'video_' + url.length;
    }
};

const DEFAULT_BOOTCAMP_MODULES = [
    {
        id: 'module-1',
        title: 'Module 01: Foundations & Mindset',
        description: 'Core fundamentals of digital business and high-income leverage systems.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '12 mins',
        resourceLink: ''
    },
    {
        id: 'module-2',
        title: 'Module 02: High-Converting Digital Systems',
        description: 'Step-by-step blueprint for automating lead generation and conversion funnels.',
        videoUrl: '',
        duration: '18 mins',
        resourceLink: ''
    },
    {
        id: 'module-3',
        title: 'Module 03: Execution, Scaling & Mentorship',
        description: 'Roadmap to scale from first dollar to consistent daily recurring assets.',
        videoUrl: '',
        duration: '25 mins',
        resourceLink: ''
    }
];

export default function Dashboard() {
    const { isAuthenticated, userProfile } = useUserAuth();

    const [minutes, setMinutes] = useState(14);
    const [seconds, setSeconds] = useState(59);
    const [bannerText, setBannerText] = useState('🎁 This training is completely FREE for a limited time. Previously ₹299, but today you can access it at absolutely no cost.');
    const [isUrgentVisible, setIsUrgentVisible] = useState(true);

    const [userEmail, setUserEmail] = useState(() => userProfile?.email || localStorage.getItem('user_email') || '');
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [videoAsset, setVideoAsset] = useState(null);
    const [whySessionAsset, setWhySessionAsset] = useState(null);
    const [bootcampModules, setBootcampModules] = useState(DEFAULT_BOOTCAMP_MODULES);
    const [special2ccConfig, setSpecial2ccConfig] = useState(null);
    const [flpJoinUrl, setFlpJoinUrl] = useState('https://foreverliving.com/join/ind');
    const [showSkipWarning, setShowSkipWarning] = useState(false);
    const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('user_registered') === 'true');
    
    // First video complete state
    const [isFirstVideoCompleted, setIsFirstVideoCompleted] = useState(() => {
        const savedEmail = userProfile?.email || localStorage.getItem('user_email');
        if (savedEmail && localStorage.getItem(`first_video_completed_${savedEmail}`) === 'true') {
            return true;
        }
        return localStorage.getItem('first_video_completed') === 'true' || localStorage.getItem('video_completed') === 'true';
    });

    // Permanent Bootcamp unlock state (Why session completed)
    const [isBootcampUnlocked, setIsBootcampUnlocked] = useState(() => {
        const savedEmail = userProfile?.email || localStorage.getItem('user_email');
        if (savedEmail && localStorage.getItem(`bootcamp_unlocked_${savedEmail}`) === 'true') {
            return true;
        }
        return localStorage.getItem('bootcamp_unlocked') === 'true';
    });

    // All bootcamp modules completed state (Required for 2CC Special Session to appear)
    const [isAllBootcampCompleted, setIsAllBootcampCompleted] = useState(() => {
        const savedEmail = userProfile?.email || localStorage.getItem('user_email');
        if (savedEmail && localStorage.getItem(`bootcamp_all_completed_${savedEmail}`) === 'true') {
            return true;
        }
        return localStorage.getItem('bootcamp_all_completed') === 'true';
    });

    // Per-video completion state (controls anti-skip for the active video)
    const [isCurrentVideoCompleted, setIsCurrentVideoCompleted] = useState(false);

    // Sync state when userProfile changes or on initial load
    useEffect(() => {
        const syncProfile = async () => {
            const email = userProfile?.email || localStorage.getItem('user_email');
            if (email) {
                const normalized = email.trim().toLowerCase();
                setUserEmail(normalized);
                setIsRegistered(true);
                setIsFirstVideoCompleted(true);
                setFormData(prev => ({
                    ...prev,
                    name: prev.name || userProfile?.name || '',
                    email: prev.email || normalized
                }));

                // Restore cloud progress from Supabase
                const cloudData = await fetchUserCloudProgress(normalized);
                if (cloudData) {
                    if (cloudData.first_video_completed) {
                        setIsFirstVideoCompleted(true);
                    }
                    if (cloudData.bootcamp_unlocked) {
                        setIsBootcampUnlocked(true);
                    }
                    if (cloudData.bootcamp_all_completed) {
                        setIsAllBootcampCompleted(true);
                    }
                }
            }
        };
        syncProfile();
    }, [userProfile, isAuthenticated]);

    const videoRef = useRef(null);
    const maxWatchedTimeRef = useRef(0);
    const whySessionRef = useRef(null);
    const maxWhySessionWatchedRef = useRef(0);
    const bootcampRef = useRef(null);
    const navigate = useNavigate();

    const markVideoCompleted = (currentUrl) => {
        const urlToUse = currentUrl || videoAsset;
        setIsCurrentVideoCompleted(true);
        setIsFirstVideoCompleted(true);
        localStorage.setItem('first_video_completed', 'true');
        localStorage.setItem('video_completed', 'true');

        const activeEmail = userEmail || userProfile?.email || localStorage.getItem('user_email');
        if (activeEmail) {
            saveUserCloudProgress(activeEmail, { first_video_completed: true });
        }
        if (urlToUse) {
            const vKey = getVideoKey(urlToUse);
            localStorage.setItem(`completed_${vKey}`, 'true');
            if (activeEmail) {
                localStorage.setItem(`completed_${vKey}_${activeEmail}`, 'true');
                localStorage.setItem(`first_video_completed_${activeEmail}`, 'true');
            }
        }
    };

    const markWhySessionCompleted = () => {
        setIsBootcampUnlocked(true);
        setIsFirstVideoCompleted(true);
        localStorage.setItem('bootcamp_unlocked', 'true');

        const activeEmail = userEmail || userProfile?.email || localStorage.getItem('user_email');
        if (activeEmail) {
            saveUserCloudProgress(activeEmail, { bootcamp_unlocked: true, first_video_completed: true });
        }
        if (whySessionAsset) {
            const vKey = getVideoKey(whySessionAsset);
            localStorage.setItem(`completed_${vKey}`, 'true');
            if (activeEmail) {
                localStorage.setItem(`completed_${vKey}_${activeEmail}`, 'true');
                localStorage.setItem(`bootcamp_unlocked_${activeEmail}`, 'true');
            }
        }
    };

    // Anti-skip & completion handlers
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const duration = videoRef.current.duration;

        // Check completion if near end
        if (duration && current >= duration - 1) {
            markVideoCompleted();
        }

        // If user already completed THIS specific video, allow free seeking
        if (isCurrentVideoCompleted) {
            return;
        }

        // If current time jumped ahead of max watched time by more than 1.5 seconds
        if (current > maxWatchedTimeRef.current + 1.5) {
            videoRef.current.currentTime = maxWatchedTimeRef.current;
            setShowSkipWarning(true);
        } else {
            maxWatchedTimeRef.current = Math.max(maxWatchedTimeRef.current, current);
            if (current > 2 && videoAsset) {
                const vKey = getVideoKey(videoAsset);
                try {
                    localStorage.setItem(`hero_watch_sec_${vKey}`, current.toString());
                } catch (e) {}
            }
        }
    };

    const handleSeeking = () => {
        if (!videoRef.current) return;
        // If user already completed THIS specific video, allow free seeking
        if (isCurrentVideoCompleted) {
            return;
        }
        const current = videoRef.current.currentTime;
        // If seeking ahead of max watched time
        if (current > maxWatchedTimeRef.current + 0.5) {
            videoRef.current.currentTime = maxWatchedTimeRef.current;
            setShowSkipWarning(true);
        }
    };

    const handleVideoEnded = () => {
        markVideoCompleted();
    };

    const handleDismissWarning = () => {
        setShowSkipWarning(false);
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    const handleWhySessionTimeUpdate = () => {
        if (!whySessionRef.current) return;
        const current = whySessionRef.current.currentTime;
        const duration = whySessionRef.current.duration;

        if (duration && current >= duration - 1) {
            markWhySessionCompleted();
        }

        if (isBootcampUnlocked) return;

        if (current > maxWhySessionWatchedRef.current + 1.5) {
            whySessionRef.current.currentTime = maxWhySessionWatchedRef.current;
            setShowSkipWarning(true);
        } else {
            maxWhySessionWatchedRef.current = Math.max(maxWhySessionWatchedRef.current, current);
            if (current > 2 && whySessionAsset) {
                const vKey = getVideoKey(whySessionAsset);
                try {
                    localStorage.setItem(`why_watch_sec_${vKey}`, current.toString());
                } catch (e) {}
            }
        }
    };

    const handleWhySessionSeeking = () => {
        if (!whySessionRef.current) return;
        if (isBootcampUnlocked) return;
        const current = whySessionRef.current.currentTime;
        if (current > maxWhySessionWatchedRef.current + 0.5) {
            whySessionRef.current.currentTime = maxWhySessionWatchedRef.current;
            setShowSkipWarning(true);
        }
    };

    const handleWhySessionEnded = () => {
        markWhySessionCompleted();
    };

    const scrollToVideo = () => {
        const videoElement = document.getElementById('training');
        if (videoElement) {
            videoElement.scrollIntoView({ behavior: 'smooth' });
        }
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    };

    useEffect(() => {
        const fetchRemoteAssets = async () => {
            const { supabase } = await import('../lib/supabase');
            if (!supabase) return;

            const savedEmail = localStorage.getItem('user_email');
            const alreadyUnlocked =
                localStorage.getItem('bootcamp_unlocked') === 'true' ||
                (savedEmail && localStorage.getItem(`bootcamp_unlocked_${savedEmail}`) === 'true');

            if (alreadyUnlocked) {
                setIsBootcampUnlocked(true);
            }

            const alreadyFirstCompleted = 
                localStorage.getItem('first_video_completed') === 'true' || 
                localStorage.getItem('video_completed') === 'true' ||
                (savedEmail && localStorage.getItem(`first_video_completed_${savedEmail}`) === 'true');

            if (alreadyFirstCompleted) {
                setIsFirstVideoCompleted(true);
            }

            const alreadyAllCompleted =
                localStorage.getItem('bootcamp_all_completed') === 'true' ||
                (savedEmail && localStorage.getItem(`bootcamp_all_completed_${savedEmail}`) === 'true');
            if (alreadyAllCompleted) {
                setIsAllBootcampCompleted(true);
            }

            // Fetch all system configs in a single optimized query (eliminates 406 errors on missing keys)
            const { data: allConfigs } = await supabase.from('config').select('key, value');
            const configMap = {};
            if (Array.isArray(allConfigs)) {
                allConfigs.forEach((row) => {
                    if (row && row.key) configMap[row.key] = row.value;
                });
            }

            // 1. Hero Video
            const videoVal = configMap['video_url'];
            if (videoVal) {
                setVideoAsset(videoVal);
                const vKey = getVideoKey(videoVal);
                const isThisVideoDone =
                    localStorage.getItem(`completed_${vKey}`) === 'true' ||
                    (savedEmail && localStorage.getItem(`completed_${vKey}_${savedEmail}`) === 'true');
                
                setIsCurrentVideoCompleted(Boolean(isThisVideoDone));
                const savedPos = parseFloat(localStorage.getItem(`hero_watch_sec_${vKey}`) || '0');
                const validPos = !isNaN(savedPos) && savedPos > 0 ? savedPos : 0;
                maxWatchedTimeRef.current = validPos;
                if (videoRef.current && validPos > 2) {
                    videoRef.current.currentTime = validPos;
                }
            }

            // 2. Why Session Video
            const whyVal = configMap['why_session_video_url'];
            if (whyVal) {
                setWhySessionAsset(whyVal);
                const wKey = getVideoKey(whyVal);
                const savedPosW = parseFloat(localStorage.getItem(`why_watch_sec_${wKey}`) || '0');
                const validPosW = !isNaN(savedPosW) && savedPosW > 0 ? savedPosW : 0;
                maxWhySessionWatchedRef.current = validPosW;
                if (whySessionRef.current && validPosW > 2) {
                    whySessionRef.current.currentTime = validPosW;
                }
            }

            // 3. Urgency Timer Config
            const urgencyVal = configMap['urgency_config'];
            if (urgencyVal) {
                try {
                    const parsed = JSON.parse(urgencyVal);
                    setMinutes(parsed.minutes);
                    setSeconds(parsed.seconds);
                    setBannerText(parsed.text);
                    setIsUrgentVisible(parsed.visible);
                } catch (e) { }
            }

            // 4. Bootcamp Modules
            const bootcampVal = configMap['bootcamp_modules'];
            if (bootcampVal) {
                try {
                    const parsed = JSON.parse(bootcampVal);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setBootcampModules(parsed);
                    }
                } catch (e) { }
            }

            // 5. Special Session 2CC Config
            const s2ccVal = configMap['special_2cc_config'];
            if (s2ccVal) {
                try {
                    setSpecial2ccConfig(JSON.parse(s2ccVal));
                } catch {
                    setSpecial2ccConfig({ videoUrl: s2ccVal });
                }
            } else if (configMap['special_2cc_video_url']) {
                setSpecial2ccConfig({ videoUrl: configMap['special_2cc_video_url'] });
            }

            // 6. Forever Living India Join URL
            if (configMap['flp_join_url']) {
                setFlpJoinUrl(configMap['flp_join_url']);
            }

            // Sync user registration status
            if (savedEmail) {
                const lead = await checkLeadStatus(savedEmail);
                if (lead) {
                    setIsRegistered(true);
                }
            }
        };
        fetchRemoteAssets();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        const normalizedEmail = formData.email.trim().toLowerCase();
        const result = await submitLead({
            name: formData.name,
            email: normalizedEmail,
            phone: formData.phone,
            city: formData.city,
            source: 'dashboard_video_access'
        });
        setIsSubmitting(false);
        if (result.success || result.isDuplicate) {
            setIsRegistered(true);
            setUserEmail(normalizedEmail);
            localStorage.setItem('user_email', normalizedEmail);
            localStorage.setItem('user_registered', 'true');
            if (isBootcampUnlocked) {
                localStorage.setItem(`bootcamp_unlocked_${normalizedEmail}`, 'true');
            }
            if (isCurrentVideoCompleted && videoAsset) {
                const vKey = getVideoKey(videoAsset);
                localStorage.setItem(`completed_${vKey}_${normalizedEmail}`, 'true');
            }
            setSubmitStatus(result.isDuplicate ? 'duplicate' : 'success');
            setTimeout(() => {
                const bootcampElement = document.getElementById('hbootcamp');
                if (bootcampElement) {
                    bootcampElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 200);
        } else {
            setSubmitStatus('error');
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds === 0) {
                    if (minutes === 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    setMinutes((m) => m - 1);
                    return 59;
                }
                return prevSeconds - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [minutes]);

    return (
        <div className="bg-transparent text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container pt-24">
            <Navbar />
            <main>
                <section className="relative pt-12 md:pt-24 pb-24 px-margin-mobile md:px-gutter max-w-container-max mx-auto text-center">
                    <div className="floral-glass-heavy rounded-3xl p-12 md:p-20 ambient-shadow relative overflow-hidden">
                        
                        <h1 className="relative z-10 font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight max-w-5xl mx-auto text-gradient-shimmer">
                            HarshBahti: Curated Digital Craftsmanship.
                        </h1>
                        <p className="relative z-10 font-sans text-lg text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed">
                            A delicate approach to branding, design, and digital experiences. In just 15 minutes, discover a refined path to creating new opportunities on the internet.
                        </p>
                        <a className="relative z-10 inline-flex items-center gap-3 bg-primary/10 border border-primary text-primary px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase font-bold hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:-translate-y-1" href="#training">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                            Explore Our Work
                        </a>
                    </div>
                </section>

                <section className="py-20 px-margin-mobile md:px-gutter max-w-6xl mx-auto" id="training">
                    <div className="relative w-full rounded-[2rem] overflow-hidden floral-glass ambient-shadow flex items-center justify-center p-3 border border-white/5">
                        <div className="w-full rounded-3xl overflow-hidden relative bg-transparent">
                            {videoAsset ? (
                                (() => {
                                    const heroEmbed = getEmbedUrl(videoAsset);
                                    if (heroEmbed && heroEmbed.type === 'youtube') {
                                        return (
                                            <div className="w-full aspect-video">
                                                <iframe
                                                    key={videoAsset}
                                                    src={heroEmbed.src}
                                                    title="Training Masterclass"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                    className="w-full h-full aspect-video border-0 rounded-2xl"
                                                ></iframe>
                                            </div>
                                        );
                                    }
                                    return (
                                        <video
                                            ref={videoRef}
                                            key={videoAsset}
                                            src={videoAsset}
                                            controls
                                            autoPlay
                                            muted
                                            playsInline
                                            preload="auto"
                                            crossOrigin="anonymous"
                                            onTimeUpdate={handleTimeUpdate}
                                            onSeeking={handleSeeking}
                                            onEnded={handleVideoEnded}
                                            onContextMenu={(e) => e.preventDefault()}
                                            controlsList="nodownload noplaybackrate"
                                            className="w-full h-auto aspect-video object-contain bg-transparent opacity-90"
                                            poster="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqbbDm_XhvRdXIWcfOR5axXjqhSEYYNj6YQ-TGgqF57fvnC5mQfK2ICeygyPmIyA0DvnsJOxuFuXjl28bI9i8k2oBUF6-2q_Jj0VwWBPVqVSFgNMecsa-Ta3kmnBi0ppQ4EPO5Y9T91AxJ9j3TOTJMG_kgLmeik_bDrXbxPw_o7bAvXI37k5LjynpslUP9SYsZBi19UPRNQ0rbQK9rJ-ORVILPUitwg62DATQ8fUM0L3-yEfDA4-PmiKABimKO5K7vQSMhIUEvNHZ"
                                        />
                                    );
                                })()
                            ) : (
                                <div className="relative w-full aspect-video flex items-center justify-center group cursor-pointer bg-surface/50">
                                    <div className="absolute inset-0 z-0">
                                        <img className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqbbDm_XhvRdXIWcfOR5axXjqhSEYYNj6YQ-TGgqF57fvnC5mQfK2ICeygyPmIyA0DvnsJOxuFuXjl28bI9i8k2oBUF6-2q_Jj0VwWBPVqVSFgNMecsa-Ta3kmnBi0ppQ4EPO5Y9T91AxJ9j3TOTJMG_kgLmeik_bDrXbxPw_o7bAvXI37k5LjynpslUP9SYsZBi19UPRNQ0rbQK9rJ-ORVILPUitwg62DATQ8fUM0L3-yEfDA4-PmiKABimKO5K7vQSMhIUEvNHZ" />
                                    </div>
                                    <div className="relative z-10 bg-black/60 p-6 rounded-full backdrop-blur-xl group-hover:bg-primary group-hover:text-black group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-primary border border-white/10">
                                        <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Anti-Skip Warning Modal */}
                {showSkipWarning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="floral-glass-heavy border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/30">
                                <span className="material-symbols-outlined text-3xl">warning</span>
                            </div>
                            
                            <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">
                                Skipping Video Is Not Allowed
                            </h3>
                            
                            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                                Skipping is not allowed. You have to watch the video completely to unlock the bootcamp.
                            </p>
                            
                            <button
                                onClick={handleDismissWarning}
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all transform active:scale-95"
                            >
                                Continue Watching
                            </button>
                        </div>
                    </div>
                )}
                {/* Gated Access Section */}
                {!isAuthenticated ? (
                    <AuthGate onSuccess={() => {
                        setTimeout(() => {
                            const bootcampElement = document.getElementById('hbootcamp');
                            if (bootcampElement) {
                                bootcampElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 300);
                    }} />
                ) : (
                    <>
                        {/* Start Your Application - Get Free Access Form */}
                        <section className="py-16 sm:py-24 px-margin-mobile md:px-gutter relative" id="contact">
                            <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-12 sm:gap-16 items-start">
                                <div className="md:sticky md:top-32">
                                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                                        <span className="material-symbols-outlined text-sm">verified_user</span>
                                        Logged In as {userProfile?.name || 'Learner'}
                                    </div>
                                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gradient-shimmer">
                                        Start Your Application
                                    </h2>
                                    <p className="font-sans text-base sm:text-lg text-on-surface-variant mb-6 sm:mb-8 leading-relaxed max-w-md">
                                        Join the platform to access premium insights. Fill out the application and a specialist will contact you.
                                    </p>
                                    
                                    {isUrgentVisible && (
                                        <div className="floral-glass rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden border-l-4 border-l-primary flex items-center justify-between">
                                            <p className="font-sans text-xs sm:text-sm text-on-surface-variant flex-1 pr-4">
                                                {bannerText}
                                            </p>
                                            <div className="flex items-center gap-2 text-primary font-mono text-xl sm:text-2xl bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-primary/20">
                                                <div><span>{minutes.toString().padStart(2, '0')}</span><span className="text-[10px] sm:text-xs font-sans text-primary/70 ml-1">M</span></div>
                                                <span className="opacity-50">:</span>
                                                <div><span>{seconds.toString().padStart(2, '0')}</span><span className="text-[10px] sm:text-xs font-sans text-primary/70 ml-1">S</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="floral-glass-heavy rounded-2xl sm:rounded-3xl p-6 sm:p-8 ambient-shadow relative">
                                    {submitStatus === 'duplicate' && (
                                        <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl text-xs sm:text-sm mb-6 animate-in slide-in-from-top-2 flex gap-2 items-center">
                                            <span className="material-symbols-outlined">info</span> We already have your details! Your registration is active.
                                        </div>
                                    )}
                                    {submitStatus === 'success' && (
                                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs sm:text-sm mb-6 animate-in slide-in-from-top-2 flex gap-2 items-center">
                                            <span className="material-symbols-outlined">check_circle</span> Application submitted successfully! See HBootcamp below.
                                        </div>
                                    )}
                                    {submitStatus === 'error' && (
                                        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-xs sm:text-sm mb-6 animate-in slide-in-from-top-2 flex gap-2 items-center">
                                            <span className="material-symbols-outlined">error</span> Oops! Something went wrong. Please try again.
                                        </div>
                                    )}
                                    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                            <div>
                                                <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 sm:mb-2 tracking-wider uppercase">Full Name</label>
                                                <div className="relative">
                                                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20" placeholder="Jane Doe" type="text" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 sm:mb-2 tracking-wider uppercase">Mobile</label>
                                                <div className="relative">
                                                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20" placeholder="+91 98765 43210" type="tel" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 sm:mb-2 tracking-wider uppercase">Email Address</label>
                                            <div className="relative">
                                                <input required name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-on-surface text-sm focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20" placeholder="jane@example.com" type="email" />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-sans font-semibold text-on-surface-variant mb-1.5 sm:mb-2 tracking-wider uppercase">City</label>
                                            <div className="relative">
                                                <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 sm:py-3.5 px-4 text-on-surface text-sm focus:border-secondary focus:bg-black/60 focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-white/20" placeholder="Your City" type="text" />
                                            </div>
                                        </div>
                                        
                                        <div className="pt-2 sm:pt-4">
                                            <button disabled={isSubmitting} className="w-full bg-primary text-black py-3.5 sm:py-4 flex items-center justify-center gap-2 rounded-xl font-sans font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-primary-container transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]" type="submit">
                                                {isSubmitting ? <Loader size="sm" /> : 'Get Free Access Now'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </section>

                        {/* HBootcamp Section - Appears for Authenticated Members */}
                        <section className="py-12 sm:py-20 px-3 sm:px-6 md:px-gutter max-w-6xl mx-auto border-t border-white/10 animate-in fade-in slide-in-from-bottom-6 duration-500 overflow-hidden w-full" id="hbootcamp" ref={bootcampRef}>
                            <div className="floral-glass-heavy rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 ambient-shadow relative overflow-hidden w-full max-w-full">
                            {/* Decorative background glows */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                            {!isFirstVideoCompleted ? (
                                /* LOCKED STATE */
                                <div className="relative z-10 text-center max-w-2xl mx-auto">
                                    <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                        <span className="material-symbols-outlined text-4xl animate-pulse">lock</span>
                                    </div>

                                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                        Step 1 of 3 Complete (Registered)
                                    </div>

                                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                                        HBootcamp Access Locked
                                    </h2>

                                    <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                                        You have to first complete the video above to unlock the next session. Please watch the complete training without skipping to progress.
                                    </p>

                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-8 text-left space-y-3">
                                        <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium">
                                            <span>Video Training Progress</span>
                                            <span className="text-amber-400 font-bold">Watching In Progress</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                            <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: '40%' }}></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={scrollToVideo}
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase font-bold transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                                        Watch Video Training Above
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* ALWAYS SHOW WHY SESSION ONCE FIRST VIDEO IS COMPLETED */}
                                    <div className="relative z-10 w-full space-y-8 text-center mb-12">
                                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                                            <span className="material-symbols-outlined text-sm">play_circle</span>
                                            Step 2 of 3 (Why Session)
                                        </div>
                                        
                                        <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                                            Why Are We Doing This?
                                        </h2>
                                        
                                        <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl mx-auto mb-8">
                                            Before you jump into the core curriculum, watch this brief session to understand the philosophy and exactly what to expect.
                                        </p>

                                        <div className="relative w-full max-w-4xl mx-auto rounded-[2rem] overflow-hidden floral-glass ambient-shadow flex items-center justify-center p-3 border border-white/5">
                                            <div className="w-full rounded-3xl overflow-hidden relative bg-black/60 aspect-video">
                                                {whySessionAsset ? (
                                                    <video
                                                        ref={whySessionRef}
                                                        key={whySessionAsset}
                                                        src={whySessionAsset}
                                                        controls
                                                        playsInline
                                                        preload="auto"
                                                        crossOrigin="anonymous"
                                                        onTimeUpdate={handleWhySessionTimeUpdate}
                                                        onSeeking={handleWhySessionSeeking}
                                                        onEnded={handleWhySessionEnded}
                                                        onContextMenu={(e) => e.preventDefault()}
                                                        controlsList={isBootcampUnlocked ? "nodownload" : "nodownload noplaybackrate"}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-on-surface-variant p-6">
                                                        <span className="material-symbols-outlined text-5xl mb-4">video_library</span>
                                                        <p>The instructor is preparing the "Why Session". Please check back soon.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ONLY SHOW BOOTCAMP PLAYER & FLP INDIA GATEWAY IF WHY SESSION IS COMPLETED */}
                                    {isBootcampUnlocked && (
                                        <div className="relative z-10 w-full space-y-8 pt-12 border-t border-white/10">
                                            
                                            {/* OFFICIAL FOREVER LIVING INDIA ONBOARDING GATEWAY - ONLY VISIBLE AFTER WHY SESSION */}
                                            <div className="floral-glass-heavy border border-emerald-500/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden bg-gradient-to-b from-emerald-500/[0.07] via-black/40 to-black/60 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                                <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>

                                                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                                    <div className="space-y-3 text-center lg:text-left max-w-xl">
                                                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                                                            <span className="material-symbols-outlined text-sm">verified_user</span>
                                                            Official FLP India Registration
                                                        </div>

                                                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                                            Step into the Business: Register Your FLP Partner ID
                                                        </h3>

                                                        <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                                                            Now that you have completed the foundational <strong>Why Session</strong>, create your official Forever Living India business account to activate global mentorship, leadership incentives, and curriculum tools.
                                                        </p>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-on-surface-variant/90">
                                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                                                                <span className="material-symbols-outlined text-primary text-base">public</span>
                                                                <span>160+ Global Markets Access</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                                                                <span className="material-symbols-outlined text-primary text-base">payments</span>
                                                                <span>Direct Wholesale & Incentives</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                                                        <a
                                                            href={flpJoinUrl || 'https://foreverliving.com/join/ind'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-400 via-primary to-teal-400 text-black px-8 py-4 rounded-2xl font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all text-center group w-full sm:w-auto"
                                                        >
                                                            <span className="material-symbols-outlined text-lg font-bold group-hover:rotate-45 transition-transform">open_in_new</span>
                                                            Join Forever Living India Now
                                                        </a>
                                                        <span className="text-[11px] text-on-surface-variant/70 font-mono flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                            Official Gateway: foreverliving.com/join/ind
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center max-w-2xl mx-auto mb-8">
                                                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                                                    <span className="material-symbols-outlined text-sm">verified</span>
                                                    Full Access Unlocked
                                                </div>

                                                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight text-gradient-shimmer">
                                                    HBootcamp Video Masterclass
                                                </h2>

                                                <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl mx-auto">
                                                    Welcome to your dedicated training curriculum. Complete each session to unlock the next advanced module.
                                                </p>
                                            </div>

                                            <BootcampPlayer
                                                modules={bootcampModules}
                                                userEmail={userEmail}
                                                onAllModulesCompleted={(completed) => setIsAllBootcampCompleted(completed)}
                                            />

                                            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 text-center max-w-2xl mx-auto mt-10">
                                                <p className="text-primary font-medium text-sm mb-3">Need 1-on-1 assistance or have questions regarding these sessions?</p>
                                                <a
                                                    href={`https://wa.me/918650991949?text=${encodeURIComponent(
                                                        `Hi Harsh! ${formData.name || userProfile?.name ? `I am ${formData.name || userProfile?.name}. ` : ''}I am attending your Bootcamp Masterclass sessions and would like 1-on-1 assistance / have questions regarding the training.`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-primary text-black px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                    </svg>
                                                    Connect with Instructor Support
                                                </a>
                                            </div>

                                            {/* SPECIAL SESSION 2CC: REMAINS 100% INVISIBLE UNTIL ALL BOOTCAMP MODULES ARE COMPLETED */}
                                            {isAllBootcampCompleted && (
                                                <SpecialSession2CC
                                                    config={special2ccConfig}
                                                    userEmail={userEmail}
                                                    userName={formData.name || userProfile?.name}
                                                />
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </>
            )}
            </main>
            <Footer />
        </div>
    );
}
