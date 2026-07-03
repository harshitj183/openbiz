import request from 'supertest';
import app from '@/index';

describe('Health endpoint', () => {
  it('should return status ok and environment information', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
    });
    expect(typeof response.body.environment).toBe('string');
    expect(response.body.timestamp).toBeDefined();
  });
});
