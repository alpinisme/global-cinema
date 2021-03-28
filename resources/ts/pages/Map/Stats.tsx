import React, { ReactElement } from 'react';
import ErrorBox from '../../components/ErrorBox';
import LoadingIndicator from '../../components/LoadingIndicator';
import { useGetRequest } from '../../hooks/requestHooks';
import { StatsResponse } from '../../types/api';
import styles from './Stats.scss';

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

    const month = new Date(date).toLocaleString('default', {
        timeZone: 'UTC',
        month: 'long',
        year: 'numeric',
    });

    return (
        <table className={styles.table}>
            <caption style={{ captionSide: 'top' }}>Most Popular Films in {month}</caption>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Screenings Advertised</th>
                </tr>
            </thead>
            <tbody>
                {topFilmsByScreeningCountDesc.map(entry => (
                    <tr key={entry.film.id}>
                        <td>{entry.film.title}</td>
                        <td>{entry.screening_count}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

interface Props {
    date: string;
    city: number;
}

export default Stats;
