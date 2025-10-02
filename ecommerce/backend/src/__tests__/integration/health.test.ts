import request from 'supertest';
import app from '../../index';

describe('Health Check Integration Tests', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'OK',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
      });
    });

    it('should not be rate limited', async () => {
      // Make multiple requests to ensure health check is not rate limited
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/health')
          .expect(200);
      }
    });
  });
});
