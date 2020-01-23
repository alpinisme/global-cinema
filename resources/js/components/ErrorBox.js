import React from 'react';

const ErrorBox = ({ errors }) =>
    errors.map(e => (
        <ul key={e}>
            <li className="err-msg">{e}</li>
        </ul>
    ));

export default ErrorBox;
