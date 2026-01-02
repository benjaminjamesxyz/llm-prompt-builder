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
          chunks: 'all',
          cacheGroups: {
            'prism-core': {
              test: /[\\/]node_modules[\\/]prismjs[\\/]/,
              name: 'prism-core',
              priority: 10,
            },
            'yaml': {
              test: /[\\/]node_modules[\\/]js-yaml[\\/]/,
              name: 'yaml',
              priority: 10,
            },
          },
        },
      };
      return config;
    },
  },
});
