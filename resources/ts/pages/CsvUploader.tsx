import React, { ReactElement } from 'react';
import { City } from '../types/api';

const CsvUploader = ({ cities }: Props): ReactElement => {
    return (
        <form>
            <input type="file" />
        </form>
    );
};

export default CsvUploader;

interface Props {
    cities: City[];
}
