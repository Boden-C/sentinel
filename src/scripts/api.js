'use strict';

import { validateUser } from './auth.js';

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
 * @returns {Promise<Response>} The response object.
 * @throws {Error} If there is an issue with the request.
 */
export async function request(url, options = {}, auth = false) {
    url = `${import.meta.env.VITE_API_URL}${url}`;
    options.headers = {
        ...options.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    options.credentials = 'same-origin';

    if (auth) {
        const idToken = await validateUser();
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${idToken}`,
        };
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    } else {
        return response;
    }

}

export function fetchEnergyData() {
    console.log('fetching energy data');
}

// needs to return this
// [
//     { hour: "00:00", energy: 10 },
//     { hour: "01:00", energy: 12 },
//     // ... up to 24 hours
//   ]


export async function getGeneratedData(buildingName) {
    try {
        const url = `/data/generate/${buildingName}`;
        const response = await request(url, { method: 'GET' }, true);
        let result = await response.json();
        if (result.length === 0) {
            return generateFallbackData(buildingName);
        }
    } catch (error) {
        console.warn('Falling back to local data generation:', error);
        return generateFallbackData(buildingName);
    }
}

function generateFallbackData(buildingName) {
    // Input validation
    if (typeof buildingName !== 'string') {
        throw new Error(`Building name must be a string, got ${typeof buildingName}`);
    }

    // Get current UTC time
    const utcTime = new Date();

    // Helper function to round to nearest hour
    function roundToNearestHour(date) {
        const roundedDate = new Date(date);
        if (roundedDate.getMinutes() >= 30) {
            roundedDate.setHours(roundedDate.getHours() + 1);
        }
        roundedDate.setMinutes(0);
        roundedDate.setSeconds(0);
        roundedDate.setMilliseconds(0);
        return roundedDate;
    }

    // Format time as HH:MM
    function formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    if (buildingName === "Dallas Office") {
        // Dallas is UTC-6 hours during Standard Time
        const dallasTime = new Date(utcTime.getTime()-3*60*60*1000);
        const roundedDallasTime = roundToNearestHour(dallasTime);
        const dallasTimeStr = formatTime(roundedDallasTime);

        return [
            {
                title: "Optimize Energy Usage",
                description: `Checked at ${dallasTimeStr} in Dallas on Sunday. This is typically outside of business hours, therefore HVAC is automatically lowered.`,
                impact: "Estimated 10% reduction in energy usage by reducing energy usage.",
            },
            {
                title: "Turn Off Sprinklers",
                description: "According to weather forecasts, Dallas is expected to have rain later today.",
                impact: "Save up to 100 gallons of water by turning off sprinklers.",
            }
        ];
    } else if (buildingName === "Dubai Office") {
        // Dubai is UTC+4 hours year-round
        const dubaiTime = new Date(utcTime.getTime()+9*60*60*1000);
        const roundedDubaiTime = roundToNearestHour(dubaiTime);
        const dubaiTimeStr = formatTime(roundedDubaiTime);

        return [
            {
                title: "Evening Settings",
                description: `The AI checked at ${dubaiTimeStr} in Dubai in the night, all energy usages are turned automatically off. The weather forecasts show no significant requirements.`,
                impact: "Save up to 20% of energy usage by turning off all appliances.",
            },

        ];
    } else {
        throw new Error(`Unknown building name: ${buildingName}`);
    }
}

export async function getGeneratedDataIndex(buildingName, i) {
    let list = await getGeneratedData(buildingName);
    return list[i];
}

export async function getBuildingData(buildingName) {
    try {
        const url = `/data/building/${buildingName}`;  // Assuming the base URL is handled in `request`
        const response = await request(url, { method: 'GET' }, true);  // 'true' for authentication
        
        // Parse and return the response data
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}