import React, { ReactElement, Dispatch, SetStateAction, useState, useCallback } from 'react';
import Month from '../components/Month';
import type { Film, Theater } from '../types/api';
import ScreeningsContext from '../contexts/ScreeningsContext';
import Axios from 'axios';

const Student = ({ useGetRequest }: Props): ReactElement => {
    const [films, setFilms] = useState<Film[]>([]);

    const [theaters] = useGetRequest<Theater[]>(
        '/theaters',
        e => `Theaters could not be loaded: ${e}`
    );

    const [assignment] = useGetRequest<string>(
        '/users',
        e => `Assignment could not be loaded: ${e}`
    );

    const doFilmsSearch = useCallback(
        (input: string, year?: string) => {
            if (input.length < 3) {
                return;
            }

            Axios.get(`/films/search/${input}?year=${year}`)
                .then(r => r.data)
                .then(setFilms)
                .catch(console.log);
        },
        [setFilms]
    );

    const context = {
        theaters: theaters ?? [],
        films: films ?? [],
        getFilms: doFilmsSearch,
    };

    return assignment ? (
        <ScreeningsContext.Provider value={context}>
            <Month month={assignment} />
        </ScreeningsContext.Provider>
    ) : (
        <div> ...loading</div>
    );
};

export interface Props {
    useGetRequest: <A>(
        url: string,
        createErrMsg: (e: string) => string
    ) => [A | null, Dispatch<SetStateAction<A | null>>];
}

export default Student;
