import axios from 'axios';
import React, {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { User } from '../types/api';

const AuthContext = createContext({} as AuthContextData);

export function useAuth(): AuthContextData {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: Props): ReactElement {
    const auth = useAuthProvider();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function useAuthProvider() {
    // TODO: switch to useReducer so that the number of final states is three:
    // isLoading: true; isLoading: false and user: User; isLoading: false and errors: Errors
    // throw error if isLoading: true and user is something other than User
    // perhaps make the user param in the success case "unknown" and then use a type guard to check
    const [user, setUser] = useState<User | null>(null);
    const [errors, setErrors] = useState<Errors>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            axios
                .get('/user')
                .then(res => res.data)
                .then(user => {
                    setUser(user);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    });

    const login = (form: LoginForm) => {
        setErrors({});

        axios
            .post('login', form)
            .then(res => res.data)
            .then(setUser)
            .catch(err => setErrors(err.response.data.errors));
    };

    const register = (form: RegistrationForm) => {
        setErrors({});

        axios
            .post('register', form)
            .then(res => res.data)
            .then(setUser)
            .catch(err => setErrors(err.response.data.errors));
    };

    const logout = () => {
        axios.post('/logout');
        setUser(null);
    };

    return { login, logout, register, isLoading, user, errors };
}

interface Props {
    children: ReactNode;
}

interface RegistrationForm {
    role: string;
    instructor_id: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface AuthContextData {
    login: (form: LoginForm) => void;
    logout: () => void;
    register: (form: RegistrationForm) => void;
    user: User | null;
    errors: Errors;
    isLoading: boolean;
}

interface Errors {
    role?: string[];
    instructor?: string[];
    name?: string[];
    email?: string[];
    password?: string[];
}
