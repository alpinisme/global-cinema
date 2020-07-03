import { ScreeningsGeoJSONFeature, ScreeningsGeoJSON, User, Theater } from '../../types/api';

const screeningsGeoJSONFeatures: ScreeningsGeoJSONFeature[] = [
    {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [47.608013, -122.335167],
        },
        properties: {
            theater: 'Arcadia',
            title: 'Whoa, a Movie!',
            language: 'English',
            country: 'USA',
        },
    },
    {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [null, null],
        },
        properties: {
            theater: 'Neptune',
            title: 'Huh, Another Movie!',
            language: 'Hindi',
            country: 'India',
        },
    },
];

const screeningsGeoJSON: ScreeningsGeoJSON = {
    type: 'FeatureCollection',
    name: '1950-09-01',
    crs: {
        type: 'name',
        properties: {
            name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
        },
    },
    features: screeningsGeoJSONFeatures,
};

const theaters: Theater[] = [
    {
        name: 'Neptune',
        city_id: 1,
        id: 5,
    },
];

const users: User[] = [
    {
        email: 'hello@example.com',
        name: 'random user',
        id: 2,
        role: 'student',
    },
    {
        email: 'admin@example.com',
        name: 'admin user',
        id: 4,
        role: 'admin',
    },
];

const cities = [
    {
        name: 'Seattle',
        country: 'USA',
        id: 1,
        lat: 47.608013,
        lng: -122.335167,
        zoom: 10,
    },
];

export { cities, screeningsGeoJSON, users, theaters };
