import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  // Test environment initialization
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5001';
  process.env.JWT_SECRET = 'test-secret-key-1234567890123456';
});

afterAll(async () => {
  // Clean up resources if needed
});
