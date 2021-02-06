import axios from 'axios';
import React, { useState, useEffect, ReactElement } from 'react';
import DuplicatesDisplay from '../components/DuplicatesDisplay';
import ItemToReview from '../components/ItemToReview';
import TextButton from '../components/TextButton';
import { Film, FilmToReview } from '../types/api';
import { usePatchRequest } from '../utils/hooks';

const FilmReview = (): ReactElement => {
    const url = '/review/films';
    const [films, setFilms] = useState<FilmToReview[]>([]);
    const [mergeResult, sendMergeRequest] = usePatchRequest();
    const minCount = 5;

    useEffect(() => {
        if (mergeResult.error) {
            console.log(mergeResult);
        }
    }, [mergeResult]);

    useEffect(() => {
        let isMounted = true;

        if (films.length == 0 || films.length == minCount) {
            axios
                .get(url)
                .then(res => isMounted && setFilms(res.data))
                .catch(err => console.log('Oops', err));
        }

        return () => {
            isMounted = false;
        };
    }, [films, setFilms]);

    const reject = (rejected: Film) => {
        axios.delete('films/' + rejected.id);
        setFilms(films?.filter(film => film.current != rejected) ?? []);
    };

    const merge = (from: Film, to: Film) => {
        const path = 'merge/films';
        sendMergeRequest(path, { from: from.id, to: to.id });
        setFilms(films?.filter(film => film.current != from) ?? []);
    };

    if (!films) {
        return <div>...searching the database</div>;
    }

    return (
        <ul>
            {films.map(film => (
                <ItemToReview
                    key={film.current.id}
                    name={`${film.current.title} (${film.current.year ?? 'no year'})`}
                >
                    <TextButton
                        label="Reject"
                        style="danger"
                        handleClick={() => reject(film.current)}
                    />
                    <DuplicatesDisplay
                        duplicates={film.alternates}
                        displayAlternate={film => `${film.title} (${film.year})`}
                        displayTitle={film => film.imdb}
                        handleMerge={alternate => merge(film.current, alternate)}
                    />
                </ItemToReview>
            ))}
        </ul>
    );
};

export default FilmReview;
