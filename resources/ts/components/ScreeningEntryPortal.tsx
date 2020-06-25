import React, { ReactElement, ChangeEvent, useContext } from 'react';
import Select from './Select';
import MonthPicker from './MonthPicker';
import { useCityContext } from '../contexts/CityContext';
import AdminContext from '../contexts/AdminContext';

const ScreeningEntryPortal = ({ setMonth }: Props): ReactElement => {
    const [city, setCity] = useCityContext();
    const { cities } = useContext(AdminContext);

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
    setMonth: (month: string) => void;
}

export default ScreeningEntryPortal;
