import React, { ReactElement, ChangeEvent, useContext } from 'react';
import Select from './Select';
import MonthPicker from './MonthPicker';
import { AdminContext } from '../contexts/AdminContext';
import { useHistory } from 'react-router';
import useQuery from '../hooks/useQuery';

const ScreeningEntryPortal = (): ReactElement => {
    const history = useHistory();
    const query = useQuery();
    const city = query.get('city') ?? '';
    const { cities } = useContext(AdminContext);

    const options = cities ? cities.map(city => ({ value: city.id, label: city.name })) : [];

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const search = new URLSearchParams();
        search.append('city', e.target.value);
        history.push({ search: search.toString() });
    };

    return (
        <>
            <Select
                label="Choose a city:"
                options={options}
                value={city}
                handleChange={handleChange}
            />
            {city.length > 0 && <MonthPicker />}
        </>
    );
};

export default ScreeningEntryPortal;
