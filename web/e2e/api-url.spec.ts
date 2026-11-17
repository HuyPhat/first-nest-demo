import { expect, test } from '@playwright/test';
import { apiUrl } from '../lib/api-url';

test('uses API_URL when it is set', () => {
  expect(apiUrl({ API_URL: 'https://api.example.com', NODE_ENV: 'production' })).toBe(
    'https://api.example.com',
  );
});

test('falls back to the local API in development', () => {
  expect(apiUrl({ NODE_ENV: 'development' })).toBe('http://localhost:3000');
});

test('refuses to guess in production when API_URL is missing or empty', () => {
  expect(() => apiUrl({ NODE_ENV: 'production' })).toThrow('API_URL is required in production');
  expect(() => apiUrl({ API_URL: '', NODE_ENV: 'production' })).toThrow(
    'API_URL is required in production',
  );
});
