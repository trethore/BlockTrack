import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-background border-t border-border text-sm text-muted-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <a
                        href="https://github.com/trethore/BlockTrack"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                        <Github className="h-4 w-4" />
                        <span>Github</span>
                    </a>

                    <div className="text-center md:text-right">
                        <span>BlockTrack by Titouan Réthoré. </span>
                        <span>Powered by <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">CoinGecko API</a>. </span>
                        <span>Code under MIT license.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;