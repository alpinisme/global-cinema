import React, { createContext, ReactElement, ReactNode } from 'react';
import type { Theater, Film } from '../types/api';
import { useGetRequest } from '../hooks/requestHooks';
import useFilmSearch from '../hooks/useFilmSearch';

export const ScreeningsContext = createContext({} as ScreeningsContextData);

const ScreeningsProvider = ({ children }: ScreeningsProviderProps): ReactElement => {
    const theaters = useGetRequest<Theater[]>('/theaters');
    const [films, getFilms] = useFilmSearch();

    const screeningsContextData = {
        films,
        getFilms,
        theaters: theaters.data ?? [],
    };

    return (
        <ScreeningsContext.Provider value={screeningsContextData}>
            {children}
        </ScreeningsContext.Provider>
    );
};

export default ScreeningsProvider;

export interface ScreeningsContextData {
    films: Film[];
    theaters: Theater[];
    getFilms: (input: string, year?: string) => void;
}

interface ScreeningsProviderProps {
    children: ReactNode;
}
