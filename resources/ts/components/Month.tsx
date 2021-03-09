import React, { ReactElement } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import DayPicker from './DayPicker';

const Month = (): ReactElement => {
    const { month } = useParams<MonthParams>();

    if (!month) {
        throw new Error('Month component requires url param "month"');
    }

    return (
        <>
            <DayPicker month={month} />
            <Link to="/">Back to Admin Home</Link>
        </>
    );
};

export default Month;

interface MonthParams {
    month?: string;
}
