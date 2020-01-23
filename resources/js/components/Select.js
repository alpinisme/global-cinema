import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ id, options, value, handleChange, autoFocus }) => (
    <select
        id={id}
        value={value}
        onChange={handleChange}
        autoFocus={!!autoFocus}
    >
        <option disabled value="">
            Select...
        </option>

        {options.map(opt => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);

Select.propTypes = {
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.any.isRequired,
    handleChange: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool
};

export default Select;
