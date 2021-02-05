import React, { createContext, ReactElement, ReactNode, useContext } from 'react';
import type { User, City } from '../types/api';
import { useGetRequest } from '../utils/hooks';

export const AdminContext = createContext({} as AdminContextData);

export const useAdminContext = (): AdminContextData => useContext(AdminContext);

const AdminProvider = ({ children }: Props): ReactElement => {
    const users = useGetRequest<User[]>('/users');
    const cities = useGetRequest<City[]>('/cities');

    const adminContextData = {
        users: users.data ?? [],
        cities: cities.data ?? [],
    };

    return <AdminContext.Provider value={adminContextData}>{children}</AdminContext.Provider>;
};

export default AdminProvider;

export interface AdminContextData {
    users: User[];
    cities: City[];
}

interface Props {
    children: ReactNode;
}
