import React, { createContext, ReactElement, ReactNode, useContext } from 'react';
import Modal from '../components/Modal';

export const useModalProvider = (): ModalContextData => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [children, setChildren] = React.useState<ReactNode | null>(null);

    // the intent is that this function will be called with a
    // ReactNode to show it and with no argument to hide it
    // this, however, is not enforced, which is not ideal
    const toggle = (content: ReactNode = null) => {
        setIsOpen(!isOpen);
        if (content) {
            setChildren(content);
        }
    };

    return { isOpen, toggle, children };
};

const ModalContext = createContext({} as ModalContextData);

export const useModal = (): ModalContextData => useContext(ModalContext);

export const ModalProvider = ({ children }: Props): ReactElement => {
    const modal = useModalProvider();

    return (
        <ModalContext.Provider value={modal}>
            <Modal />
            {children}
        </ModalContext.Provider>
    );
};

interface Props {
    children: ReactNode;
}

interface ModalContextData {
    isOpen: boolean;
    toggle: (modalContent?: ReactNode) => void;
    children: ReactNode;
}
