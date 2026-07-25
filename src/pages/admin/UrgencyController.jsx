import { useState } from 'react';

export default function UrgencyController() {
    const [countdownMinutes, setCountdownMinutes] = useState(14);
    const [countdownSeconds, setCountdownSeconds] = useState(59);
    const [bannerText, setBannerText] = useState('🎁 This training is completely FREE for a limited time. Previously ₹299, but today you can access it at absolutely no cost.');
    const [urgentVisibility, setUrgentVisibility] = useState(true);

    const saveSettings = (e) => {
        e.preventDefault();
        // Simulate updating global settings
        alert('Urgency Engine Parameters Synced! Conversion rates typically improve by 15% with optimized countdown ranges.');
    };

    return (
        <div className="w-full">
            <div className="mb-8 p-6 glass-card rounded-xl border border-glass-border ambient-shadow">
                <h2 className="text-xl font-bold text-slate-light flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">local_fire_department</span>
                    Urgency Engine Output
                </h2>
                <p className="text-on-surface-variant text-sm">Manually calibrate psychological conversion triggers including countdowns, copy variations, and banner visibility constraints globally.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card rounded-xl border border-glass-border p-6 h-fit order-2 md:order-1">
                    <form onSubmit={saveSettings} className="space-y-6">

                        <div className="flex items-center justify-between border-b border-glass-border pb-6">
                            <div>
                                <div className="font-bold text-sm text-slate-light">Engine Status</div>
                                <div className="text-xs text-on-surface-variant">Toggle global visibility of the urgency widget</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setUrgentVisibility(!urgentVisibility)}
                                className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${urgentVisibility ? 'bg-primary' : 'bg-surface-container'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full absolute transition-transform ${urgentVisibility ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                        </div>

                        <div className={!urgentVisibility ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                            <label className="block text-xs font-label-caps text-on-surface-variant mb-2 mt-6">Seed Time (MM:SS)</label>
                            <div className="flex items-center gap-4 mb-6">
                                <input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={countdownMinutes}
                                    onChange={(e) => setCountdownMinutes(e.target.value)}
                                    className="w-full bg-background border border-glass-border rounded-lg py-3 px-4 text-sm text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                                />
                                <span className="text-xl font-bold text-on-surface-variant">:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={countdownSeconds}
                                    onChange={(e) => setCountdownSeconds(e.target.value)}
                                    className="w-full bg-background border border-glass-border rounded-lg py-3 px-4 text-sm text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                                />
                            </div>

                            <label className="block text-xs font-label-caps text-on-surface-variant mb-2">Promotional Overlay Text</label>
                            <textarea
                                value={bannerText}
                                onChange={(e) => setBannerText(e.target.value)}
                                className="w-full bg-background border border-glass-border rounded-lg py-3 px-4 text-sm text-slate-light h-24 resize-none mb-6 focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                            ></textarea>

                            <button type="submit" className="w-full bg-primary text-[#0F172A] py-3 rounded-lg font-bold hover:scale-[1.02] transition-transform shadow-[0_4px_14px_0_rgba(107,216,203,0.2)]">
                                Flush Cache & Deploy
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview Panel */}
                <div className="glass-card rounded-xl border border-glass-border p-6 h-fit bg-gradient-to-br from-surface-container-lowest to-surface/80 order-1 md:order-2">
                    <h3 className="font-label-caps text-xs text-on-surface-variant mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-green-400">visibility</span>
                        Live Frontend Preview
                    </h3>

                    {urgentVisibility ? (
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 relative overflow-hidden z-0">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary z-10"></div>
                            <p className="font-body-sm text-sm text-on-surface mb-6 relative z-10 break-words mix-blend-plus-lighter">
                                {bannerText}
                            </p>
                            <div className="flex items-center gap-4 text-primary font-display-xl-mobile text-2xl font-bold relative z-10 drop-shadow-[0_0_10px_rgba(107,216,203,0.5)]">
                                <div><span>{String(countdownMinutes).padStart(2, '0')}</span><span className="text-sm font-normal ml-1">m</span></div>
                                <span className="opacity-50">:</span>
                                <div><span>{String(countdownSeconds).padStart(2, '0')}</span><span className="text-sm font-normal ml-1">s</span></div>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-dashed border-glass-border rounded-lg p-12 flex items-center justify-center text-on-surface-variant text-sm font-label-caps opacity-50">
                            Widget Hidden
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
