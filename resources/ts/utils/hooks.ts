import { useState, useEffect, useCallback, ChangeEvent, useReducer, Reducer } from 'react';
import axios from 'axios';
import { Film } from '../types/api';
import { throttle } from './functions';

function reducer<A>(state: RequestResponseQ<A>, action: ReducerAction<A>): RequestResponseQ<A> {
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

const initialState = {
    data: null,
    error: null,
    isLoading: true,
};

export function usePostRequest<A, B>(): [RequestResponse<B>, (url: string, postData: A) => void] {
    const [state, dispatch] = useReducer<RequestReducer<B>>(
        reducer,
        initialState as RequestResponseQ<B>
    );

    const makePostRequest = (url: string, postData: A) => {
        dispatch({ type: 'new request' });
        axios
            .post(url, postData)
            .then(res => {
                dispatch({ type: 'success', data: res.data });
            })
            .catch(error => {
                dispatch({ type: 'error', error });
            });
    };
    return [state, makePostRequest];
}

export function usePatchRequest<A, B>(): [RequestResponse<B>, (url: string, postData: A) => void] {
    const [state, dispatch] = useReducer<RequestReducer<B>>(
        reducer,
        initialState as RequestResponseQ<B>
    );

    const makePatchRequest = (url: string, patchData: A) => {
        dispatch({ type: 'new request' });
        axios
            .patch(url, patchData)
            .then(res => {
                dispatch({ type: 'success', data: res.data });
            })
            .catch(error => {
                dispatch({ type: 'error', error });
            });
    };
    return [state, makePatchRequest];
}

export function useGetRequest<A>(url: string): RequestResponseQ<A> {
    const [state, dispatch] = useReducer<RequestReducer<A>>(
        reducer,
        initialState as RequestResponseQ<A>
    );

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

export type RequestResponseQ<A> = SuccessResponse<A> | ErrorResponse<A> | PendingResponse<A>;

type SuccessResponse<A> = {
    data: A;
    error: null;
    isLoading: false;
};

type ErrorResponse<A> = {
    data: A | null;
    error: string;
    isLoading: false;
};

type PendingResponse<A> = {
    data: A | null;
    error: string | null;
    isLoading: true;
};

type ReducerAction<A> =
    | { type: 'new request' }
    | { type: 'error'; error: string }
    | { type: 'success'; data: A };

type RequestReducer<A> = Reducer<RequestResponseQ<A>, ReducerAction<A>>;
