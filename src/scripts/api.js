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
        const url = `/data/generate/${buildingName}`;  // Assuming the base URL is handled in `request`
        const response = await request(url, { method: 'GET' }, true);  // 'true' for authentication
        
        // Parse and return the response data
        return await response.json();
    } catch (error) {
        console.error('Error fetching generated data:', error);
        throw error;
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