import React, { useState, useEffect, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import { TileLayer, Popup, CircleMarker, LayerGroup, MapContainer } from 'react-leaflet';
import { log } from './utils';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import style from './Map.scss';
import { City, ScreeningsGeoJSON, ScreeningsGeoJSONFeature } from '../ts/types/api';

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
const fetchJSON = async (url: string, setIsError: (isError: boolean) => void) => {
    setIsError(false);

    const checkIfStatusOk = (response: Response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    };

    try {
        const response = await fetch(url);
        const okResponse = checkIfStatusOk(response);
        return okResponse.json();
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
    const [date, setDate] = useState<Date | null>(minDate);
    const [isError, setIsError] = useState(false);
    const [city, setCity] = useState(bombay);
    const [cities, setCities] = useState<City[]>([]);
    const [screenings, setScreenings] = useState<ScreeningsGeoJSON | null>(null);

    // added because official typings now allow for [Date, Date] to be passed in,
    // to account for time when selectsRange is set to true, which it is not here
    const setTypedDate = (date: Date | [Date, Date] | null) => {
        if (date instanceof Array) {
            console.log('date range passed when date expected');
            setDate(null);
        } else {
            setDate(date);
        }
    };

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

    // fetch cities on page load
    useEffect(() => {
        fetchJSON('/cities', setIsError).then(setCities).catch(log);
    }, []);

    // fetch theaters each time city or date changes, if valid date selected (city will always be valid)
    useEffect(() => {
        if (date) {
            const url = `/map/${city.id}/${toDateString(date)}`;
            fetchJSON(url, setIsError).then(setScreenings).catch(log);
        }
    }, [date, city.id]);

    const mappableScreenings = screenings?.features.filter(
        screening => screening.geometry.coordinates[0] != null
    );

    return (
        <>
            <div id="map-menu-box" className={isActiveMap ? MOBILE_INVISIBLE : MOBILE_VISIBLE}>
                <CityPicker cities={cities} value={city.id} handleChange={handleCitySelection} />

                <DatePicker
                    placeholderText="Select Date"
                    minDate={minDate}
                    maxDate={maxDate}
                    selected={date}
                    onChange={setTypedDate}
                />

                <button type="button" className={MOBILE_ONLY} onClick={handleActiveStatusChange}>
                    Show Map
                </button>

                {isError && <ErrorDisplay />}
            </div>

            <div className={isActiveMap ? MOBILE_VISIBLE : MOBILE_INVISIBLE}>
                {isActiveMap && (
                    <button className={style.cancelButton} onClick={handleActiveStatusChange}>
                        Search Again
                    </button>
                )}
                <ScreeningsMap city={city} screenings={mappableScreenings} />
            </div>
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

const ScreeningsMap = ({ city, screenings }: MapProps) => {
    const position: [number, number] = [city.lat, city.lng];

    return (
        <MapContainer center={position} zoom={city.zoom} id="map">
            <TileLayer
                url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                id="mapbox/light-v10"
                accessToken="pk.eyJ1IjoibWVuZWxzbzIiLCJhIjoiY2tra3A0aGtlMHZ4bDJ3cW5ncGY0M3FucCJ9.P4agnONVKGYVz32aZxP24A"
            />
            <LayerGroup>
                {screenings?.map(screening => (
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
                            <ul className={style.info}>
                                <li className={style.label}>
                                    theater:
                                    <span className={style.value}>
                                        {screening.properties.theater}
                                    </span>
                                </li>
                                <li className={style.label}>
                                    title:
                                    <span className={style.value}>
                                        {screening.properties.title}
                                    </span>
                                </li>
                            </ul>
                        </Popup>
                    </CircleMarker>
                ))}
            </LayerGroup>
        </MapContainer>
    );
};

interface MapProps {
    city: City;
    screenings: ScreeningsGeoJSONFeature[] | undefined;
}

interface CityPickerProps {
    cities: City[];
    value: number;
    handleChange: (e: SyntheticEvent) => void;
}

ReactDOM.render(<Root />, document.getElementById('react-root'));
