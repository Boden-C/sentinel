'use strict';

export function getUserFriendlyErrorMessage(error) {
    // Define a hashmap for Firebase error codes and corresponding user-friendly messages
    const errorMap = {
        'auth/invalid-email': 'The email address is not recognized.',
        'auth/invalid-credential': 'The email or password is incorrect.',
        'auth/user-disabled': 'This user has been disabled. Please contact support.',
        'auth/user-not-found': 'No user found with this email. Please check and try again.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'This email is already in use. Please use a different email address.',
        'auth/weak-password': 'The password is too weak. Please choose a stronger password.',
        'auth/too-many-requests': 'Too many requests. Please try again later.',
        'auth/operation-not-allowed': 'This authentication method is not enabled. Please contact support.',
        'auth/expired-action-code': 'The link you used has expired. Please request a new one.',
        'auth/invalid-action-code': 'The link you used is invalid. Please request a new one.',
        'auth/requires-recent-login': 'This action requires you to reauthenticate. Please log in again.',
        'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
        'auth/unknown': 'An unknown error occurred. Please try again later.'
    };

    // Check if error has a 'code' property and is listed in the hashmap
    if (error && error.code) {
        return errorMap[error.code] || `${error.message || error.code}`;
    }

    // If the error does not match any Firebase error code, return a default message
    return `${error.message || error}`;
}
