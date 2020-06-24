import React, { createContext, ReactElement, useState, Dispatch, useContext } from 'react';
import { City } from '../types/api';

const CityContext = createContext<[City | null, Dispatch<City | null> | null]>([null, null]);

const CityContextProvider = ({ children }: Props) => {
    const [city, setCity] = useState<City | null>(null);

    return <CityContext.Provider value={[city, setCity]}>{children}</CityContext.Provider>;
};

const useCityContext = (): [City | null, Dispatch<City | null>] => {
    const [city, setCity] = useContext(CityContext);
    if (!setCity)
        throw new Error(
            'useCityContext must only be called from children of a CityContextProvider'
        );
    return [city, setCity];
};

interface Props {
    children: ReactElement;
}

export { CityContextProvider, useCityContext };
