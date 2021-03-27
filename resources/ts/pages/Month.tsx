import React, { ReactElement } from 'react';
import { Redirect, useLocation, useParams, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import ContentContainer from '../components/ContentContainer';
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

/**
 * Component for selecting one day from a list of all days in a specific month
 */
const Month = (): ReactElement => {
    const { month } = useParams<MonthParams>();

    if (!month) {
        throw new Error('Month component requires url param "month"');
    }

    const { url } = useRouteMatch();
    const search = useLocation().search;
    const startDate = new Date(month);

    if (isNaN(startDate.getTime())) {
        return <Redirect to="/404" />;
    }

    const endDate = finishMonth(new Date(month));
    const dateRange = createDateRange(startDate, endDate);
    const getDay = (date: Date) => String(date.getUTCDate()).padStart(2, '0');

    return (
        <ContentContainer>
            <h1>Data Entry</h1>
            <p>Select a date to enter screenings for</p>
            <ul className="button-list">
                {dateRange.map(date => (
                    <li key={date.toString()}>
                        <Link to={{ pathname: `${url}/${getDay(date)}`, search }}>
                            {toDateString(date)}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/">Back to Admin Home</Link>
        </ContentContainer>
    );
};

export default Month;

interface MonthParams {
    month?: string;
}
