import React from 'react';
import { Progress } from '../ui/progress.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip.js';
import { parseBigInt, formatSupply } from '../../lib/utils.js';

interface SupplyProgressBarProps {
    circulatingSupplyStr: string | number | null | undefined;
    maxSupplyStr: string | number | null | undefined;
    totalSupplyStr: string | number | null | undefined;
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

    const effectiveMaxSupply = maxSupply ?? totalSupply; // Use totalSupply if maxSupply is not defined

    if (circulatingSupply === null) {
        return <span className="text-xs text-muted-foreground">N/A</span>;
    }

    const formattedCirculating = formatSupply(circulatingSupply);

    if (effectiveMaxSupply === null || effectiveMaxSupply === 0n) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="text-xs">{formattedCirculating} {symbol}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Circulating Supply: {formattedCirculating} {symbol}</p>
                        <p>Max/Total Supply: Not Available</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    const percentage = Number((circulatingSupply * 10000n / effectiveMaxSupply)) / 100;
    const formattedMax = formatSupply(effectiveMaxSupply);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="w-full">
                        <Progress value={percentage} className="h-2 mb-1" />
                        <div className="text-xs text-muted-foreground text-center">
                            {formattedCirculating} / {formattedMax}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Circulating: {formattedCirculating} {symbol}</p>
                    <p>{maxSupply ? 'Max Supply' : 'Total Supply'}: {formattedMax} {symbol}</p>
                    <p>Percentage: {percentage.toFixed(2)}%</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default SupplyProgressBar;