'use strict';

import { GeneratedData } from './types.js';

export function fetchEnergyData() {
    console.log('fetching energy data');
}

// needs to return this
// [
//     { hour: "00:00", energy: 10 },
//     { hour: "01:00", energy: 12 },
//     // ... up to 24 hours
//   ]


/**
 * Fetches the generated data from the server.
 * @returns {Promise<GeneratedData>} The generated data object.
 */
export function getGeneratedData() {
    return new GeneratedData({
        estimatedCarbonEmmissions: 'low',
        estimatedEnergyUse: 100,
        estimatedEnergyUsage: 'low',
        actions: [
            {
                title: 'Turn off lights',
                description: 'Turn off lights when not in use.',
                impact: 'Save energy by using natural light.',
                request: 'POST /api/actions/turn-off-lights',
            },
            {
                title: 'Unplug devices',
                description: 'Unplug devices when not in use.',
                impact: 'Reduce standby power consumption.',
                request: 'POST /api/actions/unplug-devices',
            },
        ],
        tips: [
            {
                title: 'Use energy-efficient bulbs',
                description: 'Replace incandescent bulbs with LEDs.',
                impact: 'Save energy and reduce emissions.',
                request: 'GET /api/tips/energy-efficient-bulbs',
            },
            {
                title: 'Adjust thermostat',
                description: 'Set thermostat to 68°F in winter and 78°F in summer.',
                impact: 'Optimize heating and cooling efficiency.',
                request: 'GET /api/tips/adjust-thermostat',
            },
        ],
    });
}