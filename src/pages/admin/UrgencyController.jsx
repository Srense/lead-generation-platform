import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function UrgencyController() {
    const [countdownMinutes, setCountdownMinutes] = useState(14);
    const [countdownSeconds, setCountdownSeconds] = useState(59);
    const [bannerText, setBannerText] = useState('🎁 This training is completely FREE for a limited time. Previously ₹299, but today you can access it at absolutely no cost.');
    const [urgentVisibility, setUrgentVisibility] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('config').select('value').eq('key', 'urgency_config').single();
            if (data && data.value) {
                try {
                    const parsed = JSON.parse(data.value);
                    setCountdownMinutes(parsed.minutes);
                    setCountdownSeconds(parsed.seconds);
                    setBannerText(parsed.text);
                    setUrgentVisibility(parsed.visible);
                } catch (e) { }
            }
            setIsLoading(false);
        };
        fetchConfig();
    }, []);

    const saveSettings = async (e) => {
        e.preventDefault();
        const payload = JSON.stringify({
            minutes: parseInt(countdownMinutes),
            seconds: parseInt(countdownSeconds),
            text: bannerText,
            visible: urgentVisibility
        });

        if (supabase) {
            const { error } = await supabase.from('config').upsert({ key: 'urgency_config', value: payload });
            if (error) {
                alert('Error saving configuration: ' + error.message);
                return;
            }
        }
        alert('Urgency Engine Parameters Synced! Landing page will immediately inherit these settings.');
    };

    return (
        <div className="w-full font-sans">
            <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-display font-semibold text-on-surface flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                            <span className="material-symbols-outlined text-xl">local_fire_department</span>
                        </div>
                        Urgency Engine Output
                    </h2>
                    <p className="text-on-surface-variant text-sm font-sans pl-13">Manually calibrate psychological conversion triggers including countdowns, copy variations, and banner visibility constraints globally.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="floral-glass rounded-2xl p-8 h-fit order-2 md:order-1 ambient-shadow">
                    <form onSubmit={saveSettings} className="space-y-6">

                        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-6">
                            <div>
                                <div className="font-semibold text-on-surface text-base">Engine Status</div>
                                <div className="text-sm text-on-surface-variant">Toggle global visibility of the urgency widget</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setUrgentVisibility(!urgentVisibility)}
                                className={`w-14 h-8 rounded-full transition-colors relative flex items-center shadow-inner ${urgentVisibility ? 'bg-primary' : 'bg-surface-variant/60'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full absolute transition-transform shadow-sm ${urgentVisibility ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                        </div>

                        <div className={!urgentVisibility ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                            <label className="block text-sm font-semibold text-on-surface-variant mb-2 mt-6">Seed Time (MM:SS)</label>
                            <div className="flex items-center gap-4 mb-6">
                                <input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={countdownMinutes}
                                    onChange={(e) => setCountdownMinutes(e.target.value)}
                                    className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                                <span className="text-xl font-bold text-on-surface-variant">:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={countdownSeconds}
                                    onChange={(e) => setCountdownSeconds(e.target.value)}
                                    className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                            </div>

                            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Promotional Overlay Text</label>
                            <textarea
                                value={bannerText}
                                onChange={(e) => setBannerText(e.target.value)}
                                className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3 px-4 text-on-surface h-24 resize-none mb-6 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            ></textarea>

                            <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-sans font-medium hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                                Flush Cache & Deploy
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview Panel */}
                <div className="floral-glass-heavy rounded-2xl p-8 h-fit order-1 md:order-2 ambient-shadow">
                    <h3 className="font-semibold text-sm text-on-surface-variant mb-6 flex items-center gap-2 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
                        Live Frontend Preview
                    </h3>

                    {urgentVisibility ? (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 relative overflow-hidden z-0 shadow-sm">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary z-10 rounded-l-xl"></div>
                            <p className="font-sans text-base text-on-surface mb-6 relative z-10 break-words leading-relaxed">
                                {bannerText}
                            </p>
                            <div className="flex items-center gap-4 text-primary font-display text-4xl font-bold relative z-10">
                                <div className="bg-white/60 px-4 py-2 rounded-lg border border-primary/10 shadow-sm"><span>{String(countdownMinutes).padStart(2, '0')}</span><span className="text-lg font-normal ml-1">m</span></div>
                                <span className="opacity-50">:</span>
                                <div className="bg-white/60 px-4 py-2 rounded-lg border border-primary/10 shadow-sm"><span>{String(countdownSeconds).padStart(2, '0')}</span><span className="text-lg font-normal ml-1">s</span></div>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-dashed border-outline-variant/80 bg-surface-variant/20 rounded-xl p-12 flex flex-col items-center justify-center text-on-surface-variant gap-4">
                            <span className="material-symbols-outlined text-4xl opacity-50">visibility_off</span>
                            <span className="text-sm font-semibold uppercase tracking-wider">Widget Hidden</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
