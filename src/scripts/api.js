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

window.addReservation = addReservation; // TODO remove
/**
 * Add a new reservation for the currently authenticated user
 * @param {string} spaceId - The ID of the space to reserve
 * @param {Date} start - Start time of the reservation
 * @param {Date} end - End time of the reservation
 * @returns {Promise<string>} - The reservation ID if successful
 * @throws {Error} - If the request fails
 */
export async function addReservation(spaceId, start, end) {
    // Convert dates to ISO strings
    const startTimestamp = start.toISOString();
    const endTimestamp = end.toISOString();

    const response = await request('/reservations/add', {
        method: 'POST',
        body: JSON.stringify({
            space_id: spaceId,
            start_timestamp: startTimestamp,
            end_timestamp: endTimestamp
        }),
    }, true);

    // Handle non-200 responses
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    // Parse successful response
    const data = await response.json();
    return data.id;  // Return the reservation ID
}

/**
 * Deletes a reservation
 * @param {number} id - The parking ID
 * @param {string} time_block - The start specific time block for the reservation
 */
export function deleteReservation(id, time_block) {
    const data = {
        charger_id: id,
        time_block: time_block,
    };

    return request(
        '/reservations/delete',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
        true
    ); // `true` if authentication is required
}
