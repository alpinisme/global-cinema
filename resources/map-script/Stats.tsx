import React, { ReactElement } from 'react';
import ErrorBox from '../ts/components/ErrorBox';
import LoadingIndicator from '../ts/components/LoadingIndicator';
import { useGetRequest } from '../ts/hooks/requestHooks';
import { StatsResponse } from '../ts/types/api';

const Stats = ({ city, date }: Props): ReactElement => {
    const stats = useGetRequest<StatsResponse[]>(`/month-stats?city=${city}&date=${date}`);

    if (stats.isLoading) {
        return <LoadingIndicator />;
    }

    if (stats.error != null) {
        return <ErrorBox errors={stats.error} />;
    }

    const topFilmsByScreeningCountDesc = stats.data
        .slice()
        .sort((a, b) => b.screening_count - a.screening_count)
        .slice(0, 5);

    return (
        <ul>
            {topFilmsByScreeningCountDesc.map(entry => (
                <li key={entry.film.id}>
                    {entry.film.title}: {entry.screening_count}
                </li>
            ))}
        </ul>
    );
};

interface Props {
    date: string | null;
    city: number;
}

export default Stats;
