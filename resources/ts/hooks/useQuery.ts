import { useLocation } from 'react-router';

export default function useQuery(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
}
