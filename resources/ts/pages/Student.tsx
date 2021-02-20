import React, { ReactElement, useState, useCallback } from 'react';
import Month from '../components/Month';
import type { Film, Theater } from '../types/api';
import { ScreeningsContext } from '../contexts/ScreeningsContext';
import Axios from 'axios';
import { useGetRequest } from '../hooks/requestHooks';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBox from '../components/ErrorBox';

const Student = (): ReactElement => {
    const [films, setFilms] = useState<Film[]>([]);
    const theaters = useGetRequest<Theater[]>('/theaters');
    const assignment = useGetRequest<string>('/users');

    const getFilms = useCallback(
        (input: string, year?: string) => {
            if (input.length < 3) {
                return;
            }

            Axios.get(`/films?search_term=${input}&up_to_year=${year}`)
                .then(r => r.data)
                .then(setFilms)
                .catch(console.log);
        },
        [setFilms]
    );

    const context = {
        theaters: theaters.data ?? [],
        films,
        getFilms,
    };

    if (assignment.isLoading) {
        return <LoadingIndicator />;
    }

    if (assignment.error != null) {
        return <ErrorBox errors={"Couldn't load assignment"} />;
    }

    return (
        <ScreeningsContext.Provider value={context}>
            <Month month={assignment.data} />
        </ScreeningsContext.Provider>
    );
};

export default Student;
