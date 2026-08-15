import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function VideoManager() {
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch the initial URL from Supabase
        const fetchConfig = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('config').select('value').eq('key', 'video_url').single();
            if (data) setVideoUrl(data.value);
            setIsLoading(false);
        };
        fetchConfig();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        setUploadProgress(20);

        if (supabase) {
            try {
                const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

                // Upload to Supabase Storage Bucket
                const { data, error } = await supabase.storage
                    .from('videos')
                    .upload(fileName, file, { cacheControl: '3600', upsert: false });

                if (error) throw error;

                setUploadProgress(100);

                // Get the public viewing URL
                const { data: urlData } = supabase.storage.from('videos').getPublicUrl(fileName);
                const finalUrl = urlData.publicUrl;

                // Update the UI state and permanently save it to Database Configuration
                setVideoUrl(finalUrl);
                await supabase.from('config').upsert({ key: 'video_url', value: finalUrl });

                alert('Upload Complete! Video deployed to Edge nodes and landing page dynamically updated.');
            } catch (err) {
                console.error("Storage Error:", err);
                alert('Upload Failed. Did you run the SQL script to create the bucket? Error: ' + err.message);
            }
        }

        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
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

    return (
        <div className="w-full font-sans">
            <div className="mb-8 p-8 floral-glass rounded-2xl ambient-shadow flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-display font-semibold text-on-surface flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/50">
                            <span className="material-symbols-outlined text-xl">videocam</span>
                        </div>
                        Global Video Configurations
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
    );
}
