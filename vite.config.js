import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'node', // or jsdom
        setupFiles: './src/tests/setup.js',
    },
    server: {
        proxy: {
            '/api': {
                target: 'localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
