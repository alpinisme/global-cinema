import { ChangeEvent, useCallback, useState } from 'react';

function useFormField(
    initialValue = ''
): { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void } {
    const [value, setValue] = useState(initialValue);
    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
        []
    );
    return { value, onChange };
}

export default useFormField;
