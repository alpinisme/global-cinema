import { useEffect } from 'react';

const SITE_NAME = 'Filmapping';

const useTitle = (title: string): void => {
    useEffect(() => {
        document.title = SITE_NAME + ' | ' + title;
    }, [title]);
};

export default useTitle;
