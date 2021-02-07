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
        case 'state update':
            return state.data ? { ...state, data: action.update(state.data) } : state;
        default:
            throw new Error('Unknown action type');
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

    const update = (fn: UpdateFunction<A>) => dispatch({ type: 'state update', update: fn });

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

    return { ...state, update };
}

export type RequestResponse<A> = SuccessResponse<A> | ErrorResponse<A> | PendingResponse<A>;

type UpdateFunction<A> = (old: A) => A;

interface SuccessResponse<A> {
    data: A;
    error: null;
    isLoading: false;
    update: (fn: UpdateFunction<A>) => void;
}

interface ErrorResponse<A> {
    data: A | null;
    error: string;
    isLoading: false;
    update: (fn: UpdateFunction<A>) => void;
}

interface PendingResponse<A> {
    data: A | null;
    error: string | null;
    isLoading: true;
    update: (fn: UpdateFunction<A>) => void;
}

type ReducerAction<A> =
    | { type: 'new request' }
    | { type: 'error'; error: string }
    | { type: 'success'; data: A }
    | { type: 'state update'; update: UpdateFunction<A> };

type RequestReducer<A> = Reducer<RequestResponse<A>, ReducerAction<A>>;
