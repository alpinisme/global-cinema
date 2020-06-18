import React, { ReactElement, useState, useEffect } from 'react';
import Fuse from 'fuse.js';

interface Identified {
    id: number;
}

export interface Props<A> {
    label: string;
    keys: string[];
    options: A[];
    displayMatch: (a: A) => string;
    handleSubmit: (id: number) => void;
    handleManualAdd?: (title: string) => void;
}

function Autosuggest<A extends Identified>({
    label,
    keys,
    options,
    displayMatch,
    handleSubmit,
    handleManualAdd,
}: Props<A>): ReactElement {
    const [value, setValue] = useState('');
    const [matches, setMatches] = useState<A[]>([]);

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

        const fuse = new Fuse(options as A[], config);
        const all = fuse.search(value);
        const top4 = all.slice(0, 4);

        setMatches(top4);
    }, [options, value, keys]);

    return (
        <>
            <div>
                <label htmlFor={label}>{label}</label>
                <input
                    type="text"
                    name={label}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                {!value && (
                    <p>
                        As you begin typing a {label.toLowerCase()}, possible
                        matches will appear below.
                    </p>
                )}
            </div>

            {value && (
                <>
                    {matches.length > 0 && (
                        <p>Select the correct {label} to submit the entry.</p>
                    )}
                    <ul className="button-list">
                        {matches.map(match => (
                            <li key={match.id}>
                                <button
                                    type="submit"
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
                                <p>
                                    If the correct {label.toLowerCase()} is not
                                    listed above,{' '}
                                </p>
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
