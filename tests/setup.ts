process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./prisma/test.db';

import { beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom/vitest';
import prisma from '../server/configs/database.config.js';

beforeAll(async () => {
  await prisma.operation.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.operation.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});
