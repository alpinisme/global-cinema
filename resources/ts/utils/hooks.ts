import { Dispatch, SetStateAction, useState, useEffect, useCallback, ChangeEvent } from 'react';
import axios from 'axios';
import { Film } from '../types/api';
import { throttle } from './functions';

export interface RequestResponse<A> {
    data: A | null;
    error: string | null;
    isLoading: boolean;
}

export function usePostRequest<A, B>(): [RequestResponse<B>, (url: string, postData: A) => void] {
    const [res, setRes] = useState<RequestResponse<B>>({
        data: null,
        error: null,
        isLoading: false,
    });

    const makePostRequest = (url: string, postData: A) => {
        setRes(prevState => ({ ...prevState, isLoading: true }));
        axios
            .post(url, postData)
            .then(res => {
                setRes({ data: res.data, isLoading: false, error: null });
            })
            .catch(error => {
                setRes({ data: null, isLoading: false, error });
            });
    };
    return [res, makePostRequest];
}

export function usePatchRequest<A, B>(): [RequestResponse<B>, (url: string, postData: A) => void] {
    const [res, setRes] = useState<RequestResponse<B>>({
        data: null,
        error: null,
        isLoading: false,
    });

    const makePatchRequest = (url: string, postData: A) => {
        setRes(prevState => ({ ...prevState, isLoading: true }));
        axios
            .patch(url, postData)
            .then(res => {
                setRes({ data: res.data, isLoading: false, error: null });
            })
            .catch(error => {
                setRes({ data: null, isLoading: false, error });
            });
    };
    return [res, makePatchRequest];
}

export function useNewGetRequest<A>(url: string): RequestResponse<A> {
    const [data, setData] = useState<A | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // prevent state update on unmounted component
        setError(null);

        axios
            .get(url)
            .then(res => res.data)
            .then(data => {
                if (isMounted) {
                    setData(data);
                    setIsLoading(false);
                }
            })
            .catch(res => {
                if (isMounted) {
                    setError(res.body.error);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { error, isLoading, data };
}

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
        let isMounted = true; // prevent state update on unmounted component
        const req = axios
            .get(url)
            .then(res => res.data)
            .then(data => {
                if (isMounted) setData(data);
            });

        if (isMounted) {
            setRequest(req);
        }

        return () => {
            isMounted = false;
        };
    }, [url]);

    /**
     * handle errors, if any
     * this must be done in a separate effect so that changes to
     * the setErrors dependency don't cause multiple calls to api
     */
    useEffect(() => {
        let isMounted = true; // prevent state update on unmounted component

        if (isMounted) {
            request?.catch(setErrors);
        }

        return () => {
            isMounted = false;
        };
    }, [request, setErrors]);

    return [data, setData];
}

export function useFilmSearch(): [Film[], (input: string, year?: string | undefined) => void] {
    const [films, setFilms] = useState<Film[]>([]);

    const search = (input: string, year?: string) => {
        if (input.length < 3) {
            return;
        }

        const stripArticles = (str: string) => {
            const articles = ['the', 'a', 'an'];
            const words = str.split(' ');
            const query = articles.includes(words[0]) ? words.slice(1) : words;
            return query.join(' ');
        };

        let query: string;
        if (input.length > 3) {
            query = stripArticles(input);
        } else {
            query = input;
        }

        if (query.length != 3) {
            return;
        }

        axios
            .get(`/films/search/${query}?year=${year}`)
            .then(r => r.data)
            .then(setFilms)
            .catch(console.log);
    };

    const doFilmsSearch = throttle((s, y) => search(s, y), 100);

    return [films, doFilmsSearch];
}

export function useFormField(
    initialValue = ''
): { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void } {
    const [value, setValue] = useState(initialValue);
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
        []
    );
    return { value, onChange };
}
