import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from './../ui/button.tsx';
import { useTheme } from './../theme-provider.tsx';
import { Moon, Sun, Bitcoin } from 'lucide-react';

const Navbar: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`;

    const logoColor = "oklch(0.65 0.22 145)";

    return (
        <nav className="bg-background border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <Bitcoin style={{ color: logoColor }} className="h-7 w-7" />
                        <span className="text-xl font-bold text-foreground">
                            BlockTrack
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <NavLink to="/" className={navLinkClasses}>
                            About
                        </NavLink>
                        <NavLink to="/leaderboard" className={navLinkClasses}>
                            Leaderboard
                        </NavLink>
                        <NavLink to="/favorites" className={navLinkClasses}>
                            Favorites
                        </NavLink>
                        <NavLink to="/account" className={navLinkClasses}>
                            Account
                        </NavLink>
                    </div>

                    {/* Theme Toggle Button */}
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;