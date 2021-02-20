import React, { ReactElement, useState, useCallback } from 'react';
import Month from '../components/Month';
import type { Film, Theater } from '../types/api';
import { ScreeningsContext } from '../contexts/ScreeningsContext';
import Axios from 'axios';
import { useGetRequest } from '../hooks/requestHooks';
import { useAuth } from '../hooks/useAuth';

const Student = (): ReactElement => {
    const [films, setFilms] = useState<Film[]>([]);
    const theaters = useGetRequest<Theater[]>('/theaters');
    const auth = useAuth();

    if (!auth.user || !auth.user.assignment) {
        throw Error(
            "It seems that you're trying to access the student page. But I can't verify that you're a student. This probably isn't your fault. Contact a site administrator"
        );
    }

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

    return (
        <ScreeningsContext.Provider value={context}>
            <Month month={auth.user.assignment.date} />
        </ScreeningsContext.Provider>
    );
};

export default Student;
