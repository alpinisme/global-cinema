import React, { ReactElement } from 'react';
import axios from 'axios';
import ScreeningEntry from '../components/ScreeningEntry';
import SavedScreening from '../components/SavedScreening';
import { removeFrom, toDateString } from '../utils/functions';
import { Screening } from '../types/api';
import { useGetRequest } from '../hooks/requestHooks';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorBox from '../components/ErrorBox';
import { Link, useParams } from 'react-router-dom';

const Day = (): ReactElement => {
    const { month, day } = useParams<DayParams>();
    const ISOdate = month + '-' + day;
    const date = new Date(ISOdate);
    // TODO: check if valid date and return redirect if not
    // This will likely require putting everything below here in a dummy component
    // to avoid conditionally calling hooks
    const endpoint = '/screenings/' + ISOdate;
    const screenings = useGetRequest<Screening[]>(endpoint);

    /**
     * sends request to server to destroy record at `id`
     * and also removes it from current application state
     *
     * @param {number} id id to be deleted
     */
    const destroy = (id: number) => {
        const index = screenings.data?.findIndex(screening => (screening.id = id));

        if (index === undefined) {
            throw new Error('Cannot delete nonexistent screening with id ' + id);
        }

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

    const humanReadableDate = toDateString(date);
    const handleSuccess = (screening: Screening) => screenings.update(old => [...old, screening]);
    // slice to avoid mutating array, and hence toggling order on each render
    const savedScreenings = screenings.data.slice().reverse();

    return (
        <>
            <h1>{humanReadableDate}</h1>

            <Link to={`/screening-entry/${month}`}>Back to all dates</Link>

            <div className="box">
                <h2>Save new screening</h2>
                <ScreeningEntry date={date} handleSuccess={handleSuccess} />
            </div>

            {savedScreenings.length > 0 && (
                <div className="box">
                    <h2>Already Saved</h2>
                    <ul className="already-saved">
                        {savedScreenings.map(screening => (
                            <SavedScreening
                                key={screening.id}
                                screening={screening}
                                handleDelete={() => destroy(screening.id)}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

interface DayParams {
    month: string;
    day: string;
}

export default Day;
