import React, { ReactElement, Dispatch, SetStateAction } from 'react';
import Month from '../components/Month';
import type { Film, Theater } from '../types/api';
import ScreeningsContext from '../contexts/ScreeningsContext';

const Student = ({ useGetRequest }: Props): ReactElement => {
    const [films, setFilms] = useGetRequest<Film[]>(
        '/films',
        e => `Films could not be loaded: ${e}`
    );

    const [theaters] = useGetRequest<Theater[]>(
        '/theaters',
        e => `Theaters could not be loaded: ${e}`
    );

    const [assignment] = useGetRequest<string>(
        '/users',
        e => `Assignment could not be loaded: ${e}`
    );

    const context = {
        theaters: theaters ?? [],
        films: films ?? [],
        addFilm: film => setFilms(old => (old ? [film, ...old] : [film])),
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
