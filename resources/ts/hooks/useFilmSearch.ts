import axios from 'axios';
import { useState } from 'react';
import { Film } from '../types/api';
import { throttle } from '../utils/functions';

function useFilmSearch(): [Film[], (input: string, year?: string | undefined) => void] {
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
            // TODO: there's a bug here, because the site requires that the term be at least 3 chars *trimmed*
            query = stripArticles(input);
        } else {
            query = input;
        }

        if (query.length != 3) {
            return;
        }

        axios
            .get(`/films?search_term=${query}&up_to_year=${year}`)
            .then(r => r.data)
            .then(setFilms)
            .catch(console.log);
    };

    const doFilmsSearch = throttle((s, y) => search(s, y), 100);

    return [films, doFilmsSearch];
}

export default useFilmSearch;
