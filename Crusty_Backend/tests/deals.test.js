const request = require('supertest');
const app = require('../app');
const { PizzaPlace, Deal, User } = require('../models');
const { generateToken } = require('../utils/jwt');

describe('Deals API', () => {
  let adminToken;
  let pizzaPlace;
  let deal;

  beforeAll(async () => {
    // Create test admin user
    const admin = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = generateToken(admin);

    // Create test pizza place
    pizzaPlace = await PizzaPlace.create({
      name: 'Test Pizza Place',
      address: '123 Test St',
      phone: '123-456-7890'
    });

    // Create test deal
    deal = await Deal.create({
      title: 'Test Deal',
      description: '50% off all pizzas',
      pizzaPlaceId: pizzaPlace.id,
      expirationDate: new Date(Date.now() + 86400000) // Tomorrow
    });
  });

  afterAll(async () => {
    await Deal.destroy({ where: {} });
    await PizzaPlace.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('GET /deals/active', () => {
    it('should return all active deals', async () => {
      const res = await request(app)
        .get('/deals/active')
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].title).toBe('Test Deal');
    });
  });

  describe('GET /deals/pizza-place/:pizzaPlaceId', () => {
    it('should return deals for a specific pizza place', async () => {
      const res = await request(app)
        .get(`/deals/pizza-place/${pizzaPlace.id}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body[0].pizzaPlaceId).toBe(pizzaPlace.id);
    });

    it('should return 404 for non-existent pizza place', async () => {
      await request(app)
        .get('/deals/pizza-place/999999')
        .expect(404);
    });
  });

  describe('POST /deals', () => {
    it('should create a new deal when authenticated as admin', async () => {
      const newDeal = {
        title: 'New Test Deal',
        description: 'Buy one get one free',
        pizzaPlaceId: pizzaPlace.id,
        expirationDate: new Date(Date.now() + 86400000)
      };

      const res = await request(app)
        .post('/deals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newDeal)
        .expect(201);

      expect(res.body.title).toBe(newDeal.title);
    });

    it('should return 401 when not authenticated', async () => {
      await request(app)
        .post('/deals')
        .send({})
        .expect(401);
    });
  });

  describe('PUT /deals/:dealId', () => {
    it('should update a deal when authenticated as admin', async () => {
      const updates = {
        title: 'Updated Test Deal'
      };

      const res = await request(app)
        .put(`/deals/${deal.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(res.body.title).toBe(updates.title);
    });

    it('should return 404 for non-existent deal', async () => {
      await request(app)
        .put('/deals/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(404);
    });
  });

  describe('DELETE /deals/:dealId', () => {
    it('should delete a deal when authenticated as admin', async () => {
      await request(app)
        .delete(`/deals/${deal.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deletedDeal = await Deal.findByPk(deal.id);
      expect(deletedDeal).toBeNull();
    });

    it('should return 404 for non-existent deal', async () => {
      await request(app)
        .delete('/deals/999999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
}); 