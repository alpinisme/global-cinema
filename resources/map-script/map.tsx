import React, { useState, useEffect, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import { Map, TileLayer, Popup, CircleMarker, LayerGroup } from 'react-leaflet';
import { log } from './utils';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import style from './Map.scss';
import { City, ScreeningsGeoJSON } from '../ts/types/api';

const MOBILE_VISIBLE = 'mobile-fullscreen-visible';
const MOBILE_INVISIBLE = 'mobile-invisible';
const MOBILE_ONLY = 'mobile-only';

const bombay: City = {
    id: 8,
    name: 'Bombay',
    country: 'India',
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
    const toDateString = (date: Date) => date.toISOString().slice(0, 10);

    // isActiveMap is a boolean that signifies whether the map should be visible to mobile users.
    const [isActiveMap, setIsActiveMap] = useState(false);
    const [date, setDate] = useState(minDate);
    const [isError, setIsError] = useState(false);
    const [city, setCity] = useState(bombay);
    const [cities, setCities] = useState<City[]>([]);
    const [theaters, setTheaters] = useState<ScreeningsGeoJSON | null>(null);

    /**
     * event handler for toggling map visibility
     */
    const handleActiveStatusChange = () => {
        setIsActiveMap(oldStatus => !oldStatus);
    };

    const handleCitySelection = event => {
        // user input will be a string, so parse it to get a number, base 10
        const id = parseInt(event.target.value, 10);

        // the dropdown only lists valid cities, so we know there will be a match and can type cast confidently
        setCity(cities.find(city => city.id == id) as City);
    };

    // fetch cities
    useEffect(() => {
        fetchJSON('/cities', setIsError).then(setCities).catch(log);
    }, []);

    // fetch theaters
    useEffect(() => {
        const url = `/map/${city.id}/${toDateString(date)}`;
        fetchJSON(url, setIsError).then(setTheaters).catch(log);
    }, [date, city.id]);

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

const CityPicker = ({ cities, value, handleChange }: CityPickerProps) => (
    <select value={value} onChange={handleChange}>
        {cities.map(city => (
            <option key={city.id} value={city.id}>
                {city.name}
            </option>
        ))}
    </select>
);

const ErrorDisplay = () => (
    <div className="errors">Sorry, we don&apos;t have data for that date</div>
);

const ScreeningsMap = ({ city, theaters: screening, className, handleClick }: MapProps) => {
    const position: [number, number] = [city.lat, city.lng];

    return (
        <div className={className}>
            <Map center={position} zoom={city.zoom} id="map">
                <TileLayer
                    url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    id="mapbox.light"
                />
                <LayerGroup>
                    {screening?.features.map(screening => (
                        <CircleMarker
                            key={screening.properties.theater}
                            radius={6}
                            center={screening.geometry.coordinates.reverse() as [number, number]}
                            color={'purple'}
                            opacity={0}
                            fillOpacity={0.8}
                            weight={0.6}
                        >
                            <Popup>
                                <dl>
                                    <dt className={style.label}>theater:</dt>
                                    <dd className={style.value}>{screening.properties.theater}</dd>
                                    <dt className={style.label}>title:</dt>
                                    <dd className={style.value}>{screening.properties.title}</dd>
                                </dl>
                            </Popup>
                        </CircleMarker>
                    ))}
                </LayerGroup>
            </Map>
        </div>
    );
};

interface MapProps {
    city: City;
    theaters: ScreeningsGeoJSON | null;
    className: string;
    handleClick: () => void;
}

interface CityPickerProps {
    cities: City[];
    value: number;
    handleChange: (e: SyntheticEvent) => void;
}

ReactDOM.render(<Root />, document.getElementById('react-root'));
