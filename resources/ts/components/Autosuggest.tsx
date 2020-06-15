import React, { useState, SyntheticEvent, ChangeEvent } from 'react';

export interface Props<A> {
    value: string;
    setValue: (e: ChangeEvent<HTMLInputElement>) => void;
    label: string;
    matches: Array<A>;
    displayMatch: (a: A) => string;
    handleSubmit: (e: SyntheticEvent<HTMLButtonElement>) => void;
    handleManualAdd: () => void;
}

const AutosuggestInput = (props: Props<any>) => {
    return (
        <>
            <div>
                <label htmlFor={props.label}>{props.label}</label>
                <input
                    type="text"
                    name={props.label}
                    value={props.value}
                    onChange={props.setValue}
                />
                {!props.value && (
                    <p>
                        As you begin typing a {props.label.toLowerCase()},
                        possible matches will appear below.
                    </p>
                )}
            </div>

            {props.value && (
                <>
                    {props.matches.length > 0 && (
                        <p>
                            Select the correct {props.label} to submit the
                            entry.
                        </p>
                    )}
                    <ul className="button-list">
                        {props.matches.map(match => (
                            <li key={match.id}>
                                <button
                                    type="submit"
                                    data-film={match.id}
                                    onClick={props.handleSubmit}
                                >
                                    {props.displayMatch(match)}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {props.matches.length > 0 ? (
                        <p>
                            If the correct {props.label.toLowerCase()} is not
                            listed above,{' '}
                        </p>
                    ) : (
                        <p>Sorry, no matches found.</p>
                    )}
                    <button onClick={props.handleManualAdd}>
                        Add {props.label.toLowerCase()} manually
                    </button>
                </>
            )}
        </>
    );
};

export default AutosuggestInput;
