import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

export function useGetRequest<A>(
    url: string,
    setErrors: (err: string) => void
): [A | null, Dispatch<SetStateAction<A | null>>] {
    const [data, setData] = useState<A | null>(null);
    const [request, setRequest] = useState<Promise<void> | null>(null);

    /**
     * make request and handle success
     * then save promise in state so another effect can handle errors, if any
     */
    useEffect(() => {
        const req = axios
            .get(url)
            .then(res => res.data)
            .then(setData);

        setRequest(req);
    }, [url]);

    /**
     * handle errors, if any
     * this must be done in a separate effect so that changes to
     * the setErrors dependency don't cause multiple calls to api
     */
    useEffect(() => {
        request?.catch(setErrors);
    }, [request, setErrors]);

    return [data, setData];
}
