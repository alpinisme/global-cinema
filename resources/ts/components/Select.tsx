import React, { ReactElement } from 'react';

const Select = ({
    id,
    options,
    value,
    handleChange,
    label,
    autoFocus = false,
}: Props): ReactElement => (
    <label>
        {label}
        <select id={id} value={value} onChange={handleChange} autoFocus={autoFocus}>
            <option disabled value="">
                Select...
            </option>

            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </label>
);

export default Select;

export interface Props {
    id?: string;
    options: Array<{
        value: number;
        label: string;
    }>;
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    autoFocus?: boolean;
    label?: string;
}
