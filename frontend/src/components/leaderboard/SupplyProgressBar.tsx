import React from 'react';
import { Progress } from '@/components/ui/progress.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { parseBigInt, formatSupply, formatSupply as formatSupplyDetailed } from '@lib/utils.ts';
import { Info } from 'lucide-react';

interface SupplyProgressBarProps {
    circulatingSupplyStr: string | number | null | undefined;
    maxSupplyStr: string | number | null | undefined;
    totalSupplyStr?: string | number | null | undefined;
    symbol: string;
}

const SupplyProgressBar: React.FC<SupplyProgressBarProps> = ({
    circulatingSupplyStr,
    maxSupplyStr,
    totalSupplyStr,
    symbol
}) => {
    const circulatingSupply = parseBigInt(circulatingSupplyStr);
    const maxSupply = parseBigInt(maxSupplyStr);
    const totalSupply = parseBigInt(totalSupplyStr);

    if (circulatingSupply === null) {
        return <span className="text-xs text-muted-foreground">N/A</span>;
    }

    const formattedCirculatingDisplay = formatSupply(circulatingSupply);
    const formattedCirculatingTooltip = formatSupplyDetailed(circulatingSupply);

    if (maxSupply === null) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="text-xs text-center flex items-center justify-center gap-1">
                            <span>{formattedCirculatingDisplay} {symbol}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Circulating: {formattedCirculatingTooltip} {symbol}</p>
                        <p>Max Supply: Infinite</p>
                        {totalSupply !== null && <p>Total Supply: {formatSupplyDetailed(totalSupply)} {symbol}</p>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    if (circulatingSupply === maxSupply) {
        const formattedMaxTooltip = formatSupplyDetailed(maxSupply);
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="text-xs text-center text-green-500 flex items-center justify-center gap-1">
                            <span>Fully Circulated</span>
                            <Info className="h-3 w-3 opacity-70" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Circulating: {formattedCirculatingTooltip} {symbol}</p>
                        <p>Max Supply: {formattedMaxTooltip} {symbol}</p>
                        <p>All available tokens are in circulation.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    const percentage = maxSupply === 0n ? 0 : Number((circulatingSupply * 10000n / maxSupply)) / 100;
    const formattedMaxDisplay = formatSupply(maxSupply);
    const formattedMaxTooltip = formatSupplyDetailed(maxSupply);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="w-full">
                        {maxSupply > 0n && <Progress value={percentage} className="h-2 mb-1" />}
                        <div className="text-xs text-muted-foreground text-center">
                            {formattedCirculatingDisplay} / {formattedMaxDisplay}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Circulating: {formattedCirculatingTooltip} {symbol}</p>
                    <p>Max Supply: {formattedMaxTooltip} {symbol}</p>
                    <p>Percentage: {percentage.toFixed(2)}%</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default SupplyProgressBar;