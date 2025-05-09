import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Compass, ListChecks } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4 space-y-8">
            <Compass className="h-24 w-24 text-primary/70" strokeWidth={1.5} />

            <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                    Oops! You lost the track.
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
                    It seems the page you're looking for isn't on our map.
                    Don't worry, let's get you back on course!
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button asChild size="lg">
                    <Link to="/leaderboard">
                        <ListChecks className="mr-2 h-5 w-5" />
                        Eyes on the Leaderboard
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link to="/">
                        Back to Home
                    </Link>
                </Button>
            </div>

            <p className="text-sm text-muted-foreground">
                Error Code: 404 - Page Not Found
            </p>
        </div>
    );
};

export default NotFoundPage;