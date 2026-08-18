import { useState } from 'react';

const FEATURED_CERTIFICATES = [
    {
        title: 'Govt. Registration & Legal Incorporation',
        description: 'Official registration with government regulatory compliance & direct selling guidelines.',
        image: '/Govt.Proof/certificates/image1.jpeg',
        tag: 'Legal Entity'
    },
    {
        title: 'Consumer Protection & Fair Trade Standards',
        description: 'Certified adherence to national consumer affairs and ethical business practices.',
        image: '/Govt.Proof/certificates/image3.jpeg',
        tag: 'Compliance'
    },
    {
        title: 'Global Quality & Safety Certifications',
        description: 'International ISO, Halal, Kosher & cruelty-free manufacturing approvals.',
        image: '/Govt.Proof/certificates/image5.jpeg',
        tag: 'Quality Standard'
    },
    {
        title: 'Tax, GST & Commercial Authority Approvals',
        description: 'Fully compliant commercial registration with active national standing.',
        image: '/Govt.Proof/certificates/image7.jpeg',
        tag: 'Official Approval'
    }
];

export default function GovtProofSection() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    return (
        <section className="py-16 px-margin-mobile md:px-gutter max-w-6xl mx-auto" id="govt-proof">
            <div className="floral-glass rounded-[2.5rem] p-8 md:p-14 ambient-shadow border border-emerald-500/20 relative overflow-hidden">
                {/* Ambient glow backgrounds */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 space-y-10">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                            <span className="material-symbols-outlined text-base">verified_user</span>
                            100% Government Registered & Certified
                        </div>

                        <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Official Government Proof & <span className="text-gradient-shimmer">Legal Compliance</span>
                        </h2>

                        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                            We operate with absolute transparency. Our business model, digital systems, and products are 100% compliant with Government regulations, Consumer Protection guidelines, and International Quality Standards.
                        </p>
                    </div>

                    {/* Certificate Grid Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_CERTIFICATES.map((cert, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(cert.image)}
                                className="group relative rounded-2xl bg-black/40 border border-white/10 hover:border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col justify-between"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-black/60">
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-primary/90 text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                                            {cert.tag}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-10 h-10 rounded-full bg-black/80 text-primary flex items-center justify-center shadow-lg border border-primary/30">
                                            <span className="material-symbols-outlined text-xl">zoom_in</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-semibold text-white text-sm mb-1.5 group-hover:text-primary transition-colors">
                                            {cert.title}
                                        </h4>
                                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                                            {cert.description}
                                        </p>
                                    </div>
                                    <div className="pt-4 flex items-center gap-1.5 text-xs text-primary font-semibold">
                                        <span>Click to Inspect</span>
                                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="floral-glass-heavy rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-left">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <span className="material-symbols-outlined text-3xl">policy</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base md:text-lg">
                                    Complete 24-Page Legal & Government Verification Dossier
                                </h4>
                                <p className="text-xs md:text-sm text-on-surface-variant">
                                    Includes Ministry registrations, Quality standard certifications, and regulatory approvals.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
                            <button
                                onClick={() => setIsPdfModalOpen(true)}
                                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-black px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-base">visibility</span>
                                View Full Proof (PDF)
                            </button>

                            <a
                                href="/Govt.Proof/Govt_Registration_Certificates.pdf"
                                download="Govt_Registration_Certificates.pdf"
                                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all"
                            >
                                <span className="material-symbols-outlined text-base">download</span>
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox / Zoom Modal for individual certificate images */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden floral-glass-heavy border border-primary/40 p-4 shadow-[0_0_60px_rgba(16,185,129,0.3)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white hover:text-primary flex items-center justify-center transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Government Certificate Proof"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                        />
                        <div className="pt-3 text-center">
                            <span className="text-xs text-on-surface-variant">Verified Government Compliance Document</span>
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Full Dossier Modal */}
            {isPdfModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in"
                    onClick={() => setIsPdfModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden floral-glass-heavy border border-primary/40 flex flex-col shadow-[0_0_60px_rgba(16,185,129,0.3)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                                Official Government Verification Dossier (PDF)
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href="/Govt.Proof/Govt_Registration_Certificates.pdf"
                                    download="Govt_Registration_Certificates.pdf"
                                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span> Download File
                                </a>
                                <button
                                    onClick={() => setIsPdfModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined text-base">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 w-full bg-black/80">
                            <iframe
                                src="/Govt.Proof/Govt_Registration_Certificates.pdf#toolbar=1"
                                title="Official Government Registration Certificates"
                                className="w-full h-full border-0"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
