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
        //     const user = await users.login(JSON.parse(req.body))
        //     const isAuthorized = user.authorize(req.headers.Authorization)
        //     if (!isAuthorized) {
        //      return res(ctx.status(401), ctx.json({message: 'Not authorized'}))
        //     }
        //     const shoppingCart = JSON.parse(req.body)
        //    // do whatever other things you need to do with this shopping cart
        return res(ctx.json(screeningsGeoJSON));
    }),
];

export { handlers };
