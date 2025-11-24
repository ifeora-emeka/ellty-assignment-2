import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';
import prisma from '../server/configs/database.config.js';

describe('Posts API', () => {
  let authAgent: ReturnType<typeof request.agent>;
  let userId: string;
  const uniqueId = Math.random().toString(36).substring(7);
  let testCounter = 0;

  beforeEach(async () => {
    await prisma.operation.deleteMany();
    await prisma.post.deleteMany();
    
    authAgent = request.agent(app);
    const testUsername = `postuser${uniqueId}${++testCounter}`;
    const testPassword = 'password123';

    const signupResponse = await authAgent
      .post('/api/auth/signup')
      .send({
        username: testUsername,
        password: testPassword,
      })
      .expect(201);

    userId = signupResponse.body.user.id;

    await authAgent
      .post('/api/auth/login')
      .send({
        username: testUsername,
        password: testPassword,
      })
      .expect(200);
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid value', async () => {
      const response = await authAgent
        .post('/api/posts')
        .send({ value: 42 })
        .expect(201);

      expect(response.body).toHaveProperty('post');
      expect(response.body.post.value).toBe(42);
      expect(response.body.post.userId).toBe(userId);
    });

    it('should reject post creation when not authenticated', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ value: 42 })
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    it('should reject post with invalid value', async () => {
      const response = await authAgent
        .post('/api/posts')
        .send({ value: 'not a number' })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should accept negative numbers', async () => {
      const response = await authAgent
        .post('/api/posts')
        .send({ value: -15.5 })
        .expect(201);

      expect(response.body.post.value).toBe(-15.5);
    });
  });

  describe('GET /api/posts', () => {
    it('should return all root posts', async () => {
      await authAgent.post('/api/posts').send({ value: 10 });
      await authAgent.post('/api/posts').send({ value: 20 });
      await authAgent.post('/api/posts').send({ value: 30 });

      const response = await request(app).get('/api/posts').expect(200);

      expect(response.body.posts.length).toBeGreaterThanOrEqual(3);
      const values = response.body.posts.map((p: { value: number }) => p.value);
      expect(values).toContain(30);
      expect(values).toContain(20);
      expect(values).toContain(10);
    });

    it('should not require authentication', async () => {
      await authAgent.post('/api/posts').send({ value: 42 });

      const response = await request(app).get('/api/posts').expect(200);

      expect(response.body.posts.length).toBeGreaterThanOrEqual(1);
      const values = response.body.posts.map((p: { value: number }) => p.value);
      expect(values).toContain(42);
    });

    it('should not include replies in root posts list', async () => {
      const postResponse = await authAgent.post('/api/posts').send({ value: 10 });
      const postId = postResponse.body.post.id;

      await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'add', operand: 5 });

      const response = await request(app).get('/api/posts').expect(200);

      const post = response.body.posts.find((p: { id: string }) => p.id === postId);
      expect(post).toBeDefined();
      expect(post.id).toBe(postId);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return post with replies', async () => {
      const postResponse = await authAgent.post('/api/posts').send({ value: 10 });
      const postId = postResponse.body.post.id;

      await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'add', operand: 5 });

      const response = await request(app).get(`/api/posts/${postId}`).expect(200);

      expect(response.body.post.value).toBe(10);
      expect(response.body.post.replies).toHaveLength(1);
      expect(response.body.post.replies[0].value).toBe(15);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/posts/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Post not found');
    });

    it('should not require authentication', async () => {
      const postResponse = await authAgent.post('/api/posts').send({ value: 42 });
      const postId = postResponse.body.post.id;

      const response = await request(app).get(`/api/posts/${postId}`).expect(200);

      expect(response.body.post.value).toBe(42);
    });
  });

  describe('POST /api/posts/:id/reply', () => {
    let postId: string;

    beforeEach(async () => {
      const response = await authAgent.post('/api/posts').send({ value: 10 });
      postId = response.body.post.id;
    });

    it('should add reply with addition operation', async () => {
      const response = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'add', operand: 5 })
        .expect(201);

      expect(response.body.post.value).toBe(15);
      expect(response.body.post.operation.type).toBe('add');
      expect(response.body.post.operation.operand).toBe(5);
      expect(response.body.post.parentId).toBe(postId);
    });

    it('should add reply with subtraction operation', async () => {
      const response = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'subtract', operand: 3 })
        .expect(201);

      expect(response.body.post.value).toBe(7);
      expect(response.body.post.operation.type).toBe('subtract');
    });

    it('should add reply with multiplication operation', async () => {
      const response = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'multiply', operand: 4 })
        .expect(201);

      expect(response.body.post.value).toBe(40);
      expect(response.body.post.operation.type).toBe('multiply');
    });

    it('should add reply with division operation', async () => {
      const response = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'divide', operand: 2 })
        .expect(201);

      expect(response.body.post.value).toBe(5);
      expect(response.body.post.operation.type).toBe('divide');
    });

    it('should reject division by zero', async () => {
      const response = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'divide', operand: 0 })
        .expect(400);

      expect(response.body.error).toBe('Division by zero is not allowed');
    });

    it('should reject invalid operation', async () => {
      const response = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'power', operand: 2 })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should reject when not authenticated', async () => {
      const response = await request(app)
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'add', operand: 5 })
        .expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });

    it('should reject reply to non-existent post', async () => {
      const response = await authAgent
        .post('/api/posts/non-existent-id/reply')
        .send({ operation: 'add', operand: 5 })
        .expect(404);

      expect(response.body.error).toBe('Parent post not found');
    });

    it('should allow nested replies', async () => {
      const firstReply = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'add', operand: 5 });

      const firstReplyId = firstReply.body.post.id;

      const secondReply = await authAgent
        .post(`/api/posts/${firstReplyId}/reply`)
        .send({ operation: 'multiply', operand: 2 })
        .expect(201);

      expect(secondReply.body.post.value).toBe(30);
      expect(secondReply.body.post.parentId).toBe(firstReplyId);
    });

    it('should handle decimal operations correctly', async () => {
      const response = await authAgent
        .post(`/api/posts/${postId}/reply`)
        .send({ operation: 'divide', operand: 3 })
        .expect(201);

      expect(response.body.post.value).toBeCloseTo(3.333333, 5);
    });
  });
});
