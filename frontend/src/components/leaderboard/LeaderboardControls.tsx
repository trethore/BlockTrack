import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowUp, ArrowDown, X as XIcon, RefreshCcw } from 'lucide-react';
import {
    ChartTimeframe,
    SortableTokenKey,
    SortDirection,
    CHART_TIMEFRAMES,
} from '@/types/token.ts';
import { debounce } from 'lodash';

interface LeaderboardControlsProps {
    title?: string;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    sortConfig: { key: SortableTokenKey; direction: SortDirection };
    onSortKeyChange: (key: SortableTokenKey) => void;
    onSortDirectionChange: (direction: SortDirection) => void;
    selectedTimePeriod: ChartTimeframe;
    onTimePeriodChange: (period: ChartTimeframe) => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const SORTABLE_KEYS = [
    { value: 'marketCapUsd', label: 'Market Cap' },
    { value: 'name', label: 'Name' },
    { value: 'symbol', label: 'Symbol' },
    { value: 'priceUSD', label: 'Price' },
    { value: 'percentChange1h', label: '% 1h' },
    { value: 'percentChange24h', label: '% 24h' },
    { value: 'percentChange7d', label: '% 7d' },
    { value: 'percentChange30d', label: '% 30d' },
    { value: 'percentChange1y', label: '% 1y' },
] as const;


const LeaderboardControls: React.FC<LeaderboardControlsProps> = ({
    title = "Explore BlockTrack",
    searchTerm,
    onSearchChange,
    sortConfig,
    onSortKeyChange,
    onSortDirectionChange,
    selectedTimePeriod,
    onTimePeriodChange,
    onRefresh,
    isRefreshing
}) => {
    const [inputValue, setInputValue] = useState(searchTerm);
    const debouncedSearch = useCallback(
        debounce((newSearchTerm: string) => {
            onSearchChange(newSearchTerm);
        }, 300),
        [onSearchChange]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newInputValue = e.target.value;
        setInputValue(newInputValue);
        debouncedSearch(newInputValue);
    };

    const clearSearch = () => {
        setInputValue('');
        onSearchChange('');
        debouncedSearch.cancel();
    };

    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);


    const handleSortKeySelect = (value: string) => {
        const newSortKey = value as SortableTokenKey;
        onSortKeyChange(newSortKey);

        if (newSortKey.startsWith('percentChange')) {
            let period: ChartTimeframe | null = null;
            if (newSortKey === 'percentChange1h') period = '1h';
            else if (newSortKey === 'percentChange24h') period = '1d';
            else if (newSortKey === 'percentChange7d') period = '7d';
            else if (newSortKey === 'percentChange30d') period = '30d';
            else if (newSortKey === 'percentChange1y') period = '1y';

            if (period && CHART_TIMEFRAMES.includes(period)) {
                onTimePeriodChange(period);
            }
        }
    };

    return (
        <div className="mb-6 space-y-4">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            </div>
            <div className="relative max-w-lg mx-auto">
                <Input
                    type="search"
                    placeholder="Search token by name or symbol..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                />
                {inputValue && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-red-500 hover:text-red-700"
                        onClick={clearSearch}
                        aria-label="Clear search"
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select
                        value={sortConfig.key}
                        onValueChange={handleSortKeySelect}
                    >
                        <SelectTrigger className="w-auto sm:w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            {SORTABLE_KEYS.map(sk => (
                                <SelectItem key={sk.value} value={sk.value}>
                                    {sk.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onSortDirectionChange(sortConfig.direction === 'asc' ? 'desc' : 'asc')}
                        aria-label="Toggle sort direction"
                    >
                        {sortConfig.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            aria-label="Refresh favorites"
                        >
                            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    )}
                    <span className="text-sm text-muted-foreground hidden sm:inline">Period:</span>
                    <ToggleGroup
                        type="single"
                        value={selectedTimePeriod}
                        onValueChange={(value: ChartTimeframe) => {
                            if (value) onTimePeriodChange(value);
                        }}
                        className="flex-wrap justify-start sm:justify-end"
                    >
                        {CHART_TIMEFRAMES.map(period => (
                            <ToggleGroupItem key={period} value={period} aria-label={`Select ${period} period`}>
                                {period.toUpperCase()}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardControls;