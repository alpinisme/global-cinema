import React, {
    useState,
    useEffect,
    ReactElement,
    SetStateAction,
    Dispatch,
} from 'react';
import ReactDOM from 'react-dom';
import ErrorBox from './components/ErrorBox';
import InstructorPage from './pages/Instructor';
import AdminPage from './pages/Admin';
import axios from 'axios';
import { addOnce } from './utils/functions';
import Student from './pages/Student';

const App = (): ReactElement => {
    const [errors, setErrors] = useState<string[]>([]);

    function useGetRequest<A>(
        url: string,
        createErrMsg: (e: string) => string
    ): [A | null, Dispatch<SetStateAction<A | null>>] {
        const [data, setData] = useState<A | null>(null);

        useEffect(() => {
            axios
                .get(url)
                .then(res => res.data)
                .then(setData)
                .catch(e => setErrors(addOnce(createErrMsg(e))));
        }, [url, createErrMsg]);

        return [data, setData];
    }

    /**
     * get userType from api
     */
    const [userType] = useGetRequest(
        '/role',
        e => `Error: unable to verify user type.\nCause: ${e}`
    );

    /**
     * display errors if any
     */
    if (errors.length > 0) {
        return <ErrorBox errors={errors} />;
    }

    /**
     * show appropriate page
     */
    switch (userType) {
        case null:
            return <div>...loading</div>;

        case 'user':
            return <Student setErrors={d => setErrors(addOnce(d))} />;

        case 'instructor':
            return <InstructorPage setErrors={d => setErrors(addOnce(d))} />;

        case 'admin':
            return <AdminPage useGetRequest={useGetRequest} />;

        default:
            setErrors(addOnce("couldn't recognize user role"));
            return <></>;
    }
};

export default App;

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
