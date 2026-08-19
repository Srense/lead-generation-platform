import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlowCard from '../components/GlowCard';

const ALL_CERTIFICATES = [
    {
        id: 1,
        title: 'Govt. Registration & Incorporation Certificate',
        category: 'Legal Entity',
        tag: 'Incorporation',
        description: 'Official direct selling registration & legal entity incorporation complying with national statutory guidelines.',
        image: '/Govt.Proof/certificates/image1.jpeg'
    },
    {
        id: 2,
        title: 'Statutory Regulatory Authority Compliance',
        category: 'Legal Entity',
        tag: 'Legal Standing',
        description: 'Authoritative certification confirming business adherence to government commercial provisions.',
        image: '/Govt.Proof/certificates/image2.png'
    },
    {
        id: 3,
        title: 'Consumer Protection & Fair Trade Standards',
        category: 'Consumer Protection',
        tag: 'Consumer Rights',
        description: 'Certified adherence to national consumer protection policies, grievance redressal, and ethical trade practices.',
        image: '/Govt.Proof/certificates/image3.jpeg'
    },
    {
        id: 4,
        title: 'Direct Selling Model Legal Verification',
        category: 'Legal Entity',
        tag: 'Compliance',
        description: 'Validated compliance with consumer affairs direct selling regulations and trade standards.',
        image: '/Govt.Proof/certificates/image4.png'
    },
    {
        id: 5,
        title: 'Global Quality & ISO Standards Certification',
        category: 'Quality & ISO',
        tag: 'ISO Standard',
        description: 'International benchmark certification for premium quality management, safety, and rigorous manufacturing controls.',
        image: '/Govt.Proof/certificates/image5.jpeg'
    },
    {
        id: 6,
        title: 'Good Manufacturing Practices (GMP) Seal',
        category: 'Quality & ISO',
        tag: 'GMP Approved',
        description: 'Rigorous manufacturing and laboratory inspection verification verifying top safety ratings.',
        image: '/Govt.Proof/certificates/image6.jpeg'
    },
    {
        id: 7,
        title: 'Commercial Standing & GST Compliance',
        category: 'Tax & Compliance',
        tag: 'Tax Official',
        description: 'Fully audited tax standing, Goods and Services Tax registration, and fiscal transparency declaration.',
        image: '/Govt.Proof/certificates/image7.jpeg'
    },
    {
        id: 8,
        title: 'Commercial Operations & Licensing Permit',
        category: 'Tax & Compliance',
        tag: 'Operations',
        description: 'Commercial operating permit verified by municipal and national enterprise departments.',
        image: '/Govt.Proof/certificates/image8.jpeg'
    },
    {
        id: 9,
        title: 'International Halal & Kosher Certifications',
        category: 'Quality & ISO',
        tag: 'Global Purity',
        description: 'Global purity and dietary safety certification enabling worldwide international distribution in 160+ countries.',
        image: '/Govt.Proof/certificates/image9.jpeg'
    },
    {
        id: 10,
        title: 'Cruelty-Free & Ethical Production Audit',
        category: 'Quality & ISO',
        tag: 'Ethical',
        description: 'Audited assurance of zero animal testing and environmentally responsible harvesting standards.',
        image: '/Govt.Proof/certificates/image10.jpeg'
    },
    {
        id: 11,
        title: 'National Ministry Authorization & Declaration',
        category: 'Legal Entity',
        tag: 'Ministry Record',
        description: 'Government ministry registry record recognizing lawful active standing in the direct sales sector.',
        image: '/Govt.Proof/certificates/image11.jpeg'
    },
    {
        id: 12,
        title: 'Enterprise Authenticity Verification',
        category: 'Legal Entity',
        tag: 'Enterprise',
        description: 'Corporate registry documentation certifying legitimate operational status.',
        image: '/Govt.Proof/certificates/image12.png'
    },
    {
        id: 13,
        title: 'Consumer Redressal & Transparency Charter',
        category: 'Consumer Protection',
        tag: 'Fair Trade',
        description: 'Legally documented consumer terms, refund frameworks, and user rights protection.',
        image: '/Govt.Proof/certificates/image13.jpeg'
    },
    {
        id: 14,
        title: 'Safety & Product Efficacy Validation',
        category: 'Quality & ISO',
        tag: 'Safety Rated',
        description: 'Independent clinical testing and efficacy verification from accredited laboratories.',
        image: '/Govt.Proof/certificates/image14.jpeg'
    },
    {
        id: 15,
        title: 'Direct Sales Association Regulatory Member',
        category: 'Consumer Protection',
        tag: 'DSA Charter',
        description: 'Full alignment with national Direct Selling Association ethical guidelines and governance.',
        image: '/Govt.Proof/certificates/image15.png'
    },
    {
        id: 16,
        title: 'Tax Residency & Fiscal Clearance Certificate',
        category: 'Tax & Compliance',
        tag: 'Tax Clearance',
        description: 'Clean tax record with complete statutory withholdings and annual compliance filings.',
        image: '/Govt.Proof/certificates/image16.jpeg'
    },
    {
        id: 17,
        title: 'Global Export & Distribution License',
        category: 'Legal Entity',
        tag: 'Export License',
        description: 'Cross-border logistics authorization meeting international customs and trade pacts.',
        image: '/Govt.Proof/certificates/image17.jpeg'
    },
    {
        id: 18,
        title: 'Environmental & Sustainability Benchmark',
        category: 'Quality & ISO',
        tag: 'Eco Friendly',
        description: 'Eco-conscious manufacturing, recyclable packaging validation, and carbon accountability.',
        image: '/Govt.Proof/certificates/image18.jpeg'
    },
    {
        id: 19,
        title: 'Official Identity & Brand Protection Registry',
        category: 'Legal Entity',
        tag: 'Intellectual Property',
        description: 'Trademark and intellectual property registration protecting digital training and brand assets.',
        image: '/Govt.Proof/certificates/image19.jpeg'
    },
    {
        id: 20,
        title: 'Anti-Pyramid Statutory Compliance Declaration',
        category: 'Consumer Protection',
        tag: 'Anti-Fraud',
        description: 'Direct verification demonstrating genuine product-based commerce, strictly banning deceptive practices.',
        image: '/Govt.Proof/certificates/image20.jpeg'
    },
    {
        id: 21,
        title: 'State Governance Operational Clearance',
        category: 'Legal Entity',
        tag: 'State Clearance',
        description: 'Regional administrative operational compliance and legal commerce endorsements.',
        image: '/Govt.Proof/certificates/image21.jpeg'
    },
    {
        id: 22,
        title: 'Quality Management Systems (ISO 9001:2015)',
        category: 'Quality & ISO',
        tag: 'ISO 9001',
        description: 'Certified operational management system upholding continuous improvement and safety.',
        image: '/Govt.Proof/certificates/image22.jpeg'
    },
    {
        id: 23,
        title: 'Digital Systems & Data Security Compliance',
        category: 'Consumer Protection',
        tag: 'Data Safety',
        description: 'Adherence to privacy protocols, encrypted user portals, and strict data governance.',
        image: '/Govt.Proof/certificates/image23.jpeg'
    },
    {
        id: 24,
        title: 'Comprehensive Legal Dossier Master Endorsement',
        category: 'Tax & Compliance',
        tag: 'Dossier Master',
        description: 'Summary government certification validating complete statutory compliance dossier.',
        image: '/Govt.Proof/certificates/image24.jpeg'
    }
];

const CATEGORIES = ['All Proofs', 'Legal Entity', 'Quality & ISO', 'Consumer Protection', 'Tax & Compliance'];

export default function Certificates() {
    const [selectedCategory, setSelectedCategory] = useState('All Proofs');
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const filteredCertificates = useMemo(() => {
        if (selectedCategory === 'All Proofs') return ALL_CERTIFICATES;
        return ALL_CERTIFICATES.filter(c => c.category === selectedCategory);
    }, [selectedCategory]);

    const activeImage = lightboxIndex !== null ? filteredCertificates[lightboxIndex] : null;

    const handlePrev = (e) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + filteredCertificates.length) % filteredCertificates.length);
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % filteredCertificates.length);
        }
    };

    return (
        <div className="bg-transparent text-on-background min-h-screen flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-margin-mobile md:px-gutter max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Section */}
                <section className="text-center max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        <span className="material-symbols-outlined text-base">verified_user</span>
                        100% Government Registered & Fully Compliant
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
                        Official Government Proof & <span className="text-gradient-shimmer">Legal Certifications</span>
                    </h1>

                    <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        Complete transparency is the cornerstone of our platform. Explore our verified registrations, consumer protection charters, ISO quality standards, and official government documentation.
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        <div className="floral-glass p-4 rounded-2xl text-center border border-white/5">
                            <span className="block font-display text-2xl md:text-3xl font-bold text-primary">100%</span>
                            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Govt. Registered</span>
                        </div>
                        <div className="floral-glass p-4 rounded-2xl text-center border border-white/5">
                            <span className="block font-display text-2xl md:text-3xl font-bold text-secondary">24+</span>
                            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Verified Proofs</span>
                        </div>
                        <div className="floral-glass p-4 rounded-2xl text-center border border-white/5">
                            <span className="block font-display text-2xl md:text-3xl font-bold text-primary">ISO 9001</span>
                            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Quality Standard</span>
                        </div>
                        <div className="floral-glass p-4 rounded-2xl text-center border border-white/5">
                            <span className="block font-display text-2xl md:text-3xl font-bold text-secondary">160+</span>
                            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Global Countries</span>
                        </div>
                    </div>
                </section>

                {/* Primary Dossier Download & Inspection Banner */}
                <section>
                    <div className="floral-glass-heavy rounded-3xl p-8 md:p-10 border border-emerald-500/20 ambient-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[150%] bg-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10 flex items-start sm:items-center gap-5 text-left">
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
                                <span className="material-symbols-outlined text-4xl">policy</span>
                            </div>
                            <div>
                                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                                    Official 24-Page Government Verification Dossier
                                </h3>
                                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-xl">
                                    Contains complete authenticated statutory filings, ministry certifications, tax clearances, and direct selling regulatory licenses in one document.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
                            <button
                                onClick={() => setIsPdfModalOpen(true)}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-black px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 hover:-translate-y-0.5"
                            >
                                <span className="material-symbols-outlined text-base">visibility</span>
                                View Dossier (PDF)
                            </button>
                            <a
                                href="/Govt.Proof/Govt_Registration_Certificates.pdf"
                                download="Govt_Registration_Certificates.pdf"
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all"
                            >
                                <span className="material-symbols-outlined text-base">download</span>
                                Download PDF
                            </a>
                        </div>
                    </div>
                </section>

                {/* Category Filter Tabs */}
                <section className="space-y-8">
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                                    selectedCategory === category
                                        ? 'bg-primary text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                                        : 'bg-black/40 border border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Certificate Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCertificates.map((cert, idx) => (
                            <GlowCard
                                key={cert.id}
                                onClick={() => setLightboxIndex(idx)}
                                className="floral-glass p-4 rounded-2xl border border-white/10 hover:border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/5">
                                        <img
                                            src={cert.image}
                                            alt={cert.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                        <div className="absolute top-2.5 left-2.5">
                                            <span className="bg-primary/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                                                {cert.tag}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
                                            <div className="w-10 h-10 rounded-full bg-black/80 text-primary flex items-center justify-center shadow-lg border border-primary/30">
                                                <span className="material-symbols-outlined text-xl">zoom_in</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block mb-1">
                                            {cert.category}
                                        </span>
                                        <h4 className="font-semibold text-white text-sm group-hover:text-primary transition-colors line-clamp-2">
                                            {cert.title}
                                        </h4>
                                        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mt-1.5">
                                            {cert.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-primary font-semibold">
                                    <span>Inspect Document</span>
                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </GlowCard>
                        ))}
                    </div>
                </section>

                {/* Trust & Legal Compliance Pillars */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                    <GlowCard className="floral-glass p-8 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-5 border border-primary/30">
                            <span className="material-symbols-outlined text-2xl">gavel</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-2">Statutory Compliance</h3>
                        <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                            Operating strictly under national Direct Selling Guidelines and statutory commerce acts, guaranteeing legal legitimacy for all associates.
                        </p>
                    </GlowCard>

                    <GlowCard className="floral-glass p-8 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-5 border border-secondary/30">
                            <span className="material-symbols-outlined text-2xl">shield</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-2">Consumer Protection</h3>
                        <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                            Complete transparency with clear buyer rights, grievance redressal systems, and direct registration with consumer protection authorities.
                        </p>
                    </GlowCard>

                    <GlowCard className="floral-glass p-8 rounded-3xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-tertiary/20 text-tertiary flex items-center justify-center mb-5 border border-tertiary/30">
                            <span className="material-symbols-outlined text-2xl">award_star</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-2">Global Quality Standards</h3>
                        <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                            Recognized with ISO 9001:2015, Halal, Kosher, and cruelty-free seals, maintaining world-class manufacturing across 160+ countries worldwide.
                        </p>
                    </GlowCard>
                </section>

                {/* Call to Action Card */}
                <section className="text-center">
                    <GlowCard className="floral-glass-heavy p-10 md:p-14 rounded-[2.5rem] ambient-shadow relative overflow-hidden border border-white/10">
                        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Ready to Start Your Digital Journey?
                            </h2>
                            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                                Join our 100% verified, legal, and government-registered program. Watch the exclusive training session or submit your application today.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                                <Link
                                    to="/#training"
                                    className="bg-primary hover:bg-primary-container text-black px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-0.5"
                                >
                                    Watch Training
                                </Link>
                                <Link
                                    to="/contact"
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all"
                                >
                                    Contact Team
                                </Link>
                            </div>
                        </div>
                    </GlowCard>
                </section>
            </main>

            {/* Lightbox / Zoom Modal for Certificates */}
            {activeImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
                    onClick={() => setLightboxIndex(null)}
                >
                    <div
                        className="relative max-w-4xl w-full max-h-[92vh] rounded-3xl overflow-hidden floral-glass-heavy border border-primary/40 p-5 shadow-[0_0_60px_rgba(16,185,129,0.3)] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Lightbox Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                                    {activeImage.category} • Document {lightboxIndex + 1} of {filteredCertificates.length}
                                </span>
                                <h3 className="text-white font-semibold text-base">{activeImage.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={activeImage.image}
                                    download={`${activeImage.title.replace(/\s+/g, '_')}.jpeg`}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                                    title="Download Certificate Image"
                                >
                                    <span className="material-symbols-outlined text-base">download</span>
                                </a>
                                <button
                                    onClick={() => setLightboxIndex(null)}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Lightbox Image View & Prev/Next Buttons */}
                        <div className="relative flex-1 flex items-center justify-center py-4 min-h-[50vh] max-h-[68vh] overflow-hidden">
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-primary hover:text-black text-white border border-white/20 flex items-center justify-center transition-all shadow-lg"
                                title="Previous"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>

                            <img
                                src={activeImage.image}
                                alt={activeImage.title}
                                className="w-full h-auto max-h-[64vh] object-contain rounded-xl shadow-2xl"
                            />

                            <button
                                onClick={handleNext}
                                className="absolute right-2 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-primary hover:text-black text-white border border-white/20 flex items-center justify-center transition-all shadow-lg"
                                title="Next"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>

                        {/* Lightbox Footer */}
                        <div className="pt-3 border-t border-white/10 text-center text-xs text-on-surface-variant flex items-center justify-between">
                            <span>{activeImage.description}</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">verified</span> Verified Official
                            </span>
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

            <Footer />
        </div>
    );
}
