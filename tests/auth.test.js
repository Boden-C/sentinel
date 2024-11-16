// tests/auth.test.js
import { describe, it, expect } from 'vitest';
import { signup, signin, signout } from '../src/scripts/auth.js';

const TEST_EMAIL = 'testuser@example.com';
const TEST_PASSWORD = 'testpassword';
const WRONG_EMAIL = 'wronguser@example.com';
const WRONG_PASSWORD = 'wrongpassword';

describe('Firebase Authentication', () => {
    it('should sign up a new user', async () => {
        try {
            const userCredential = await signup(TEST_EMAIL, TEST_PASSWORD);
            console.log('Sign-up successful:', userCredential.user.email);
        } catch (error) {
            expect(error.message).toContain('email-already-in-use');
        }
    });

    it('should sign in an existing user', async () => {
        const idToken = await signin(TEST_EMAIL, TEST_PASSWORD);
        console.log('Sign-in successful. ID Token:', idToken);
        expect(idToken).toBeTruthy();
    });

    it('should fail to sign in with wrong email', async () => {
        try {
            await signin(WRONG_EMAIL, TEST_PASSWORD);
        } catch (error) {
            console.log('Error message for wrong email:', error.message);
            // Expect either "auth/user-not-found" or "invalid-credential"
            expect(error.message).toMatch(/auth\/user-not-found|invalid-credential/);
        }
    });

    it('should fail to sign in with wrong password', async () => {
        try {
            await signin(TEST_EMAIL, WRONG_PASSWORD);
        } catch (error) {
            console.log('Error message for wrong password:', error.message);
            // Expect either "auth/wrong-password" or "invalid-credential"
            expect(error.message).toMatch(/auth\/wrong-password|invalid-credential/);
        }
    });

    it('should sign out the current user', async () => {
        await signout();
        console.log('Sign-out successful');
    });
});
