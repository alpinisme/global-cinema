import React, { ReactNode, ReactPortal } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { createPortal } from 'react-dom';
import styles from './Modal.scss';

const Modal = (): ReactPortal | null => {
    const root = document.getElementById('modal-root');
    const modal = useModal();

    if (!root) {
        throw new Error('Modal root missing from document');
    }

    if (!modal.isOpen) {
        console.log('modal is not open in its component');
        return null;
    }

    console.log('trying to create portal');

    return createPortal(
        <div className={styles.container} onClick={() => modal.toggle()}>
            <div className={styles.dialog}>{modal.children}</div>
        </div>,
        root
    );
};

export default Modal;

interface Props {
    children: ReactNode;
}
