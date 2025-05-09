import React, { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    ListChecks,
    Star,
    BarChart3,
    Zap,
    Code,
    Rocket,
    Sparkles,
    ChevronsRight,
    ArrowDownCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '../components/ui/button.tsx';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '../components/ui/card.tsx';
import { cn } from '../lib/utils.ts';
import ScrollReveal from '../components/animations/ScrollReveal.tsx';

const SYMBOL_PALETTE = [
    { char: '₿', color: 'text-yellow-400/60' },
    { char: 'Ξ', color: 'text-gray-400/60' },
    { char: 'S', color: 'text-purple-400/60' },
    { char: '♦', color: 'text-blue-400/60' },
    { char: '◈', color: 'text-teal-400/60' },
    { char: 'Ł', color: 'text-sky-400/60' },
    { char: '$', color: 'text-green-400/60' },
    { char: 'Ð', color: 'text-orange-400/60' },
    { char: 'Δ', color: 'text-red-400/60' },
];

interface SymbolConfig {
    char: string;
    color: string;
    size: number;
    startX: number;
    startY: number;
    duration: number;
    delay: number;
    initialScale: number;
    animateScaleFactor: number;
}

const FloatingCryptoSymbols: React.FC = () => {
    const NUM_SYMBOLS = 25;

    const configs = useMemo<SymbolConfig[]>(
        () =>
            Array.from({ length: NUM_SYMBOLS }).map<SymbolConfig>(() => {
                const p = SYMBOL_PALETTE[Math.floor(Math.random() * SYMBOL_PALETTE.length)];
                const initialScale = Math.random() * 0.4 + 0.6;
                return {
                    char: p.char,
                    color: p.color,
                    size: Math.random() * 25 + 20,
                    startX: Math.random() * 100,
                    startY: 105 + Math.random() * 30,
                    duration: Math.random() * 10 + 15,  // Faster: 15–25s
                    delay: Math.random() * 10,           // Start sooner: 0–10s delay
                    initialScale,
                    animateScaleFactor: initialScale * (Math.random() * 0.3 + 0.85),
                };
            }),
        []
    );

    return (
        <div
            className="fixed inset-0 overflow-visible pointer-events-none z-[0]"
            aria-hidden="true"
        >
            {configs.map((cfg, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: `${cfg.startX}vw`,
                        y: `${cfg.startY}vh`,
                        opacity: 0,
                        scale: cfg.initialScale,
                    }}
                    animate={{
                        y: '-40vh',
                        opacity: [0, 0.5, 0.5, 0],
                        scale: cfg.animateScaleFactor,
                    }}
                    transition={{
                        duration: cfg.duration,
                        delay: cfg.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    style={{
                        position: 'absolute',
                        fontSize: cfg.size,
                        willChange: 'transform, opacity, scale',
                    }}
                    className={cn('font-bold', cfg.color)}
                >
                    {cfg.char}
                </motion.div>
            ))}
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactElement;
    title: string;
    description: string;
    linkTo?: string;
    linkLabel?: string;
    delay?: number;
    isExternalLink?: boolean;
    iconColorClass: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    linkTo,
    linkLabel,
    delay = 0,
    isExternalLink = false,
    iconColorClass,
}) => (
    <ScrollReveal delay={delay} className="h-full">
        <Card className="group h-full flex flex-col bg-card/70 dark:bg-card/60 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:scale-[1.02] hover:border-primary/60 hover:shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center space-x-4 p-6">
                <motion.div
                    className={cn('p-3 rounded-lg shadow-md', iconColorClass)}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    {React.cloneElement(icon, {
                        className: 'h-7 w-7 text-white',
                    } as React.HTMLAttributes<HTMLElement>)}
                </motion.div>
                <CardTitle className="text-xl font-semibold text-left text-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between px-6 pb-6">
                <CardDescription className="mb-4 text-left text-muted-foreground">
                    {description}
                </CardDescription>
                {linkTo && linkLabel && (
                    <Button
                        variant="link"
                        asChild
                        className="self-start p-0 h-auto text-primary group-hover:underline"
                    >
                        {isExternalLink ? (
                            <a
                                href={linkTo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center"
                            >
                                {linkLabel}
                                <ChevronsRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        ) : (
                            <Link to={linkTo} className="inline-flex items-center">
                                {linkLabel}
                                <ChevronsRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    </ScrollReveal>
);


const LandingPage: React.FC = () => {
    const featuresSectionRef = useRef<HTMLElement | null>(null);

    const heroTitleParts = [
        { text: 'Navigate the ', colorClass: 'text-foreground' },
        { text: 'Crypto', colorClass: 'text-green-400' },
        { text: ' Cosmos', colorClass: 'text-foreground' },
    ];
    const heroSubtitle =
        'BlockTrack is your essential toolkit for cutting through the noise. Track market leaders, discover trends, and personalize your crypto journey with clarity and confidence.';

    const features: FeatureCardProps[] = [
        {
            icon: <ListChecks />,
            title: 'Real‑Time Leaderboard',
            description: 'Stay ahead with constantly updated rankings. Spot the movers and shakers instantly.',
            linkTo: '/leaderboard',
            linkLabel: 'View Leaderboard',
            delay: 0.1,
            iconColorClass: 'bg-sky-500',
        },
        {
            icon: <Star />,
            title: 'Personal Watchlist',
            description: 'Authenticate to select & track tokens that matter *to you*.',
            linkTo: '/favorites',
            linkLabel: 'Manage Favorites',
            delay: 0.2,
            iconColorClass: 'bg-amber-500',
        },
        {
            icon: <BarChart3 />,
            title: 'In‑Depth Token Details',
            description: 'Go beyond ranks. Explore key metrics and historical price charts.',
            linkTo: '/leaderboard',
            linkLabel: 'Explore Tokens',
            delay: 0.3,
            iconColorClass: 'bg-blue-500',
        },
        {
            icon: <Zap />,
            title: 'Fast & Focused UI',
            description: 'Built with a modern stack and Clean Architecture for a reliable, clutter‑free experience.',
            delay: 0.4,
            iconColorClass: 'bg-emerald-500',
        },
        {
            icon: <Code />,
            title: 'Open & Transparent',
            description: 'BlockTrack is open‑source! Check out the code, contribute, or learn from it.',
            linkTo: 'https://github.com/trethore/BlockTrack',
            linkLabel: 'View on GitHub',
            delay: 0.5,
            isExternalLink: true,
            iconColorClass: 'bg-purple-500',
        },
        {
            icon: <Rocket />,
            title: 'More Features Incoming!',
            description: "We're just getting started. Expect exciting new tools and advanced analytics soon.",
            delay: 0.6,
            iconColorClass: 'bg-fuchsia-500',
        },
    ];

    const titleWordVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.15 + 0.1, duration: 0.5, ease: 'easeOut' },
        }),
    };

    const scrollToFeatures = () =>
        featuresSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });

    return (
        <div className="relative container mx-auto px-4 py-8 md:py-12 space-y-20 md:space-y-28 overflow-y-hidden">
            <FloatingCryptoSymbols />

            <section className="relative z-[1] flex flex-col items-center justify-center text-center space-y-8 pt-16 md:pt-20 pb-12 md:pb-16 min-h-[calc(50vh+4rem)] sm:min-h-[calc(60vh+4rem)]">
                <motion.h1
                    className="font-extrabold tracking-tighter text-5xl sm:text-6xl lg:text-7xl"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                >
                    {heroTitleParts.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                            {part.text.split(' ').map(
                                (word, wordIndex) =>
                                    word && (
                                        <motion.span
                                            key={`${partIndex}-${wordIndex}`}
                                            variants={titleWordVariants}
                                            custom={partIndex * 3 + wordIndex}
                                            className={cn(
                                                'inline-block',
                                                part.colorClass,
                                                (wordIndex < part.text.split(' ').length - 1 || partIndex < heroTitleParts.length - 1) ? 'mr-2 sm:mr-3 lg:mr-4' : 'mr-0'
                                            )}
                                        >
                                            {word}
                                        </motion.span>
                                    )
                            )}
                        </React.Fragment>
                    ))}
                </motion.h1>

                <ScrollReveal delay={0.8}>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-muted-foreground">
                        {heroSubtitle}
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={1.0}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8">
                        <Button
                            size="lg"
                            asChild
                            className="shadow-lg hover:shadow-primary/40 transition-shadow duration-300 transform hover:scale-105"
                        >
                            <Link to="/leaderboard">
                                <TrendingUp className="mr-2 h-5 w-5" /> Explore Leaderboard
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="shadow-md hover:shadow-accent/30 transition-shadow duration-300 transform hover:scale-105"
                        >
                            <Link to="/account">
                                <Star className="mr-2 h-5 w-5" /> Create Account / Login
                            </Link>
                        </Button>
                    </div>
                </ScrollReveal>

                <AnimatePresence>
                    <motion.div
                        // Scroll down button position adjusted
                        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group translate-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        onClick={scrollToFeatures}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') scrollToFeatures();
                        }}
                        aria-label="Scroll to features section"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                            className="p-2 rounded-full group-hover:bg-primary/10 transition-colors "
                        >
                            <ArrowDownCircle className="h-10 w-10 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </section>

            <section ref={featuresSectionRef} className="relative z-[1] space-y-12 py-16 md:py-24">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 md:mb-20">
                        Why <span className="text-green-400">BlockTrack</span>?
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {features.map((feature, idx) => (
                        <FeatureCard key={idx} {...feature} />
                    ))}
                </div>
            </section>

            <ScrollReveal delay={0.3}>
                <section className="relative z-[1] text-center py-20 md:py-28 px-6 rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-primary/5 via-card to-accent/5 dark:from-primary/10 dark:via-card dark:to-accent/10 border border-border/20">
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] rounded-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-slow-spin opacity-30 md:opacity-40 -z-[1]" />
                    <Sparkles className="mx-auto mb-8 h-14 w-14 text-primary animate-pulse" />
                    <h2 className="mb-6 text-3xl md:text-4xl font-bold">Ready to Take Control?</h2>
                    <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed text-muted-foreground">
                        Create a free account to save your favorite tokens, personalize your view, and stay organized in the fast‑paced crypto market.
                    </p>
                    <Button
                        size="lg"
                        asChild
                        className="px-12 py-3 text-base md:text-lg font-semibold shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105"
                    >
                        <Link to="/account">Get Started Now</Link>
                    </Button>
                </section>
            </ScrollReveal>
        </div>
    );
};

export default LandingPage;