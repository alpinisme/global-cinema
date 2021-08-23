import React, { ChangeEvent, ReactElement, useState } from 'react';
import TreeList, { Data as TreeListData } from '../../../../components/TreeList';
import Select from '../../../../components/Select';
import styles from './ProgressChecker.scss';
import { useAdminContext } from '../../../../contexts/AdminContext';
import { useGetRequest } from '../../../../hooks/requestHooks';

/**
 * Callback for reduce function. Transforms a list of formatted date strings (YYYY-month, ex: 1987-May)
 * into a nested array of objects suitable for display in TreeList component
 */
const formatDates = (accumulator: TreeListData[], date: string): TreeListData[] => {
    const year = date.slice(0, 4);
    const month = date.slice(5);

    const parent = accumulator.find(d => d.name == year);
    const child = { name: month, id: date, children: [] };

    if (!parent) {
        accumulator.push({ name: year, id: year, children: [child] });

        return accumulator;
    } else {
        parent.children.push(child);

        return accumulator;
    }
};

/**
 * Component that allows users to review which months the project
 * has gathered data for. It displays years and months in a collapsible tree
 */
const ProgressChecker = (): ReactElement => {
    const [city, setCity] = useState<string | null>(null);
    const { cities } = useAdminContext();

    const options = cities.map(city => ({ label: city.name, value: city.id }));
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => setCity(e.target.value);

    // retreive list of completed months for selected city
    const dates = useGetRequest<string[]>('/completed/' + city);
    const data = dates.data?.reduce(formatDates, []) ?? [];

    return (
        <>
            <Select
                label={'Select a city to review'}
                value={city ?? ''}
                options={options}
                handleChange={handleChange}
            />
            {city && (
                <div className={styles.treeContainer}>
                    {data.length ? (
                        <h3>Here are the months we have so far:</h3>
                    ) : (
                        <h3>...checking the database</h3>
                    )}
                    <TreeList data={data} />
                </div>
            )}
        </>
    );
};

export default ProgressChecker;
