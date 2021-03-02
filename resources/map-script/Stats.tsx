import React, { ReactElement } from 'react';
import { useGetRequest } from '../ts/hooks/requestHooks';
import { City, Film } from '../ts/types/api';

const Stats = (props: Props): ReactElement => {
    const stats = useGetRequest<StatsResponse[]>(
        `/month-stats?city=${props.city.id}&date=${props.date}`
    );

    const topFilmsByDescScreeningCount = stats.data
        ?.slice()
        .sort((a, b) => b.screening_count - a.screening_count)
        .slice(0, 5);

    return (
        <ul>
            {topFilmsByDescScreeningCount?.map(entry => (
                <li key={entry.film.id}>
                    {entry.film.title}: {entry.screening_count}
                </li>
            ))}
        </ul>
    );
};

interface Props {
    date: string | null;
    city: City;
}

interface StatsResponse {
    screening_count: number;
    film: Film;
}

export default Stats;
