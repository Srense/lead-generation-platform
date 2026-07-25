import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-surface-container-lowest dark:bg-surface-container-lowest border-t border-glass-border mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-gutter py-12 max-w-container-max mx-auto gap-6 text-center md:text-left">
                <div className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-primary">HarshBhati</div>
                <div className="flex flex-wrap justify-center gap-6">
                    <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">Privacy Policy</a>
                    <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">Terms of Service</a>
                    <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="#">Cookie Policy</a>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                    © 2024 HarshBhati. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
