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
        
    });
}