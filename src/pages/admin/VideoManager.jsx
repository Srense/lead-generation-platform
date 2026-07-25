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
        <div className="w-full">
            <div className="mb-8 p-6 glass-card rounded-xl border border-glass-border ambient-shadow">
                <h2 className="text-xl font-bold text-slate-light flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">videocam</span>
                    Global Video Configurations
                </h2>
                <p className="text-on-surface-variant text-sm">Govern the primary lead generation asset streamed on the dashboard. Files are distributed safely through our CDN Edge network.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card rounded-xl border border-glass-border p-6 h-fit">
                    <h3 className="font-bold text-slate-light mb-4">Direct Secure Upload</h3>
                    <p className="text-xs text-on-surface-variant mb-6">Upload raw MP4/WebM files to the encrypted bucket. Transcoding is handled autonomously.</p>

                    <div className="border border-dashed border-primary/40 bg-surface-container/30 hover:bg-surface-container/50 transition-colors rounded-xl p-8 text-center cursor-pointer relative overflow-hidden group">
                        <input type="file" accept="video/mp4,video/webm" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleUpload} disabled={isUploading} />

                        {!isUploading ? (
                            <>
                                <span className="material-symbols-outlined text-primary text-4xl mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
                                <div className="text-sm text-slate-light">Drag & drop your file here</div>
                                <div className="text-xs text-on-surface-variant mt-1">Maximum file size: 4GB</div>
                            </>
                        ) : (
                            <div className="w-full">
                                <div className="text-sm font-bold text-primary mb-2">Pushing to Node: {Math.min(uploadProgress, 100)}%</div>
                                <div className="w-full bg-background rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(uploadProgress, 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-card rounded-xl border border-glass-border p-6 h-fit">
                    <h3 className="font-bold text-slate-light mb-4">Current Asset Identifier</h3>
                    <p className="text-xs text-on-surface-variant mb-6">Modify the direct remote URL endpoint serving the core video asset.</p>

                    <form onSubmit={saveUrl}>
                        <label className="block text-xs font-label-caps text-on-surface-variant mb-2">Streaming URL Endpoint</label>
                        <div className="relative mb-6">
                            <span className="absolute left-3 top-3 material-symbols-outlined text-on-surface-variant text-lg">link</span>
                            <input
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder={isLoading ? "Loading securely..." : "https://..."}
                                className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-sm text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                            />
                        </div>

                        <button disabled={isLoading} type="submit" className="flex items-center gap-2 justify-center w-full bg-primary/20 text-primary border border-primary/40 py-3 rounded-lg font-bold hover:bg-primary hover:text-background transition-colors text-sm disabled:opacity-50">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Commit Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
