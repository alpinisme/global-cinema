import { createContext, Dispatch } from 'react';
import type { Theater, Film } from '../types/api';

export interface ScreeningsContextData {
    films: Film[];
    theaters: Theater[];
    addFilm: Dispatch<Film>;
}

const ScreeningsContext = createContext({} as ScreeningsContextData);

export default ScreeningsContext;
