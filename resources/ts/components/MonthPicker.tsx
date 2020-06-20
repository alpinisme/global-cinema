import React, { ReactElement, useState, ChangeEvent, FormEvent } from 'react';
import ErrorBox from './ErrorBox';

const MonthPicker = ({ setMonth }: Props): ReactElement => {
    const [isValid, setIsValid] = useState<boolean>(false);
    const [input, setInput] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validate = (s: string): boolean => {
        const month = s.slice(0, 2);
        const slash = s[2];
        const year = s.slice(3);

        if (!(parseInt(month) <= 12)) {
            return false;
        }

        if (slash != '/') {
            return false;
        }

        const currentYear = new Date().getFullYear();
        if (parseInt(year) >= 1901 && parseInt(year) <= currentYear) {
            return true;
        }

        return false;
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
            const date = `${year}-${month}-01`;
            setMonth(date);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Choose a month (MM/YYYY)
                <input type="text" onChange={handleChange} placeholder="09/1997" />
            </label>
            {isSubmitted && !isValid && (
                <ErrorBox errors={['invalid date format, make sure it matches MM/YYYY']} />
            )}
            <input type="submit" />
        </form>
    );
};

export interface Props {
    setMonth: (month: string) => void;
}

export default MonthPicker;
