import { rest } from 'msw';
import { cities, screeningsGeoJSON, users, theaters } from './mock-backend-data';

const handlers = [
    rest.get('/cities', async (req, res, ctx) => {
        return res(ctx.json(cities));
    }),

    rest.get('/users', async (req, res, ctx) => {
        return res(ctx.json(users));
    }),

    rest.get('/theaters', async (req, res, ctx) => {
        return res(ctx.json(theaters));
    }),

    rest.get('/screenings/1950-09-01', async (req, res, ctx) => {
        return res(ctx.json(screeningsGeoJSON));
    }),
];

export { handlers };
