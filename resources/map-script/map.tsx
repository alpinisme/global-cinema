import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { map, geoJSON, circleMarker, popup, tileLayer, Control, Map, Layer } from 'leaflet';
import { escapeHtml, log } from './utils';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';

const MOBILE_VISIBLE = 'mobile-fullscreen-visible';
const MOBILE_INVISIBLE = 'mobile-invisible';
const MOBILE_ONLY = 'mobile-only';

const bombay = {
    id: 8,
    name: 'Bombay',
    lat: 19.07283,
    lng: 72.8832,
    zoom: 11,
};

/**
 * fetch function that parses response for json and flags errors
 *
 * @param {string} url string for url to fetch
 * @param {function} setIsError function that accepts boolean to set error status (as side effect)
 */
const fetchJSON = async (url, setIsError) => {
    setIsError(false);

    const handleResponse = response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    };

    try {
        const response = await fetch(url);
        const r = await handleResponse(response);
        return r.json();
    } catch (e) {
        return setIsError(true);
    }
};

const Root = () => {
    const minDate = new Date('1945');
    const maxDate = new Date('1995');
    // since dates are stored in database without timestamp, we only want first ten chars
    const toDateString = date => date.toISOString().slice(0, 10);

    // isActiveMap is a boolean that signifies whether the map should be visible to mobile users.
    const [isActiveMap, setIsActiveMap] = useState(false);
    const [date, setDate] = useState(minDate);
    const [isError, setIsError] = useState(false);
    const [city, setCity] = useState(bombay);
    const [cities, setCities] = useState({ default: { name: 'name', id: 'id' } });
    const [theaters, setTheaters] = useState(null);

    /**
     * event handler for toggling map visibility
     */
    const handleActiveStatusChange = () => {
        setIsActiveMap(oldStatus => !oldStatus);
    };

    /**
     * event handler for city selection -- uses the id submitted with the event to look up
     * the city data from among the cities stored in state; stores new city in its own state
     */
    const handleCitySelection = event => {
        // user input will be a string, so parse it to get a number, base 10
        const id = parseInt(event.target.value, 10);
        log('setting city');
        setCity(cities[id]);
    };

    /**
     * fetch cities and store them in state, setting the error status appropriately
     */
    const getCities = () => {
        const indexCities = arr => {
            // given an array of cities, it returns an object with each city keyed to its id
            return arr.reduce((obj, next) => {
                obj[next.id] = next;
                return obj;
            }, {});
        };

        fetchJSON('/cities', setIsError).then(indexCities).then(setCities).catch(log);
    };

    /**
     * fetch theaters and store them in state, setting the error status appropriately
     */
    const getTheaters = () => {
        const url = `/map/${city.id}/${toDateString(date)}`;
        fetchJSON(url, setIsError).then(setTheaters).catch(log);
    };

    useEffect(getCities, []);
    useEffect(getTheaters, [date]);

    return (
        <>
            <div id="map-menu-box" className={isActiveMap ? MOBILE_INVISIBLE : MOBILE_VISIBLE}>
                <CityPicker cities={cities} value={city.id} handleChange={handleCitySelection} />

                <DatePicker
                    placeholderText="Select Date"
                    mindate={minDate}
                    maxDate={maxDate}
                    selected={date}
                    onChange={setDate}
                />

                <button type="button" className={MOBILE_ONLY} onClick={handleActiveStatusChange}>
                    Show Map
                </button>

                {isError && <ErrorDisplay />}
            </div>

            <ScreeningsMap
                city={city}
                theaters={theaters}
                className={isActiveMap ? MOBILE_VISIBLE : MOBILE_INVISIBLE}
                handleClick={handleActiveStatusChange}
            />
        </>
    );
};

const CityPicker = ({ cities, value, handleChange }) => (
    <select value={value} onChange={handleChange}>
        {Object.keys(cities).map(city => (
            <option key={cities[city].id} value={cities[city].id}>
                {cities[city].name}
            </option>
        ))}
    </select>
);

const ErrorDisplay = () => (
    <div className="errors">Sorry, we don&apos;t have data for that date</div>
);

const ScreeningsMap = ({ city, theaters, className, handleClick }) => {
    // the Map component is basically a wrapper around a Leaflet instances
    // and since Leaflet handles its own rendering, we cede control to it
    // using refs instead of state for the variables internal to Leaflet
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Layer | null>(null);
    const legendOpts = useRef<string[]>([]);

    // initialize map and save a reference to it in mapRef for later manipulation
    const initializeMap = () => {
        const url =
            'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

        const opts = {
            maxZoom: 18,
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.light',
        };

        mapRef.current = map('map', { layers: [tileLayer(url, opts)] });
    };

    // create Leaflet Control extension "Button" that will toggle classes related
    // to mobile use of the page
    const addButton = () => {
        const Button = Control.extend({
            onAdd: () => {
                const button = document.createElement('button');
                button.innerText = 'Search Again';
                button.id = 'mobile-status-button';
                button.classList.add(MOBILE_ONLY);
                button.addEventListener('click', handleClick);
                return button;
            },
            onRemove: () => {
                // do nothing
            },
        });

        const button = o => new Button(o);
        button({ position: 'topright' }).addTo(mapRef.current as Map);
    };

    // (re)center the map on the selected city
    const centerMap = () => {
        mapRef.current?.setView([city.lat, city.lng], city.zoom);
    };

    // put markers on the maps to correspond to screenings at particular theaters
    const drawMarkers = () => {
        // remove stale markers already on the map, if present
        if (markerRef.current) {
            mapRef.current?.removeLayer(markerRef.current as Layer);
        }

        // if the new dataset is empty, theaters will be null
        if (!theaters) return;

        // create new marker layer and store it in markerRef so it can
        // be manipulated and removed when necessary
        markerRef.current = geoJSON(theaters, {
            style: feature => feature?.properties?.style,

            pointToLayer: (feature, latlng) => {
                const language: string = feature.properties.film_language;
                const film: string = feature.properties.film_name;
                const theater: string = feature.properties.theater_name;

                /* this section is currently unused, but is retained in case we
        decide to have the legend change again */
                const isNew = x => !legendOpts.current.includes(x);

                if (isNew(language)) {
                    legendOpts.current.push(language);
                }
                /* end unused section */

                const getColor = field => (field ? '#A5A' : '#AAA');

                const box = popup().setContent(
                    `Theater Name: ${escapeHtml(theater)}</b><br/>` +
                        `Film Name: ${escapeHtml(film)}</b><br/>` +
                        `Film Language: ${escapeHtml(language)}`
                );

                const marker = circleMarker(latlng, {
                    radius: 6,
                    fillColor: getColor(film),
                    weight: 0.6,
                    opacity: 0,
                    fillOpacity: 0.8,
                });

                marker.bindPopup(box);
                return marker;
            },
        });

        // add the newly created marker layer to the existing map
        markerRef.current.addTo(mapRef.current as Map);
    };

    useEffect(initializeMap, []);
    useEffect(addButton, []);
    useEffect(centerMap, [city]);
    useEffect(drawMarkers, [theaters]);

    return (
        <div className={className}>
            <div id="map" />
        </div>
    );
};

CityPicker.propTypes = {
    cities: PropTypes.objectOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    value: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
};

ScreeningsMap.propTypes = {
    city: PropTypes.objectOf(PropTypes.any).isRequired,
    theaters: PropTypes.objectOf(PropTypes.any),
    className: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
};

ScreeningsMap.defaultProps = {
    theaters: null,
};

ReactDOM.render(<Root />, document.getElementById('react-root'));
