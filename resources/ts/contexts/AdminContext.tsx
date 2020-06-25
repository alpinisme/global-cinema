import { createContext } from 'react';
import type { User, City } from '../types/api';

export interface AdminContextData {
    users: User[];
    cities: City[];
}

const AdminContext = createContext({} as AdminContextData);

export default AdminContext;
