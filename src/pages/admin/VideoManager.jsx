import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function VideoManager() {
    const [videoUrl, setVideoUrl] = useState('');
    const [whySessionUrl, setWhySessionUrl] = useState('');
    const [special2ccConfig, setSpecial2ccConfig] = useState({
        videoUrl: '',
        title: 'Special Session: 2CC Fast-Track Blueprint',
        description: 'Exclusive masterclass detailing the exact roadmap to achieve your 2CC milestone, maximize leadership profit-sharing, and scale your digital assets.',
        resourceLink: '',
        duration: 'Special Session'
    });

    const [uploadProgress, setUploadProgress] = useState(0);
    const [whyUploadProgress, setWhyUploadProgress] = useState(0);
    const [upload2ccProgress, setUpload2ccProgress] = useState(0);

    const [isUploading, setIsUploading] = useState(false);
    const [isWhyUploading, setIsWhyUploading] = useState(false);
    const [is2ccUploading, setIs2ccUploading] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the initial URLs and configs from Supabase in a single bulk query
        const fetchConfig = async () => {
            if (!supabase) return;
            try {
                const { data: allConfigs } = await supabase.from('config').select('key, value');
                const configMap = {};
                if (Array.isArray(allConfigs)) {
                    allConfigs.forEach((row) => {
                        if (row && row.key) configMap[row.key] = row.value;
                    });
                }

                if (configMap['video_url']) setVideoUrl(configMap['video_url']);
                if (configMap['why_session_video_url']) setWhySessionUrl(configMap['why_session_video_url']);

                const s2ccVal = configMap['special_2cc_config'];
                if (s2ccVal) {
                    try {
                        const parsed = JSON.parse(s2ccVal);
                        setSpecial2ccConfig((prev) => ({ ...prev, ...parsed }));
                    } catch {
                        setSpecial2ccConfig((prev) => ({ ...prev, videoUrl: s2ccVal }));
                    }
                } else if (configMap['special_2cc_video_url']) {
                    setSpecial2ccConfig((prev) => ({ ...prev, videoUrl: configMap['special_2cc_video_url'] }));
                }
            } catch (err) {
                console.error("Config fetch error:", err);
            }
            setIsLoading(false);
        };
        fetchConfig();
    }, []);

    // 1. Hero Video Upload
    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        setUploadProgress(20);

        if (supabase) {
            try {
                const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

                const { data, error } = await supabase.storage
                    .from('videos')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (error) throw error;
                setUploadProgress(100);

                const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
                const finalUrl = urlData.publicUrl;

                setVideoUrl(finalUrl);
                await supabase.from('config').upsert({ key: 'video_url', value: finalUrl });

                alert('Upload Complete! Video deployed to Edge nodes and landing page dynamically updated.');
            } catch (err) {
                console.error("Storage Error:", err);
                alert('Upload Failed: ' + err.message);
            }
        }

        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
    };

    // 2. Why Session Upload
    const handleWhyUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        setIsWhyUploading(true);
        setWhyUploadProgress(20);

        if (supabase) {
            try {
                const fileName = `why_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

                const { data, error } = await supabase.storage
                    .from('videos')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (error) throw error;
                setWhyUploadProgress(100);

                const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
                const finalUrl = urlData.publicUrl;

                setWhySessionUrl(finalUrl);
                await supabase.from('config').upsert({ key: 'why_session_video_url', value: finalUrl });

                alert('Why Session Upload Complete! Video deployed to Edge nodes and landing page dynamically updated.');
            } catch (err) {
                console.error("Storage Error:", err);
                alert('Upload Failed: ' + err.message);
            }
        }

        setIsWhyUploading(false);
        setTimeout(() => setWhyUploadProgress(0), 1000);
    };

    // 3. Special Session 2CC Upload
    const handle2ccUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        setIs2ccUploading(true);
        setUpload2ccProgress(20);

        if (supabase) {
            try {
                const fileName = `special_2cc_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

                const { data, error } = await supabase.storage
                    .from('videos')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (error) throw error;
                setUpload2ccProgress(100);

                const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
                const finalUrl = urlData.publicUrl;

                const updatedConfig = { ...special2ccConfig, videoUrl: finalUrl };
                setSpecial2ccConfig(updatedConfig);
                await supabase.from('config').upsert({ key: 'special_2cc_config', value: JSON.stringify(updatedConfig) });
                await supabase.from('config').upsert({ key: 'special_2cc_video_url', value: finalUrl });

                alert('2CC Special Session Video Upload Complete! Deployed to Edge network.');
            } catch (err) {
                console.error("Storage Error:", err);
                alert('2CC Video Upload Failed: ' + err.message);
            }
        }

        setIs2ccUploading(false);
        setTimeout(() => setUpload2ccProgress(0), 1000);
    };

    const saveUrl = async (e) => {
        e.preventDefault();
        if (supabase) {
            const { error } = await supabase.from('config').upsert({ key: 'video_url', value: videoUrl });
            if (error) {
                alert('Error saving configuration: ' + error.message);
                return;
            }
        }
        alert('System Configuration Updated. The new streaming URL will be served via Edge Nodes immediately.');
    };

    const saveWhyUrl = async (e) => {
        e.preventDefault();
        if (supabase) {
            const { error } = await supabase.from('config').upsert({ key: 'why_session_video_url', value: whySessionUrl });
            if (error) {
                alert('Error saving configuration: ' + error.message);
                return;
            }
        }
        alert('Why Session Configuration Updated.');
    };

    const save2ccConfig = async (e) => {
        e.preventDefault();
        if (supabase) {
            const { error } = await supabase.from('config').upsert({
                key: 'special_2cc_config',
                value: JSON.stringify(special2ccConfig)
            });
            if (error) {
                alert('Error saving 2CC Session configuration: ' + error.message);
                return;
            }
            if (special2ccConfig.videoUrl) {
                await supabase.from('config').upsert({
                    key: 'special_2cc_video_url',
                    value: special2ccConfig.videoUrl
                });
            }
        }
        alert('Special Session (2CC) Configuration Updated Successfully!');
    };

    return (
        <div className="w-full font-sans space-y-12">
            {/* Section 1: Hero Video */}
            <div>
                <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-display font-semibold text-on-surface flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                                <span className="material-symbols-outlined text-xl">videocam</span>
                            </div>
                            Global Video Configurations (Hero Video)
                        </h2>
                        <p className="text-on-surface-variant text-sm font-sans pl-13">Govern the primary lead generation asset streamed on the dashboard. Files are distributed safely through our CDN Edge network.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="floral-glass rounded-2xl p-8 h-fit ambient-shadow">
                        <h3 className="font-semibold text-on-surface text-lg mb-2">Direct Secure Upload</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Upload raw MP4/WebM files to the encrypted bucket. Transcoding is handled autonomously.</p>

                        <div className="border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-colors rounded-2xl p-10 text-center cursor-pointer relative overflow-hidden group">
                            <input type="file" accept="video/mp4,video/webm" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleUpload} disabled={isUploading} />

                            {!isUploading ? (
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                    </div>
                                    <div className="text-base font-medium text-on-surface mt-2">Drag & drop your file here</div>
                                    <div className="text-sm text-on-surface-variant">Maximum file size: 4GB</div>
                                </div>
                            ) : (
                                <div className="w-full py-4">
                                    <div className="text-sm font-semibold text-primary mb-3">Pushing to Node: {Math.min(uploadProgress, 100)}%</div>
                                    <div className="w-full bg-surface-variant/40 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div className="bg-primary h-3 rounded-full transition-all duration-300 relative" style={{ width: `${Math.min(uploadProgress, 100)}%` }}>
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="floral-glass rounded-2xl p-8 h-fit ambient-shadow">
                        <h3 className="font-semibold text-on-surface text-lg mb-2">Current Asset Identifier</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Modify the direct remote URL endpoint serving the core video asset.</p>

                        <form onSubmit={saveUrl} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1">Streaming URL Endpoint</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 material-symbols-outlined text-on-surface-variant text-lg">link</span>
                                    <input
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder={isLoading ? "Loading securely..." : "https://..."}
                                        className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm focus:border-primary focus:bg-surface-variant/80 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button disabled={isLoading} type="submit" className="flex items-center justify-center gap-2 w-full bg-primary/10 text-primary border border-primary/20 py-4 rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Commit Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Section 2: Why Session Video */}
            <div>
                <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-display font-semibold text-on-surface flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm border border-blue-500/30">
                                <span className="material-symbols-outlined text-xl">play_circle</span>
                            </div>
                            Why Session Video Configurations
                        </h2>
                        <p className="text-on-surface-variant text-sm font-sans pl-13">Configure the intermediate video session shown between the hero video and the bootcamp modules.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="floral-glass rounded-2xl p-8 h-fit ambient-shadow">
                        <h3 className="font-semibold text-on-surface text-lg mb-2">Direct Secure Upload</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Upload raw MP4/WebM files for the Why Session.</p>

                        <div className="border border-dashed border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 transition-colors rounded-2xl p-10 text-center cursor-pointer relative overflow-hidden group">
                            <input type="file" accept="video/mp4,video/webm" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleWhyUpload} disabled={isWhyUploading} />

                            {!isWhyUploading ? (
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                    </div>
                                    <div className="text-base font-medium text-on-surface mt-2">Drag & drop your file here</div>
                                    <div className="text-sm text-on-surface-variant">Maximum file size: 4GB</div>
                                </div>
                            ) : (
                                <div className="w-full py-4">
                                    <div className="text-sm font-semibold text-blue-400 mb-3">Pushing to Node: {Math.min(whyUploadProgress, 100)}%</div>
                                    <div className="w-full bg-surface-variant/40 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div className="bg-blue-500 h-3 rounded-full transition-all duration-300 relative" style={{ width: `${Math.min(whyUploadProgress, 100)}%` }}>
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="floral-glass rounded-2xl p-8 h-fit ambient-shadow">
                        <h3 className="font-semibold text-on-surface text-lg mb-2">Current Asset Identifier</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Modify the direct remote URL endpoint serving the Why Session video.</p>

                        <form onSubmit={saveWhyUrl} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1">Streaming URL Endpoint</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 material-symbols-outlined text-on-surface-variant text-lg">link</span>
                                    <input
                                        value={whySessionUrl}
                                        onChange={(e) => setWhySessionUrl(e.target.value)}
                                        placeholder={isLoading ? "Loading securely..." : "https://..."}
                                        className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm focus:border-blue-500 focus:bg-surface-variant/80 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button disabled={isLoading} type="submit" className="flex items-center justify-center gap-2 w-full bg-blue-500/10 text-blue-400 border border-blue-500/20 py-4 rounded-xl font-medium hover:bg-blue-500 hover:text-white transition-all duration-300 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Commit Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Section 3: SPECIAL SESSION: 2CC VIDEO CONFIGURATIONS */}
            <div>
                <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex justify-between items-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                    <div>
                        <h2 className="text-2xl font-display font-semibold text-amber-300 flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm border border-amber-500/40">
                                <span className="material-symbols-outlined text-xl">workspace_premium</span>
                            </div>
                            Special Session: 2CC Video Configurations
                        </h2>
                        <p className="text-on-surface-variant text-sm font-sans pl-13">
                            Govern the restricted VIP 2CC Masterclass. This session remains <strong>completely invisible</strong> until the student finishes all bootcamp modules across all phases.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left: Direct Upload */}
                    <div className="floral-glass rounded-2xl p-8 h-fit ambient-shadow border border-amber-500/20">
                        <h3 className="font-semibold text-amber-200 text-lg mb-2">Direct Secure 2CC Upload</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Upload raw MP4/WebM masterclass files directly to the encrypted bucket.</p>

                        <div className="border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition-colors rounded-2xl p-10 text-center cursor-pointer relative overflow-hidden group">
                            <input type="file" accept="video/mp4,video/webm" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handle2ccUpload} disabled={is2ccUploading} />

                            {!is2ccUploading ? (
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-110 transition-transform duration-300 border border-amber-500/40">
                                        <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                    </div>
                                    <div className="text-base font-medium text-on-surface mt-2">Upload 2CC Masterclass Video</div>
                                    <div className="text-sm text-on-surface-variant">Supports MP4, WebM up to 4GB</div>
                                </div>
                            ) : (
                                <div className="w-full py-4">
                                    <div className="text-sm font-semibold text-amber-400 mb-3">Uploading 2CC Video: {Math.min(upload2ccProgress, 100)}%</div>
                                    <div className="w-full bg-surface-variant/40 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-300 relative" style={{ width: `${Math.min(upload2ccProgress, 100)}%` }}>
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Metadata & Streaming URL Endpoint */}
                    <div className="floral-glass rounded-2xl p-8 h-fit ambient-shadow border border-amber-500/20">
                        <h3 className="font-semibold text-amber-200 text-lg mb-2">2CC Masterclass Details & Stream URL</h3>
                        <p className="text-sm text-on-surface-variant mb-6">Configure YouTube link, Vimeo embed, Google Drive, or direct MP4 URL along with title & downloadable resources.</p>

                        <form onSubmit={save2ccConfig} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1">Streaming Video URL / Embed Link</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 material-symbols-outlined text-on-surface-variant text-lg">link</span>
                                    <input
                                        value={special2ccConfig.videoUrl || ''}
                                        onChange={(e) => setSpecial2ccConfig({ ...special2ccConfig, videoUrl: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=... or MP4 URL"
                                        className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3.5 pl-12 pr-4 text-on-surface text-sm focus:border-amber-400 focus:bg-surface-variant/80 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1">Session Title</label>
                                <input
                                    value={special2ccConfig.title || ''}
                                    onChange={(e) => setSpecial2ccConfig({ ...special2ccConfig, title: e.target.value })}
                                    placeholder="Special Session: 2CC Fast-Track Blueprint"
                                    className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3 px-4 text-on-surface text-sm focus:border-amber-400 focus:bg-surface-variant/80 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1">Session Description</label>
                                <textarea
                                    rows="3"
                                    value={special2ccConfig.description || ''}
                                    onChange={(e) => setSpecial2ccConfig({ ...special2ccConfig, description: e.target.value })}
                                    placeholder="Exclusive masterclass detailing the roadmap..."
                                    className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3 px-4 text-on-surface text-sm focus:border-amber-400 focus:bg-surface-variant/80 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 ml-1">Downloadable Resource / PDF Link (Optional)</label>
                                <input
                                    value={special2ccConfig.resourceLink || ''}
                                    onChange={(e) => setSpecial2ccConfig({ ...special2ccConfig, resourceLink: e.target.value })}
                                    placeholder="https://... (PDF or Cheatsheet URL)"
                                    className="w-full bg-surface-variant/40 border border-outline-variant/60 rounded-xl py-3 px-4 text-on-surface text-sm focus:border-amber-400 focus:bg-surface-variant/80 outline-none transition-all"
                                />
                            </div>

                            <button disabled={isLoading} type="submit" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all duration-300 disabled:opacity-50 mt-2">
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save 2CC Special Session
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
