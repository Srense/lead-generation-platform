import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Loader from '../../components/Loader';

const DEFAULT_MODULES = [
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

export default function BootcampManager() {
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [saveMessage, setSaveMessage] = useState(null);

    useEffect(() => {
        const fetchBootcampModules = async () => {
            if (!supabase) {
                setModules(DEFAULT_MODULES);
                setIsLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('config')
                    .select('value')
                    .eq('key', 'bootcamp_modules')
                    .single();

                if (data && data.value) {
                    try {
                        const parsed = JSON.parse(data.value);
                        setModules(Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MODULES);
                    } catch {
                        setModules(DEFAULT_MODULES);
                    }
                } else {
                    setModules(DEFAULT_MODULES);
                }
            } catch (err) {
                console.error('Error fetching bootcamp modules:', err);
                setModules(DEFAULT_MODULES);
            }
            setIsLoading(false);
        };

        fetchBootcampModules();
    }, []);

    const saveModulesToSupabase = async (updatedModules) => {
        setIsSaving(true);
        setSaveMessage(null);
        if (supabase) {
            try {
                const { error } = await supabase.from('config').upsert({
                    key: 'bootcamp_modules',
                    value: JSON.stringify(updatedModules)
                });
                if (error) throw error;
                setSaveMessage('success');
            } catch (err) {
                console.error('Failed to save bootcamp modules:', err);
                setSaveMessage('error');
            }
        } else {
            setSaveMessage('success');
        }
        setIsSaving(false);
        setTimeout(() => setSaveMessage(null), 4000);
    };

    const handleAddModule = () => {
        const newModule = {
            id: `module-${Date.now()}`,
            title: `Module 0${modules.length + 1}: New Curriculum Topic`,
            description: 'Enter module overview and takeaways.',
            videoUrl: '',
            duration: '15 mins',
            resourceLink: ''
        };
        const updated = [...modules, newModule];
        setModules(updated);
        setEditingModule(newModule);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        const updated = modules.map((m) => (m.id === editingModule.id ? editingModule : m));
        setModules(updated);
        setEditingModule(null);
        saveModulesToSupabase(updated);
    };

    const handleDeleteModule = (id) => {
        if (window.confirm('Are you sure you want to delete this bootcamp module?')) {
            const updated = modules.filter((m) => m.id !== id);
            setModules(updated);
            if (editingModule && editingModule.id === id) {
                setEditingModule(null);
            }
            saveModulesToSupabase(updated);
        }
    };

    const handleMoveModule = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= modules.length) return;
        const updated = [...modules];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setModules(updated);
        saveModulesToSupabase(updated);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader size="lg" text="LOADING BOOTCAMP MODULES..." />
            </div>
        );
    }

    return (
        <div className="w-full font-sans pb-16">
            <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-display font-semibold text-on-surface flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        Bootcamp Curriculum Manager
                    </h2>
                    <p className="text-on-surface-variant text-sm font-sans pl-13">
                        Govern sequential training modules. Embed YouTube, Vimeo, or direct MP4 video URLs. Modules unlock sequentially for students as they complete each video.
                    </p>
                </div>
                <button
                    onClick={handleAddModule}
                    className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary-container shadow-sm transition-all"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    Add New Module
                </button>
            </div>

            {saveMessage === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined">check_circle</span>
                    Bootcamp curriculum updated and published live to student portals.
                </div>
            )}

            {saveMessage === 'error' && (
                <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm mb-6 flex items-center gap-2 animate-in fade-in">
                    <span className="material-symbols-outlined">error</span>
                    Error saving modules to cloud database. Please retry.
                </div>
            )}

            {/* Modal / Form for editing a module */}
            {editingModule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="floral-glass-heavy border border-primary/30 rounded-3xl p-8 max-w-xl w-full relative shadow-[0_0_50px_rgba(16,185,129,0.2)] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                Edit Module Details
                            </h3>
                            <button onClick={() => setEditingModule(null)} className="text-on-surface-variant hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Module Title</label>
                                <input
                                    type="text"
                                    required
                                    value={editingModule.title}
                                    onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary outline-none"
                                    placeholder="Module 01: Masterclass Title"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Video Link / Embed URL</label>
                                <input
                                    type="url"
                                    required
                                    value={editingModule.videoUrl}
                                    onChange={(e) => setEditingModule({ ...editingModule, videoUrl: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary outline-none"
                                    placeholder="https://www.youtube.com/watch?v=... or MP4 URL"
                                />
                                <p className="text-xs text-on-surface-variant/70 mt-1">Supports YouTube, Vimeo, and direct .mp4/.webm streaming URLs.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Description / Summary</label>
                                <textarea
                                    rows="3"
                                    value={editingModule.description}
                                    onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary outline-none"
                                    placeholder="Briefly describe what students will learn in this session."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Duration (e.g. 15 mins)</label>
                                    <input
                                        type="text"
                                        value={editingModule.duration}
                                        onChange={(e) => setEditingModule({ ...editingModule, duration: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary outline-none"
                                        placeholder="15 mins"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Resource / PDF Link</label>
                                    <input
                                        type="url"
                                        value={editingModule.resourceLink}
                                        onChange={(e) => setEditingModule({ ...editingModule, resourceLink: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:border-primary outline-none"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-primary text-black py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-primary-container transition-all"
                                >
                                    {isSaving ? 'Saving...' : 'Save & Publish Module'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingModule(null)}
                                    className="px-5 py-3 rounded-xl border border-white/10 text-on-surface-variant hover:text-white text-xs font-semibold uppercase"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modules List */}
            <div className="space-y-4">
                {modules.map((mod, index) => (
                    <div
                        key={mod.id || index}
                        className="floral-glass rounded-2xl p-6 ambient-shadow border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all"
                    >
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-semibold text-white text-base">{mod.title}</h4>
                                    <span className="text-xs bg-black/40 text-on-surface-variant px-2.5 py-1 rounded-full border border-white/10">
                                        {mod.duration || 'Video'}
                                    </span>
                                </div>
                                <p className="text-sm text-on-surface-variant mb-2">{mod.description}</p>
                                <div className="flex flex-wrap items-center gap-3 text-xs">
                                    {mod.videoUrl ? (
                                        <span className="text-primary flex items-center gap-1 font-mono">
                                            <span className="material-symbols-outlined text-sm">play_circle</span>
                                            {mod.videoUrl.slice(0, 45)}...
                                        </span>
                                    ) : (
                                        <span className="text-amber-400 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">warning</span>
                                            No video URL set
                                        </span>
                                    )}
                                    {mod.resourceLink && (
                                        <a href={mod.resourceLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">attachment</span> Resource
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                            <button
                                onClick={() => handleMoveModule(index, -1)}
                                disabled={index === 0}
                                title="Move Up"
                                className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-primary text-on-surface-variant hover:text-white disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-base">arrow_upward</span>
                            </button>
                            <button
                                onClick={() => handleMoveModule(index, 1)}
                                disabled={index === modules.length - 1}
                                title="Move Down"
                                className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-primary text-on-surface-variant hover:text-white disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-base">arrow_downward</span>
                            </button>
                            <button
                                onClick={() => setEditingModule(mod)}
                                className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black rounded-xl font-bold text-xs uppercase transition-all"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteModule(mod.id)}
                                className="p-2 rounded-xl bg-error/10 border border-error/20 text-error hover:bg-error hover:text-white transition-all"
                                title="Delete"
                            >
                                <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
