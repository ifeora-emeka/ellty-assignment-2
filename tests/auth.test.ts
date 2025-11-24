import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

let authUserCounter = 0;

describe('Auth API', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: `testuser${++authUserCounter}`,
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject signup with short username', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'ab',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should reject signup with short password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: `testuser${++authUserCounter}`,
          password: '12345',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should reject signup with duplicate username', async () => {
      const username = `testuser${++authUserCounter}`;
      await request(app)
        .post('/api/auth/signup')
        .send({
          username,
          password: 'password123',
        });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username,
          password: 'password456',
        })
        .expect(400);

      expect(response.body.error).toBe('Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    let loginUsername: string;
    
    beforeEach(async () => {
      loginUsername = `testuser${++authUserCounter}`;
      await request(app)
        .post('/api/auth/signup')
        .send({
          username: loginUsername,
          password: 'password123',
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: loginUsername,
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(loginUsername);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: loginUsername,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user info when authenticated', async () => {
      const agent = request.agent(app);
      const username = `testuser${++authUserCounter}`;

      await agent
        .post('/api/auth/signup')
        .send({
          username,
          password: 'password123',
        });

      await agent
        .post('/api/auth/login')
        .send({
          username,
          password: 'password123',
        });

      const response = await agent.get('/api/auth/me').expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(username);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject when not authenticated', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout authenticated user', async () => {
      const agent = request.agent(app);
      const username = `testuser${++authUserCounter}`;

      await agent
        .post('/api/auth/signup')
        .send({
          username,
          password: 'password123',
        });

      await agent
        .post('/api/auth/login')
        .send({
          username,
          password: 'password123',
        });

      const response = await agent.post('/api/auth/logout').expect(200);

      expect(response.body.message).toBe('Logged out successfully');

      await agent.get('/api/auth/me').expect(401);
    });

    it('should reject logout when not authenticated', async () => {
      const response = await request(app).post('/api/auth/logout').expect(401);

      expect(response.body.error).toBe('Unauthorized');
    });
  });
});
