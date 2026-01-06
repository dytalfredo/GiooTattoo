import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
    site: 'http://gio-estudio.netlify.app/',
    integrations: [react(), tailwind()],
    outDir: 'dist',
    server: {
        port: 3000,
        host: true
    },
    vite: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            }
        }
    }
});
