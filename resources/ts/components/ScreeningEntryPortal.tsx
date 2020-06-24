import React, { ReactElement, useState, ChangeEvent } from 'react';
import { City } from '../types/api';
import Select from './Select';
import MonthPicker from './MonthPicker';
import { useCityContext } from '../contexts/CityContext';

const ScreeningEntryPortal = ({ cities, setMonth }: Props): ReactElement => {
    const [city, setCity] = useCityContext();

    const selectedCity = city ? city.id.toString() : '';

    const options = cities ? cities.map(city => ({ value: city.id, label: city.name })) : [];

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = cities.find(city => city.id.toString() == e.target.value);
        if (!selected) {
            setCity(null);
        } else {
            setCity(selected);
        }
    };

    return (
        <>
            <Select
                label="Choose a city:"
                options={options}
                value={selectedCity}
                handleChange={handleChange}
            />
            {city && <MonthPicker setMonth={setMonth} />}
        </>
    );
};

interface Props {
    cities: City[];
    setMonth: (month: string) => void;
}

export default ScreeningEntryPortal;
