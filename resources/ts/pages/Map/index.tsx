import React, { useState, useEffect, SyntheticEvent, useMemo, ReactElement } from 'react';
import DatePicker from 'react-datepicker';
import { TileLayer, Popup, CircleMarker, LayerGroup, MapContainer } from 'react-leaflet';
import { log } from '../../utils/functions';
import 'react-datepicker/dist/react-datepicker.css';
import 'leaflet/dist/leaflet.css';
import style from './Map.scss';
import { City, ScreeningsGeoJSON, ScreeningsGeoJSONFeature } from '../../types/api';
import Stats from './Stats';
import { Map as LeafletMap } from 'leaflet';
import useTitle from '../../hooks/useTitle';
import { useGetRequest } from '../../hooks/requestHooks';

// TODO: make this work!
const MOBILE_VISIBLE = 'mobile-fullscreen-visible';
const MOBILE_INVISIBLE = 'mobile-invisible';
const MOBILE_ONLY = 'mobile-only';

const worldMapCenter: Partial<City> = {
    lat: 0,
    lng: 0,
    zoom: 2,
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

// a bit hacky, but Sweden (sv) uses YYYY-MM-DD and this won't cause timezone conversion problems
// and react-datepicker requires us to use dates in local timezone
const toDateString = (date: Date) => date.toLocaleDateString('sv');

const createLocalDay = (dateString: string) => new Date(dateString + 'T00:00:00');

const Map = (): ReactElement => {
    useTitle('Map');

    // isActiveMap is a boolean that signifies whether the map should be visible to mobile users.
    const [isActiveMap, setIsActiveMap] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [isError, setIsError] = useState(false);
    const [city, setCity] = useState<City | null>(null);
    const cities = useGetRequest<City[]>('/cities');
    const [screenings, setScreenings] = useState<ScreeningsGeoJSON | null>(null);

    const minDate = city?.oldest ? createLocalDay(city.oldest) : null;
    const maxDate = city?.latest ? createLocalDay(city.latest) : null;

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

        // reset date, otherwise an unavailable date may remain selected
        setDate(null);

        // the dropdown only lists valid cities, so we know there will be a match and can type cast confidently
        setCity(cities.data?.find(city => city.id == id) as City);
    };

    // fetch theaters each time city or date changes, if valid date selected (city will always be valid)
    useEffect(() => {
        if (city && date) {
            const url = `/geojson?city=${city.id}&date=${toDateString(date)}`;
            fetchJSON(url, setIsError).then(setScreenings).catch(log);
        }
    }, [date, city]);

    const mappableScreenings = screenings?.features.filter(
        screening => screening.geometry.coordinates[0] != null
    );

    return (
        <div className={style.page}>
            <div className={style.flex}>
                <div
                    id="map-menu-box"
                    className={
                        isActiveMap
                            ? style[MOBILE_INVISIBLE]
                            : style[MOBILE_VISIBLE] + ' ' + style.flexCol + ' ' + style.menuBox
                    }
                >
                    <h1>Film History from the Edges</h1>
                    <h2>Mapping Global Cinema</h2>
                    <div className={style.controls}>
                        <CityPicker
                            cities={cities.data ?? []}
                            value={city?.id}
                            handleChange={handleCitySelection}
                        />

                        <div className={style.grid}>
                            <p>Pick a date: </p>
                            <DatePicker
                                placeholderText="Select Date"
                                minDate={minDate}
                                maxDate={maxDate}
                                disabled={minDate == null}
                                selected={date}
                                onChange={setTypedDate}
                                className={style.datepicker}
                            />
                        </div>

                        <button
                            type="button"
                            className={style[MOBILE_ONLY]}
                            onClick={handleActiveStatusChange}
                        >
                            Show Map
                        </button>

                        {isError && <ErrorDisplay />}
                    </div>
                    {city && minDate == null && <p>Sorry, no data available for that city yet</p>}
                    {city && date && <Stats city={city.id} date={toDateString(date)} />}
                </div>
            </div>

            <div
                className={
                    style.mapContainer +
                    ' ' +
                    (isActiveMap ? style[MOBILE_VISIBLE] : style[MOBILE_INVISIBLE])
                }
            >
                {isActiveMap && (
                    <button className={style.cancelButton} onClick={handleActiveStatusChange}>
                        Search Again
                    </button>
                )}
                <ScreeningsMap city={city ?? worldMapCenter} screenings={mappableScreenings} />
            </div>
        </div>
    );
};

const CityPicker = ({ cities, value, handleChange }: CityPickerProps) => (
    <div className={style.grid}>
        <label htmlFor="city-picker">Pick a city: </label>
        <select id="city-picker" value={value} onChange={handleChange} className={style.cityPicker}>
            <option value="">Select...</option>
            {cities.map(city => (
                <option key={city.id} value={city.id}>
                    {city.name}
                </option>
            ))}
        </select>
    </div>
);

const ErrorDisplay = () => (
    <div className="errors">Sorry, we don&apos;t have data for that date</div>
);

const ScreeningsMap = ({ city, screenings }: MapProps) => {
    const position: [number, number] = useMemo(() => [Number(city.lat), Number(city.lng)], [city]);
    const [map, setMap] = useState<LeafletMap | null>(null);

    const displayMap = useMemo(() => {
        return (
            <MapContainer
                center={position}
                zoom={city.zoom}
                className={style.map}
                whenCreated={setMap}
                scrollWheelZoom={false}
            >
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
                                    {screening.properties.language && (
                                        <li className={style.label}>
                                            language:
                                            <span className={style.value}>
                                                {screening.properties.language}
                                            </span>
                                        </li>
                                    )}
                                    {screening.properties.country && (
                                        <li className={style.label}>
                                            country:
                                            <span className={style.value}>
                                                {screening.properties.country}
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </Popup>
                        </CircleMarker>
                    ))}
                </LayerGroup>
            </MapContainer>
        );
    }, [city.zoom, screenings, position]);

    useEffect(() => {
        map?.setView(position, city.zoom);
        // if popups not closed, then changing cities and selecting a date triggers
        // the map to recenter on old city (and its closing popup action)
        map?.closePopup();
    }, [map, position, city.zoom]);

    return displayMap;
};

interface MapProps {
    city: Partial<City>;
    screenings: ScreeningsGeoJSONFeature[] | undefined;
}

interface CityPickerProps {
    cities: City[];
    value: number | undefined;
    handleChange: (e: SyntheticEvent) => void;
}

export default Map;
