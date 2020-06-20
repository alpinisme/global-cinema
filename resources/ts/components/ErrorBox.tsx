import React, { ReactElement } from 'react';

const ErrorBox = ({ errors }: Props): ReactElement => {
    const errList = errors.map(e => (
        <ul key={e}>
            <li className="err-msg">{e}</li>
        </ul>
    ));

    return <>{errList}</>;
};

export default ErrorBox;

export interface Props {
    errors: string[];
}
