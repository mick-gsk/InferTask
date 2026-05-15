// ESLint Flat Config (ESLint v9+)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Keine any-Typen ohne expliziten Kommentar
      '@typescript-eslint/no-explicit-any': 'error',
      // Unbenutzte Variablen als Fehler
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Konsistente Typen bevorzugen
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    },
    ignores: ['frontend/dist/**', 'node_modules/**'],
  }
);
