import { useEffect, useReducer, Reducer } from 'react';
import axios from 'axios';

function reducer<A>(state: RequestResponse<A>, action: ReducerAction<A>): RequestResponse<A> {
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

function usePostOrPatch<A, B>(
    method: 'post' | 'patch'
): [RequestResponse<B>, (url: string, postData: A) => void] {
    const [state, dispatch] = useReducer<RequestReducer<B>>(
        reducer,
        initialState as RequestResponse<B>
    );

    const makePostRequest = (url: string, postData: A) => {
        dispatch({ type: 'new request' });
        axios[method](url, postData)
            .then(res => {
                dispatch({ type: 'success', data: res.data });
            })
            .catch(error => {
                dispatch({ type: 'error', error });
            });
    };
    return [state, makePostRequest];
}

export function usePostRequest<A, B>(): [RequestResponse<B>, (url: string, postData: A) => void] {
    return usePostOrPatch('post');
}

export function usePatchRequest<A, B>(): [RequestResponse<B>, (url: string, postData: A) => void] {
    return usePostOrPatch('patch');
}

export function useGetRequest<A>(url: string): RequestResponse<A> {
    const [state, dispatch] = useReducer<RequestReducer<A>>(
        reducer,
        initialState as RequestResponse<A>
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

export type RequestResponse<A> = SuccessResponse<A> | ErrorResponse<A> | PendingResponse<A>;

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

type RequestReducer<A> = Reducer<RequestResponse<A>, ReducerAction<A>>;
