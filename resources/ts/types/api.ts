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
    imdb: string;
}

/**
 * get requests to `theaters/` api return an array of objects with interface `Theater`
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
    id: number;
    city_id: number;
    film_id: number;
    theater_id: number;
    theater: Theater;
    film: Film;
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
    assignment?: {
        date: string;
        instructor_id: string;
        city: City;
    };
}

/**
 * get requests to `cities/` api return an array of objects with interface `City`
 */
export interface City {
    name: string;
    country: string;
    id: number;
    lat: number;
    lng: number;
    zoom: number;
}

/**
 * the feature type that is nested inside `ScreeningsGeoJSON`
 */
export interface ScreeningsGeoJSONFeature {
    type: string;
    geometry: {
        type: 'Point';
        coordinates: [number | null, number | null];
    };
    properties: {
        theater: string;
        title: string;
        language: string | null;
        country: string | null;
    };
}

/**
 * get request to `geojson`
 */
export interface ScreeningsGeoJSON {
    type: 'FeatureCollection';
    name: string;
    crs: {
        type: 'name';
        properties: {
            name: 'urn:ogc:def:crs:OGC:1.3:CRS84';
        };
    };
    features: ScreeningsGeoJSONFeature[];
}

/**
 * get request to review/theaters
 */
export interface TheaterToReview {
    current: Theater;
    alternates: Theater[];
}

/**
 * get request to review/films
 */
export interface FilmToReview {
    current: Film;
    alternates: Film[];
}

/**
 * get request to month-stats
 */
export interface StatsResponse {
    screening_count: number;
    film: Film;
}

// TODO I think the screenings interface needs to be split, depending on whether we are posting or getting.
