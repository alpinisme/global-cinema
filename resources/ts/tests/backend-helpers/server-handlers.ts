import { rest } from 'msw';
import { User } from '../../types/api';
import { cities, screeningsGeoJSON, users, theaters, theatersToReview } from './mock-backend-data';

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

    rest.get('/instructors', async (req, res, ctx) => {
        return res(ctx.json(users));
    }),

    rest.get('/review/theaters', async (req, res, ctx) => {
        return res(ctx.json(theatersToReview));
    }),

    rest.post<User>('/register', async (req, res, ctx) => {
        const { role } = req.body;
        return res(ctx.json({ role }));
    }),

    rest.get('/user', async (req, res, ctx) => {
        return res(ctx.json(users[0]));
    }),

    rest.get('/completed/:city', async (req, res, ctx) => {
        return res(ctx.json([]));
    }),
];

export { handlers };
