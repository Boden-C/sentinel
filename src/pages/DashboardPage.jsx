import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Overview } from '@/components/overview';
import { BuildingSwitcher } from '@/components/building-switcher';
import { UserNav } from '@/components/user-nav';
import { MapPin, Clock, Cloud, Sun, CloudRain, CalendarCog, Search } from 'lucide-react';

/**
 * Determines the emission level color based on the provided level
 * @param {'low' | 'medium' | 'high'} level - The emission level
 * @returns {string} Tailwind color class
 */
const getEmissionColor = (level) => {
    const colors = {
        low: 'text-green-500',
        medium: 'text-yellow-500',
        high: 'text-red-500',
    };
    return colors[level] || colors.medium;
};

/**
 * @param {{ title: string, description: string, impact: string }} props
 */
const ActionItem = ({ title, description, impact }) => (
    <div className="mb-4 p-4 border-2 rounded-lg">
        <div className="flex items-center gap-2">
            <CalendarCog className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm font-medium mt-2">Potential Impact: {impact}</p>
        <Button className="mt-2 border-red-500 text-red-500" variant="outline">
            Disable
        </Button>
    </div>
);

/**
 * @param {{ title: string, description: string, impact: string }} props
 */
const SearchItem = ({ title, description, impact }) => (
    <div className="mb-4 p-4 border-2 rounded-lg">
        <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm font-medium mt-2">Potential Impact: {impact}</p>
        <Button className="mt-2 text-yellow-500" variant="outline">
            Search
        </Button>
    </div>
);

const WeatherIcon = ({ condition }) => {
    switch (condition.toLowerCase()) {
        case 'sunny':
            return <Sun className="h-4 w-4 text-yellow-500" />;
        case 'cloudy':
            return <Cloud className="h-4 w-4 text-gray-500" />;
        case 'rainy':
            return <CloudRain className="h-4 w-4 text-blue-500" />;
        default:
            return <Cloud className="h-4 w-4 text-gray-500" />;
    }
};

export default function DashboardPage() {
    return (
        <div className="flex h-screen flex-col">
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <BuildingSwitcher />
                    <div className="ml-auto flex items-center space-x-4">
                        <CalendarDateRangePicker />
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex-1 p-8 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side */}
                    <div className="space-y-6">
                        {/* Metric Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Carbon Emissions</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-green-500"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold">Currently:</span>
                                        <span className={`text-2xl font-bold ${getEmissionColor('low')}`}>Low</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">Estimated Usage: 245 kWh</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                                    <CardTitle className="text-sm font-medium">
                                        {' '}
                                        Local Time:{' '}
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <MapPin className="h-4 w-4 text-blue-500" />
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <WeatherIcon condition="sunny" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold mt-1 pb-1">New York, US</div>
                                    <p className="text-sm text-muted-foreground mt-1">72°F - Sunny</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Graph Card */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Energy Usage Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Assistant */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assistant Actions and Tips</CardTitle>
                            <CardDescription>View tips and Cancel automations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-thumb]:rounded-md
                                [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700
                                [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:hover:bg-gray-600
                                [&::-webkit-scrollbar-track]:bg-transparent"
                            >
                                <ActionItem
                                    title="Adjust Thermostat Schedule"
                                    description="Optimize your heating and cooling schedule based on occupancy patterns"
                                    impact="Save up to $30/month"
                                />
                                <SearchItem
                                    title="Search Energy Usage Patterns"
                                    description="Analyze historical data to identify optimization opportunities"
                                    impact="Potential savings analysis"
                                />
                                <ActionItem
                                    title="LED Lighting Upgrade"
                                    description="Replace remaining traditional bulbs with LED alternatives"
                                    impact="Save up to $15/month"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
