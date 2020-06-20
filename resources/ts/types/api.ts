/**
 * This file contains interfaces for the objects returned from our backend apis
 * The interfaces are non-exhaustive. That is, additional data may also be transmitted
 * But these interfaces represent a minimum as well as a necessary structure
 *
 * Backend api tests should be maintained so ensure that data is delivered in this format
 */

/**
 * get requests to `films/` api return an array of objects with interface `Film`
 */
export interface Film {
    id: number;
    title: string;
    year: number;
}

/**
 * get requests to `theaters/` api return an array of objects with interface `Film`
 */
export interface Theater {
    name: string;
    id: number;
    city_id: number;
}

/**
 * get requests to `screenings/` api return an array of objects with interface `Screening`
 */
export interface Screening {
    id?: number;
    theater_id: number;
    film_id: number;
    city_id: number;
    date: string;
}

/**
 * get requests to `instructor/` api return an array of objects with interface `Student`
 */
export interface Student {
    info: {
        email: string;
        name: string;
        id: number;
    };
    datesCompleted: string[];
}

/**
 * get requests to `users/` api return an array of objects with interface `User`
 */
export interface User {
    email: string;
    name: string;
    id: number;
    role: string;
}
