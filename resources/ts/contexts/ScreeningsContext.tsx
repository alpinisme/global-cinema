import { createContext } from 'react';
import type { Theater, Film } from '../types/api';

export interface ScreeningsContextData {
    films: Film[];
    theaters: Theater[];
    getFilms: (input: string, year?: string) => void;
}

const ScreeningsContext = createContext({} as ScreeningsContextData);

export default ScreeningsContext;
