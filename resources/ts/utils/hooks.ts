import { useState, useEffect, useCallback, ChangeEvent } from 'react';
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

export function useGetRequest<A>(url: string): RequestResponse<A> {
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
