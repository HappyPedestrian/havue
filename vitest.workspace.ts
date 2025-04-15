import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // If you want to keep running your existing tests in Node.js, uncomment the next line.
  // 'vitest.config.ts',
  // {
  //   extends: 'vitest.config.ts',
  //   test: {
  //     browser: {
  //       enabled: true,
  //       provider: 'playwright',
  //       // https://vitest.dev/guide/browser/playwright
  //       instances: []
  //     }
  //   }
  // },
  {
    extends: 'vitest.config.ts',
    test: {
      clearMocks: true,
      globals: true,
      include: ['packages/**/*.{test,spec}.ts', 'packages/**/*.{test,spec}.tsx'],
      name: 'browser',
      environment: 'jsdom',
      setupFiles: ['vitest-browser-vue'],
      testTransformMode: {
        web: ['*.{ts,tsx}']
      },
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }]
      }
      // ...
    }
  }
  // {
  //   extends: 'vitest.config.ts',
  //   test: {
  //     include: ['packages/**/*.{test,spec}.ts', 'packages/**/*.{test,spec}.tsx'],
  //     exclude: ['packages/components/**/*.{test,spec}.ts', 'packages/components/**/*.{test,spec}.tsx'],
  //     name: 'unit',
  //     environment: 'node'
  //   }
  // }
])
