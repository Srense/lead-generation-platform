import { useState } from 'react';

export default function VideoManager() {
    const [videoUrl, setVideoUrl] = useState('https://storage.googleapis.com/hshq-demo/hq_training_video.mp4');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const simulateUpload = (e) => {
        e.preventDefault();
        if (!e.target.files.length) return;
        setIsUploading(true);
        setUploadProgress(0);

        // Simulate complex secure upload
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setVideoUrl(`https://secure-repo.hq/uploads/${e.target.files[0].name.replace(/\s+/g, '_')}`);
                    return 100;
                }
                return prev + 15;
            });
        }, 400);
    };

    const saveUrl = (e) => {
        e.preventDefault();
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
                        <input type="file" accept="video/mp4,video/webm" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={simulateUpload} disabled={isUploading} />

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
                                className="w-full bg-background border border-glass-border rounded-lg py-3 pl-10 pr-4 text-sm text-slate-light focus:border-primary focus:ring-1 focus:outline-none transition-colors"
                            />
                        </div>

                        <button type="submit" className="flex items-center gap-2 justify-center w-full bg-primary/20 text-primary border border-primary/40 py-3 rounded-lg font-bold hover:bg-primary hover:text-background transition-colors text-sm">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Commit Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
