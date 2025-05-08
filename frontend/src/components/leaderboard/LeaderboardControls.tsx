import React from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ArrowUp, ArrowDown, X as XIcon } from 'lucide-react';
import {
    TimePeriod,
    SortableTokenKey,
    SortDirection,
} from '@/types/token.ts';

interface LeaderboardControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    sortConfig: { key: SortableTokenKey; direction: SortDirection };
    onSortKeyChange: (key: SortableTokenKey) => void;
    onSortDirectionChange: (direction: SortDirection) => void;
    selectedTimePeriod: TimePeriod;
    onTimePeriodChange: (period: TimePeriod) => void;
}

const TIME_PERIODS: TimePeriod[] = ['1h', '24h', '7d', '30d', '1y'];

const SORTABLE_KEYS = [
    { value: 'name', label: 'Name' },
    { value: 'symbol', label: 'Symbol' },
    { value: 'priceUSD', label: 'Price' },
    { value: 'marketCapUsd', label: 'Market Cap' },
    { value: 'percentChange1h', label: '% 1h' },
    { value: 'percentChange24h', label: '% 24h' },
    { value: 'percentChange7d', label: '% 7d' },
    { value: 'percentChange30d', label: '% 30d' },
    { value: 'percentChange1y', label: '% 1y' },
];

const LeaderboardControls: React.FC<LeaderboardControlsProps> = ({
    searchTerm,
    onSearchChange,
    sortConfig,
    onSortKeyChange,
    onSortDirectionChange,
    selectedTimePeriod,
    onTimePeriodChange,
}) => {
    const handleSortKeySelect = (value: string) => {
        const newSortKey = value as SortableTokenKey;
        onSortKeyChange(newSortKey);
        if (newSortKey.startsWith('percentChange')) {
            const period = newSortKey.replace('percentChange', '').toLowerCase() as TimePeriod;
            if (TIME_PERIODS.includes(period)) {
                onTimePeriodChange(period);
            }
        }
    };

    return (
        <div className="mb-6 space-y-4">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-semibold tracking-tight">Explore BlockTrack</h2>
            </div>
            <div className="relative max-w-lg mx-auto">
                <Input
                    type="search"
                    placeholder="Search token by name or symbol..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pr-10"
                />
                {searchTerm && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-red-500 hover:text-red-700"
                        onClick={() => onSearchChange('')}
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
                    <span className="text-sm text-muted-foreground hidden sm:inline">Period:</span>
                    <ToggleGroup
                        type="single"
                        value={selectedTimePeriod}
                        onValueChange={(value: TimePeriod) => {
                            if (value) onTimePeriodChange(value);
                        }}
                        className="flex-wrap justify-start sm:justify-end"
                    >
                        {TIME_PERIODS.map(period => (
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