import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '**/*.config.*',
      '**/*rc.*',
      'next-env.d.ts',
      'test/__mocks__/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
    rules: {
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      '@next/next': next,
      prettier,
    },
    rules: {
      ...(tseslint.configs.recommendedTypeChecked?.[0]?.rules ?? {}),
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.browser, ...globals.node },
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
