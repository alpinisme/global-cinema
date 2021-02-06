import React, { ReactElement } from 'react';
import { Identifiable } from '../../types/utilityInterfaces';
import styles from './DuplicateDisplay.scss';

function DuplicatesDisplay<A extends Identifiable>({
    duplicates,
    handleMerge,
    displayAlternate,
    displayTitle,
}: Props<A>): ReactElement {
    if (!duplicates.length) {
        return <div>No likely duplicates found</div>;
    }

    return (
        <div>
            Possibly a duplicate of:
            <ul>
                {duplicates.map(alternate => (
                    <li key={alternate.id} title={displayTitle?.(alternate)}>
                        {displayAlternate(alternate)}
                        <button className={styles.merge} onClick={() => handleMerge(alternate)}>
                            Merge
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DuplicatesDisplay;

interface Props<A extends Identifiable> {
    duplicates: A[];
    handleMerge: (alternate: A) => void;
    displayAlternate: (alternate: A) => string;
    displayTitle?: (alternate: A) => string;
}
