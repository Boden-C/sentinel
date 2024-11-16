
# Frontend Function Documentation

## src/components/AuthContext.jsx

/**
 * @typedef {Object} AuthContextType
 * @property {import('firebase/auth').User | null} user - The current user
 * @property {boolean} loading - Whether the auth state is being determined
 * @property {Function} signin - Sign in function
 * @property {Function} signup - Sign up function
 * @property {Function} signout - Sign out function
 */
    /**

/**
 * Sign in with email/password or provider
 * @param {string|'google'|'github'} email - Email or provider name
 * @param {string} [password] - Password (not needed for provider signin)
 * @param {boolean} [remember=false] - Whether to persist auth state
 */
    const signin = async (email, password, remember = false) => {

/**
 * Sign up with email/password or provider
 * @param {string|'google'|'github'} email - Email or provider name
 * @param {string} [password] - Password (not needed for provider signup)
 * @param {string|null} [name=null] - Optional display name
 * @param {boolean} [remember=true] - Whether to persist auth state
 */
    const signup = async (email, password, name = null, remember = true) => {

/**
 * Hook for using auth context
 * @returns {AuthContextType} Auth context value
 */
    export function useAuth() {

## src/components/PrivateRoute.jsx

/**
 * Route wrapper to protect routes that require authentication
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route
 */
    export function PrivateRoute({ children }) {

## src/pages/SigninPage.jsx

/**
 * SignIn page component that handles Firebase authentication
 * @returns {JSX.Element} The SignIn page component
 */
    export default function SignIn() {

## src/pages/SignupPage.jsx

/**
 * SignUp component for user registration
 * @returns {JSX.Element} The SignUp form component
 */
    export default function SignUp() {

/**
 * Handles form submission for user registration
 * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
 */
    const handleSubmit = async (e) => {

## src/scripts/api.js

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
 * @returns {Promise<Response>} The response object.
 * @throws {Error} If there is an issue with the request.
 */
    export async function request(url, options = {}, auth = false) {

/**
 * Add a new reservation for the currently authenticated user
 * @param {string} spaceId - The ID of the space to reserve
 * @param {Date} start - Start time of the reservation
 * @param {Date} end - End time of the reservation
 * @returns {Promise<string>} - The reservation ID if successful
 * @throws {Error} - If the request fails
 */
    export async function addReservation(spaceId, start, end) {

/**
 * Deletes a reservation
 * @param {number} id - The parking ID
 * @param {string} time_block - The start specific time block for the reservation
 */
    export function deleteReservation(id, time_block) {

## src/scripts/auth.js

/**
 * Signs up a new user with the given email and password.
 * @param {string} email - The email for the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
 * @throws {Error} If there is an error during sign-up.
 */
    export async function signup(email, password) {

/**
 * Signs in a user with the given email and password.
 * @param {string} email The email of the user.
 * @param {string} password The password of the user.
 * @returns {Promise<string>} The Firebase ID token.
 * @throws {Error} If an error occurs while signing in.
 */
    export async function signin(email, password) {

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while signing out.
 */
    export async function signout() {

/**
 * Authenticates the user and returns the Firebase ID token.
 * @returns {Promise<string>} The Firebase ID token.
 * @throws {Error} If invalid
 */
    export async function validateUser() {


# Frontend Function Documentation

## src/components/AuthContext.jsx

/**
 * @typedef {Object} AuthContextType
 * @property {import('firebase/auth').User | null} user - The current user
 * @property {boolean} loading - Whether the auth state is being determined
 * @property {Function} signin - Sign in function
 * @property {Function} signup - Sign up function
 * @property {Function} signout - Sign out function
 */
    /**

/**
 * Sign in with email/password or provider
 * @param {string|'google'|'github'} email - Email or provider name
 * @param {string} [password] - Password (not needed for provider signin)
 * @param {boolean} [remember=false] - Whether to persist auth state
 */
    const signin = async (email, password, remember = false) => {

/**
 * Sign up with email/password or provider
 * @param {string|'google'|'github'} email - Email or provider name
 * @param {string} [password] - Password (not needed for provider signup)
 * @param {string|null} [name=null] - Optional display name
 * @param {boolean} [remember=true] - Whether to persist auth state
 */
    const signup = async (email, password, name = null, remember = true) => {

/**
 * Hook for using auth context
 * @returns {AuthContextType} Auth context value
 */
    export function useAuth() {

## src/components/PrivateRoute.jsx

/**
 * Route wrapper to protect routes that require authentication
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route
 */
    export function PrivateRoute({ children }) {

## src/pages/SigninPage.jsx

/**
 * SignIn page component that handles Firebase authentication
 * @returns {JSX.Element} The SignIn page component
 */
    export default function SignIn() {

## src/pages/SignupPage.jsx

/**
 * SignUp component for user registration
 * @returns {JSX.Element} The SignUp form component
 */
    export default function SignUp() {

/**
 * Handles form submission for user registration
 * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
 */
    const handleSubmit = async (e) => {

## src/scripts/api.js

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
 * @returns {Promise<Response>} The response object.
 * @throws {Error} If there is an issue with the request.
 */
    export async function request(url, options = {}, auth = false) {

/**
 * Add a new reservation for the currently authenticated user
 * @param {string} spaceId - The ID of the space to reserve
 * @param {Date} start - Start time of the reservation
 * @param {Date} end - End time of the reservation
 * @returns {Promise<string>} - The reservation ID if successful
 * @throws {Error} - If the request fails
 */
    export async function addReservation(spaceId, start, end) {

/**
 * Deletes a reservation
 * @param {number} id - The parking ID
 * @param {string} time_block - The start specific time block for the reservation
 */
    export function deleteReservation(id, time_block) {

## src/scripts/auth.js

/**
 * Signs up a new user with the given email and password.
 * @param {string} email - The email for the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
 * @throws {Error} If there is an error during sign-up.
 */
    export async function signup(email, password) {

/**
 * Signs in a user with the given email and password.
 * @param {string} email The email of the user.
 * @param {string} password The password of the user.
 * @returns {Promise<string>} The Firebase ID token.
 * @throws {Error} If an error occurs while signing in.
 */
    export async function signin(email, password) {

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while signing out.
 */
    export async function signout() {

/**
 * Authenticates the user and returns the Firebase ID token.
 * @returns {Promise<string>} The Firebase ID token.
 * @throws {Error} If invalid
 */
    export async function validateUser() {


# Frontend Function Documentation

## src/components/AuthContext.jsx

/**
 * @typedef {Object} AuthContextType
 * @property {import('firebase/auth').User | null} user - The current user
 * @property {boolean} loading - Whether the auth state is being determined
 * @property {Function} signin - Sign in function
 * @property {Function} signup - Sign up function
 * @property {Function} signout - Sign out function
 */
    /**

/**
 * Sign in with email/password or provider
 * @param {string|'google'|'github'} email - Email or provider name
 * @param {string} [password] - Password (not needed for provider signin)
 * @param {boolean} [remember=false] - Whether to persist auth state
 */
    const signin = async (email, password, remember = false) => {

/**
 * Sign up with email/password or provider
 * @param {string|'google'|'github'} email - Email or provider name
 * @param {string} [password] - Password (not needed for provider signup)
 * @param {string|null} [name=null] - Optional display name
 * @param {boolean} [remember=true] - Whether to persist auth state
 */
    const signup = async (email, password, name = null, remember = true) => {

/**
 * Hook for using auth context
 * @returns {AuthContextType} Auth context value
 */
    export function useAuth() {

## src/components/PrivateRoute.jsx

/**
 * Route wrapper to protect routes that require authentication
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route
 */
    export function PrivateRoute({ children }) {

## src/pages/SigninPage.jsx

/**
 * SignIn page component that handles Firebase authentication
 * @returns {JSX.Element} The SignIn page component
 */
    export default function SignIn() {

## src/pages/SignupPage.jsx

/**
 * SignUp component for user registration
 * @returns {JSX.Element} The SignUp form component
 */
    export default function SignUp() {

/**
 * Handles form submission for user registration
 * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
 */
    const handleSubmit = async (e) => {

## src/scripts/api.js

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
 * @returns {Promise<Response>} The response object.
 * @throws {Error} If there is an issue with the request.
 */
    export async function request(url, options = {}, auth = false) {

/**
 * Add a new reservation for the currently authenticated user
 * @param {string} spaceId - The ID of the space to reserve
 * @param {Date} start - Start time of the reservation
 * @param {Date} end - End time of the reservation
 * @returns {Promise<string>} - The reservation ID if successful
 * @throws {Error} - If the request fails
 */
    export async function addReservation(spaceId, start, end) {

/**
 * Deletes a reservation
 * @param {number} id - The parking ID
 * @param {string} time_block - The start specific time block for the reservation
 */
    export function deleteReservation(id, time_block) {

## src/scripts/auth.js

/**
 * Signs up a new user with the given email and password.
 * @param {string} email - The email for the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
 * @throws {Error} If there is an error during sign-up.
 */
    export async function signup(email, password) {

/**
 * Signs in a user with the given email and password.
 * @param {string} email The email of the user.
 * @param {string} password The password of the user.
 * @returns {Promise<string>} The Firebase ID token.
 * @throws {Error} If an error occurs while signing in.
 */
    export async function signin(email, password) {

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while signing out.
 */
    export async function signout() {

/**
 * Authenticates the user and returns the Firebase ID token.
 * @returns {Promise<string>} The Firebase ID token.
 * @throws {Error} If invalid
 */
    export async function validateUser() {

