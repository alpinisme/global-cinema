import React, { ReactElement, useState, useEffect, ChangeEvent } from 'react';
import Fuse from 'fuse.js';
import styles from './Autosuggest.scss';
import { Identifiable } from '../../types/utilityInterfaces';

function Autosuggest<A extends Identifiable>({
    config,
    handleSubmit,
    handleManualAdd,
    handleInput,
}: Props<A>): ReactElement {
    const [value, setValue] = useState('');
    const [matches, setMatches] = useState<A[]>([]);
    const { label, keys, options, displayMatch } = config;

    // find four closest matches for user-input title in db
    useEffect(() => {
        const config = {
            shouldSort: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 2,
            keys: keys,
        };

        const fuse = new Fuse(options, config);
        const all = fuse.search(value);
        const top4 = all.slice(0, 4).map(d => d.item);

        setMatches(top4);
    }, [options, value, keys]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (handleInput) {
            handleInput(value);
        }
        setValue(value);
    };

    // TODO: add third display option (not: "no options found") when less than 3 characters
    return (
        <>
            <div>
                <label htmlFor={label} className={styles.label}>
                    {label}:
                </label>
                <input
                    type="text"
                    name={label}
                    value={value}
                    onChange={handleChange}
                    className={styles.input}
                />
                {!value && <p>As you begin typing, possible matches will appear below.</p>}
            </div>

            {value && (
                <>
                    {matches.length > 0 && <p>Select the correct {label} to submit the entry.</p>}
                    <ul className="button-list">
                        {matches.map(match => (
                            <li key={match.id}>
                                <button
                                    type="submit"
                                    className={styles.button}
                                    onClick={() => handleSubmit(match.id)}
                                >
                                    {displayMatch(match)}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {handleManualAdd && (
                        <div>
                            {matches.length > 0 ? (
                                <p>If the correct {label.toLowerCase()} is not listed above, </p>
                            ) : (
                                <p>Sorry, no matches found.</p>
                            )}
                            <button onClick={() => handleManualAdd(value)}>
                                Add {label.toLowerCase()} manually
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default Autosuggest;

export interface Props<A> {
    config: { label: string; keys: string[]; options: A[]; displayMatch: (a: A) => string };
    handleSubmit: (id: number) => void;
    handleManualAdd?: (title: string) => void;
    handleInput?: (input: string) => void;
}
