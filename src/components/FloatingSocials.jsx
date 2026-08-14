import React from 'react';

export default function FloatingSocials() {
    // Replace these with the actual details
    const whatsappNumber = "919876543210"; // Country code + number
    const whatsappMessage = encodeURIComponent("Hi Harsh! I watched your video and would like to know more about the digital craftsmanship training.");
    
    const instagramHandle = "harshbahti";

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Instagram Button */}
            <a 
                href={`https://instagram.com/${instagramHandle}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_rgba(238,42,123,0.5)]"
                aria-label="Message on Instagram"
            >
                {/* Instagram SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            </a>

            {/* WhatsApp Button */}
            <a 
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
                aria-label="Message on WhatsApp"
            >
                {/* WhatsApp SVG Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
            </a>
        </div>
    );
}
