import { createContext, Dispatch } from 'react';
import type { Theater, Film, User, City } from '../types/api';

export interface AdminContextData {
    films: Film[];
    theaters: Theater[];
    users: User[];
    cities: City[];
    addFilm: Dispatch<Film>;
}

const AdminContext = createContext({} as AdminContextData);

export default AdminContext;
