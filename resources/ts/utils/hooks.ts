import { useState, useEffect, useCallback, ChangeEvent, useReducer, Reducer } from 'react';
import axios from 'axios';
import { Film } from '../types/api';
import { throttle } from './functions';

function reducer<A>(state: RequestResponse<A>, action: ReducerAction<A>) {
    switch (action.type) {
        case 'new request':
            return { ...state, error: null, isLoading: true };
        case 'error':
            return { ...state, isLoading: false, error: action.error };
        case 'success':
            return { ...state, isLoading: false, data: action.data };
        default:
            throw new Error();
    }
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
    const initialState = {
        data: null,
        error: null,
        isLoading: true,
    };

    const [state, dispatch] = useReducer<RequestReducer<A>>(reducer, initialState);

    useEffect(() => {
        let isMounted = true; // prevent state update on unmounted component
        dispatch({ type: 'new request' });

        axios
            .get(url)
            .then(res => res.data)
            .then(data => {
                if (isMounted) {
                    dispatch({ type: 'success', data });
                }
            })
            .catch(res => {
                if (isMounted) {
                    dispatch({ type: 'error', error: res.body.error });
                }
            });

        return () => {
            isMounted = false;
        };
    }, [url]);

    return state;
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

export interface RequestResponse<A> {
    data: A | null;
    error: string | null;
    isLoading: boolean;
}

type ReducerAction<A> =
    | { type: 'new request' }
    | { type: 'error'; error: string }
    | { type: 'success'; data: A };

type RequestReducer<A> = Reducer<RequestResponse<A>, ReducerAction<A>>;
