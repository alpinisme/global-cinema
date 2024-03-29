import React, { ReactElement } from 'react';
import axios from 'axios';
import ScreeningEntry from './ScreeningEntry';
import SavedScreening from './SavedScreening';
import { isValidDate, removeFrom, toDateString } from '../../utils/functions';
import { Screening } from '../../types/api';
import { useGetRequest } from '../../hooks/requestHooks';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorBox from '../../components/ErrorBox';
import { useHistory, useParams } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';

const Day = (): ReactElement => {
    const history = useHistory();
    const { month, day } = useParams<DayParams>();
    const ISOdate = month + '-' + day;
    const date = new Date(ISOdate);

    if (!isValidDate(date)) {
        history.replace('/404');
    }

    const endpoint = '/screenings/' + ISOdate;
    const screenings = useGetRequest<Screening[]>(endpoint);
    useTitle('Screening Entry');

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

    if (screenings.error != null) {
        return <ErrorBox errors={screenings.error} />;
    }

    const humanReadableDate = toDateString(date);
    const handleSuccess = (screening: Screening) => screenings.update(old => [...old, screening]);
    // slice to avoid mutating array, and hence toggling order on each render
    const savedScreenings = screenings.data?.slice().reverse();

    return (
        <>
            <h1>{humanReadableDate}</h1>

            <button type="button" onClick={() => history.goBack()}>
                Back to all dates
            </button>

            <div className="box">
                <h2>Save new screening</h2>
                {screenings.isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <ScreeningEntry date={date} handleSuccess={handleSuccess} />
                )}
            </div>

            {savedScreenings && (
                <div className="box">
                    <h2>Already Saved</h2>

                    {savedScreenings.length > 0 ? (
                        <ul className="already-saved">
                            {savedScreenings.map(screening => (
                                <SavedScreening
                                    key={screening.id}
                                    screening={screening}
                                    handleDelete={() => destroy(screening.id)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p>No screenings saved yet</p>
                    )}
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
