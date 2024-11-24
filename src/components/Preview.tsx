'use client'; 

/**
 * Suspense-Enabled Preview Component with Hydration Fix
 * 
 * This implementation solves common hydration mismatches that occur when rendering
 * time-based data in a server/client hybrid environment. It demonstrates proper
 * handling of:
 * 1. Server-side rendering (SSR)
 * 2. Client-side hydration
 * 3. Dynamic updates
 * 4. Suspense integration
 */

import React, { useState, Suspense, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

// Type definitions for better type safety and documentation
interface TimeState
{
    timestamp: string;
    isHydrated: boolean;
}

interface RenderMode
{
    mode: 'client' | 'server';
}

/**
 * Loading Placeholder Component
 * 
 * Used in three scenarios:
 * 1. During initial SSR
 * 2. During hydration
 * 3. As Suspense fallback
 * 
 * The structure matches the main component to prevent layout shift
 */
const LoadingDisplay = () => (
    <div className="p-6 rounded-lg border shadow-sm bg-gray-50 animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
            {/* Matching structure with real component for smooth transition */}
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
        </div>
        <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-6 w-48 bg-gray-300 rounded" />
        </div>
    </div>
);

/**
 * Time Display Component
 * 
 * Handles both server and client rendering while avoiding hydration mismatches.
 * Uses a staged approach to updating:
 * 1. Initial render: Empty state (prevents hydration mismatch)
 * 2. After hydration: Initial time set
 * 3. Client updates: Regular intervals if in client mode
 */
const TimeDisplay: React.FC<RenderMode> = ({ mode }) =>
{
    /**
     * State Management
     * 
     * timestamp: Intentionally starts empty to avoid hydration mismatch
     * isHydrated: Tracks whether component has been hydrated on client
     * 
     * This structure prevents the server/client timestamp mismatch
     * that causes hydration errors
     */
    const [timeData, setTimeData] = useState<TimeState>({
        timestamp: '', // Empty initial state is crucial for hydration matching
        isHydrated: false
    });

    /**
     * Hydration Effect
     * 
     * This effect runs once after initial client-side hydration.
     * It's separated from the update effect to ensure proper initialization.
     * 
     * Important: This must run before the update effect
     */
    useEffect(() =>
    {
        // Set initial time and mark as hydrated
        setTimeData({
            timestamp: new Date().toISOString(),
            isHydrated: true
        });
    }, []); // Empty deps array ensures single execution

    /**
     * Update Effect
     * 
     * Handles ongoing updates in client mode.
     * Only runs after hydration is complete to prevent timing issues.
     * 
     * Dependencies:
     * - mode: Determines if updates should occur
     * - timeData.isHydrated: Ensures hydration is complete
     */
    useEffect(() =>
    {
        // Only proceed if we're in client mode and hydration is complete
        if (mode === 'client' && timeData.isHydrated)
        {
            console.log('Setting up client-side time updates');

            const interval = setInterval(() =>
            {
                setTimeData(prev => ({
                    ...prev,
                    timestamp: new Date().toISOString()
                }));
            }, 1000);

            // Cleanup to prevent memory leaks
            return () =>
            {
                console.log('Cleaning up client-side updates');
                clearInterval(interval);
            };
        }
    }, [mode, timeData.isHydrated]);

    /**
     * Loading State
     * 
     * Show loading placeholder until we have a timestamp.
     * This creates a smooth transition from SSR to hydrated state.
     */
    if (!timeData.timestamp)
    {
        return <LoadingDisplay />;
    }

    /**
     * Main Render
     * 
     * Only rendered after hydration is complete and timestamp is available.
     * Visual indicators change based on mode and hydration state.
     */
    return (
        <div className="p-6 rounded-lg border shadow-sm bg-white">
            {/* Visual indicator of render mode */}
            <div className="flex items-center space-x-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${
                    // Different styling for client/server modes
                    mode === 'client' && timeData.isHydrated
                        ? 'bg-green-500 animate-pulse' // Active client indicator
                        : 'bg-blue-500'                // Static server indicator
                    }`} />
                <span className="font-medium">
                    {mode === 'client' ? 'Client Rendered' : 'Server Rendered'}
                </span>
            </div>

            {/* Time display */}
            <div className="space-y-2">
                <p className="text-sm text-gray-600">Timestamp:</p>
                <p className="font-mono text-lg">{timeData.timestamp}</p>
            </div>

            {/* Mode-specific message */}
            <div className="mt-4 text-sm text-gray-500">
                {mode === 'client'
                    ? "Live updating with Suspense"
                    : "Static server render with Suspense"}
            </div>

            {/* Debug information - only shown in development */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs text-gray-400">
                    Hydrated: {timeData.isHydrated ? 'Yes' : 'No'}
                </div>
            )}
        </div>
    );
};

/**
 * Main Preview Component
 * 
 * Orchestrates the demo and provides UI for switching modes.
 * Uses Suspense for loading states and transitions.
 */
const SuspensePreview = () =>
{
    // Track current render mode - this state only exists on client
    const [renderMode, setRenderMode] = useState<'client' | 'server'>('server');

    return (
        <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        Suspense-Enabled Rendering Demo
                    </h1>
                    <p className="text-gray-600">
                        Explore server and client rendering with Suspense
                    </p>
                </div>

                {/* Mode toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                        <p className="font-medium">
                            Render Mode: {renderMode === 'client' ? 'Client-side' : 'Server-side'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Toggle to switch between render modes
                        </p>
                    </div>
                    <Switch
                        checked={renderMode === 'client'}
                        onCheckedChange={(checked) =>
                            setRenderMode(checked ? 'client' : 'server')
                        }
                    />
                </div>

                {/* Main display with Suspense boundary */}
                <Suspense fallback={<LoadingDisplay />}>
                    <TimeDisplay mode={renderMode} />
                </Suspense>

                {/* Technical information tabs */}
                <Tabs defaultValue="implementation">
                    <TabsList>
                        <TabsTrigger value="implementation">Implementation</TabsTrigger>
                        <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    </TabsList>

                    <TabsContent value="implementation">
                        <div className="mt-4 space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-3">How It Works:</h3>
                                {renderMode === 'client' ? (
                                    // Client-side specific implementation details
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-green-700 mb-2">
                                                Client-Side Rendering Process
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                                                <li>
                                                    <strong>Initial Hydration:</strong> Component receives server HTML and
                                                    hydrates with empty initial state to prevent mismatch
                                                </li>
                                                <li>
                                                    <strong>First Effect:</strong> After hydration, component initializes with
                                                    current time and sets up interval timer
                                                </li>
                                                <li>
                                                    <strong>Live Updates:</strong> useEffect hook manages interval for
                                                    continuous time updates every second
                                                </li>
                                                <li>
                                                    <strong>Cleanup:</strong> Timer is automatically cleared when component
                                                    unmounts or mode changes
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-green-700 mb-2">
                                                Technical Implementation
                                            </h4>
                                            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                                                {`useEffect(() => {
  if (isHydrated) {
    const interval = setInterval(() => {
      setTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }
}, [isHydrated]);`}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-green-700 mb-2">
                                                Client-Side Features
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                                                <li>
                                                    <strong>DOM Updates:</strong> React efficiently updates only the
                                                    timestamp text without full re-renders
                                                </li>
                                                <li>
                                                    <strong>Event Handling:</strong> Manages browser timers and cleanup
                                                </li>
                                                <li>
                                                    <strong>State Management:</strong> Maintains time state in memory
                                                </li>
                                                <li>
                                                    <strong>Browser APIs:</strong> Access to full browser functionality
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    // Server-side specific implementation details
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-blue-700 mb-2">
                                                Server-Side Rendering Process
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                                                <li>
                                                    <strong>Initial Render:</strong> Component renders once on the server
                                                    with empty initial state
                                                </li>
                                                <li>
                                                    <strong>Static HTML:</strong> Server generates and sends complete HTML
                                                    structure
                                                </li>
                                                <li>
                                                    <strong>No JavaScript:</strong> Component remains static without
                                                    client-side updates
                                                </li>
                                                <li>
                                                    <strong>SEO Ready:</strong> Search engines receive fully rendered
                                                    content
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-blue-700 mb-2">
                                                Technical Implementation
                                            </h4>
                                            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                                                {`// Server-side render
const TimeDisplay = ({ mode }) => {
  // Initial empty state prevents hydration mismatch
  const [timeData, setTimeData] = useState({
    timestamp: '',
    isHydrated: false
  });
  
  return (
    <div className="...">
      {/* Static content structure */}
    </div>
  );
};`}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-blue-700 mb-2">
                                                Server-Side Features
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                                                <li>
                                                    <strong>Static Generation:</strong> HTML is pre-rendered at build time
                                                </li>
                                                <li>
                                                    <strong>No Hydration Issues:</strong> Empty initial state prevents
                                                    client/server mismatches
                                                </li>
                                                <li>
                                                    <strong>Performance:</strong> Minimal JavaScript overhead on client
                                                </li>
                                                <li>
                                                    <strong>Accessibility:</strong> Content available before JavaScript loads
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="mt-4 bg-blue-50 p-3 rounded">
                                            <h4 className="text-sm font-medium text-blue-700 mb-2">
                                                Server Rendering Benefits
                                            </h4>
                                            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                                                <li>Faster Time to First Byte (TTFB)</li>
                                                <li>Better Core Web Vitals scores</li>
                                                <li>Improved SEO performance</li>
                                                <li>Lower client-side resource usage</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="benefits">
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            {/* Server benefits */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium mb-3">Server Rendering</h3>
                                <ul className="list-disc pl-4 text-sm space-y-2 text-gray-700">
                                    <li>No hydration mismatches</li>
                                    <li>Better SEO performance</li>
                                    <li>Faster initial load</li>
                                    <li>Works without JavaScript</li>
                                </ul>
                            </div>
                            {/* Client benefits */}
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-medium mb-3">Client Rendering</h3>
                                <ul className="list-disc pl-4 text-sm space-y-2 text-gray-700">
                                    <li>Live updates</li>
                                    <li>Smooth transitions</li>
                                    <li>Interactive features</li>
                                    <li>Real-time data</li>
                                </ul>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SuspensePreview;