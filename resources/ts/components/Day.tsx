import React, { ReactElement } from 'react';
import axios from 'axios';
import ScreeningEntry from './ScreeningEntry';
import SavedScreening from './SavedScreening';
import { removeFrom, toDateString } from '../utils/functions';
import { Screening } from '../types/api';
import { useGetRequest } from '../hooks/requestHooks';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';

const Day = (props: DayProps): ReactElement => {
    const endpoint = '/screenings/' + props.date.toISOString().slice(0, 10);
    const screenings = useGetRequest<Screening[]>(endpoint);

    /**
     * sends request to server to destroy record at `id`
     * and also removes it from current application state
     *
     * @param {number} id id to be deleted
     * @param {number} index location in state array
     */
    const destroy = (id: number, index: number) => {
        axios
            .delete(`/screenings/${id}`)
            .then(() => screenings.update(old => removeFrom(old, index)))
            .catch(console.log);
    };

    if (screenings.isLoading) {
        return <LoadingIndicator />;
    }

    if (screenings.error != null) {
        return <ErrorBox errors={screenings.error} />;
    }

    const date = toDateString(props.date);
    const handleSuccess = (screening: Screening) => screenings.update(old => [...old, screening]);
    // slice to avoid mutating array, and hence toggling order on each render
    const savedScreenings = screenings.data.slice().reverse();

    return (
        <>
            <h1>{date}</h1>

            <button className="cancel-btn" onClick={props.cancel}>
                Back to all dates
            </button>

            <div className="box">
                <h2>Save new screening</h2>
                <ScreeningEntry date={props.date} handleSuccess={handleSuccess} />
            </div>

            {savedScreenings.length > 0 && (
                <div className="box">
                    <h2>Already Saved</h2>
                    <ul className="already-saved">
                        {savedScreenings.map((screening, index) => (
                            <SavedScreening
                                key={screening.id}
                                screening={screening}
                                handleDelete={() => destroy(screening.id, index)}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export interface DayProps {
    date: Date;
    cancel: () => void;
}

export default Day;
