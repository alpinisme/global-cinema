/**
 * This file contains interfaces for the objects returned from our backend apis
 * The interfaces are non-exhaustive. That is, additional data may also be transmitted
 * But these interfaces represent a minimum as well as a necessary structure
 *
 * Backend api tests should be maintained so ensure that data is delivered in this format
 */

/**
 * get requests to films/ api return an array of objects with interface Film
 */
export interface Film {
    id: string;
    title: string;
    year: string;
    matches: Film[]; // note: this doesn't belong to API and must be moved
    isNew: boolean;
}

/**
 * get requests to theaters/ api return an array of objects with interface Film
 */
export interface Theater {
    name: string;
    id: string;
}

/**
 * get requests to screenings/ api return an array of objects with interface Film
 */
export interface Screening {
    id: number;
    theater_id: string;
    film_id: string;
}

/**
 * get requests to instructor/ api return an array of objects with interface Student
 */
export interface Student {
    info: {
        email: string;
        name: string;
        id: string;
    };
    datesCompleted: string[];
}

/**
 * get requests to instructor/ api return an array of objects with interface Student
 */
export interface User {
    email: string;
    name: string;
    id: string;
    role: string;
}
