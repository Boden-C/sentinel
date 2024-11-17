import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Overview } from '@/components/overview';
import { BuildingSwitcher } from '@/components/building-switcher';
import { UserNav } from '@/components/user-nav';

const RecommendationItem = ({ title, description, impact }) => (
    <div className="mb-4 p-4 border rounded-lg">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm font-medium mt-2">Potential Impact: {impact}</p>
        <Button className="mt-2" variant="outline">
            Apply
        </Button>
    </div>
);

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
                                    <CardTitle className="text-sm font-medium">Estimated Savings</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$1,234.56</div>
                                    <p className="text-xs text-muted-foreground">Projected annual savings</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">-245 kg</div>
                                    <p className="text-xs text-muted-foreground">CO₂ reduction potential</p>
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

                    {/* Right Side - Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommendations</CardTitle>
                            <CardDescription>Suggested actions to improve energy efficiency</CardDescription>
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
                                <RecommendationItem
                                    title="Adjust Thermostat Schedule"
                                    description="Optimize your heating and cooling schedule based on occupancy patterns"
                                    impact="Save up to $30/month"
                                />
                                <RecommendationItem
                                    title="LED Lighting Upgrade"
                                    description="Replace remaining traditional bulbs with LED alternatives"
                                    impact="Save up to $15/month"
                                />
                                <RecommendationItem
                                    title="Smart Power Strip Installation"
                                    description="Reduce phantom power consumption from devices"
                                    impact="Save up to $10/month"
                                />
                                {/* Add more recommendations as needed */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
