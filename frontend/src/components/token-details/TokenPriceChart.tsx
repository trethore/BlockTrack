import React from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.tsx';
import { ChartDataPoint } from '@/types/token.ts';
import { formatPrice } from '@/lib/utils.ts';

interface TokenPriceChartProps {
    data: ChartDataPoint[];
    isLoading: boolean;
}

function formatTimestamp(timestamp: number): string {
    const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    const d = new Date(ms);
    return isNaN(d.getTime())
        ? 'Invalid Time'
        : d.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
}

const TokenPriceChart: React.FC<TokenPriceChartProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return <div className="h-[300px] w-full bg-muted/50 animate-pulse rounded-md flex items-center justify-center">Loading Chart...</div>;
    }

    const chartData = data;

    if (!chartData || chartData.length === 0) {
        // Display error message if no data is available
        return <div className="h-[300px] w-full border rounded-md flex items-center justify-center text-muted-foreground">Please refresh, the distance API is having issues</div>; // MODIFIED THIS LINE
    }

    const greenColor = "hsl(142.1 76.2% 36.3%)";

    const chartConfig = {
        price: {
            label: "Price (USD)",
            color: greenColor,
        },
    } satisfies ChartConfig;

    const prices = chartData.map(d => d.price);
    const yMin = Math.min(...prices);
    const yMax = Math.max(...prices);
    const yPadding = Math.max((yMax - yMin) * 0.1, yMin * 0.05);

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted-foreground/50" />
                <XAxis
                    dataKey="date"
                    type="number"
                    scale="time"
                    domain={['dataMin', 'dataMax']}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value: number) => {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) return "";
                        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }}
                    className="text-xs text-muted-foreground"
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value: number) => formatPrice(value).replace('$', '')}
                    domain={[Math.max(0, yMin - yPadding), yMax + yPadding]}
                    className="text-xs text-muted-foreground"
                    orientation="right"
                    allowDataOverflow={false}
                />
                <ChartTooltip
                    cursor={true}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label: string, payload?: any[]) => {
                                const raw = payload?.[0]?.payload?.date;
                                return typeof raw === 'number'
                                    ? formatTimestamp(raw)
                                    : 'Invalid Time';
                            }}
                            formatter={(value: any) => typeof value === 'number' ? formatPrice(value) : 'N/A'}
                            indicator="dot"
                        />
                    }
                />
                <Line
                    dataKey="price"
                    type="monotone"
                    stroke={greenColor}
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    );
};

export default TokenPriceChart;