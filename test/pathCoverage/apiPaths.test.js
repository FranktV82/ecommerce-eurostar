const { expect } = require('chai');
const request = require('supertest');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

describe('API Path Coverage', () => {
  describe('GET /healthcheck', () => {
    it('returns server health status', async () => {
      const response = await request(BASE_URL)
        .get('/healthcheck')
        .expect(200);

      expect(response.body).to.have.property('status', 'ok');
      expect(response.body).to.have.property('timestamp');
      expect(new Date(response.body.timestamp).toString()).not.to.equal('Invalid Date');
    });
  });

  describe('POST /register', () => {
    it('creates a new user account', async () => {
      const response = await request(BASE_URL)
        .post('/register')
        .send({
          email: 'newuser@example.com',
          password: 'mypassword',
          name: 'New User',
        })
        .expect(201);

      expect(response.body.user).to.include({
        email: 'newuser@example.com',
        name: 'New User',
      });
      expect(response.body.user).to.have.property('id');
      expect(response.body).to.have.property('token').that.is.a('string');
    });
  });

  describe('POST /login', () => {
    it('authenticates an existing user', async () => {
      const response = await request(BASE_URL)
        .post('/login')
        .send({
          email: 'alice@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.user).to.deep.equal({
        id: 1,
        email: 'alice@example.com',
        name: 'Alice Johnson',
      });
      expect(response.body).to.have.property('token').that.is.a('string');
    });
  });

  describe('POST /checkout', () => {
    it('completes a cash checkout with discount', async () => {
      const loginResponse = await request(BASE_URL)
        .post('/login')
        .send({
          email: 'alice@example.com',
          password: 'password123',
        })
        .expect(200);

      const response = await request(BASE_URL)
        .post('/checkout')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send({
          productIds: [1, 3],
          paymentMethod: 'cash',
        })
        .expect(200);

      expect(response.body.paymentMethod).to.equal('cash');
      expect(response.body.subtotal).to.equal(114);
      expect(response.body.discount).to.equal(11.4);
      expect(response.body.total).to.equal(102.6);
      expect(response.body.items).to.have.lengthOf(2);
      expect(response.body.items[0]).to.include({
        id: 1,
        name: 'Eurostar Standard Ticket',
        price: 89,
      });
      expect(response.body.items[1]).to.include({
        id: 3,
        name: 'Travel Insurance',
        price: 25,
      });
    });
  });
});
