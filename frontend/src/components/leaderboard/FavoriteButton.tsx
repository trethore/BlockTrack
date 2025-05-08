import React from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';

interface FavoriteButtonProps {
    tokenId: string;
    isFavorite: boolean;
    onToggle: (tokenId: string) => void;
    isLoading: boolean;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    tokenId,
    isFavorite,
    onToggle,
    isLoading,
    isAuthLoading,
    isAuthenticated,
}) => {
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click if any
        if (!isAuthenticated || isAuthLoading || isLoading) return;
        onToggle(tokenId);
    };

    if (isAuthLoading) {
        return (
            <Button variant="ghost" size="icon" className="w-8 h-8" disabled>
                <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
        );
    }

    if (!isAuthenticated) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 opacity-50 cursor-not-allowed">
                            <Star className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Login to add favorites</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }


    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggle}
                        disabled={isLoading}
                        className="w-8 h-8"
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default FavoriteButton;