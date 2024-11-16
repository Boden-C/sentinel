import { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import '../styles/example.css';

function LandingPage() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="flex flex-row justify-center h-44">
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo h-40" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react h-40" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>Edit and save to test HMR</p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default LandingPage;
