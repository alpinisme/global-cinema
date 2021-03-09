import React, { ReactElement, useEffect } from 'react';
import Month from '../components/Month';
import type { Theater } from '../types/api';
import { ScreeningsContext } from '../contexts/ScreeningsContext';
import { useGetRequest } from '../hooks/requestHooks';
import { useAuth } from '../hooks/useAuth';
import useFilmSearch from '../hooks/useFilmSearch';
import { useHistory } from 'react-router';

const Student = (): ReactElement => {
    const [films, getFilms] = useFilmSearch();
    const theaters = useGetRequest<Theater[]>('/theaters');
    const auth = useAuth();
    const history = useHistory();

    if (!auth.user || !auth.user.assignment) {
        throw Error(
            "It seems that you're trying to access the student page. But I can't verify that you're a student. This probably isn't your fault. Contact a site administrator"
        );
    }

    const assignedCity = auth.user.assignment.city;

    useEffect(() => {
        const search = new URLSearchParams();
        search.append('city', assignedCity.id.toString());
        history.push({ search: search.toString() });
    }, [assignedCity, history]);

    const context = {
        theaters: theaters.data ?? [],
        films,
        getFilms,
    };

    return (
        <ScreeningsContext.Provider value={context}>
            <Month />
        </ScreeningsContext.Provider>
    );
};

export default Student;
