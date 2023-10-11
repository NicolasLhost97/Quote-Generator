import request from 'supertest';
import server from '../server';

describe("API Routes", () => {

    const API_KEY = 'azerty123'

    afterAll(done => {
        server.close(done);
    });

    // Authentication test
    test("require authorization", () => {
        return request(server)
            .get("/api/quote")
            .then(response => {
                expect(response.statusCode).toBe(401);
            });
    });

    // Quote retrieval test with valid authentication
    test("fetch quote with valid authentication", () => {
        return request(server)
            .get("/api/quote")
            .set('Authorization', `Bearer ${API_KEY}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty("content");
                expect(response.body).toHaveProperty("author");
            });
    });

    // Test for non-existing roads
    test("return 404 for non-existent routes", () => {
        return request(server)
            .get("/api/no-route")
            .set('Authorization', `Bearer ${API_KEY}`)
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });

});

