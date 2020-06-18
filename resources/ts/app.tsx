import React, { useState, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import ErrorBox from './components/ErrorBox';
import InstructorPage from './pages/Instructor';
import AdminPage from './pages/Admin';
import { addOnce } from './utils/functions';
import Student from './pages/Student';
import { useGetRequest } from './utils/hooks';

const App = (): ReactElement => {
    const [errors, setErrors] = useState<string[]>([]);

    const [userType] = useGetRequest<string>('role', e =>
        setErrors(addOnce(`Error: unable to verify user type.\nCause: ${e}`))
    );

    function useStatefulGetRequest<A>(a: string, fn: (s: string) => string) {
        return useGetRequest<A>(a, b => setErrors(addOnce(fn(b))));
    }

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
            return <Student useGetRequest={useStatefulGetRequest} />;

        case 'instructor':
            return <InstructorPage useGetRequest={useStatefulGetRequest} />;

        case 'admin':
            return <AdminPage useGetRequest={useStatefulGetRequest} />;

        default:
            setErrors(addOnce("couldn't recognize user role"));
            return <></>;
    }
};

export default App;

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
