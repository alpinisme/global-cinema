import React, { ReactElement, useState, ChangeEvent, FormEvent } from 'react';
import { useHistory } from 'react-router';
import ErrorBox from '../ErrorBox';
import styles from './MonthPicker.scss';

const MonthPicker = (): ReactElement => {
    const [isValid, setIsValid] = useState<boolean>(false);
    const [input, setInput] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const history = useHistory();

    const validate = (input: string): boolean => {
        const year = parseInt(input.slice(3));
        const currentYear = new Date().getFullYear();

        return year <= currentYear;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setInput(value);
        setIsValid(validate(value));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        setIsSubmitted(true);

        if (isValid) {
            const month = input.slice(0, 2);
            const year = input.slice(3);
            history.push(`/screening-entry/${year}-${month}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Choose a month:
                <input
                    type="text"
                    className={styles.input}
                    onChange={handleChange}
                    placeholder="09/1997"
                    pattern={'(0[1-9]|1[0-2])/(19|20)[0-9]{2}'}
                    title={'MM/YYYY'}
                />
            </label>
            {isSubmitted && !isValid && <ErrorBox errors={'Month must be from the past'} />}
            <button type="submit" className={styles.submit}>
                Submit
            </button>
        </form>
    );
};

export default MonthPicker;
