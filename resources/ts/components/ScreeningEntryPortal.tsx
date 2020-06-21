import React, { ReactElement, useState } from 'react';
import { City } from '../types/api';
import Select from './Select';
import MonthPicker from './MonthPicker';

const ScreeningEntryPortal = ({ cities, setMonth }: Props): ReactElement => {
    const [cityID, setCityID] = useState<string | null>(null);

    return (
        <>
            <Select
                label="Choose a city:"
                options={cities?.map(city => ({ value: city.id, label: city.name })) ?? []}
                value={cityID ?? ''}
                handleChange={e => setCityID(e.target.value)}
            />
            {cityID && <MonthPicker setMonth={setMonth} />}
        </>
    );
};

interface Props {
    cities: City[];
    setMonth: (month: string) => void;
}

export default ScreeningEntryPortal;
