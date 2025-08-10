import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({  }) => {
    return {
      base: '/sequencer/',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
