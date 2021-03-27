import React, { ReactElement } from 'react';
import ErrorBox from '../../components/ErrorBox';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useGetRequest } from '../../hooks/requestHooks';
import { StatsResponse } from '../../types/api';

const Stats = ({ city, date }: Props): ReactElement => {
    const stats = useGetRequest<StatsResponse[]>(`/month-stats?city=${city}&date=${date}`);

    if (stats.isLoading) {
        return <LoadingIndicator />;
    }

    if (stats.error != null) {
        return <ErrorBox errors={stats.error} />;
    }

    if (stats.data.length == 0) {
        return <p>Sorry, we have no data for that city on that day</p>;
    }

    const topFilmsByScreeningCountDesc = stats.data
        .slice()
        .sort((a, b) => b.screening_count - a.screening_count)
        .slice(0, 5);

    return (
        <>
            <h4>Most Popular Films That Month</h4>
            <ul>
                {topFilmsByScreeningCountDesc.map(entry => (
                    <li key={entry.film.id}>
                        {entry.film.title}: {entry.screening_count}
                    </li>
                ))}
            </ul>
        </>
    );
};

interface Props {
    date: string | null;
    city: number;
}

export default Stats;
