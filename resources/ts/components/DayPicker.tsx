import React, { ReactElement } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { toDateString } from '../utils/functions';

/**
 * takes a given Date object and returns a new Date
 * that is one day less than a full month later
 *
 * for this app, the date will always be the first
 * of the month, and the return will always be the last
 *
 * @param {Date} date
 */
const finishMonth = (date: Date) => {
    date.setUTCMonth(date.getUTCMonth() + 1);
    date.setUTCDate(date.getUTCDate() - 1);
    return date;
};

/**
 * creates an array of Date objects from start date to end date
 *
 * for this app, the date will always be the first
 * of the month, and the return will always be the last
 *
 * @param {Date} start date from which to push to array
 * @param {Date} end last date to push to array
 */
const createDateRange = (start: Date, end: Date) => {
    const current = new Date(start);
    const range: Date[] = [];
    for (const d = new Date(current); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
        range.push(new Date(d));
    }
    return range;
};

const DayPicker = ({ month }: Props): ReactElement => {
    const start = new Date(month);
    const end = finishMonth(new Date(month));
    const range = createDateRange(start, end);
    const getDay = (date: Date) => String(date.getDate()).padStart(2, '0');
    const { url } = useRouteMatch();

    return (
        <>
            <h1>Data Entry</h1>
            <p>Select a date to enter screenings for</p>
            <ul className="button-list">
                {range.map(date => (
                    <li key={date.toString()}>
                        <Link to={`${url}/${getDay(date)}`}>{toDateString(date)}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default DayPicker;

export interface Props {
    month: string;
}
