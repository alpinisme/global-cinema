import React, { ReactElement } from 'react';
import axios from 'axios';
import ScreeningEntry from './ScreeningEntry';
import SavedScreening from './SavedScreening';
import { toDateString } from '../utils/functions';
import { Screening } from '../types/api';
import { useGetRequest } from '../hooks/requestHooks';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';

const Day = ({ date, cancel }: DayProps): ReactElement => {
    const endpoint = '/screenings/' + date.toISOString().slice(0, 10);
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
            .then(() => screenings.update(old => [...old.slice(0, index), ...old.slice(index + 1)]))
            .catch(console.log);
    };

    if (screenings.isLoading) {
        return <LoadingIndicator />;
    }

    if (screenings.error != null) {
        return <ErrorBox errors={screenings.error} />;
    }

    return (
        <>
            <h1>{toDateString(date)}</h1>

            <button className="cancel-btn" onClick={cancel}>
                Back to all dates
            </button>

            <div className="box">
                <h2>Save new screening</h2>

                <ScreeningEntry
                    date={date}
                    handleSuccess={data => screenings.update(old => [...old, data])}
                />
            </div>

            {screenings.data.length > 0 && (
                <div className="box">
                    <h2>Already Saved</h2>
                    <ul className="already-saved">
                        {screenings.data
                            .map((screening, index) => {
                                return (
                                    <SavedScreening
                                        key={screening.id}
                                        screening={screening}
                                        handleDelete={() => destroy(screening.id as number, index)}
                                    />
                                );
                            })
                            .reverse()}
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
