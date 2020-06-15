import React, { useState, ReactElement } from 'react';
import Day from './Day';
import DayPicker from './DayPicker';
import type { Film, Theater } from '../types/api';

const Month = ({
    month,
    theaters,
    films,
    addFilm,
    cancel,
}: Props): ReactElement => {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <>
            {date ? (
                <Day
                    date={date}
                    theaters={theaters}
                    films={films}
                    cancel={() => setDate(null)}
                    addFilm={addFilm}
                />
            ) : (
                <DayPicker month={month} handleClick={setDate} />
            )}
            <button onClick={cancel}>Back to Admin Home</button>
        </>
    );
};

export default Month;

export interface Props {
    month: string;
    theaters: Theater[];
    films: Film[];
    addFilm: (film: Film) => void;
    cancel?: () => void;
}
