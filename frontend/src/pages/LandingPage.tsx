import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.tsx';
import { TrendingUp, List, Star, BarChartHorizontal, Zap, Target, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

const LandingPage: React.FC = () => {
    const featureCardClass = "bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]";

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 space-y-16 md:space-y-24">

            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    Navigate the Crypto Cosmos
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    BlockTrack is your essential toolkit for cutting through the noise.
                    Track market leaders, discover trends, and personalize your crypto journey with clarity and confidence.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Button size="lg" asChild>
                        <Link to="/leaderboard">
                            <TrendingUp className="mr-2 h-5 w-5" /> Explore Leaderboard
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link to="/account">
                            <Star className="mr-2 h-5 w-5" /> Create Account / Login
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="space-y-12">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Why BlockTrack?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className={cn(featureCardClass)}>
                        <CardHeader className="items-center text-center">
                            <div className="p-3 rounded-full bg-primary/10 mb-3">
                                <List className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Real-Time Leaderboard</CardTitle>
                            <CardDescription className="text-center">
                                Stay ahead with constantly updated rankings based on market capitalization. Spot the movers and shakers instantly.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button variant="link" asChild className="text-primary">
                                <Link to="/leaderboard">View Leaderboard →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className={cn(featureCardClass)}>
                        <CardHeader className="items-center text-center">
                            <div className="p-3 rounded-full bg-amber-400/10 mb-3">
                                <Star className="h-8 w-8 text-amber-500" />
                            </div>
                            <CardTitle className="text-xl">Your Personal Watchlist</CardTitle>
                            <CardDescription className="text-center">
                                Stop drowning in noise. Authenticate to select your favorite tokens and track exactly what matters *to you*.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button variant="link" asChild className="text-primary">
                                <Link to="/favorites">Manage Favorites →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className={cn(featureCardClass)}>
                        <CardHeader className="items-center text-center">
                            <div className="p-3 rounded-full bg-blue-500/10 mb-3">
                                <BarChartHorizontal className="h-8 w-8 text-blue-500" />
                            </div>
                            <CardTitle className="text-xl">In-Depth Token Details</CardTitle>
                            <CardDescription className="text-center">
                                Go beyond the rank. Explore key metrics, historical price charts, and supply details for informed decisions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button variant="link" asChild className="text-primary">
                                <Link to="/leaderboard">Explore Tokens →</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className={cn(featureCardClass)}>
                        <CardHeader className="items-center text-center">
                            <div className="p-3 rounded-full bg-emerald-500/10 mb-3">
                                <Zap className="h-8 w-8 text-emerald-500" />
                            </div>
                            <CardTitle className="text-xl">Fast & Focused UI</CardTitle>
                            <CardDescription className="text-center">
                                Built with a modern stack (React, NestJS, Tailwind 4) and Clean Architecture for a reliable, clutter-free experience.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <span className="text-sm text-muted-foreground">(No distractions, just data)</span>
                        </CardContent>
                    </Card>

                    <Card className={cn(featureCardClass)}>
                        <CardHeader className="items-center text-center">
                            <div className="p-3 rounded-full bg-purple-500/10 mb-3">
                                <Target className="h-8 w-8 text-purple-500" />
                            </div>
                            <CardTitle className="text-xl">Open & Transparent</CardTitle>
                            <CardDescription className="text-center">
                                BlockTrack is open-source! Check out the code, contribute, or learn from the implementation on GitHub.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button variant="link" asChild className="text-primary" >
                                <a href="https://github.com/trethore/BlockTrack" target="_blank" rel="noopener noreferrer">
                                    View on GitHub →
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className={cn(featureCardClass)}>
                        <CardHeader className="items-center text-center">
                            <div className="p-3 rounded-full bg-fuchsia-500/10 mb-3">
                                <Sparkles className="h-8 w-8 text-fuchsia-500" />
                            </div>
                            <CardTitle className="text-xl">More Features Incoming!</CardTitle>
                            <CardDescription className="text-center">
                                We're just getting started. Expect exciting new tools, advanced analytics, and more ways to master the market soon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <span className="text-sm text-muted-foreground">(Stay tuned for updates!)</span>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="text-center bg-gradient-to-r from-primary/5 via-card to-primary/5 dark:from-primary/10 dark:via-card dark:to-primary/10 py-16 px-6 rounded-lg border border-border/50">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Take Control?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                    Create a free account to save your favorite tokens, personalize your view, and stay organized in the fast-paced crypto market.
                </p>
                <Button size="lg" asChild>
                    <Link to="/account">Get Started Now</Link>
                </Button>
            </section>

        </div>
    );
};

export default LandingPage;