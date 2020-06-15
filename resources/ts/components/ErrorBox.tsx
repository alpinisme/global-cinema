import React, { ReactElement } from 'react';

const ErrorBox = (props: Props): ReactElement => {
    const list_items = props.errors.map(e => (
        <ul key={e}>
            <li className="err-msg">{e}</li>
        </ul>
    ));

    return <>{list_items}</>;
};

export default ErrorBox;

export interface Props {
    errors: string[];
}
