import React, { useState, ReactElement } from 'react';
import Day from './Day';
import DayPicker from './DayPicker';

const Month = ({ month, cancel }: Props): ReactElement => {
    const [date, setDate] = useState<Date | null>(null);

    return (
        <>
            {date ? (
                <Day date={date} cancel={() => setDate(null)} />
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
    cancel?: () => void;
}
