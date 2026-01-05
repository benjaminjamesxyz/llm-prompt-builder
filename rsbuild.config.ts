import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';

export default defineConfig({
  plugins: [pluginPreact()],

  source: {
    entry: {
      index: './src/main.tsx',
    },
  },

  html: {
    template: './index.html',
  },

  output: {
    distPath: {
      root: 'dist',
    },
    minify: true,
    cssModules: {
      localIdentName: '[local]__[hash:base64:5]',
    },
  },

  server: {
    port: 3000,
  },

  tools: {
    rspack: (config) => {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'async',
          cacheGroups: {
            'prism-core': {
              test: /[\\/]node_modules[\\/]prismjs[\\/]/,
              name: 'prism-core',
              priority: 10,
              reuseExistingChunk: true,
            },
            'common': {
              name: 'common',
              chunks: 'async',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
      return config;
    },
  },
});
