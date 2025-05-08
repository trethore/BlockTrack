import React from 'react';
import { Input } from '../ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.js';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group.js';
import { Button } from '../ui/button.js';
import { ArrowDownUp, ArrowUp, ArrowDown } from 'lucide-react';
import {
    TimePeriod,
    SortableTokenKey,
    SortDirection,
    TIME_PERIODS,
    SORTABLE_KEYS,
} from '../../types/token.js';

interface LeaderboardControlsProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    sortConfig: { key: SortableTokenKey; direction: SortDirection };
    onSortKeyChange: (key: SortableTokenKey) => void;
    onSortDirectionChange: (direction: SortDirection) => void;
    selectedTimePeriod: TimePeriod;
    onTimePeriodChange: (period: TimePeriod) => void;
}

const LeaderboardControls: React.FC<LeaderboardControlsProps> = ({
    searchTerm,
    onSearchChange,
    sortConfig,
    onSortKeyChange,
    onSortDirectionChange,
    selectedTimePeriod,
    onTimePeriodChange,
}) => {
    return (
        <div className="mb-6 space-y-4">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-semibold tracking-tight">Explore BlockTrack</h2>
            </div>
            <Input
                type="search"
                placeholder="Search token by name or symbol..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="max-w-lg mx-auto"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select
                        value={sortConfig.key}
                        onValueChange={(value) => onSortKeyChange(value as SortableTokenKey)}
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