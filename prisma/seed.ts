import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const operations = ['add', 'subtract', 'multiply', 'divide'] as const;

const calculateResult = (parentValue: number, operation: string, operand: number): number => {
  switch (operation) {
    case 'add':
      return parentValue + operand;
    case 'subtract':
      return parentValue - operand;
    case 'multiply':
      return parentValue * operand;
    case 'divide':
      if (operand === 0) return parentValue;
      return parentValue / operand;
    default:
      return parentValue;
  }
};

async function createReplyChain(
  parentPostId: string,
  parentValue: number,
  userId: string,
  depth: number,
  maxDepth: number
) {
  if (depth >= maxDepth) return;

  const shouldCreateReply = Math.random() > 0.3;
  if (!shouldCreateReply) return;

  const numReplies = faker.number.int({ min: 1, max: 3 });

  for (let i = 0; i < numReplies; i++) {
    const operation = faker.helpers.arrayElement(operations);
    let operand = faker.number.float({ min: 1, max: 100, fractionDigits: 2 });

    if (operation === 'divide' && operand === 0) {
      operand = faker.number.float({ min: 1, max: 100, fractionDigits: 2 });
    }

    const calculatedValue = calculateResult(parentValue, operation, operand);

    const reply = await prisma.post.create({
      data: {
        value: calculatedValue,
        userId,
        parentId: parentPostId,
        operation: {
          create: {
            type: operation,
            operand,
          },
        },
      },
    });

    await createReplyChain(reply.id, calculatedValue, userId, depth + 1, maxDepth);
  }
}

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('🧹 Cleaning database...');
  await prisma.operation.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleaned');

  console.log('📝 Creating users...');
  const numUsers = 20;
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const username = faker.internet.username().toLowerCase().slice(0, 20);
    const hashedPassword = await bcrypt.hash('password123', 10);

    try {
      const user = await prisma.user.create({
        data: {
          username: `${username}_${i}`,
          password: hashedPassword,
        },
      });

      users.push(user);
    } catch (error) {
      console.error(`Failed to create user ${i}:`, error);
    }
  }

  console.log(`✅ Created ${users.length} users`);

  if (users.length === 0) {
    console.error('❌ No users created, cannot proceed with seeding posts');
    return;
  }

  console.log('📊 Creating posts with reply chains...');
  const numRootPosts = 50;

  for (let i = 0; i < numRootPosts; i++) {
    const user = faker.helpers.arrayElement(users);
    const value = faker.number.float({ min: 1, max: 1000, fractionDigits: 2 });

    try {
      const post = await prisma.post.create({
        data: {
          value,
          userId: user.id,
        },
      });

      const maxDepth = faker.number.int({ min: 2, max: 5 });
      const replyUser = faker.helpers.arrayElement(users);
      
      await createReplyChain(post.id, value, replyUser.id, 0, maxDepth);

      if ((i + 1) % 10 === 0) {
        console.log(`  Created ${i + 1}/${numRootPosts} root posts with replies`);
      }
    } catch (error) {
      console.error(`Failed to create post ${i}:`, error);
    }
  }

  const totalPosts = await prisma.post.count();
  const totalOperations = await prisma.operation.count();

  console.log('✅ Seed completed!');
  console.log(`📊 Summary:`);
  console.log(`   - ${users.length} users created`);
  console.log(`   - ${totalPosts} total posts created`);
  console.log(`   - ${totalOperations} operations created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
