import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, Menu, Bitcoin as BitcoinIcon, X } from "lucide-react"; // Renamed Bitcoin to BitcoinIcon
import { Button } from "../ui/button.tsx";
import { useTheme } from "../theme-provider.tsx";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    // SheetClose, // Not directly used here but available
} from "../ui/sheet.tsx";
import { cn } from "../../lib/utils.ts";

const Navbar: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
        const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
        if (isActive) {
            return `${baseClasses} bg-primary/10 text-primary dark:bg-accent dark:text-accent-foreground`;
        } else {
            return `${baseClasses} text-muted-foreground hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground`;
        }
    };

    const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) => {
        const baseClasses = "block px-3 py-3 rounded-md text-base font-medium transition-colors";
        if (isActive) {
            return `${baseClasses} bg-primary/10 text-primary dark:bg-accent dark:text-accent-foreground`;
        } else {
            return `${baseClasses} text-muted-foreground hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground`;
        }
    };

    const logoColor = "oklch(0.65 0.22 145)";

    const closeSheet = () => setIsSheetOpen(false);

    return (
        <nav className="bg-background border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0" onClick={isSheetOpen ? closeSheet : undefined}>
                        <BitcoinIcon className="h-7 w-7 text-green-500" />
                        <span className="text-xl font-bold text-foreground">
                            BlockTrack
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        <NavLink to="/" className={navLinkClasses} end>About</NavLink>
                        <NavLink to="/leaderboard" className={navLinkClasses}>Leaderboard</NavLink>
                        <NavLink to="/favorites" className={navLinkClasses}>Favorites</NavLink>
                        <NavLink to="/account" className={navLinkClasses}>Account</NavLink>
                    </div>

                    <div className="flex items-center gap-2">
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

                        <div className="md:hidden">
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                                    <SheetHeader className="flex flex-row justify-between items-center space-y-0 border-b p-4">
                                        <Link to="/" className="flex items-center gap-2" onClick={closeSheet}>
                                            <BitcoinIcon className="h-6 w-6 text-green-500" />
                                            <SheetTitle className="text-lg font-semibold">BlockTrack</SheetTitle>
                                        </Link>
                                    </SheetHeader>
                                    <nav className="flex flex-col space-y-1 p-4">
                                        <NavLink to="/" className={mobileNavLinkClasses} onClick={closeSheet} end>About</NavLink>
                                        <NavLink to="/leaderboard" className={mobileNavLinkClasses} onClick={closeSheet}>Leaderboard</NavLink>
                                        <NavLink to="/favorites" className={mobileNavLinkClasses} onClick={closeSheet}>Favorites</NavLink>
                                        <NavLink to="/account" className={mobileNavLinkClasses} onClick={closeSheet}>Account</NavLink>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;