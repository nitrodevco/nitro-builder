// vite.config.js
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import VitePluginHtmlEnv from 'vite-plugin-html-env';

export default defineConfig({
    plugins: [ VitePluginHtmlEnv(), react() ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '~': resolve(__dirname, 'node_modules')
        }
    },
    build: {
        assetsInlineLimit: 102400,
        rollupOptions: {
            output: {
                assetFileNames: 'src/assets/[name].[ext]',
                manualChunks: id => 
                {
                    if (id.includes('node_modules')) 
                    {
                        if (id.includes('@nitrots/nitro-renderer')) return 'nitro-renderer';

                        return 'vendor';
                    }
                }
            }
        }
    }
})
